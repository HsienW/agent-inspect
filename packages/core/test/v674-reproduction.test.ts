/**
 * v6.7.4-0 reproducers: search ordering + lock already-fixed unpublished behavior.
 */
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { searchTraces } from "../src/search.js";
import { renderTraceStats, type TraceStats } from "../src/stats.js";
import { extractMetadata } from "../src/trace-metadata.js";

describe("v6.7.4-0 core reproduction", () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-v674-core-"));
  });

  afterEach(async () => {
    await rm(tmp, { recursive: true, force: true });
  });

  it("stats render does not double-prefix already-typed names (ee49d4c)", () => {
    // Lock unpublished fix — do not reimplement.
    const stats: TraceStats = {
      traceDir: tmp,
      totalRuns: 1,
      successCount: 1,
      errorCount: 0,
      runningCount: 0,
      unknownCount: 0,
      errorRate: 0,
      duration: { minMs: 1, avgMs: 1, p50Ms: 1, p95Ms: 1, maxMs: 1 },
      totalSteps: 3,
      avgStepsPerRun: 3,
      totalLlmSteps: 1,
      totalToolSteps: 1,
      totalErrorSteps: 0,
      slowestRuns: [],
      slowestSteps: [
        { runId: "run_1", stepName: "tool:retrieve-policy", stepType: "tool", durationMs: 28 },
        { runId: "run_1", stepName: "llm:generate-answer", stepType: "llm", durationMs: 13 },
        { runId: "run_1", stepName: "plan", stepType: "logic", durationMs: 14 },
      ],
    };
    const out = renderTraceStats(stats);
    expect(out).toContain("tool:retrieve-policy");
    expect(out).toContain("llm:generate-answer");
    expect(out).not.toContain("tool:tool:");
    expect(out).not.toContain("llm:llm:");
  });

  it("filtered search is newest-first and --limit keeps most recent matches", async () => {
    const older = path.join(tmp, "run_old.jsonl");
    const newer = path.join(tmp, "run_new.jsonl");
    await writeFile(
      older,
      `${JSON.stringify({
        schemaVersion: "0.1",
        event: "run_started",
        timestamp: 1_700_000_001_000,
        runId: "run_old",
        name: "old",
        startTime: 1_700_000_001_000,
      })}\n${JSON.stringify({
        schemaVersion: "0.1",
        event: "run_completed",
        timestamp: 1_700_000_001_100,
        runId: "run_old",
        status: "success",
        endTime: 1_700_000_001_100,
        durationMs: 100,
      })}\n`,
      "utf-8",
    );
    await writeFile(
      newer,
      `${JSON.stringify({
        schemaVersion: "0.1",
        event: "run_started",
        timestamp: 1_700_000_002_000,
        runId: "run_new",
        name: "new",
        startTime: 1_700_000_002_000,
      })}\n${JSON.stringify({
        schemaVersion: "0.1",
        event: "run_completed",
        timestamp: 1_700_000_002_100,
        runId: "run_new",
        status: "success",
        endTime: 1_700_000_002_100,
        durationMs: 100,
      })}\n`,
      "utf-8",
    );

    const metas = [
      await extractMetadata(older),
      await extractMetadata(newer),
    ];
    const results = await searchTraces(metas, {
      traceDir: tmp,
      status: "success",
      limit: 1,
    });
    // Desired: newest match kept when limited. Current sort is oldest-first.
    expect(results[0]?.runId).toBe("run_new");
  });
});
