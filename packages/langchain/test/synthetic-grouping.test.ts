import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readTraceEvents } from "agent-inspect/advanced";

import { LangChainTracePersistence } from "../src/trace-persistence.js";

describe("v6.8-4 synthetic correlated grouping", () => {
  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-v684-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it("creates a synthetic group when two siblings share LangGraph semantic parent", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_synthetic_group",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "a",
      lcParentRunId: "LangGraph",
      name: "chain:node_a",
      kind: "CHAIN",
      startTime: 1,
      attributes: {},
    });
    await persistence.onStepStart({
      lcRunId: "b",
      lcParentRunId: "LangGraph",
      name: "chain:node_b",
      kind: "CHAIN",
      startTime: 2,
      attributes: {},
    });
    await persistence.onStepEnd({
      lcRunId: "a",
      endTime: 3,
      durationMs: 2,
      status: "success",
    });
    await persistence.onStepEnd({
      lcRunId: "b",
      endTime: 4,
      durationMs: 2,
      status: "success",
    });

    const events = await readTraceEvents("run_synthetic_group", traceDir);
    const synthetic = events.find(
      (e) => e.event === "step_started" && e.name === "synthetic:LangGraph",
    );
    expect(synthetic).toBeDefined();
    if (synthetic?.event === "step_started") {
      expect(synthetic.metadata?.synthetic).toBe(true);
      expect(synthetic.metadata?.semanticParentLabel).toBe("LangGraph");
    }

    const nodeA = events.find(
      (e) => e.event === "step_started" && e.name === "chain:node_a",
    );
    const nodeB = events.find(
      (e) => e.event === "step_started" && e.name === "chain:node_b",
    );
    // First sibling stays unresolved (append-only); second attaches to synthetic.
    if (nodeA?.event === "step_started") {
      expect(nodeA.parentId).toBeUndefined();
      expect(nodeA.metadata?.parentMapping).toBe("unresolved");
    }
    if (nodeB?.event === "step_started") {
      expect(nodeB.parentId).toBe(
        synthetic && "stepId" in synthetic ? synthetic.stepId : undefined,
      );
      expect(nodeB.metadata?.parentMapping).toBe("synthetic-group");
      expect(nodeB.metadata?.semanticParentLabel).toBe("LangGraph");
    }

    expect(events.some((e) => e.event === "run_completed")).toBe(true);
    expect(
      events.some(
        (e) =>
          e.event === "step_completed" &&
          synthetic &&
          "stepId" in synthetic &&
          e.stepId === synthetic.stepId,
      ),
    ).toBe(true);
  });

  it("does not invent a synthetic group for a single semantic sibling", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_no_synth_single",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "only",
      lcParentRunId: "__start__",
      name: "chain:only",
      kind: "CHAIN",
      startTime: 1,
      attributes: {},
    });
    await persistence.onStepEnd({
      lcRunId: "only",
      endTime: 2,
      durationMs: 1,
      status: "success",
    });

    const events = await readTraceEvents("run_no_synth_single", traceDir);
    expect(events.some((e) => e.event === "step_started" && String(e.name).startsWith("synthetic:"))).toBe(
      false,
    );
  });
});
