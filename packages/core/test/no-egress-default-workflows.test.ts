import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createInspector } from "../src/inspector.js";
import { openTrace } from "../src/readers/index.js";
import {
  buildTraceFacts,
  createRunStatusRule,
  runTraceChecks,
} from "../src/checks/index.js";
import { fileWriter } from "../src/writers/index.js";
import { checkCommand } from "../../cli/src/check.js";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, "../../..");
const { installNoEgressGuard } = await import(
  pathToFileURL(path.join(repoRoot, "scripts/lib/no-egress-guard.mjs")).href
);

/**
 * Maintainer-owned #225 harness: default local workflows must not open
 * outbound sockets. Intentional exceptions for this harness: none.
 */
describe("no-egress default local workflows (#225)", () => {
  let tmp = "";
  let guard: ReturnType<typeof installNoEgressGuard> | undefined;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-no-egress-"));
    guard = installNoEgressGuard();
    process.exitCode = 0;
  });

  afterEach(async () => {
    guard?.restore();
    guard = undefined;
    process.exitCode = 0;
    await rm(tmp, { recursive: true, force: true });
  });

  it("writes, reads, checks, and facts-builds a local trace without egress", async () => {
    const dir = path.join(tmp, ".agent-inspect");
    const writer = fileWriter({ dir });
    const inspector = createInspector({ writer });

    await inspector.run("no-egress-demo", async () => {
      await inspector.step("work", async () => ({ ok: true }));
      return "done";
    });
    await inspector.flush();
    await inspector.close();

    const read = await openTrace({ type: "directory", path: dir });
    expect(read.runs.length).toBeGreaterThan(0);

    const facts = buildTraceFacts(read);
    expect(facts.rawEvents.length).toBeGreaterThan(0);

    const check = runTraceChecks(
      { read },
      { rules: [createRunStatusRule({ expected: "ok" })] },
    );
    expect(["pass", "passed", "fail", "failed", "error"].includes(check.status)).toBe(
      true,
    );

    const file = path.join(dir, "manual.jsonl");
    await writeFile(
      file,
      `${JSON.stringify({
        schemaVersion: "0.2",
        eventId: "event-a",
        runId: "run-check",
        kind: "RUN",
        name: "check",
        status: "ok",
        timestamp: "2026-06-26T00:00:00.000Z",
        confidence: "explicit",
        source: { type: "manual" },
      })}\n`,
      "utf8",
    );

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await checkCommand(file, { json: true, dir });
    logSpy.mockRestore();
    expect(process.exitCode === 0 || process.exitCode === 1).toBe(true);

    expect(guard?.attempts ?? []).toEqual([]);
  });

  it("fails the harness when unexpected fetch egress occurs", () => {
    expect(() => {
      void fetch("https://example.invalid/probe");
    }).toThrow(/AI_NO_EGRESS/);
    expect(guard?.attempts.some((item: { api: string }) => item.api === "fetch")).toBe(true);
  });
});
