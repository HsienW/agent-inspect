#!/usr/bin/env node
/**
 * Root `prepublishOnly` gate.
 *
 * When AGENT_INSPECT_SKIP_PREPUBLISH_CHECKS=1 (Trusted Publish Verify already ran
 * the gates), exit 0 without spawning checks.
 *
 * The previous `node -e '…exit(0)' && checks` form was broken: exit(0) still
 * continued into `&& checks`, so parallel package publishes re-ran the full suite.
 */
import { spawnSync } from "node:child_process";
import process from "node:process";

if (process.env.AGENT_INSPECT_SKIP_PREPUBLISH_CHECKS === "1") {
  process.exit(0);
}

const result = spawnSync(
  "pnpm",
  ["run", "prepublish:checks"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      AGENT_INSPECT_REPO_HEALTH_SKIP_VERSION: "1",
    },
    shell: process.platform === "win32",
  },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);
