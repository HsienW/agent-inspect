import { mkdir, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { Serialized } from "@langchain/core/load/serializable";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readTraceEvents } from "agent-inspect/advanced";

import { AgentInspectCallback } from "../src/agent-inspect-callback.js";
import { LangChainTracePersistence } from "../src/trace-persistence.js";

function mockSerialized(name: string): Serialized {
  return {
    lc: 1,
    type: "constructor",
    id: ["langchain", name],
    name,
    kwargs: {},
  };
}

describe("v6.8-2 callback reuse and deferred completion", () => {
  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-v682-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it("reused callback writes a second envelope without mixing run ids", async () => {
    const cb = new AgentInspectCallback({
      traceDir,
      persist: true,
      runId: "run_reuse_first",
    });

    await cb.handleChainStart(
      mockSerialized("graph"),
      {},
      "a1",
      undefined,
      [],
      {},
      "agent",
      "external",
    );
    await cb.handleChainEnd({ ok: true }, "a1", "external");

    const firstEvents = await readTraceEvents("run_reuse_first", traceDir);
    expect(firstEvents.filter((e) => e.event === "run_started")).toHaveLength(1);
    expect(firstEvents.filter((e) => e.event === "run_completed")).toHaveLength(1);

    await cb.handleChainStart(
      mockSerialized("graph"),
      {},
      "b1",
      undefined,
      [],
      {},
      "agent",
      "external",
    );
    await cb.handleChainEnd({ ok: true }, "b1", "external");

    const files = (await readdir(traceDir)).filter((f) => f.endsWith(".jsonl"));
    expect(files.length).toBeGreaterThanOrEqual(2);
    expect(files).toContain("run_reuse_first.jsonl");

    const secondFile = files.find((f) => f !== "run_reuse_first.jsonl");
    expect(secondFile).toBeDefined();
    const secondId = secondFile!.replace(/\.jsonl$/, "");
    const secondEvents = await readTraceEvents(secondId, traceDir);
    expect(secondEvents.filter((e) => e.event === "run_started")).toHaveLength(1);
    expect(secondEvents.filter((e) => e.event === "run_completed")).toHaveLength(1);
    expect(secondEvents.every((e) => e.runId === secondId)).toBe(true);
    expect(firstEvents.every((e) => e.runId === "run_reuse_first")).toBe(true);

    // In-memory buffer belongs to the second invocation only.
    const memory = cb.getEvents();
    expect(memory.every((e) => e.runId === "b1" || e.eventId.startsWith("b1:"))).toBe(true);
  });

  it("same-turn sibling start cancels deferred finalize until both end", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_deferred_sibling",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "c1",
      lcParentRunId: "ext",
      name: "chain:a",
      kind: "CHAIN",
      startTime: 1,
      attributes: {},
    });
    await persistence.onStepStart({
      lcRunId: "c2",
      lcParentRunId: "ext",
      name: "chain:b",
      kind: "CHAIN",
      startTime: 2,
      attributes: {},
    });
    await persistence.onStepEnd({
      lcRunId: "c1",
      lcParentRunId: "ext",
      endTime: 3,
      durationMs: 2,
      status: "success",
    });
    // c2 still active — must not finalize yet
    expect(persistence.lifecycle.finalized).toBe(false);
    await persistence.onStepEnd({
      lcRunId: "c2",
      lcParentRunId: "ext",
      endTime: 4,
      durationMs: 2,
      status: "success",
    });

    const events = await readTraceEvents("run_deferred_sibling", traceDir);
    expect(events.filter((e) => e.event === "run_started")).toHaveLength(1);
    expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    expect(events.filter((e) => e.event === "step_started")).toHaveLength(2);
  });

  it("deferred finalize is cancelled when a sibling starts during the microtask gap", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_deferred_cancel",
      silent: true,
    });

    await persistence.onStepStart({
      lcRunId: "c1",
      lcParentRunId: "ext",
      name: "chain:a",
      kind: "CHAIN",
      startTime: 1,
      attributes: {},
    });

    const ending = persistence.onStepEnd({
      lcRunId: "c1",
      lcParentRunId: "ext",
      endTime: 2,
      durationMs: 1,
      status: "success",
    });
    // Start sibling before the deferred finalize microtask settles.
    await persistence.onStepStart({
      lcRunId: "c2",
      lcParentRunId: "ext",
      name: "chain:b",
      kind: "CHAIN",
      startTime: 3,
      attributes: {},
    });
    await ending;
    expect(persistence.lifecycle.finalized).toBe(false);

    await persistence.onStepEnd({
      lcRunId: "c2",
      lcParentRunId: "ext",
      endTime: 4,
      durationMs: 1,
      status: "success",
    });

    const events = await readTraceEvents("run_deferred_cancel", traceDir);
    expect(events.filter((e) => e.event === "run_started")).toHaveLength(1);
    expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    expect(events.filter((e) => e.event === "step_started")).toHaveLength(2);
  });

  it("late end after finalize increments diagnostics and does not reopen the envelope", async () => {
    const persistence = new LangChainTracePersistence({
      traceDir,
      runId: "run_late_end",
      silent: true,
    });
    await persistence.onStepStart({
      lcRunId: "only",
      name: "chain:x",
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
    expect(persistence.lifecycle.finalized).toBe(true);

    await persistence.onStepEnd({
      lcRunId: "ghost",
      endTime: 9,
      durationMs: 0,
      status: "success",
      completionAttributes: { name: "llm:late", kind: "LLM" },
    });

    expect(persistence.lateEventCount).toBeGreaterThanOrEqual(1);
    const events = await readTraceEvents("run_late_end", traceDir);
    expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    expect(events.filter((e) => e.event === "run_started")).toHaveLength(1);
  });
});
