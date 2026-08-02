import { mkdir, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { Serialized } from "@langchain/core/load/serializable";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AgentInspectCallback } from "../src/agent-inspect-callback.js";
import { resolvePersistIntent } from "../src/persist-intent.js";

function mockSerialized(name: string): Serialized {
  return {
    lc: 1,
    type: "constructor",
    id: ["langchain", name],
    name,
    kwargs: {},
  };
}

describe("persist-by-intent", () => {
  it("resolves intent from options", () => {
    expect(resolvePersistIntent({})).toEqual({ persist: false, contradictory: false });
    expect(resolvePersistIntent({ traceDir: ".agent-inspect" })).toEqual({
      persist: true,
      contradictory: false,
    });
    expect(resolvePersistIntent({ persist: true })).toEqual({
      persist: true,
      contradictory: false,
    });
    expect(resolvePersistIntent({ persist: false, traceDir: ".agent-inspect" })).toEqual({
      persist: false,
      contradictory: true,
    });
  });

  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-persist-intent-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it("enables persistence when only traceDir is provided", async () => {
    const cb = new AgentInspectCallback({
      traceDir,
      runId: "run_trace_dir_only",
      silent: true,
    });
    await cb.handleChainStart(mockSerialized("c"), {}, "root");
    await cb.handleChainEnd({}, "root");
    const files = await readdir(traceDir);
    expect(files).toContain("run_trace_dir_only.jsonl");
  });

  it("stays in-memory when persist is explicitly false despite traceDir", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const cb = new AgentInspectCallback({
      traceDir,
      persist: false,
      runId: "run_no_persist",
    });
    await cb.handleChainStart(mockSerialized("c"), {}, "root");
    await cb.handleChainEnd({}, "root");
    const files = await readdir(traceDir);
    expect(files).toHaveLength(0);
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});
