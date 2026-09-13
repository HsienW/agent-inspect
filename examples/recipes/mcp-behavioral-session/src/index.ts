import { defineTraceContract, evaluateTraceContract } from "agent-inspect/checks";
import type { TraceReadResult } from "agent-inspect/readers";

/**
 * Synthetic MCP behavioral-session recipe (#362 / 6.26.0).
 * Dual-axis: TOOL status = execution; OUTCOME = expected behavior.
 */

type Ev = {
  schemaVersion: "0.2";
  eventId: string;
  runId: string;
  kind: string;
  name: string;
  status: string;
  timestamp: string;
  confidence: "explicit";
  source: { type: "manual" };
  attributes?: Record<string, unknown>;
};

function event(eventId: string, overrides: Partial<Ev> = {}): Ev {
  return {
    schemaVersion: "0.2",
    eventId,
    runId: "run-behavioral",
    kind: "LOGIC",
    name: eventId,
    status: "ok",
    timestamp: "2026-09-12T12:00:00.000Z",
    confidence: "explicit",
    source: { type: "manual" },
    ...overrides,
  };
}

function node(e: Ev) {
  return {
    event: {
      eventId: e.eventId,
      runId: e.runId,
      kind: e.kind,
      name: e.name,
      status: e.status === "unknown" ? undefined : e.status,
      timestamp: Date.parse(e.timestamp),
      attributes: e.attributes,
      confidence: e.confidence,
      source: { type: "manual" as const },
    },
    children: [] as never[],
    depth: 1,
  };
}

function readOf(events: Ev[]): TraceReadResult {
  const children = events.filter((e) => e.kind !== "RUN").map((e) => node(e));
  return {
    format: "agent-inspect-jsonl",
    events: events as never[],
    runs: [
      {
        runId: "run-behavioral",
        name: "behavioral-session",
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
            LOGIC: 0,
            LOG: 0,
            OUTCOME: children.filter((c) => c.event.kind === "OUTCOME").length,
          },
        },
      },
    ],
    warnings: [],
    unsupportedFields: [],
    sourceFiles: [],
  };
}

const contract = defineTraceContract({
  run: { requireCompleted: true },
  observations: {
    required: ["missing_required.rejected", "valid.success"],
    failOn: ["failed"],
  },
});

const healthy = [
  event("run", { kind: "RUN", name: "behavioral-session", status: "ok" }),
  event("tool-missing", {
    kind: "TOOL",
    name: "tool:indexPath",
    status: "error",
    attributes: { toolName: "indexPath", mcpIsError: true },
  }),
  event("out-missing", {
    kind: "OUTCOME",
    name: "missing_required.rejected",
    attributes: {
      outcomeStatus: "passed",
      expectation: "missing_required should be rejected",
      method: "mcp-tool-result",
    },
  }),
  event("tool-valid", {
    kind: "TOOL",
    name: "tool:indexPath",
    status: "ok",
    attributes: { toolName: "indexPath" },
  }),
  event("out-valid", {
    kind: "OUTCOME",
    name: "valid.success",
    attributes: {
      outcomeStatus: "passed",
      expectation: "valid input should succeed",
      method: "mcp-tool-result",
    },
  }),
];

const unexpectedAccept = [
  event("run", { kind: "RUN", name: "behavioral-session", status: "ok" }),
  event("tool-bad", {
    kind: "TOOL",
    name: "tool:indexPath",
    status: "ok",
    attributes: { toolName: "indexPath" },
  }),
  event("out-bad", {
    kind: "OUTCOME",
    name: "missing_required.rejected",
    attributes: {
      outcomeStatus: "failed",
      expectation: "missing_required should be rejected",
      method: "mcp-tool-result",
    },
  }),
  event("out-valid", {
    kind: "OUTCOME",
    name: "valid.success",
    attributes: {
      outcomeStatus: "passed",
      expectation: "valid input should succeed",
      method: "mcp-tool-result",
    },
  }),
];

const healthyResult = evaluateTraceContract({ read: readOf(healthy) }, contract);
const failResult = evaluateTraceContract({ read: readOf(unexpectedAccept) }, contract);

console.log(`healthy ${healthyResult.status.toUpperCase()}`);
console.log(`unexpected-accept ${failResult.status.toUpperCase()}`);
console.log(
  "Dual-axis: TOOL status stays execution-truth; OUTCOME scores expected behavior (#362).",
);
