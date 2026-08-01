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

  it.fails(
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
    },
  );

  it.fails(
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
    },
  );
});
