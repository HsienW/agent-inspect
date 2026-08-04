import { copyFileSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const recipeDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(recipeDir, "..");
const repoRoot = path.resolve(packageDir, "../../..");
const cli = path.join(repoRoot, "packages/cli/dist/index.cjs");
const fixture = path.join(
  repoRoot,
  "fixtures/langgraph/pilot-shaped-bridged-tool.jsonl",
);
const workDir = path.join(packageDir, ".agent-inspect");
const runId = "pilot_anon_bridged_tool";
const evidenceOut = path.join(workDir, "evidence-out");

rmSync(workDir, { recursive: true, force: true });
mkdirSync(workDir, { recursive: true });
copyFileSync(fixture, path.join(workDir, `${runId}.jsonl`));

function run(args: string[]): void {
  const result = spawnSync("node", [cli, ...args], {
    cwd: packageDir,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
}

run([
  "check",
  runId,
  "--dir",
  ".agent-inspect",
  "--required-tool",
  "lookup_orders",
]);
run(["gate", "--dir", ".agent-inspect", "--max-error-rate", "0"]);
run([
  "artifacts",
  runId,
  "--dir",
  ".agent-inspect",
  "--output-dir",
  evidenceOut,
  "--always-evidence",
]);

const manifest = JSON.parse(
  readFileSync(path.join(evidenceOut, "evidence.json"), "utf8"),
) as { semantics?: { finishedToolNames?: string[] } };
const tools = manifest.semantics?.finishedToolNames ?? [];
if (!tools.includes("lookup_orders")) {
  console.error("expected semantics.finishedToolNames to include lookup_orders", tools);
  process.exit(1);
}

process.stdout.write("OK: check → gate → evidence (langgraph bridged-tool fixture)\n");
