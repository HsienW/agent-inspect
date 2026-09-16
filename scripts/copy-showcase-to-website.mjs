#!/usr/bin/env node
/**
 * Copy canonical docs media into the website public/ directory at build time.
 * - showcase → /showcase (hero videos/posters)
 * - demos → /assets/demos (GIF embeds from repo Markdown docs)
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function copyAssetDir(relSrc, relDest, label) {
  const src = path.join(root, relSrc);
  const dest = path.join(root, relDest);
  if (!existsSync(src)) {
    console.error(`[copy-showcase] missing ${relSrc}`);
    process.exit(1);
  }
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log(`[copy-showcase] ${label}`);
}

copyAssetDir("docs/assets/showcase", "apps/website/public/showcase", "apps/website/public/showcase");
copyAssetDir(
  "docs/assets/demos",
  "apps/website/public/assets/demos",
  "apps/website/public/assets/demos",
);
