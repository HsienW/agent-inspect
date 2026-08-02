import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { bundleCommand } from "../src/bundle.js";
import { bundleVerifyCommand } from "../src/bundle-verify.js";

function jsonl(...rows: unknown[]): string {
  return `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
}

function event(eventId: string, overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schemaVersion: "0.2",
    eventId,
    runId: "run-verify",
    kind: "RUN",
    name: "verify",
    status: "ok",
    timestamp: "2026-06-26T00:00:00.000Z",
    confidence: "explicit",
    source: { type: "manual" },
    ...overrides,
  };
}

describe("bundle verify command", () => {
  let tmp: string;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-bundle-verify-"));
    process.exitCode = 0;
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await writeFile(
      path.join(tmp, "run-verify.jsonl"),
      jsonl(event("e1", { runId: "run-verify" })),
      "utf-8",
    );
  });

  afterEach(async () => {
    process.exitCode = 0;
    vi.restoreAllMocks();
    await rm(tmp, { recursive: true, force: true });
  });

  it("verifies a freshly written directory bundle", async () => {
    const out = path.join(tmp, "bundle-out");
    await bundleCommand("run-verify", { dir: tmp, out, json: true });
    expect(process.exitCode ?? 0).toBe(0);
    expect(existsSync(path.join(out, "evidence.json"))).toBe(true);

    await bundleVerifyCommand(out, { json: true });
    expect(process.exitCode ?? 0).toBe(0);
    const payload = JSON.parse(String(logSpy.mock.calls.at(-1)?.[0])) as {
      ok: boolean;
      status: string;
    };
    expect(payload.ok).toBe(true);
    expect(payload.status).toBe("pass");
  });

  it("fails when a packaged file is modified", async () => {
    const out = path.join(tmp, "bundle-tamper");
    await bundleCommand("run-verify", { dir: tmp, out });
    await writeFile(path.join(out, "trace.jsonl"), "tampered\n", "utf-8");
    await bundleVerifyCommand(out);
    expect(process.exitCode).toBe(1);
    expect(errSpy.mock.calls.some((c) => String(c[0]).includes("fail"))).toBe(true);
  });
});
