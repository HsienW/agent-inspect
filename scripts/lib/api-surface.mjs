/**
 * Deterministic published API surface snapshot helpers (issue #211).
 * Filenames in export targets are basename-only so workspace vs packed paths match.
 */
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const STABLE_SUBPATHS = Object.freeze([
  "advanced",
  "persisted",
  "logs",
  "exporters",
  "diff",
  "writers",
  "readers",
  "checks",
  "reporters",
  "workspace",
]);

/** Subpaths treated as experimental (not frozen by name set today). */
export const EXPERIMENTAL_SUBPATHS = Object.freeze([]);

/**
 * @param {object} mod
 * @returns {string[]}
 */
export function exportNames(mod) {
  return Object.keys(mod)
    .filter((k) => k !== "default" && k !== "module.exports")
    .sort();
}

/**
 * @param {Record<string, unknown>} exportsMap
 */
export function normalizeExportsMap(exportsMap) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const key of Object.keys(exportsMap).sort()) {
    const value = exportsMap[key];
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      out[key] = value;
      continue;
    }
    /** @type {Record<string, unknown>} */
    const conditions = {};
    for (const condKey of Object.keys(value).sort()) {
      const condVal = /** @type {Record<string, unknown>} */ (value)[condKey];
      if (condVal && typeof condVal === "object" && !Array.isArray(condVal)) {
        /** @type {Record<string, unknown>} */
        const nested = {};
        for (const nestedKey of Object.keys(condVal).sort()) {
          const nestedVal = condVal[nestedKey];
          nested[nestedKey] =
            typeof nestedVal === "string" ? path.basename(nestedVal) : nestedVal;
        }
        conditions[condKey] = nested;
      } else {
        conditions[condKey] = condVal;
      }
    }
    out[key] = conditions;
  }
  return out;
}

/**
 * @param {string} repoRoot
 */
export function readRootPackage(repoRoot) {
  return JSON.parse(readFileSync(path.join(repoRoot, "package.json"), "utf8"));
}

/**
 * @param {string} repoRoot
 * @param {{ requireBuilt?: boolean }} [opts]
 */
export async function buildApiSurfaceSnapshot(repoRoot, opts = {}) {
  const pkg = readRootPackage(repoRoot);
  const coreDist = path.join(repoRoot, "packages/core/dist");
  const rootEsmPath = path.join(coreDist, "index.mjs");
  const rootCjsPath = path.join(coreDist, "index.cjs");
  const requireBuilt = opts.requireBuilt !== false;

  if (requireBuilt && (!existsSync(rootEsmPath) || !existsSync(rootCjsPath))) {
    throw new Error(
      `built core dist missing under ${coreDist}; run pnpm build before API surface snapshot`,
    );
  }

  const require = createRequire(path.join(repoRoot, "package.json"));
  const rootEsm = await import(pathToFileURL(rootEsmPath).href);
  const rootCjs = require(rootCjsPath);

  /** @type {Record<string, string[]>} */
  const subpaths = {};
  for (const sub of STABLE_SUBPATHS) {
    const esmPath = path.join(coreDist, `${sub}.mjs`);
    if (!existsSync(esmPath)) {
      throw new Error(`missing built subpath ${esmPath}`);
    }
    const mod = await import(pathToFileURL(esmPath).href);
    subpaths[sub] = exportNames(mod);
  }

  return {
    schemaVersion: 1,
    packageName: pkg.name,
    bin: Object.keys(pkg.bin ?? {}).sort(),
    exports: normalizeExportsMap(pkg.exports ?? {}),
    rootEsm: exportNames(rootEsm),
    rootCjs: exportNames(rootCjs),
    stableSubpaths: [...STABLE_SUBPATHS].sort(),
    experimentalSubpaths: [...EXPERIMENTAL_SUBPATHS].sort(),
    subpaths,
  };
}

/**
 * @param {unknown} value
 */
export function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
