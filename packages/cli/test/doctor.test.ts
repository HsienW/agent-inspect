import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { doctorCommand, resolveInstalledPackage, runDoctorChecks } from "../src/doctor.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

describe("doctor CLI", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-cli-doctor-"));
    await writeFile(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "doctor-fixture", type: "module" }),
      "utf8",
    );
  });

  afterEach(async () => {
    process.exitCode = 0;
    vi.restoreAllMocks();
    await rm(tmpDir, { recursive: true, force: true });
  });

  it("returns deterministic sorted checks", async () => {
    const checks = await runDoctorChecks({
      cwd: tmpDir,
      traceDir: path.join(tmpDir, ".agent-inspect"),
      checkImports: false,
    });
    expect(checks.map((check) => check.id)).toEqual([...checks.map((c) => c.id)].sort());
    expect(checks.some((check) => check.id === "node-version" && check.status === "pass")).toBe(
      true,
    );
    expect(checks.some((check) => check.id === "trace-dir-writable")).toBe(true);
  });

  it("prints JSON summary", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    await doctorCommand({
      cwd: tmpDir,
      traceDir: path.join(tmpDir, ".agent-inspect"),
      checkImports: false,
      json: true,
    });
    const payload = JSON.parse(String(logSpy.mock.calls[0]?.[0]));
    expect(payload.ok).toBe(true);
    expect(Array.isArray(payload.checks)).toBe(true);
    expect(payload.checks.every((check: { id: string }) => typeof check.id === "string")).toBe(
      true,
    );
  });

  it("treats unresolved package names as not installed", () => {
    // Avoid Vitest workspace aliases (they map real @agent-inspect/* package ids).
    expect(resolveInstalledPackage(tmpDir, "@agent-inspect/not-a-real-package-zzz").ok).toBe(
      false,
    );
  });

  it("resolves installed packages via entry when package.json is not exported", async () => {
    const checks = await runDoctorChecks({
      cwd: repoRoot,
      checkImports: true,
      framework: "custom",
    });
    expect(checks.find((check) => check.id === "import-agent-inspect")?.status).toBe("pass");
    expect(checks.find((check) => check.id === "import-agent-inspect-cjs")?.status).toBe("pass");
    expect(checks.find((check) => check.id === "version-alignment")?.status).toBe("pass");
    const resolved = resolveInstalledPackage(repoRoot, "agent-inspect");
    expect(resolved.ok).toBe(true);
    expect(resolved.version).toMatch(/^\d+\.\d+\.\d+/);
  });
});
