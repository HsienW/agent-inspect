import {
  defineTraceContract,
  evaluateTraceContract,
  type TraceCheckInput,
} from "agent-inspect/checks";
import type { TraceReadResult } from "agent-inspect/readers";

function event(
  eventId: string,
  runId: string,
  overrides: Record<string, unknown> = {},
) {
  return {
    schemaVersion: "0.2" as const,
    eventId,
    runId,
    kind: "LOGIC" as const,
    name: eventId,
    status: "ok" as const,
    timestamp: "2026-09-12T00:00:01.000Z",
    confidence: "explicit" as const,
    source: { type: "manual" as const },
    ...overrides,
  };
}

function tool(eventId: string, runId: string, name: string) {
  return event(eventId, runId, {
    kind: "TOOL",
    name: `tool:${name}`,
    attributes: { toolName: name },
    startedAt: "2026-09-12T00:00:01.000Z",
    endedAt: "2026-09-12T00:00:02.000Z",
  });
}

function runMeta(runId: string, attributes: Record<string, unknown>) {
  return event(`${runId}-run`, runId, {
    kind: "RUN",
    name: runId,
    attributes,
    timestamp: "2026-09-12T00:00:00.000Z",
  });
}

function node(e: ReturnType<typeof event>) {
  return {
    event: {
      eventId: e.eventId,
      runId: e.runId,
      parentId: e.parentId as string | undefined,
      kind: e.kind,
      name: e.name,
      status: e.status === "unknown" ? undefined : e.status,
      timestamp: Date.parse(e.timestamp),
      attributes: e.attributes as Record<string, unknown> | undefined,
      confidence: e.confidence,
      source: { type: "manual" as const },
    },
    children: [] as never[],
    depth: 1,
  };
}

function readOf(
  runs: Array<{ runId: string; events: ReturnType<typeof event>[] }>,
): TraceReadResult {
  return {
    format: "agent-inspect-jsonl",
    runs: runs.map((item) => ({
      runId: item.runId,
      name: item.runId,
      status: "ok" as const,
      children: item.events.filter((e) => e.kind !== "RUN").map(node),
      metadata: {
        totalEvents: item.events.length,
        confidenceBreakdown: {
          explicit: item.events.length,
          correlated: 0,
          heuristic: 0,
          unknown: 0,
        },
        kinds: {
          RUN: 0,
          AGENT: 0,
          LLM: 0,
          TOOL: item.events.filter((e) => e.kind === "TOOL").length,
          CHAIN: 0,
          RETRIEVER: 0,
          DECISION: 0,
          RESULT: 0,
          ERROR: 0,
          LOGIC: item.events.filter((e) => e.kind === "LOGIC").length,
          LOG: 0,
          OUTCOME: item.events.filter((e) => e.kind === "OUTCOME").length,
        },
      },
    })),
    events: runs.flatMap((item) => item.events) as TraceReadResult["events"],
    warnings: [],
    unsupportedFields: [],
    sourceFiles: [],
  };
}

function statusOf(input: TraceCheckInput, contract: Parameters<typeof evaluateTraceContract>[1]) {
  return evaluateTraceContract(input, contract).status;
}

const planner = {
  runId: "planner",
  events: [
    runMeta("planner", {
      sessionId: "sess-1",
      groupId: "grp-1",
      workflowStep: "plan",
      subAgentId: "planner-agent",
    }),
    tool("p-plan", "planner", "plan"),
    tool("p-tests", "planner", "run_tests"),
  ],
};

const verifier = {
  runId: "verifier",
  events: [
    runMeta("verifier", {
      sessionId: "sess-1",
      groupId: "grp-1",
      workflowStep: "verify",
      subAgentId: "verifier-agent",
    }),
    tool("v-tests", "verifier", "run_tests"),
  ],
};

const verifierContract = defineTraceContract({
  scope: { subAgentId: "verifier-agent" },
  tools: { required: ["run_tests"] },
});

console.log(
  `verifier scope ${statusOf({ read: readOf([planner, verifier]) }, verifierContract).toUpperCase()}`,
);

const verifierWithoutTool = {
  runId: "verifier",
  events: [
    runMeta("verifier", {
      sessionId: "sess-1",
      groupId: "grp-1",
      workflowStep: "verify",
      subAgentId: "verifier-agent",
    }),
    tool("v-plan", "verifier", "plan"),
  ],
};
console.log(
  `planner-as-verifier ${statusOf(
    { read: readOf([planner, verifierWithoutTool]) },
    verifierContract,
  ).toUpperCase()}`,
);

console.log(
  `missing actor ${statusOf(
    {
      read: readOf([
        {
          runId: "lonely",
          events: [runMeta("lonely", { sessionId: "sess-1" }), tool("t", "lonely", "run_tests")],
        },
      ]),
    },
    verifierContract,
  ).toUpperCase()}`,
);

const linked = tool("charge-1", "run-p", "charge");
const goodOutcome = event("out-good", "run-p", {
  kind: "OUTCOME",
  name: "refund-confirmed",
  attributes: {
    outcomeStatus: "passed",
    expectation: "refund-confirmed",
    method: "network",
    evidence: { eventId: "charge-1" },
  },
});
const provenance = defineTraceContract({
  observations: {
    required: ["refund-confirmed"],
    requireProvenance: { method: true, evidence: true, sameRunEventReference: true },
  },
});
console.log(
  `provenance ${statusOf(
    { read: readOf([{ runId: "run-p", events: [runMeta("run-p", {}), linked, goodOutcome] }]) },
    provenance,
  ).toUpperCase()}`,
);

const fabricated = event("out-fake", "run-p", {
  kind: "OUTCOME",
  name: "refund-confirmed",
  attributes: { outcomeStatus: "passed", expectation: "refund-confirmed" },
});
console.log(
  `fabricated provenance ${statusOf(
    { read: readOf([{ runId: "run-p", events: [runMeta("run-p", {}), fabricated] }]) },
    provenance,
  ).toUpperCase()}`,
);
