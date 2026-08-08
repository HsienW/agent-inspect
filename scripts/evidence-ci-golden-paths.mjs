#!/usr/bin/env node
/**
 * 6.16 golden paths: moderate + deep-swarm check → gate → Evidence verify.
 * No provider keys. No network from AgentInspect.
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "packages/cli/dist/index.cjs");

const paths = [
  {
    id: "moderate",
    fixture: "fixtures/langgraph/moderate-structured-output.jsonl",
    runId: "swarm_anon_moderate",
    tool: null,
  },
  {
    id: "deep-swarm",
    fixture: "fixtures/langgraph/deep-swarm-nested-ok.jsonl",
    runId: "swarm_anon_deep_ok",
    tool: "get_navan_rewards",
  },
];

function run(args, cwd) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    console.error(`[6.16-golden] failed: ${args.join(" ")}`);
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
  return result.stdout;
}

for (const p of paths) {
  const dir = mkdtempSync(path.join(tmpdir(), `ai-616-golden-${p.id}-`));
  try {
    const traceDir = path.join(dir, ".agent-inspect");
    mkdirSync(traceDir, { recursive: true });
    copyFileSync(path.join(root, p.fixture), path.join(traceDir, `${p.runId}.jsonl`));

    const checkArgs = ["check", p.runId, "--dir", ".agent-inspect", "--json"];
    if (p.tool) checkArgs.push("--required-tool", p.tool);
    run(checkArgs, dir);

    run(["gate", "--dir", ".agent-inspect", "--max-error-rate", "0", "--json"], dir);

    const evidenceOut = path.join(dir, "evidence-out");
    run(
      ["bundle", p.runId, "--dir", ".agent-inspect", "--out", evidenceOut, "--profile", "share"],
      dir,
    );
    run(["bundle", "verify", evidenceOut], dir);
    console.log(`[6.16-golden] OK ${p.id}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

console.log("[6.16-golden] OK: moderate + deep-swarm");
