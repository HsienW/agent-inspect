#!/usr/bin/env node
/**
 * Refresh packages/core/test/fixtures/api-surface.snapshot.json after an intentional
 * public API / exports change. Requires a current `pnpm build`.
 *
 *   pnpm exec node scripts/update-api-surface-snapshot.mjs
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildApiSurfaceSnapshot,
  stableStringify,
} from "./lib/api-surface.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(
  root,
  "packages/core/test/fixtures/api-surface.snapshot.json",
);

const snapshot = await buildApiSurfaceSnapshot(root);
writeFileSync(out, stableStringify(snapshot));
console.log(`[api-surface] wrote ${path.relative(root, out)}`);
