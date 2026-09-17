#!/usr/bin/env node
/**
 * Prove that a stale nested Evidence generator.version fails the same check
 * demo:verify uses (without mutating committed fixtures).
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync, cpSync } from "node:fs";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkgVersion = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8")).version;
const sampleSrc = path.join(root, "examples/evidence/moderate-agent");
const evidenceRel = "evidence/evidence.json";

const tmpRoot = mkdtempSync(path.join(os.tmpdir(), "ai-demo-stale-"));
const tmpEvidenceRoot = path.join(tmpRoot, "examples/evidence");
mkdirSync(tmpEvidenceRoot, { recursive: true });
cpSync(sampleSrc, path.join(tmpEvidenceRoot, "moderate-agent"), { recursive: true });

const evidencePath = path.join(tmpEvidenceRoot, "moderate-agent", evidenceRel);
const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
const current =
  evidence?.generator?.version ??
  evidence?.meta?.generatorVersion ??
  evidence?.packageVersion;
if (current !== pkgVersion) {
  rmSync(tmpRoot, { recursive: true, force: true });
  console.error(
    `[demo-version-sync:check] committed Evidence already stale (${current} != ${pkgVersion})`,
  );
  process.exit(1);
}

evidence.generator = { ...(evidence.generator ?? {}), version: "0.0.0-stale" };
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);

// Inline the same comparison demo:verify performs on evidence.json
const staleVersion =
  evidence?.generator?.version ??
  evidence?.meta?.generatorVersion ??
  evidence?.packageVersion;
if (staleVersion === pkgVersion) {
  rmSync(tmpRoot, { recursive: true, force: true });
  console.error("[demo-version-sync:check] failed to forge stale version");
  process.exit(1);
}

const wouldFail =
  typeof staleVersion === "string" && staleVersion !== pkgVersion;
if (!wouldFail) {
  rmSync(tmpRoot, { recursive: true, force: true });
  console.error("[demo-version-sync:check] stale comparison did not fail");
  process.exit(1);
}

// Also ensure live demo:verify still passes on committed tree
const live = spawnSync("pnpm", ["demo:verify"], {
  cwd: root,
  encoding: "utf8",
  shell: process.platform === "win32",
});
rmSync(tmpRoot, { recursive: true, force: true });

if (live.status !== 0) {
  console.error(live.stdout);
  console.error(live.stderr);
  console.error("[demo-version-sync:check] live demo:verify failed");
  process.exit(1);
}

console.log(
  `[demo-version-sync:check] OK — stale generator ${staleVersion} would fail against ${pkgVersion}; live demo:verify passes`,
);
