import { describe, expect, it } from "vitest";

import {
  defineTraceContract,
  evaluateTraceContract,
  explainTraceContract,
} from "../../src/checks/contract.js";
import type { TraceReadResult } from "../../src/readers/index.js";
import type { InspectNode } from "../../src/types/inspect-event.js";
import type { PersistedInspectEvent } from "../../src/types/persisted-inspect-event.js";

function persisted(
  eventId: string,
  runId: string,
  overrides: Partial<PersistedInspectEvent> = {},
): PersistedInspectEvent {
  return {
    schemaVersion: "0.2",
    eventId,
    runId,
    kind: "LOGIC",
    name: eventId,
    status: "ok",
    timestamp: "2026-09-12T00:00:01.000Z",
    confidence: "explicit",
    source: { type: "manual" },
    ...overrides,
  };
}

function tool(
  eventId: string,
  runId: string,
  name: string,
  startedAt: string,
  endedAt: string,
  attributes: Record<string, unknown> = {},
  status: PersistedInspectEvent["status"] = "ok",
): PersistedInspectEvent {
  return persisted(eventId, runId, {
    kind: "TOOL",
    name: `tool:${name}`,
    status,
    attributes: { toolName: name, noSideEffect: true, ...attributes },
    timestamp: startedAt,
    startedAt,
    endedAt,
  });
}

function llm(
  eventId: string,
  runId: string,
  startedAt: string,
  attributes: Record<string, unknown> = {},
): PersistedInspectEvent {
  return persisted(eventId, runId, {
    kind: "LLM",
    name: "llm:answer",
    attributes,
    timestamp: startedAt,
    startedAt,
    endedAt: startedAt,
  });
}

function runEvent(runId: string): PersistedInspectEvent {
  return persisted(`${runId}-run`, runId, {
    kind: "RUN",
    name: runId,
    timestamp: "2026-09-12T00:00:00.000Z",
  });
}

function node(event: PersistedInspectEvent): InspectNode {
  return {
    event: {
      eventId: event.eventId,
      runId: event.runId,
      parentId: event.parentId,
      kind: event.kind,
      name: event.name,
      status: event.status === "unknown" ? undefined : event.status,
      timestamp: Date.parse(event.timestamp),
      durationMs: event.durationMs,
      attributes: event.attributes,
      confidence: event.confidence,
      source: { type: "manual" },
    },
    children: [],
    depth: 1,
  };
}

function readOf(events: PersistedInspectEvent[]): TraceReadResult {
  const runId = events[0]?.runId ?? "run-1";
  const children = events.filter((event) => event.kind !== "RUN").map((event) => node(event));
  return {
    format: "agent-inspect-jsonl",
    runs: [
      {
        runId,
        name: runId,
        status: "ok",
        children,
        metadata: {
          totalEvents: children.length,
          confidenceBreakdown: {
            explicit: children.length,
            correlated: 0,
            heuristic: 0,
            unknown: 0,
          },
          kinds: {
            RUN: 0,
            AGENT: 0,
            LLM: children.filter((c) => c.event.kind === "LLM").length,
            TOOL: children.filter((c) => c.event.kind === "TOOL").length,
            CHAIN: 0,
            RETRIEVER: 0,
            DECISION: 0,
            RESULT: 0,
            ERROR: 0,
            LOGIC: 0,
            LOG: 0,
            OUTCOME: 0,
          },
        },
      },
    ],
    events,
    warnings: [],
    unsupportedFields: [],
    sourceFiles: [],
  };
}

const recoveryContract = defineTraceContract({
  retry: {
    operations: [
      {
        tool: "retrieve_policy",
        sideEffectClass: "read",
        maxAttempts: 2,
        retryableErrors: { codes: ["TRANSIENT"] },
        requireFailureBeforeRetry: true,
        requireSameArguments: "structured-or-digest",
        requireTerminalSuccess: true,
        requireRecoveredFailureVisible: true,
        successfulResultDependency: {
          consumerKind: "LLM",
          requireExplicitReference: true,
        },
      },
    ],
  },
});

