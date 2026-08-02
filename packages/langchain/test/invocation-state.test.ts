import { describe, expect, it } from "vitest";
import {
  beginCallbackRun,
  bumpCompletionGeneration,
  canScheduleFinalize,
  createInvocationState,
  endCallbackRun,
  isObservedCallbackRun,
  markEnvelopeStarted,
  markFinalized,
  noteTerminalError,
  resetInvocationState,
} from "../src/invocation-state.js";

describe("AdapterInvocationState", () => {
  it("tracks active and ended runs without inventing parents", () => {
    const state = createInvocationState("env-1");
    beginCallbackRun(state, {
      lcRunId: "child-1",
      parentLcRunId: "external-root",
      startedAt: 1,
    });

    expect(state.activeRuns.has("child-1")).toBe(true);
    expect(state.knownRelationships.has("child-1")).toBe(false);
    expect(state.pendingRelationships).toEqual([
      {
        childLcRunId: "child-1",
        parentLcRunId: "external-root",
        reason: "unobserved-parent",
      },
    ]);
  });

  it("records explicit parent only when parent was observed", () => {
    const state = createInvocationState("env-1");
    beginCallbackRun(state, { lcRunId: "parent", startedAt: 1 });
    beginCallbackRun(state, {
      lcRunId: "child",
      parentLcRunId: "parent",
      startedAt: 2,
    });

    expect(state.knownRelationships.get("child")).toBe("parent");
    expect(state.pendingRelationships).toHaveLength(0);
    expect(isObservedCallbackRun(state, "parent")).toBe(true);
  });

  it("allows finalize only when envelope started and no active runs", () => {
    const state = createInvocationState("env-1");
    expect(canScheduleFinalize(state)).toBe(false);

    markEnvelopeStarted(state, 10);
    expect(canScheduleFinalize(state)).toBe(true);

    beginCallbackRun(state, { lcRunId: "a", startedAt: 11 });
    expect(canScheduleFinalize(state)).toBe(false);

    endCallbackRun(state, "a");
    expect(canScheduleFinalize(state)).toBe(true);
    expect(state.endedRuns.has("a")).toBe(true);
  });

  it("bumps completionGeneration on start/end so deferred finalize can cancel", () => {
    const state = createInvocationState("env-1");
    markEnvelopeStarted(state, 1);
    beginCallbackRun(state, { lcRunId: "a", startedAt: 2 });
    const genAfterStart = state.completionGeneration;
    endCallbackRun(state, "a");
    expect(state.completionGeneration).toBeGreaterThan(genAfterStart);

    const scheduled = state.completionGeneration;
    bumpCompletionGeneration(state);
    expect(state.completionGeneration).not.toBe(scheduled);
  });

  it("finalizes idempotently and retains terminal error", () => {
    const state = createInvocationState("env-1");
    markEnvelopeStarted(state, 1);
    noteTerminalError(state, "boom");
    expect(markFinalized(state)).toBe(true);
    expect(markFinalized(state)).toBe(false);
    expect(state.finalized).toBe(true);
    expect(state.terminalError?.message).toBe("boom");
    expect(canScheduleFinalize(state)).toBe(false);
  });

  it("reset clears lifecycle for a later invocation on the same handler", () => {
    const state = createInvocationState("env-1");
    markEnvelopeStarted(state, 1);
    beginCallbackRun(state, {
      lcRunId: "a",
      parentLcRunId: "missing",
      startedAt: 2,
    });
    endCallbackRun(state, "a");
    markFinalized(state);

    resetInvocationState(state, "env-2");
    expect(state.envelopeRunId).toBe("env-2");
    expect(state.envelopeStarted).toBe(false);
    expect(state.finalized).toBe(false);
    expect(state.activeRuns.size).toBe(0);
    expect(state.endedRuns.size).toBe(0);
    expect(state.pendingRelationships).toHaveLength(0);
    expect(state.terminalError).toBeUndefined();
  });

  it("treats end without start as late", () => {
    const state = createInvocationState("env-1");
    expect(endCallbackRun(state, "ghost")).toEqual({ ended: false, late: true });
  });
});
