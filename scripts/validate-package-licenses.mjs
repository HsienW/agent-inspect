#!/usr/bin/env node
/**
 * Ensure every fixed-group public package ships LICENSE text identical to the root MIT LICENSE.
 * Usage: node scripts/validate-package-licenses.mjs
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonical = readFileSync(path.join(root, "LICENSE"), "utf8");
const config = JSON.parse(
  readFileSync(path.join(root, ".changeset/config.json"), "utf8"),
);
const fixed = config.fixed[0];
const failures = [];

for (const name of fixed) {
  const pkgDir =
    name === "agent-inspect" ? root : path.join(root, "packages", name.replace("@agent-inspect/", ""));
  const pkgPath = path.join(pkgDir, "package.json");
  const licensePath = path.join(pkgDir, "LICENSE");
  if (!existsSync(pkgPath)) {
    failures.push(`${name}: missing package.json at ${pkgDir}`);
    continue;
  }
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (pkg.license !== "MIT") {
    failures.push(`${name}: package.json license is ${JSON.stringify(pkg.license)}, expected "MIT"`);
  }
  if (!existsSync(licensePath)) {
    failures.push(`${name}: missing LICENSE file`);
    continue;
  }
  const text = readFileSync(licensePath, "utf8");
  if (text !== canonical) {
    failures.push(`${name}: LICENSE does not byte-match root LICENSE`);
  }
  const files = pkg.files;
  if (!Array.isArray(files) || !files.includes("LICENSE")) {
    failures.push(`${name}: package.json files[] must include "LICENSE"`);
  }
}

if (failures.length > 0) {
  console.error("[package-licenses:check] failures:");
  for (const f of failures) console.error("  -", f);
  process.exit(1);
}

console.log(
  `[package-licenses:check] OK (${fixed.length} fixed-group packages, LICENSE matches root MIT)`,
);