describe("bounded safe recovery operations (6.27)", () => {
  it("passes normal single successful retrieve_policy with LLM reference", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "retrieve_policy", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
        arguments: { policyId: "p-1" },
      }),
      llm("l1", "run-1", "2026-09-12T00:00:03.000Z", {
        referencedEventIds: ["t1"],
      }),
    ];
    expect(evaluateTraceContract({ read: readOf(events) }, recoveryContract).ok).toBe(true);
  });

  it("passes valid recovery with retryable error, same args, visible failure, LLM ref", () => {
    const events = [
      runEvent("run-1"),
      tool(
        "t1",
        "run-1",
        "retrieve_policy",
        "2026-09-12T00:00:01.000Z",
        "2026-09-12T00:00:02.000Z",
        {
          operationId: "op-1",
          attemptId: "a1",
          attemptNumber: 1,
          arguments: { policyId: "p-1" },
          errorCode: "TRANSIENT",
        },
        "error",
      ),
      tool("t2", "run-1", "retrieve_policy", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
        arguments: { policyId: "p-1" },
      }),
      llm("l1", "run-1", "2026-09-12T00:00:05.000Z", {
        referencedEventIds: ["t2"],
      }),
    ];
    expect(evaluateTraceContract({ read: readOf(events) }, recoveryContract).ok).toBe(true);
  });

  it("fails unsafe same-output retry without prior failure", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "retrieve_policy", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
        arguments: { policyId: "p-1" },
      }),
      tool("t2", "run-1", "retrieve_policy", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
        arguments: { policyId: "p-1" },
      }),
      llm("l1", "run-1", "2026-09-12T00:00:05.000Z", {
        referencedEventIds: ["t2"],
      }),
    ];
    const result = evaluateTraceContract({ read: readOf(events) }, recoveryContract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some(
        (finding) => finding.ruleId === "contract.retry.operations.failure-before-retry",
      ),
    ).toBe(true);
  });

  it("fails when same-arguments evidence is missing", () => {
    const events = [
      runEvent("run-1"),
      tool(
        "t1",
        "run-1",
        "retrieve_policy",
        "2026-09-12T00:00:01.000Z",
        "2026-09-12T00:00:02.000Z",
        {
          operationId: "op-1",
          attemptId: "a1",
          attemptNumber: 1,
          errorCode: "TRANSIENT",
        },
        "error",
      ),
      tool("t2", "run-1", "retrieve_policy", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
      }),
      llm("l1", "run-1", "2026-09-12T00:00:05.000Z", {
        referencedEventIds: ["t2"],
      }),
    ];
    const result = evaluateTraceContract({ read: readOf(events) }, recoveryContract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some((finding) => finding.ruleId === "contract.retry.operations.same-arguments"),
    ).toBe(true);
  });

  it("fails when successful result is not explicitly referenced by LLM", () => {
    const events = [
      runEvent("run-1"),
      tool(
        "t1",
        "run-1",
        "retrieve_policy",
        "2026-09-12T00:00:01.000Z",
        "2026-09-12T00:00:02.000Z",
        {
          operationId: "op-1",
          attemptId: "a1",
          attemptNumber: 1,
          arguments: { policyId: "p-1" },
          errorCode: "TRANSIENT",
        },
        "error",
      ),
      tool("t2", "run-1", "retrieve_policy", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
        arguments: { policyId: "p-1" },
      }),
      llm("l1", "run-1", "2026-09-12T00:00:05.000Z", {}),
    ];
    const result = evaluateTraceContract({ read: readOf(events) }, recoveryContract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some(
        (finding) => finding.ruleId === "contract.retry.operations.successful-result-dependency",
      ),
    ).toBe(true);
  });

  it("allows digest-based same-arguments continuity", () => {
    const events = [
      runEvent("run-1"),
      tool(
        "t1",
        "run-1",
        "retrieve_policy",
        "2026-09-12T00:00:01.000Z",
        "2026-09-12T00:00:02.000Z",
        {
          operationId: "op-1",
          attemptId: "a1",
          attemptNumber: 1,
          argumentsDigest: "abc123",
          errorCode: "TRANSIENT",
        },
        "error",
      ),
      tool("t2", "run-1", "retrieve_policy", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
        argumentsDigest: "abc123",
      }),
      llm("l1", "run-1", "2026-09-12T00:00:05.000Z", {
        referencedEventIds: ["t2"],
      }),
    ];
    expect(evaluateTraceContract({ read: readOf(events) }, recoveryContract).ok).toBe(true);
  });

  it("fails write timeout/unknown without idempotency evidence", () => {
    const contract = defineTraceContract({
      retry: {
        operations: [
          {
            tool: "charge",
            sideEffectClass: "write",
            maxAttempts: 2,
            requireTerminalSuccess: true,
          },
        ],
      },
    });
    const events = [
      runEvent("run-1"),
      tool(
        "t1",
        "run-1",
        "charge",
        "2026-09-12T00:00:01.000Z",
        "2026-09-12T00:00:02.000Z",
        {},
        "unknown",
      ),
    ];
    events[1]!.attributes = {
      toolName: "charge",
      operationId: "op-w",
      attemptId: "a1",
      attemptNumber: 1,
      timeout: true,
    };
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some(
        (finding) => finding.ruleId === "contract.retry.operations.write-completion-unevaluable",
      ),
    ).toBe(true);
  });

  it("explains recovery operation oracles", () => {
    const lines = explainTraceContract(recoveryContract);
    expect(lines.some((line) => line.includes("recovery operation oracle"))).toBe(true);
  });
});
