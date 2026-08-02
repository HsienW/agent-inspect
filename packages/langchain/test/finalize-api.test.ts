import { mkdir, rm } from "node:fs/promises";
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

describe("v6.8-7 flush/finalize/close", () => {
  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-v687-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it("finalize completes an open envelope with active children (serverless fallback)", async () => {
    const cb = new AgentInspectCallback({
      traceDir,
      persist: true,
      runId: "run_finalize_active",
      silent: true,
    });

    await cb.handleChainStart(
      mockSerialized("graph"),
      {},
      "open-node",
      undefined,
      [],
      {},
      "agent",
      "external",
    );
    // Never ends the chain — explicit finalize must still close the envelope.
    await cb.finalize({ status: "success" });
    await cb.finalize({ status: "error" }); // idempotent — no second run_completed

    const events = await readTraceEvents("run_finalize_active", traceDir);
    expect(events.filter((e) => e.event === "run_started")).toHaveLength(1);
    expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
    const completed = events.find((e) => e.event === "run_completed");
    expect(completed && "status" in completed ? completed.status : undefined).toBe(
      "success",
    );
  });

  it("close flushes and finalizes; repeated close is safe", async () => {
    const cb = new AgentInspectCallback({
      traceDir,
      persist: true,
      runId: "run_close",
      silent: true,
    });
    await cb.handleChainStart(mockSerialized("c"), {}, "root");
    await cb.close();
    await cb.close();

    const events = await readTraceEvents("run_close", traceDir);
    expect(events.filter((e) => e.event === "run_completed")).toHaveLength(1);
  });

  it("flush alone does not invent a terminal envelope without lifecycle activity", async () => {
    const cb = new AgentInspectCallback({
      traceDir,
      persist: true,
      runId: "run_flush_idle",
      silent: true,
    });
    await cb.flush();
    await cb.finalize();
    const files = await import("node:fs/promises").then((fs) => fs.readdir(traceDir));
    expect(files.filter((f) => f.endsWith(".jsonl"))).toHaveLength(0);
  });
});
