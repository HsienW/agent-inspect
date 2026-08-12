#!/usr/bin/env node
/**
 * Generate public-safe demo Evidence samples from repo fixtures (no customer data).
 * Usage: pnpm demo:generate
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "packages/cli/dist/index.cjs");

const samples = [
  {
    id: "moderate-agent",
    fixture: "fixtures/langgraph/pilot-shaped-bridged-tool.jsonl",
    label: "Moderate production-shaped LangGraph fixture",
  },
  {
    id: "langgraph-swarm",
    fixture: "fixtures/langgraph/deep-swarm-nested-ok.jsonl",
    label: "Deep nested swarm fixture",
  },
];

function run(args, opts = {}) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...(opts.env ?? {}) },
  });
  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    throw new Error(`CLI failed (${result.status}): agent-inspect ${args.join(" ")}`);
  }
  return result.stdout;
}

if (!existsSync(cli)) {
  console.error("[demo:generate] Build the CLI first (pnpm build).");
  process.exit(1);
}

const outRoot = path.join(root, "examples/evidence");
mkdirSync(outRoot, { recursive: true });

const manifest = {
  generatedAt: "1970-01-01T00:00:00.000Z",
  generator: "scripts/demo-generate.mjs",
  packageVersion: JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"))
    .version,
  samples: [],
};

for (const sample of samples) {
  const dest = path.join(outRoot, sample.id);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });

  const fixtureAbs = path.join(root, sample.fixture);
  const localTrace = path.join(dest, "source.jsonl");
  copyFileSync(fixtureAbs, localTrace);

  const checkJson = run([
    "check",
    localTrace,
    "--preset",
    "trajectory",
    "--json",
  ]);
  writeFileSync(path.join(dest, "check-trajectory.json"), checkJson);

  const evidenceDir = path.join(dest, "evidence");
  run([
    "check",
    localTrace,
    "--preset",
    "trajectory",
    "--evidence-on",
    "always",
    "--evidence-dir",
    evidenceDir,
    "--evidence-profile",
    "share",
    "--evidence-format",
    "directory",
  ]);

  const verifyOut = run(["bundle", "verify", evidenceDir, "--json"]);
  writeFileSync(path.join(dest, "bundle-verify.json"), verifyOut);

  writeFileSync(
    path.join(dest, "README.md"),
    [
      `# ${sample.label}`,
      "",
      "Public-safe synthetic Evidence sample generated from an in-repo fixture.",
      "No customer traces. No organization names.",
      "",
      "## Contents",
      "",
      "- `source.jsonl` — fixture copy",
      "- `check-trajectory.json` — `check --preset trajectory` result",
      "- `evidence/` — Evidence v2 directory (`evidence.html`, `evidence.json`, …)",
      "- `bundle-verify.json` — `bundle verify` result",
      "",
      "## Regenerate",
      "",
      "```bash",
      "pnpm build && pnpm demo:generate && pnpm demo:verify",
      "```",
      "",
    ].join("\n"),
  );

  const verify = JSON.parse(verifyOut);
  manifest.samples.push({
    id: sample.id,
    fixture: sample.fixture,
    label: sample.label,
    evidenceOk: verify.ok === true,
  });
}

writeFileSync(
  path.join(outRoot, "demo-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

writeFileSync(
  path.join(outRoot, "terminal-demo.txt"),
  [
    "$ npx agent-inspect check fixtures/langgraph/pilot-shaped-bridged-tool.jsonl --preset trajectory",
    "Check status: pass",
    "Trajectory: PASS",
    "Share safety: not evaluated",
    "Run verify-safe before sharing.",
    "",
    "$ npx agent-inspect check fixtures/langgraph/pilot-shaped-bridged-tool.jsonl --preset trajectory --evidence-on always --evidence-dir ./examples/evidence/moderate-agent/evidence",
    "Evidence: ./examples/evidence/moderate-agent/evidence",
    "",
    "$ npx agent-inspect bundle verify ./examples/evidence/moderate-agent/evidence",
    "Evidence verify: pass",
    "",
  ].join("\n"),
);

console.log(`[demo:generate] OK (${manifest.samples.length} samples)`);
