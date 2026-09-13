/**
 * Flagship 6.27 bounded read-recovery oracle for retrieve_policy.
 * Synthetic in-memory traces only — no network.
 */
import { defineTraceContract, evaluateTraceContract } from "agent-inspect/checks";
import type { TraceReadResult } from "agent-inspect/readers";

function event(eventId: string, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: "0.2" as const,
    eventId,
    runId: "run-recovery",
    kind: "LOGIC" as const,
    name: eventId,
    status: "ok" as const,
    timestamp: "2026-09-12T10:00:00.000Z",
    confidence: "explicit" as const,
    source: { type: "manual" as const },
    ...overrides,
  };
}

function read(events: ReturnType<typeof event>[]): TraceReadResult {
  const children = events
    .filter((e) => e.kind !== "RUN")
    .map((e) => ({
      event: {
        eventId: e.eventId,
        runId: e.runId,
        kind: e.kind,
        name: e.name,
        status: e.status,
        timestamp: Date.parse(e.timestamp),
        attributes: e.attributes as Record<string, unknown> | undefined,
        confidence: e.confidence,
        source: { type: "manual" as const },
      },
      children: [] as never[],
      depth: 1,
    }));
  return {
    format: "agent-inspect-jsonl",
    runs: [
      {
        runId: "run-recovery",
        name: "run-recovery",
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
            LOGIC: children.filter((c) => c.event.kind === "LOGIC").length,
            LOG: 0,
            OUTCOME: 0,
          },
        },
      },
    ],
    events: events as TraceReadResult["events"],
    warnings: [],
    unsupportedFields: [],
    sourceFiles: [],
  };
}

const contract = defineTraceContract({
  run: { requireCompleted: true },
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

const normal = [
  event("run", { kind: "RUN", name: "run-recovery" }),
  event("policy", {
    kind: "TOOL",
    name: "tool:retrieve_policy",
    attributes: {
      toolName: "retrieve_policy",
      noSideEffect: true,
      operationId: "op-policy",
      attemptId: "a1",
      attemptNumber: 1,
      arguments: { policyId: "policy-42" },
    },
    startedAt: "2026-09-12T10:00:01.000Z",
    endedAt: "2026-09-12T10:00:02.000Z",
  }),
  event("llm", {
    kind: "LLM",
    name: "llm:answer",
    attributes: { referencedEventIds: ["policy"] },
    startedAt: "2026-09-12T10:00:03.000Z",
    endedAt: "2026-09-12T10:00:04.000Z",
  }),
];

const validRecovery = [
  event("run", { kind: "RUN", name: "run-recovery" }),
  event("policy-err", {
    kind: "TOOL",
    name: "tool:retrieve_policy",
    status: "error",
    attributes: {
      toolName: "retrieve_policy",
      noSideEffect: true,
      operationId: "op-policy",
      attemptId: "a1",
      attemptNumber: 1,
      arguments: { policyId: "policy-42" },
      errorCode: "TRANSIENT",
    },
    startedAt: "2026-09-12T10:00:01.000Z",
    endedAt: "2026-09-12T10:00:02.000Z",
  }),
  event("policy-ok", {
    kind: "TOOL",
    name: "tool:retrieve_policy",
    attributes: {
      toolName: "retrieve_policy",
      noSideEffect: true,
      operationId: "op-policy",
      attemptId: "a2",
      attemptNumber: 2,
      arguments: { policyId: "policy-42" },
    },
    startedAt: "2026-09-12T10:00:03.000Z",
    endedAt: "2026-09-12T10:00:04.000Z",
  }),
  event("llm", {
    kind: "LLM",
    name: "llm:answer",
    attributes: { referencedEventIds: ["policy-ok"] },
    startedAt: "2026-09-12T10:00:05.000Z",
    endedAt: "2026-09-12T10:00:06.000Z",
  }),
];

/** ok → ok “recovery” with identical args (no prior failure). */
const unsafeSameOutput = [
  event("run", { kind: "RUN", name: "run-recovery" }),
  event("policy-1", {
    kind: "TOOL",
    name: "tool:retrieve_policy",
    attributes: {
      toolName: "retrieve_policy",
      noSideEffect: true,
      operationId: "op-policy",
      attemptId: "a1",
      attemptNumber: 1,
      arguments: { policyId: "policy-42" },
    },
    startedAt: "2026-09-12T10:00:01.000Z",
    endedAt: "2026-09-12T10:00:02.000Z",
  }),
  event("policy-2", {
    kind: "TOOL",
    name: "tool:retrieve_policy",
    attributes: {
      toolName: "retrieve_policy",
      noSideEffect: true,
      operationId: "op-policy",
      attemptId: "a2",
      attemptNumber: 2,
      arguments: { policyId: "policy-42" },
    },
    startedAt: "2026-09-12T10:00:03.000Z",
    endedAt: "2026-09-12T10:00:04.000Z",
  }),
  event("llm", {
    kind: "LLM",
    name: "llm:answer",
    attributes: { referencedEventIds: ["policy-2"] },
    startedAt: "2026-09-12T10:00:05.000Z",
    endedAt: "2026-09-12T10:00:06.000Z",
  }),
];

/** Recovered success without structured/digest argument evidence. */
const missingEvidence = [
  event("run", { kind: "RUN", name: "run-recovery" }),
  event("policy-err", {
    kind: "TOOL",
    name: "tool:retrieve_policy",
    status: "error",
    attributes: {
      toolName: "retrieve_policy",
      noSideEffect: true,
      operationId: "op-policy",
      attemptId: "a1",
      attemptNumber: 1,
      errorCode: "TRANSIENT",
    },
    startedAt: "2026-09-12T10:00:01.000Z",
    endedAt: "2026-09-12T10:00:02.000Z",
  }),
  event("policy-ok", {
    kind: "TOOL",
    name: "tool:retrieve_policy",
    attributes: {
      toolName: "retrieve_policy",
      noSideEffect: true,
      operationId: "op-policy",
      attemptId: "a2",
      attemptNumber: 2,
    },
    startedAt: "2026-09-12T10:00:03.000Z",
    endedAt: "2026-09-12T10:00:04.000Z",
  }),
  event("llm", {
    kind: "LLM",
    name: "llm:answer",
    attributes: { referencedEventIds: ["policy-ok"] },
    startedAt: "2026-09-12T10:00:05.000Z",
    endedAt: "2026-09-12T10:00:06.000Z",
  }),
];

console.log(`normal ${evaluateTraceContract({ read: read(normal) }, contract).status.toUpperCase()}`);
console.log(
  `valid-recovery ${evaluateTraceContract({ read: read(validRecovery) }, contract).status.toUpperCase()}`,
);
console.log(
  `unsafe-same-output ${evaluateTraceContract({ read: read(unsafeSameOutput) }, contract).status.toUpperCase()}`,
);
console.log(
  `missing-evidence ${evaluateTraceContract({ read: read(missingEvidence) }, contract).status.toUpperCase()}`,
);
