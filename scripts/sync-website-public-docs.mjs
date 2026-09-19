#!/usr/bin/env node
/**
 * Sync apps/website/public/docs/*.md from the docs manifest sources so
 * raw Markdown endpoints match HTML rendered from load-doc.
 *
 * Does not touch Next.js Flight transport files (index.txt).
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const websitePublicDocs = path.join(root, "apps/website/public/docs");
const manifestPath = path.join(
  root,
  "apps/website/content/docs-manifest.ts",
);

function parseManifest(text) {
  const entries = [];
  const re = /\{\s*slug:\s*(\[[^\]]*\]),\s*source:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(text))) {
    const slug = Function(`"use strict"; return (${match[1]});`)();
    entries.push({ slug, source: match[2] });
  }
  if (entries.length === 0) {
    throw new Error(`Failed to parse ${manifestPath}`);
  }
  return entries;
}

const manifest = parseManifest(readFileSync(manifestPath, "utf8"));

rmSync(websitePublicDocs, { recursive: true, force: true });
mkdirSync(websitePublicDocs, { recursive: true });

const written = [];
for (const entry of manifest) {
  const sourceAbs = path.join(root, entry.source);
  const body = readFileSync(sourceAbs, "utf8");
  const outRel =
    entry.slug.length === 0 ? "index.md" : `${entry.slug.join("/")}.md`;
  const outAbs = path.join(websitePublicDocs, outRel);
  mkdirSync(path.dirname(outAbs), { recursive: true });
  writeFileSync(outAbs, body, "utf8");
  written.push(outRel);
}

console.log(
  `Synced ${written.length} public docs Markdown file(s) → apps/website/public/docs`,
);
