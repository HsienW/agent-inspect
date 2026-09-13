/**
 * 6.29.3 DX recipe: sensitive-read vs outbound-write via alternatives.anyOf.
 * Synthetic in-memory traces only — no network.
 */
import {
  defineTraceContract,
  evaluateTraceContract,
  explainTraceContract,
  lintTraceContract,
} from "agent-inspect/checks";
import type { TraceReadResult } from "agent-inspect/readers";

function event(eventId: string, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: "0.2" as const,
    eventId,
    runId: "run-anyof",
    kind: "LOGIC" as const,
    name: eventId,
    status: "ok" as const,
    timestamp: "2026-09-13T12:00:00.000Z",
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
        timestamp: Date.parse(String(e.timestamp)),
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
        runId: "run-anyof",
        name: "run-anyof",
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
  alternatives: {
    anyOf: [
      {
        id: "read-only-path",
        description: "Sensitive metadata read without outbound write",
        contract: {
          tools: {
            required: ["retrieve_secret_metadata"],
            forbidden: ["send_outbound"],
          },
          retry: {
            operations: [
              {
                tool: "retrieve_secret_metadata",
                sideEffectClass: "read",
                requireTerminalSuccess: true,
              },
            ],
          },
        },
      },
      {
        id: "write-path",
        description: "Outbound write with fail-closed write recovery semantics",
        contract: {
          tools: {
            required: ["send_outbound"],
            forbidden: ["retrieve_secret_metadata"],
          },
          retry: {
            operations: [
              {
                tool: "send_outbound",
                sideEffectClass: "write",
                maxAttempts: 1,
                requireTerminalSuccess: true,
              },
            ],
          },
        },
      },
    ],
  },
});

const readOnlyEvents = [
  event("run", {
    kind: "RUN",
    name: "run-anyof",
    timestamp: "2026-09-13T12:00:00.000Z",
  }),
  event("t-read", {
    kind: "TOOL",
    name: "tool:retrieve_secret_metadata",
    status: "ok",
    timestamp: "2026-09-13T12:00:01.000Z",
    startedAt: "2026-09-13T12:00:01.000Z",
    endedAt: "2026-09-13T12:00:02.000Z",
    attributes: {
      toolName: "retrieve_secret_metadata",
      operationId: "op-read",
      attemptId: "a1",
      noSideEffect: true,
    },
  }),
];

const writeEvents = [
  event("run", {
    kind: "RUN",
    name: "run-anyof",
    timestamp: "2026-09-13T12:00:00.000Z",
  }),
  event("t-write", {
    kind: "TOOL",
    name: "tool:send_outbound",
    status: "ok",
    timestamp: "2026-09-13T12:00:01.000Z",
    startedAt: "2026-09-13T12:00:01.000Z",
    endedAt: "2026-09-13T12:00:02.000Z",
    attributes: {
      toolName: "send_outbound",
      operationId: "op-write",
      attemptId: "a1",
      idempotencyKey: "idem-1",
    },
  }),
];

const readOnly = evaluateTraceContract({ read: read(readOnlyEvents) }, contract);
const writePath = evaluateTraceContract({ read: read(writeEvents) }, contract);
const lint = lintTraceContract(contract);
const explain = explainTraceContract(contract);

console.log("Sensitive-read / outbound-write anyOf recipe complete");
console.log(`Read-only path: ${readOnly.status}`);
console.log(`Write path: ${writePath.status}`);
console.log(`Lint diagnostics: ${lint.length}`);
console.log("Explain:");
for (const line of explain) {
  console.log(`  - ${line}`);
}

if (readOnly.status !== "pass" || writePath.status !== "pass") {
  process.exitCode = 1;
}
