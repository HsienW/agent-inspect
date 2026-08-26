import { existsSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const recipeDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(recipeDir, "..");
const repoRoot = path.resolve(recipeDir, "../../../..");
const cli = path.join(repoRoot, "packages/cli/dist/index.cjs");
const tracesDir = path.join(repoRoot, "fixtures/traces");
const workDir = path.join(packageDir, ".agent-inspect");

interface GatePilotCase {
  label: "broken" | "fixed";
  suite: string;
  evidenceOn: "fail" | "always";
  expectedExitCode: 0 | 1;
}

const cases: GatePilotCase[] = [
  {
    label: "broken",
    suite: "agent-inspect.broken.suite.json",
    evidenceOn: "fail",
    expectedExitCode: 1,
  },
  {
    label: "fixed",
    suite: "agent-inspect.fixed.suite.json",
    evidenceOn: "always",
    expectedExitCode: 0,
  },
];

const retainedFiles = [
  "gate-artifacts/gate-results.json",
  "gate-artifacts/github-step-summary.md",
  "evidence/evidence.html",
  "evidence/evidence.json",
  "evidence/check-results.json",
  "evidence/trace.jsonl",
] as const;

rmSync(workDir, { recursive: true, force: true });

for (const pilotCase of cases) {
  const caseDir = path.join(workDir, pilotCase.label);
  const result = spawnSync("node", [
    cli,
    "gate",
    "--suite",
    path.join(packageDir, pilotCase.suite),
    "--dir",
    tracesDir,
    "--output",
    path.join(caseDir, "gate-artifacts"),
    "--format",
    "github",
    "--evidence-on",
    pilotCase.evidenceOn,
    "--evidence-dir",
    path.join(caseDir, "evidence"),
    "--evidence-profile",
    "share",
  ], {
    cwd: packageDir,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== pilotCase.expectedExitCode) {
    console.error(result.stderr || result.stdout);
    console.error(
      `Expected ${pilotCase.label} gate exit ${pilotCase.expectedExitCode}, received ${result.status ?? "none"}.`,
    );
    process.exit(1);
  }

  for (const relativePath of retainedFiles) {
    const artifactPath = path.join(caseDir, relativePath);
    if (!existsSync(artifactPath)) {
      console.error(`Missing retained ${pilotCase.label} artifact: ${artifactPath}`);
      process.exit(1);
    }
  }
}

process.stdout.write(
  "OK: broken gate exited 1, fixed gate exited 0, and both retained Evidence v2 artifacts.\n",
);
