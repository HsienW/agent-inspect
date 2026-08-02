/**
 * v6.8-8 — Actual LangGraph no-provider test application.
 * Uses real `@langchain/langgraph` + `DynamicStructuredTool` with no LLM provider / network.
 */
import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { DynamicStructuredTool } from "@langchain/core/tools";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readTraceEvents } from "agent-inspect/advanced";

import { AgentInspectCallback } from "../src/agent-inspect-callback.js";

const langgraphAvailable = await import("@langchain/langgraph")
  .then(() => true)
  .catch(() => false);

describe.runIf(langgraphAvailable)("v6.8-8 LangGraph no-provider app", () => {
  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-lg-app-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it("compiles a StateGraph with two DynamicStructuredTools and closes the envelope", async () => {
    const rewards = new DynamicStructuredTool({
      name: "get_navan_rewards",
      description: "Lookup rewards points",
      schema: {
        type: "object",
        properties: { userId: { type: "string" } },
        required: ["userId"],
      },
      func: async ({ userId }: { userId: string }) =>
        JSON.stringify({ userId, points: 42 }),
    });

    const search = new DynamicStructuredTool({
      name: "search_docs",
      description: "Search docs",
      schema: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
      func: async ({ query }: { query: string }) =>
        JSON.stringify({ query, hits: 1 }),
    });

    const State = Annotation.Root({
      request: Annotation<string>({
        reducer: (_a, b) => b,
        default: () => "",
      }),
      rewardResult: Annotation<string>({
        reducer: (_a, b) => b,
        default: () => "",
      }),
      searchResult: Annotation<string>({
        reducer: (_a, b) => b,
        default: () => "",
      }),
    });

    const graph = new StateGraph(State)
      .addNode("rewards", async (_state, config) => {
        const rewardResult = String(
          await rewards.invoke({ userId: "traveler-1" } as never, config),
        );
        return { rewardResult };
      })
      .addNode("search", async (_state, config) => {
        const searchResult = String(
          await search.invoke({ query: "policy" } as never, config),
        );
        return { searchResult };
      })
      .addEdge(START, "rewards")
      .addEdge("rewards", "search")
      .addEdge("search", END)
      .compile();

    const callback = new AgentInspectCallback({
      traceDir,
      persist: true,
      runId: "run_langgraph_no_provider",
      runName: "langgraph-no-provider-app",
      capture: "metadata-only",
      silent: true,
    });

    const result = await graph.invoke(
      { request: "lookup" },
      { callbacks: [callback] },
    );

    expect(result.rewardResult).toContain("42");
    expect(result.searchResult).toContain("policy");

    // Ensure deferred finalization settles; finalize is a safe no-op if already closed.
    await callback.flush();
    await callback.finalize({ status: "success" });

    const events = await readTraceEvents("run_langgraph_no_provider", traceDir);
    expect(events.some((e) => e.event === "run_started")).toBe(true);
    expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);

    const stepNames = events
      .filter((e) => e.event === "step_started")
      .map((e) => (e.event === "step_started" ? e.name : ""));
    // Real LangGraph emits chain nodes; tools fire when invoked with runnable config.
    expect(stepNames.some((n) => n.includes("rewards") || n.includes("search") || n.startsWith("chain:"))).toBe(
      true,
    );

    const toolStarts = events.filter(
      (e) => e.event === "step_started" && e.type === "tool",
    );
    const toolNames = toolStarts.map((e) =>
      e.event === "step_started" ? e.name : "",
    );
    expect(toolNames).toEqual(
      expect.arrayContaining(["tool:get_navan_rewards", "tool:search_docs"]),
    );

    for (const step of toolStarts) {
      if (step.event !== "step_started") continue;
      expect(step.metadata?.toolClass).toBe("DynamicStructuredTool");
      expect(typeof step.metadata?.toolName).toBe("string");
    }

    expect(JSON.stringify(events)).not.toContain("sk-");
  });

  it("reuses the same callback across two invokes without mixing envelopes", async () => {
    const State = Annotation.Root({
      n: Annotation<number>({
        reducer: (_a, b) => b,
        default: () => 0,
      }),
    });
    const graph = new StateGraph(State)
      .addNode("inc", async (state) => ({ n: state.n + 1 }))
      .addEdge(START, "inc")
      .addEdge("inc", END)
      .compile();

    const callback = new AgentInspectCallback({
      traceDir,
      persist: true,
      runId: "run_langgraph_reuse_first",
      silent: true,
    });

    await graph.invoke({ n: 0 }, { callbacks: [callback] });
    await callback.flush();
    await callback.finalize({ status: "success" });

    await graph.invoke({ n: 10 }, { callbacks: [callback] });
    await callback.flush();
    await callback.finalize({ status: "success" });

    const first = await readTraceEvents("run_langgraph_reuse_first", traceDir);
    expect(first.filter((e) => e.event === "run_completed")).toHaveLength(1);

    const { readdir } = await import("node:fs/promises");
    const files = (await readdir(traceDir)).filter((f) => f.endsWith(".jsonl"));
    expect(files.length).toBeGreaterThanOrEqual(2);
  });
});
