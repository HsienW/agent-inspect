import { defineTraceContract, evaluateTraceContract } from "agent-inspect/checks";
import type { TraceReadResult } from "agent-inspect/readers";

function event(eventId: string, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: "0.2" as const,
    eventId,
    runId: "run-controls",
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
        runId: "run-controls",
        name: "run-controls",
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
            LLM: 0,
            TOOL: children.filter((c) => c.event.kind === "TOOL").length,
            CHAIN: 0,
            RETRIEVER: 0,
            DECISION: 0,
            RESULT: 0,
            ERROR: 0,
            LOGIC: children.filter((c) => c.event.kind === "LOGIC").length,
            LOG: 0,
            OUTCOME: children.filter((c) => c.event.kind === "OUTCOME").length,
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
  tools: {
    orderRules: [{ before: "authorize", after: "charge", occurrenceMode: "all-occurrences" }],
    arguments: [
      {
        tool: "charge",
        path: "/dryRun",
        operator: "equals",
        expected: true,
        occurrence: "all",
      },
    ],
  },
  controls: {
    declaredTools: ["authorize", "charge"],
    enforcedTools: ["authorize", "charge"],
    requireDeclaredMatchesEnforced: true,
    requireObservedWithinEnforced: true,
    requiredStages: [{ stage: "enforced" }],
  },
  retry: {
    maxAttempts: 2,
    nonIdempotentTools: ["charge"],
    requireIdempotencyEvidenceForRetry: true,
  },
});

const healthy = [
  event("run", { kind: "RUN", name: "run-controls" }),
  event("auth", {
    kind: "TOOL",
    name: "tool:authorize",
    attributes: { toolName: "authorize" },
    startedAt: "2026-09-12T10:00:01.000Z",
    endedAt: "2026-09-12T10:00:02.000Z",
  }),
  event("charge", {
    kind: "TOOL",
    name: "tool:charge",
    attributes: {
      toolName: "charge",
      arguments: { dryRun: true },
      operationId: "op-1",
      attemptId: "a1",
      attemptNumber: 1,
      idempotencyKey: "charge-op-1",
    },
    startedAt: "2026-09-12T10:00:03.000Z",
    endedAt: "2026-09-12T10:00:04.000Z",
  }),
  event("stage", {
    kind: "OUTCOME",
    name: "control.enforced",
    attributes: { outcomeStatus: "passed", expectation: "control.enforced" },
  }),
];

const missingArgs = healthy.map((e) => {
  if (e.eventId !== "charge") return e;
  const { arguments: _drop, ...attributes } = e.attributes as Record<string, unknown>;
  return { ...e, attributes };
});

const unsafeRetry = [
  ...healthy,
  event("charge-2", {
    kind: "TOOL",
    name: "tool:charge",
    attributes: {
      toolName: "charge",
      arguments: { dryRun: true },
      operationId: "op-1",
      attemptId: "a2",
      attemptNumber: 2,
      // missing idempotencyKey on retry after ok
    },
    startedAt: "2026-09-12T10:00:05.000Z",
    endedAt: "2026-09-12T10:00:06.000Z",
  }),
];

/** error → success without idempotency evidence (must FAIL under requireIdempotencyEvidenceForRetry). */
const recoveredWithoutEvidence = [
  event("run", { kind: "RUN", name: "run-controls" }),
  event("charge-err", {
    kind: "TOOL",
    name: "tool:charge",
    status: "error",
    attributes: {
      toolName: "charge",
      arguments: { dryRun: true },
      operationId: "op-recover",
      attemptId: "r1",
      attemptNumber: 1,
    },
    startedAt: "2026-09-12T10:00:01.000Z",
    endedAt: "2026-09-12T10:00:02.000Z",
  }),
  event("charge-ok", {
    kind: "TOOL",
    name: "tool:charge",
    attributes: {
      toolName: "charge",
      arguments: { dryRun: true },
      operationId: "op-recover",
      attemptId: "r2",
      attemptNumber: 2,
      // missing idempotencyKey on error→success retry
    },
    startedAt: "2026-09-12T10:00:03.000Z",
    endedAt: "2026-09-12T10:00:04.000Z",
  }),
];

console.log(
  `healthy ${evaluateTraceContract({ read: read(healthy) }, contract).status.toUpperCase()}`,
);
console.log(
  `missing-args ${evaluateTraceContract({ read: read(missingArgs) }, contract).status.toUpperCase()}`,
);
console.log(
  `unsafe-retry ${evaluateTraceContract({ read: read(unsafeRetry) }, contract).status.toUpperCase()}`,
);
console.log(
  `recovered-without-evidence ${evaluateTraceContract({ read: read(recoveredWithoutEvidence) }, contract).status.toUpperCase()}`,
);
