/**
 * v6.7.5-0 — consumer package-resolution matrix.
 *
 * Documents that published packages omit `./package.json` from exports, so
 * `require.resolve("<pkg>/package.json")` fails even when the package entry
 * resolves. Doctor currently keys off that subpath (fixed in 6.7.5-1).
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runDoctorChecks } from "../src/doctor.js";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, "../../..");

const MATRIX_PACKAGES: { name: string; manifestRel: string }[] = [
  { name: "agent-inspect", manifestRel: "package.json" },
  { name: "@agent-inspect/ai-sdk", manifestRel: "packages/ai-sdk/package.json" },
  { name: "@agent-inspect/openai-agents", manifestRel: "packages/openai-agents/package.json" },
  { name: "@agent-inspect/langchain", manifestRel: "packages/langchain/package.json" },
  { name: "@agent-inspect/mcp-server", manifestRel: "packages/mcp-server/package.json" },
  { name: "@agent-inspect/redact", manifestRel: "packages/redact/package.json" },
  { name: "@agent-inspect/eval", manifestRel: "packages/eval/package.json" },
  { name: "@agent-inspect/studio", manifestRel: "packages/studio/package.json" },
  { name: "@agent-inspect/index-sqlite", manifestRel: "packages/index-sqlite/package.json" },
  { name: "@agent-inspect/jest", manifestRel: "packages/jest/package.json" },
];

function readExports(manifestRel: string): Record<string, unknown> {
  const raw = JSON.parse(readFileSync(path.join(repoRoot, manifestRel), "utf8")) as {
    exports?: Record<string, unknown>;
  };
  return raw.exports ?? {};
}

function tryResolve(requireFn: NodeRequire, id: string): { ok: boolean; code?: string } {
  try {
    requireFn.resolve(id);
    return { ok: true };
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: unknown }).code)
        : undefined;
    return { ok: false, code };
  }
}

describe("v6.7.5-0 consumer package-resolution matrix", () => {
  it("published packages omit ./package.json from the exports map", () => {
    for (const pkg of MATRIX_PACKAGES) {
      const exports = readExports(pkg.manifestRel);
      expect(exports["."], `${pkg.name} exports["."]`).toBeDefined();
      expect(
        exports["./package.json"],
        `${pkg.name} must not export ./package.json (doctor must not rely on it)`,
      ).toBeUndefined();
    }
  });

  it("package entry resolves while package.json subpath is blocked by exports", () => {
    const rows: {
      name: string;
      entryOk: boolean;
      pkgJsonOk: boolean;
      pkgJsonCode?: string;
    }[] = [];

    for (const pkg of MATRIX_PACKAGES) {
      const manifestAbs = path.join(repoRoot, pkg.manifestRel);
      expect(existsSync(manifestAbs), pkg.manifestRel).toBe(true);
      const requireFn = createRequire(manifestAbs);
      const entry = tryResolve(requireFn, pkg.name);
      const pkgJson = tryResolve(requireFn, `${pkg.name}/package.json`);
      rows.push({
        name: pkg.name,
        entryOk: entry.ok,
        pkgJsonOk: pkgJson.ok,
        pkgJsonCode: pkgJson.code,
      });
    }

    // Root package is always resolvable from its own manifest (workspace link).
    const root = rows.find((row) => row.name === "agent-inspect");
    expect(root?.entryOk).toBe(true);
    expect(root?.pkgJsonOk).toBe(false);
    expect(root?.pkgJsonCode).toBe("ERR_PACKAGE_PATH_NOT_EXPORTED");

    for (const row of rows) {
      expect(row.pkgJsonOk, `${row.name}/package.json should not resolve`).toBe(false);
      expect(
        row.pkgJsonCode,
        `${row.name}/package.json error code`,
      ).toMatch(/ERR_PACKAGE_PATH_NOT_EXPORTED|MODULE_NOT_FOUND/);
    }

    // At least the packages that declare themselves as the resolve context should
    // load their entry when createRequire is rooted at their manifest.
    const selfResolvable = rows.filter((row) => row.entryOk);
    expect(selfResolvable.map((row) => row.name)).toContain("agent-inspect");
  });

  it("doctor entry smoke passes for installed agent-inspect while package.json path fails", async () => {
    const requireFn = createRequire(path.join(repoRoot, "package.json"));
    expect(tryResolve(requireFn, "agent-inspect").ok).toBe(true);
    expect(tryResolve(requireFn, "agent-inspect/package.json").ok).toBe(false);

    const checks = await runDoctorChecks({
      cwd: repoRoot,
      checkImports: true,
      traceDir: path.join(repoRoot, ".agent-inspect"),
    });

    expect(checks.find((check) => check.id === "import-agent-inspect")?.status).toBe("pass");
    // Current bug: CJS / version checks key off package.json export and skip/warn.
    expect(checks.find((check) => check.id === "import-agent-inspect-cjs")?.status).toBe(
      "skipped",
    );
    expect(checks.find((check) => check.id === "version-alignment")?.status).toBe("skipped");
  });

  it.fails(
    "doctor version-alignment and CJS checks pass when agent-inspect entry resolves (6.7.5-1)",
    async () => {
      const checks = await runDoctorChecks({
        cwd: repoRoot,
        checkImports: true,
        traceDir: path.join(repoRoot, ".agent-inspect"),
      });

      expect(checks.find((check) => check.id === "import-agent-inspect")?.status).toBe("pass");
      expect(checks.find((check) => check.id === "import-agent-inspect-cjs")?.status).toBe("pass");
      expect(checks.find((check) => check.id === "version-alignment")?.status).toBe("pass");
    },
  );

  it("doctor correctly reports a truly absent optional package as not installed", async () => {
    const checks = await runDoctorChecks({
      cwd: repoRoot,
      framework: "ai-sdk",
      checkImports: false,
    });
    const optional = checks.find(
      (check) => check.id === "optional-package-@agent-inspect/ai-sdk",
    );
    // Workspace root does not depend on the adapter — absence is real here.
    expect(optional?.status).toBe("warn");
    expect(optional?.message).toMatch(/not installed/);
  });
});
