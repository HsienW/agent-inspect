/**
 * v6.8-9 — Streaming / parallel / subgraph / error matrix on real LangGraph.
 * No provider API keys; no network.
 */
import { mkdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readTraceEvents } from "agent-inspect/advanced";

import { AgentInspectCallback } from "../src/agent-inspect-callback.js";

const langgraphAvailable = await import("@langchain/langgraph")
  .then(() => true)
  .catch(() => false);

async function withTraceDir<T>(
  fn: (traceDir: string) => Promise<T>,
): Promise<T> {
  const traceDir = path.join(os.tmpdir(), `agent-inspect-lg-matrix-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  await mkdir(traceDir, { recursive: true });
  try {
    return await fn(traceDir);
  } finally {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

describe.runIf(langgraphAvailable)("v6.8-9 LangGraph fixture matrix", () => {
  it("direct invoke completes a parallel fan-out graph", async () => {
    await withTraceDir(async (traceDir) => {
      const State = Annotation.Root({
        a: Annotation<string>({ reducer: (_x, y) => y, default: () => "" }),
        b: Annotation<string>({ reducer: (_x, y) => y, default: () => "" }),
      });
      const graph = new StateGraph(State)
        .addNode("left", async () => ({ a: "L" }))
        .addNode("right", async () => ({ b: "R" }))
        .addNode("join", async (state) => ({ a: `${state.a}+${state.b}` }))
        .addEdge(START, "left")
        .addEdge(START, "right")
        .addEdge("left", "join")
        .addEdge("right", "join")
        .addEdge("join", END)
        .compile();

      const cb = new AgentInspectCallback({
        traceDir,
        persist: true,
        runId: "run_lg_parallel",
        silent: true,
      });
      const out = await graph.invoke({}, { callbacks: [cb] });
      await cb.flush();
      await cb.finalize({ status: "success" });
      expect(out.a).toContain("L");
      expect(out.b).toBe("R");

      const events = await readTraceEvents("run_lg_parallel", traceDir);
      expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
      expect(events.some((e) => e.event === "step_started")).toBe(true);
    });
  });

  it("stream mode yields chunks and still produces a terminal envelope", async () => {
    await withTraceDir(async (traceDir) => {
      const State = Annotation.Root({
        n: Annotation<number>({ reducer: (_a, b) => b, default: () => 0 }),
      });
      const graph = new StateGraph(State)
        .addNode("inc", async (state) => ({ n: state.n + 1 }))
        .addEdge(START, "inc")
        .addEdge("inc", END)
        .compile();

      const cb = new AgentInspectCallback({
        traceDir,
        persist: true,
        runId: "run_lg_stream",
        stream: true,
        silent: true,
      });

      const chunks: unknown[] = [];
      for await (const chunk of await graph.stream(
        { n: 0 },
        { callbacks: [cb], streamMode: "updates" },
      )) {
        chunks.push(chunk);
      }
      await cb.flush();
      await cb.finalize({ status: "success" });

      expect(chunks.length).toBeGreaterThan(0);
      const events = await readTraceEvents("run_lg_stream", traceDir);
      expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    });
  });

  it("nested subgraph invoke remains a single terminal envelope", async () => {
    await withTraceDir(async (traceDir) => {
      const Inner = Annotation.Root({
        v: Annotation<string>({ reducer: (_a, b) => b, default: () => "" }),
      });
      const inner = new StateGraph(Inner)
        .addNode("work", async () => ({ v: "inner-done" }))
        .addEdge(START, "work")
        .addEdge("work", END)
        .compile();

      const Outer = Annotation.Root({
        v: Annotation<string>({ reducer: (_a, b) => b, default: () => "" }),
      });
      const outer = new StateGraph(Outer)
        .addNode("call_inner", async (_state, config) => {
          const result = await inner.invoke({ v: "" }, config);
          return { v: result.v };
        })
        .addEdge(START, "call_inner")
        .addEdge("call_inner", END)
        .compile();

      const cb = new AgentInspectCallback({
        traceDir,
        persist: true,
        runId: "run_lg_subgraph",
        silent: true,
      });
      const result = await outer.invoke({ v: "" }, { callbacks: [cb] });
      await cb.flush();
      await cb.finalize({ status: "success" });
      expect(result.v).toBe("inner-done");

      const events = await readTraceEvents("run_lg_subgraph", traceDir);
      expect(events.filter((e) => e.event === "run_started")).toHaveLength(1);
      expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    });
  });

  it("node error yields error terminal status when finalize observes the failure", async () => {
    await withTraceDir(async (traceDir) => {
      const State = Annotation.Root({
        n: Annotation<number>({ reducer: (_a, b) => b, default: () => 0 }),
      });
      const graph = new StateGraph(State)
        .addNode("boom", async () => {
          throw new Error("intentional-node-failure");
        })
        .addEdge(START, "boom")
        .addEdge("boom", END)
        .compile();

      const cb = new AgentInspectCallback({
        traceDir,
        persist: true,
        runId: "run_lg_error",
        silent: true,
      });

      await expect(graph.invoke({ n: 0 }, { callbacks: [cb] })).rejects.toThrow(
        /intentional-node-failure/,
      );
      await cb.flush();
      await cb.finalize({
        status: "error",
        errorMessage: "intentional-node-failure",
      });

      const events = await readTraceEvents("run_lg_error", traceDir);
      const completed = events.find((e) => e.event === "run_completed");
      expect(completed && "status" in completed ? completed.status : undefined).toBe(
        "error",
      );
    });
  });
});
