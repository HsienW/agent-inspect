/**
 * Deterministic broken/fixed Evidence demo fixtures (6.10-11).
 */
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { bundleCommand } from "../src/bundle.js";
import { bundleVerifyCommand } from "../src/bundle-verify.js";

const demoDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/evidence/demo",
);

describe("evidence broken/fixed demo fixtures (6.10-11)", () => {
  let tmp: string;
  let errSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "ai-evidence-demo-"));
    process.exitCode = 0;
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(async () => {
    process.exitCode = 0;
    vi.restoreAllMocks();
    await rm(tmp, { recursive: true, force: true });
  });

  it("refuses the broken fixture without --allow-unsafe", async () => {
    expect(existsSync(path.join(demoDir, "broken.jsonl"))).toBe(true);
    await bundleCommand("broken", {
      dir: demoDir,
      out: path.join(tmp, "broken-out"),
    });
    expect(process.exitCode).toBe(1);
    expect(errSpy.mock.calls.some((c) => String(c[0]).includes("refused"))).toBe(true);
  });

  it("bundles and verifies the fixed fixture", async () => {
    const out = path.join(tmp, "fixed-out");
    await bundleCommand("fixed", { dir: demoDir, out, json: true });
    expect(process.exitCode ?? 0).toBe(0);
    expect(existsSync(path.join(out, "evidence.html"))).toBe(true);
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
});
