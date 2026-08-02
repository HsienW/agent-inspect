/**
 * v6.7.4-0 reproducers for LangChain/LangGraph blockers.
 * Known defects use it.fails until later chunks convert them to it().
 */
import { mkdir, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { Serialized } from "@langchain/core/load/serializable";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readTraceEvents } from "agent-inspect/advanced";

import { AgentInspectCallback } from "../src/agent-inspect-callback.js";

function mockSerialized(name: string): Serialized {
  return {
    lc: 1,
    type: "constructor",
    id: ["langchain", name],
    name,
    kwargs: {},
  };
}

describe("v6.7.4-0 langchain reproduction", () => {
  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-v674-lc-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it(
    "standalone persist emits run_completed when every callback has a parentRunId (LangGraph-shaped)",
    async () => {
      const cb = new AgentInspectCallback({
        traceDir,
        persist: true,
        runId: "run_langgraph_shaped",
      });
      // LangGraph-shaped: start AND end carry parentRunId (no parentless root observed).
      await cb.handleChainStart(
        mockSerialized("graph"),
        {},
        "node-1",
        "external-root",
        [],
        {},
        "agent",
      );
      await cb.handleChainEnd({ ok: true }, "node-1", "external-root");

      const files = await readdir(traceDir);
      expect(files).toContain("run_langgraph_shaped.jsonl");
      const events = await readTraceEvents("run_langgraph_shaped", traceDir);
      expect(events.some((e) => e.event === "run_completed")).toBe(true);
      expect(events.filter((e) => e.event === "run_started")).toHaveLength(1);
      expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    },
  );

  it(
    "tool step display name prefers runName over serialized DynamicStructuredTool class",
    async () => {
      const cb = new AgentInspectCallback({
        traceDir,
        persist: true,
        runId: "run_tool_identity",
      });
      await cb.handleChainStart(mockSerialized("chain"), {}, "root", undefined);
      await cb.handleToolStart(
        mockSerialized("DynamicStructuredTool"),
        "{}",
        "tool-1",
        "root",
        [],
        { toolName: "get_navan_rewards" },
        "get_navan_rewards",
      );
      await cb.handleToolEnd("{}", "tool-1");
      await cb.handleChainEnd({ ok: true }, "root");

      const events = await readTraceEvents("run_tool_identity", traceDir);
      const toolStart = events.find(
        (e) => e.event === "step_started" && e.type === "tool",
      );
      expect(toolStart && "name" in toolStart ? toolStart.name : undefined).toBe(
        "tool:get_navan_rewards",
      );
      if (toolStart?.event === "step_started") {
        expect(toolStart.metadata?.toolName).toBe("get_navan_rewards");
        expect(toolStart.metadata?.toolClass).toBe("DynamicStructuredTool");
      }
    },
  );

  it("standalone persist completes after nested parented children drain", async () => {
    const cb = new AgentInspectCallback({
      traceDir,
      persist: true,
      runId: "run_nested_parented",
    });
    await cb.handleChainStart(
      mockSerialized("graph"),
      {},
      "outer",
      "LangGraph",
      [],
      {},
      "agent",
    );
    await cb.handleLLMStart(mockSerialized("m"), ["p"], "llm-1", "outer");
    await cb.handleLLMEnd({ generations: [] } as never, "llm-1", "outer");
    await cb.handleChainEnd({ ok: true }, "outer", "LangGraph");

    const events = await readTraceEvents("run_nested_parented", traceDir);
    expect(events.filter((e) => e.event === "run_started")).toHaveLength(1);
    expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    const done = events.find((e) => e.event === "run_completed");
    expect(done && "status" in done ? done.status : undefined).toBe("success");
  });
});
