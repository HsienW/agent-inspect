/**
 * Fail when any .github/workflows/*.yml uses a mutable action ref
 * (tags like @v4, branches like @main). Only full 40-char commit SHAs are allowed.
 *
 * Run: node scripts/check-github-actions-pins.mjs
 * Or:  pnpm run actions:check
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workflowsDir = path.join(root, ".github", "workflows");

const SHA40 = /^[0-9a-f]{40}$/i;
/** Matches `uses: owner/name@ref` or `uses: owner/name/path@ref` (not local ./ paths). */
const USES_RE =
  /^\s*(?:-\s+)?uses:\s*(?<action>(?!\.\/)[A-Za-z0-9_.-]+\/[A-Za-z0-9_./-]+)@(?<ref>[^\s#]+)/gm;

const failures = [];

let files;
try {
  files = readdirSync(workflowsDir)
    .filter((name) => name.endsWith(".yml") || name.endsWith(".yaml"))
    .sort();
} catch (error) {
  console.error(
    `[actions:check] cannot read ${workflowsDir}: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
}

for (const name of files) {
  const rel = path.join(".github", "workflows", name).replaceAll("\\", "/");
  const text = readFileSync(path.join(workflowsDir, name), "utf8");
  for (const match of text.matchAll(USES_RE)) {
    const action = match.groups?.action ?? "";
    const ref = match.groups?.ref ?? "";
    if (!SHA40.test(ref)) {
      failures.push(`${rel}: ${action}@${ref} (expected 40-char commit SHA)`);
    }
  }
}

if (failures.length) {
  console.error("[actions:check] mutable or non-SHA action refs found:");
  for (const line of failures) console.error(`  - ${line}`);
  console.error(
    "[actions:check] pin with: uses: org/action@<40hex> # vN  (see pnpm run actions:check)",
  );
  process.exit(1);
}

console.log(`[actions:check] ok — ${files.length} workflow file(s), all uses: refs are 40-char SHAs`);
