/**
 * Optional helper: local pack-smoke rows for the adoption evidence ledger.
 *
 * Prefer manual updates to docs/implementation/PRE-V7-ADOPTION-EVIDENCE.md during
 * the v6.12 adoption checkpoint so Evidence-column / multi-host rows are preserved.
 * This script overwrites the "## Consumer compatibility matrix" section (including
 * any legacy "## Consumer compatibility matrix (v6.5.1)" heading).
 *
 * Run from repo root: node scripts/consumer-compat-matrix.mjs
 */
import { execSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(
  root,
  "docs/implementation/PRE-V7-ADOPTION-EVIDENCE.md",
);

const matrix = [
  { os: process.platform, node: process.version, module: "ESM", status: "local-smoke" },
  { os: process.platform, node: process.version, module: "CJS", status: "local-smoke" },
];

function run(label, cmd, args, cwd = root) {
  const result = spawnSync(cmd, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${label} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

try {
  execSync("pnpm run build", { cwd: root, stdio: "pipe" });
  run("pack smoke", "node", ["scripts/package-smoke.mjs"], root);
  matrix[0].status = "pass";
  matrix[1].status = "pass";
} catch (error) {
  matrix[0].status = "fail";
  matrix[1].status = "fail";
  console.error(error);
  process.exit(1);
}

const table = [
  "## Consumer compatibility matrix",
  "",
  "| Environment | Node | Module | Status | Date |",
  "|-------------|------|--------|--------|------|",
  ...matrix.map(
    (row) =>
      `| ${row.os} | ${row.node} | ${row.module} | ${row.status} | ${new Date().toISOString().slice(0, 10)} |`,
  ),
  "",
  "_Full cross-platform matrix (Node 20/22/24, Linux/macOS/Windows) runs in CI/release gate._",
  "",
].join("\n");

const existing = readFileSync(outPath, "utf8");
const sectionPattern =
  /## Consumer compatibility matrix(?: \(v6\.5\.1\))?[\s\S]*?(?=\n## |$)/;
const updated = sectionPattern.test(existing)
  ? existing.replace(sectionPattern, table)
  : `${existing.trim()}\n\n${table}\n`;

writeFileSync(outPath, updated);
console.log(`[consumer-compat-matrix] OK: updated ${outPath}`);
console.log(
  "[consumer-compat-matrix] Note: section overwrite — review Evidence-column rows if the ledger had richer manual data.",
);
