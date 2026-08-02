import { describe, expect, it } from "vitest";

import { findFirstCausalFailure } from "../src/causal-failure.js";
import type { TraceEvent } from "../src/types.js";

function baseEvents(overrides: TraceEvent[] = []): TraceEvent[] {
  return [
    {
      schemaVersion: "0.1",
      event: "run_started",
      timestamp: 1,
      runId: "run_a",
      name: "demo",
      startTime: 1,
    },
    ...overrides,
    {
      schemaVersion: "0.1",
      event: "run_completed",
      timestamp: 100,
      runId: "run_a",
      status: "success",
      endTime: 100,
      durationMs: 99,
    },
  ];
}

describe("findFirstCausalFailure", () => {
  it("prefers explicit error steps (order 1)", () => {
    const events = baseEvents([
      {
        schemaVersion: "0.1",
        event: "step_started",
        timestamp: 2,
        runId: "run_a",
        stepId: "s1",
        name: "tool",
        type: "tool",
        startTime: 2,
      },
      {
        schemaVersion: "0.1",
        event: "step_completed",
        timestamp: 3,
        runId: "run_a",
        stepId: "s1",
        status: "error",
        endTime: 3,
        durationMs: 1,
      },
      {
        schemaVersion: "0.1",
        event: "outcome_observed",
        timestamp: 4,
        runId: "run_a",
        outcomeId: "o1",
        name: "check",
        expectation: "ok",
        status: "failed",
        observedAt: 4,
      },
    ]);
    const result = findFirstCausalFailure(events);
    expect(result.kind).toBe("explicit_error_event");
    expect(result.orderIndex).toBe(1);
    expect(result.evidenceIds).toContain("s1");
    expect(result.engine).toBe("conservative-causal-v1");
  });

  it("uses failed observed outcome when no error step (order 2)", () => {
    const events = baseEvents([
      {
        schemaVersion: "0.1",
        event: "outcome_observed",
        timestamp: 4,
        runId: "run_a",
        outcomeId: "o1",
        parentId: "step_x",
        name: "dom",
        expectation: "visible",
        status: "failed",
        observedAt: 4,
      },
    ]);
    const result = findFirstCausalFailure(events);
    expect(result.kind).toBe("failed_observed_outcome");
    expect(result.orderIndex).toBe(2);
    expect(result.primary?.outcomeId).toBe("o1");
  });

  it("uses linked contract failure (order 3)", () => {
    const events = baseEvents([]);
    const result = findFirstCausalFailure(events, {
      contractFindings: [
        {
          ruleId: "run.status",
          status: "fail",
          evidenceIds: ["evt_1"],
          message: "run status failed",
        },
      ],
    });
    expect(result.kind).toBe("contract_failure");
    expect(result.orderIndex).toBe(3);
    expect(result.evidenceIds).toContain("evt_1");
  });

  it("refuses timing-only inference when nothing explicit exists", () => {
    const events = baseEvents([
      {
        schemaVersion: "0.1",
        event: "step_started",
        timestamp: 2,
        runId: "run_a",
        stepId: "s1",
        name: "slow",
        type: "tool",
        startTime: 2,
      },
      {
        schemaVersion: "0.1",
        event: "step_completed",
        timestamp: 50,
        runId: "run_a",
        stepId: "s1",
        status: "success",
        endTime: 50,
        durationMs: 48,
      },
    ]);
    const result = findFirstCausalFailure(events);
    expect(result.kind).toBe("none");
    expect(result.orderIndex).toBe(0);
    expect(result.rationale).toMatch(/timing-only/i);
  });
});
