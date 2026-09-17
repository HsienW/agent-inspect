#!/usr/bin/env node
/**
 * Copy root LICENSE into every scoped fixed-group package directory.
 * Root agent-inspect already commits LICENSE; scoped packages need a local copy for npm pack.
 * Usage: node scripts/sync-package-licenses.mjs
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const licenseSrc = path.join(root, "LICENSE");
const config = JSON.parse(
  readFileSync(path.join(root, ".changeset/config.json"), "utf8"),
);
const fixed = config.fixed[0];

for (const name of fixed) {
  if (name === "agent-inspect") continue;
  const short = name.replace("@agent-inspect/", "");
  const dir = path.join(root, "packages", short);
  const pkgPath = path.join(dir, "package.json");
  if (!existsSync(pkgPath)) {
    console.error(`[sync-package-licenses] missing ${name}`);
    process.exit(1);
  }
  copyFileSync(licenseSrc, path.join(dir, "LICENSE"));
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  const files = Array.isArray(pkg.files) ? [...pkg.files] : [];
  if (!files.includes("LICENSE")) {
    const idx = files.indexOf("README.md");
    if (idx >= 0) files.splice(idx + 1, 0, "LICENSE");
    else files.unshift("LICENSE");
    pkg.files = files;
    writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  }
}

console.log(`[sync-package-licenses] OK (${fixed.length - 1} scoped packages)`);
