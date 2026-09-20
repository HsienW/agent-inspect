#!/usr/bin/env node
/**
 * Remove Next.js App Router Flight payloads (every directory index.txt) from
 * the static export. They are not human docs; with connect-src none soft-nav
 * cannot use them, and serving them as text/plain makes crawlers and tools
 * show RSC wire format instead of HTML (for example /docs/index.txt).
 *
 * Keeps intentional root text assets such as llms.txt / llms-full.txt.
 */
import { readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "apps/website/out");

/** @type {string[]} */
const removed = [];

/**
 * @param {string} dir
 */
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walk(abs);
      continue;
    }
    if (name === "index.txt") {
      rmSync(abs);
      removed.push(path.relative(outDir, abs));
    }
  }
}

try {
  walk(outDir);
} catch (error) {
  const code = /** @type {NodeJS.ErrnoException} */ (error).code;
  if (code === "ENOENT") {
    console.error(`[strip-flight] missing export dir: ${outDir}`);
    process.exit(1);
  }
  throw error;
}

console.log(
  `[strip-flight] removed ${removed.length} Flight index.txt file(s) from apps/website/out`,
);
