import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readTraceEvents } from "agent-inspect/advanced";

import { LangChainTracePersistence } from "../src/trace-persistence.js";

describe("v6.8-3 parent reconciliation persistence", () => {
  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-v683-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it("links a child to a unique __start__ semantic parent when that step exists", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_semantic_start",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "start-node",
      name: "chain:__start__",
      kind: "CHAIN",
      startTime: 1,
      attributes: { langGraph: { nodeName: "__start__" } },
    });
    await persistence.onStepStart({
      lcRunId: "router",
      lcParentRunId: "__start__",
      name: "chain:router",
      kind: "CHAIN",
      startTime: 2,
      attributes: { langGraph: { nodeName: "router" } },
    });
    await persistence.onStepEnd({
      lcRunId: "router",
      endTime: 3,
      durationMs: 1,
      status: "success",
    });
    await persistence.onStepEnd({
      lcRunId: "start-node",
      endTime: 4,
      durationMs: 3,
      status: "success",
    });

    const events = await readTraceEvents("run_semantic_start", traceDir);
    const start = events.find(
      (e) => e.event === "step_started" && e.name === "chain:__start__",
    );
    const router = events.find(
      (e) => e.event === "step_started" && e.name === "chain:router",
    );
    expect(start && "stepId" in start ? start.stepId : undefined).toBeTruthy();
    expect(router && "parentId" in router ? router.parentId : undefined).toBe(
      start && "stepId" in start ? start.stepId : undefined,
    );
    if (router?.event === "step_started") {
      expect(router.metadata?.parentMapping).toBe("semantic-name");
      expect(router.metadata?.parentConfidence).toBe("correlated");
      expect(router.metadata?.semanticParentLabel).toBe("__start__");
    }
  });

  it("correlates handoffFrom to a unique taskId without inventing other edges", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_handoff",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "a",
      name: "chain:planner",
      kind: "CHAIN",
      startTime: 1,
      attributes: { langGraph: { taskId: "task-planner", nodeName: "planner" } },
    });
    await persistence.onStepStart({
      lcRunId: "b",
      lcParentRunId: "unobserved-external",
      name: "chain:worker",
      kind: "CHAIN",
      startTime: 2,
      attributes: {
        langGraph: { taskId: "task-worker", handoffFrom: "task-planner" },
      },
    });
    await persistence.onStepEnd({
      lcRunId: "b",
      endTime: 3,
      durationMs: 1,
      status: "success",
    });
    await persistence.onStepEnd({
      lcRunId: "a",
      endTime: 4,
      durationMs: 3,
      status: "success",
    });

    const events = await readTraceEvents("run_handoff", traceDir);
    const planner = events.find(
      (e) => e.event === "step_started" && e.name === "chain:planner",
    );
    const worker = events.find(
      (e) => e.event === "step_started" && e.name === "chain:worker",
    );
    expect(worker && "parentId" in worker ? worker.parentId : undefined).toBe(
      planner && "stepId" in planner ? planner.stepId : undefined,
    );
    if (worker?.event === "step_started") {
      expect(worker.metadata?.parentMapping).toBe("langgraph-metadata");
      expect(worker.metadata?.parentCorrelatedVia).toBe("handoffFrom");
    }
  });

  it("does not self-parent when child LangGraph keys are indexed only after resolve (N-4)", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_no_self_parent",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "seq",
      lcParentRunId: "unobserved-parent",
      name: "chain:RunnableSequence",
      kind: "CHAIN",
      startTime: 1,
      attributes: { langGraph: { checkpointNamespace: "swarm-ns" } },
    });
    await persistence.onStepEnd({
      lcRunId: "seq",
      endTime: 2,
      durationMs: 1,
      status: "success",
    });

    const events = await readTraceEvents("run_no_self_parent", traceDir);
    const step = events.find((e) => e.event === "step_started");
    expect(step && "stepId" in step ? step.stepId : undefined).toBeTruthy();
    if (step?.event === "step_started") {
      expect(step.parentId).not.toBe(step.stepId);
      expect(step.parentId).toBeUndefined();
      expect(step.metadata?.parentMapping).toBe("unresolved");
    }
  });

  it("keeps LangGraph semantic parents unresolved when no unique match exists", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_langgraph_label",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "node",
      lcParentRunId: "LangGraph",
      name: "chain:agent",
      kind: "CHAIN",
      startTime: 1,
      attributes: {},
    });
    await persistence.onStepEnd({
      lcRunId: "node",
      endTime: 2,
      durationMs: 1,
      status: "success",
    });

    const events = await readTraceEvents("run_langgraph_label", traceDir);
    const step = events.find((e) => e.event === "step_started");
    if (step?.event === "step_started") {
      expect(step.parentId).toBeUndefined();
      expect(step.metadata?.parentMapping).toBe("unresolved");
      expect(step.metadata?.semanticParentLabel).toBe("LangGraph");
    }
  });
});
