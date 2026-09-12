import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  loadSessionRunRecords,
  loadTraceMetadataList,
  renderGateGithubAnnotations,
  renderGateGithubStepSummary,
  renderGateJUnit,
  renderGateReport,
  runGate,
  TraceDirectory,
} from "../../src/entries/advanced.js";

async function loadFixtureRuns(fixtureDir: string) {
  const td = new TraceDirectory({ dir: fixtureDir });
  const files = await td.list();
  const metas = await loadTraceMetadataList(fixtureDir, files, (fileName) =>
    td.getPath(fileName),
  );
  return loadSessionRunRecords(metas);
}

describe("gate engine", () => {
  it("passes suite-driven gate on outcome fixture", async () => {
    const repoRoot = path.resolve(import.meta.dirname, "../../../..");
    const suitePath = path.join(repoRoot, "fixtures/configs/outcome-suite.suite.json");
    const result = await runGate([], { suitePath, cwd: repoRoot });
    expect(result.ok).toBe(true);
    expect(result.exitCode).toBe(0);
    expect(result.checks.some((check) => check.id === "suite" && check.ok)).toBe(true);
  });

  it("fails threshold gate on high error-rate cohort", async () => {
    const repoRoot = path.resolve(import.meta.dirname, "../../../..");
    const fixtureDir = path.join(repoRoot, "fixtures/cohorts/before-after");
    const runs = await loadFixtureRuns(fixtureDir);
    const result = await runGate(runs, {
      traceDir: fixtureDir,
      maxErrorRate: 5,
      forbidTools: ["deleteAccount"],
    });
    expect(result.ok).toBe(false);
    expect(result.exitCode).toBe(1);
    expect(result.checks.some((check) => check.id === "maxErrorRate" && !check.ok)).toBe(true);
    expect(result.checks.some((check) => check.id === "forbidTool" && !check.ok)).toBe(true);
  });

  it("returns exit 2 for missing gate rules", async () => {
    const result = await runGate([], {});
    expect(result.exitCode).toBe(2);
    expect(result.diagnostics.length).toBeGreaterThan(0);
  });

  it("returns exit 2 for invalid max error rate above 100", async () => {
    const repoRoot = path.resolve(import.meta.dirname, "../../../..");
    const fixtureDir = path.join(repoRoot, "fixtures/cohorts/before-after");
    const runs = await loadFixtureRuns(fixtureDir);
    const result = await runGate(runs, {
      traceDir: fixtureDir,
      maxErrorRate: 150,
    });
    expect(result.exitCode).toBe(2);
    expect(result.diagnostics.some((item) => item.includes("at most 100"))).toBe(true);
  });

  it("renders junit and github step summary deterministically", async () => {
    const repoRoot = path.resolve(import.meta.dirname, "../../../..");
    const suitePath = path.join(repoRoot, "fixtures/configs/outcome-suite.suite.json");
    const result = await runGate([], { suitePath, cwd: repoRoot });
    const junit = renderGateJUnit(result);
    const github = renderGateGithubStepSummary(result);
    expect(junit).toContain('<?xml version="1.0"');
    expect(junit).toContain("agent-inspect-gate");
    expect(github).toContain("AgentInspect gate: PASS");
    expect(github).toContain("| Check | Status | Details |");
  });

  it("renders compact json and github annotations for failures", async () => {
    const compact = renderGateReport(
      {
        ok: false,
        exitCode: 1,
        runCount: 1,
        checks: [
          {
            id: "forbidTool",
            name: "forbidTool:deleteAccount",
            ok: false,
            message: "Tool deleteAccount appeared",
          },
        ],
        diagnostics: [],
      },
      { format: "json-compact" },
    );
    expect(compact).toContain('"ok":false');
    expect(compact).not.toContain("\n");
    const annotations = renderGateGithubAnnotations({
      ok: false,
      exitCode: 1,
      runCount: 1,
      checks: [
        {
          id: "forbidTool",
          name: "forbidTool:deleteAccount",
          ok: false,
          message: "Tool deleteAccount appeared",
        },
      ],
      diagnostics: [],
    });
    expect(annotations).toContain("::error title=forbidTool:deleteAccount::");
  });
});
