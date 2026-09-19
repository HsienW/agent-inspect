#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const script = path.join(root, "scripts/prepublish-only.mjs");

test("prepublish-only skips checks when AGENT_INSPECT_SKIP_PREPUBLISH_CHECKS=1", () => {
  const result = spawnSync(process.execPath, [script], {
    env: {
      ...process.env,
      AGENT_INSPECT_SKIP_PREPUBLISH_CHECKS: "1",
      // Force a failure if checks were spawned — unset PATH so pnpm would fail.
      PATH: "",
    },
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout || "expected exit 0");
});
