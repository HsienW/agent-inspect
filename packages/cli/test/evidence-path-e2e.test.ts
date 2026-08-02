/**
 * Fast local Evidence v2 path E2E (no npm pack) — complements packed-quickstart-e2e.
 */
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { bundleCommand } from "../src/bundle.js";
import { bundleVerifyCommand } from "../src/bundle-verify.js";

function jsonl(...rows: unknown[]): string {
  return `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
}

describe(`evidence path e2e (${process.platform})`, () => {
  let tmp: string;
  let logSpy: ReturnType<typeof vi.spyOn>;
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "ai-evidence-e2e-"));
    process.exitCode = 0;
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await writeFile(
      path.join(tmp, "run-e2e.jsonl"),
      jsonl({
        schemaVersion: "0.2",
        eventId: "e1",
        runId: "run-e2e",
        kind: "RUN",
        name: "e2e",
        status: "ok",
        timestamp: "2026-08-02T00:00:00.000Z",
        confidence: "explicit",
        source: { type: "manual" },
      }),
      "utf-8",
    );
  });

  afterEach(async () => {
    process.exitCode = 0;
    vi.restoreAllMocks();
    await rm(tmp, { recursive: true, force: true });
  });

  it("bundle directory → verify → html → zip", async () => {
    const dirOut = path.join(tmp, "dir-out");
    await bundleCommand("run-e2e", { dir: tmp, out: dirOut, json: true });
    expect(process.exitCode ?? 0).toBe(0);
    expect(existsSync(path.join(dirOut, "evidence.html"))).toBe(true);
    expect(existsSync(path.join(dirOut, "evidence.json"))).toBe(true);

    await bundleVerifyCommand(dirOut, { json: true });
    expect(process.exitCode ?? 0).toBe(0);
    const verifyPayload = JSON.parse(String(logSpy.mock.calls.at(-1)?.[0])) as {
      ok: boolean;
      status: string;
    };
    expect(verifyPayload.ok).toBe(true);
    expect(verifyPayload.status).toBe("pass");

    const htmlOut = path.join(tmp, "html-out");
    await bundleCommand("run-e2e", {
      dir: tmp,
      out: htmlOut,
      format: "html",
      json: true,
    });
    expect(existsSync(path.join(htmlOut, "evidence.html"))).toBe(true);
    expect(existsSync(path.join(htmlOut, "evidence.json"))).toBe(true);

    const zipOut = path.join(tmp, "out.zip");
    await bundleCommand("run-e2e", {
      dir: tmp,
      out: zipOut,
      format: "zip",
      json: true,
    });
    expect(existsSync(zipOut)).toBe(true);
    const magic = await readFile(zipOut);
    expect(magic.subarray(0, 2).toString("utf8")).toBe("PK");
    expect(errSpy).not.toHaveBeenCalled();
  });
});
