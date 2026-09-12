import { defineTraceContract, evaluateTraceContract } from "agent-inspect/checks";
import type { TraceReadResult } from "agent-inspect/readers";

function event(eventId: string, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: "0.2" as const,
    eventId,
    runId: "run-refusal",
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
        runId: "run-refusal",
        name: "run-refusal",
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
            DECISION: children.filter((c) => c.event.kind === "DECISION").length,
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

const refusalContract = defineTraceContract({
  run: { requireCompleted: true },
  tools: { forbidden: ["send_email"], maxCalls: 0 },
  llm: { maxCalls: 0 },
  observations: { required: ["request-refused"] },
});

const healthy = [
  event("run", { kind: "RUN", name: "run-refusal" }),
  event("guard", {
    kind: "DECISION",
    name: "guardrail:outbound-policy",
    attributes: {
      policyId: "outbound-1",
      decisionId: "dec-1",
      reasonCode: "blocked-pii",
      mode: "enforce",
      verdict: "deny",
    },
  }),
  event("obs", {
    kind: "OUTCOME",
    name: "request-refused",
    attributes: {
      outcomeStatus: "passed",
      expectation: "request-refused",
      method: "custom",
      evidence: { eventId: "guard" },
    },
  }),
];

const missing = healthy.filter((e) => e.name !== "request-refused");
const sideEffect = [
  ...healthy,
  event("mail", {
    kind: "TOOL",
    name: "tool:send_email",
    attributes: { toolName: "send_email" },
    startedAt: "2026-09-12T10:00:01.000Z",
    endedAt: "2026-09-12T10:00:02.000Z",
  }),
];

console.log(
  `healthy ${evaluateTraceContract({ read: read(healthy) }, refusalContract).status.toUpperCase()}`,
);
console.log(
  `missing ${evaluateTraceContract({ read: read(missing) }, refusalContract).status.toUpperCase()}`,
);
console.log(
  `side-effect ${evaluateTraceContract({ read: read(sideEffect) }, refusalContract).status.toUpperCase()}`,
);
