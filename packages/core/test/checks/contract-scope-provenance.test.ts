import { describe, expect, it } from "vitest";

import {
  defineTraceContract,
  evaluateTraceContract,
  explainTraceContract,
  lintTraceContract,
} from "../../src/checks/contract.js";
import type { TraceReadResult } from "../../src/readers/index.js";
import type { InspectNode, InspectRunTree } from "../../src/types/inspect-event.js";
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
): PersistedInspectEvent {
  return persisted(eventId, runId, {
    kind: "TOOL",
    name: `tool:${name}`,
    attributes: { toolName: name },
    timestamp: startedAt,
    startedAt,
    endedAt,
  });
}

function runEvent(
  runId: string,
  attributes: Record<string, unknown>,
): PersistedInspectEvent {
  return persisted(`${runId}-run`, runId, {
    kind: "RUN",
    name: runId,
    attributes,
    timestamp: "2026-09-12T00:00:00.000Z",
  });
}

function outcome(
  eventId: string,
  runId: string,
  name: string,
  attrs: Record<string, unknown>,
): PersistedInspectEvent {
  return persisted(eventId, runId, {
    kind: "OUTCOME",
    name,
    attributes: {
      outcomeStatus: "passed",
      expectation: name,
      ...attrs,
    },
  });
}

function node(event: PersistedInspectEvent, children: InspectNode[] = []): InspectNode {
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
    children,
    depth: 1,
  };
}

function runTree(runId: string, events: PersistedInspectEvent[]): InspectRunTree {
  const children = events.filter((event) => event.kind !== "RUN").map((event) => node(event));
  return {
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
  };
}

function multiRead(runs: Array<{ runId: string; events: PersistedInspectEvent[] }>): TraceReadResult {
  const trees = runs.map((item) => runTree(item.runId, item.events));
  const events = runs.flatMap((item) => item.events);
  return {
    format: "agent-inspect-jsonl",
    runs: trees,
    events,
    warnings: [],
    unsupportedFields: [],
    sourceFiles: [],
  };
}

describe("TraceContract scope (#320)", () => {
  const plannerEvents = [
    runEvent("planner", {
      sessionId: "sess-1",
      groupId: "grp-1",
      workflowStep: "plan",
      subAgentId: "planner-agent",
    }),
    tool("p-plan", "planner", "plan", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z"),
    tool(
      "p-tests",
      "planner",
      "run_tests",
      "2026-09-12T00:00:03.000Z",
      "2026-09-12T00:00:04.000Z",
    ),
  ];
  const verifierEvents = [
    runEvent("verifier", {
      sessionId: "sess-1",
      groupId: "grp-1",
      workflowStep: "verify",
      subAgentId: "verifier-agent",
    }),
    tool(
      "v-tests",
      "verifier",
      "run_tests",
      "2026-09-12T00:00:05.000Z",
      "2026-09-12T00:00:06.000Z",
    ),
  ];

  it("passes when the scoped verifier performs run_tests", () => {
    const read = multiRead([
      { runId: "planner", events: plannerEvents },
      { runId: "verifier", events: verifierEvents },
    ]);
    const contract = defineTraceContract({
      scope: { subAgentId: "verifier-agent" },
      tools: { required: ["run_tests"] },
    });
    const result = evaluateTraceContract({ read }, contract);
    expect(result.status).toBe("pass");
    expect(result.runId).toBe("verifier");
    expect(result.findings.some((f) => f.ruleId === "contract.scope.selected")).toBe(true);
  });

  it("fails when planner calling run_tests is checked under verifier scope", () => {
    const plannerOnly = [
      runEvent("planner", {
        sessionId: "sess-1",
        groupId: "grp-1",
        workflowStep: "plan",
        subAgentId: "planner-agent",
      }),
      tool(
        "p-tests",
        "planner",
        "run_tests",
        "2026-09-12T00:00:03.000Z",
        "2026-09-12T00:00:04.000Z",
      ),
    ];
    const verifierNoTool = [
      runEvent("verifier", {
        sessionId: "sess-1",
        groupId: "grp-1",
        workflowStep: "verify",
        subAgentId: "verifier-agent",
      }),
      tool("v-plan", "verifier", "plan", "2026-09-12T00:00:05.000Z", "2026-09-12T00:00:06.000Z"),
    ];
    const read = multiRead([
      { runId: "planner", events: plannerOnly },
      { runId: "verifier", events: verifierNoTool },
    ]);
    const result = evaluateTraceContract(
      { read },
      defineTraceContract({
        scope: { subAgentId: "verifier-agent" },
        tools: { required: ["run_tests"] },
      }),
    );
    expect(result.status).toBe("fail");
    expect(result.runId).toBe("verifier");
  });

  it("errors on missing actor metadata without session fallback", () => {
    const read = multiRead([
      {
        runId: "lonely",
        events: [
          runEvent("lonely", { sessionId: "sess-1" }),
          tool("t1", "lonely", "run_tests", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z"),
        ],
      },
    ]);
    const result = evaluateTraceContract(
      { read },
      defineTraceContract({
        scope: { subAgentId: "missing-agent" },
        tools: { required: ["run_tests"] },
      }),
    );
    expect(result.status).toBe("error");
    expect(result.diagnostics.some((d) => d.ruleId === "contract.scope.zero-match")).toBe(true);
  });

  it("errors when groupId alone matches multiple actors", () => {
    const read = multiRead([
      { runId: "planner", events: plannerEvents },
      { runId: "verifier", events: verifierEvents },
    ]);
    const result = evaluateTraceContract(
      { read },
      defineTraceContract({
        scope: { groupId: "grp-1" },
        tools: { required: ["run_tests"] },
      }),
    );
    expect(result.status).toBe("error");
    expect(result.diagnostics.some((d) => d.ruleId === "contract.scope.ambiguous")).toBe(true);
  });

  it("projects subtree for rootEventId", () => {
    const root = persisted("root", "run-a", {
      kind: "LOGIC",
      name: "root",
      attributes: { workflowStep: "inner" },
    });
    const childTool = tool(
      "child-tool",
      "run-a",
      "run_tests",
      "2026-09-12T00:00:02.000Z",
      "2026-09-12T00:00:03.000Z",
    );
    childTool.parentId = "root";
    const sibling = tool(
      "sibling",
      "run-a",
      "charge",
      "2026-09-12T00:00:04.000Z",
      "2026-09-12T00:00:05.000Z",
    );
    const run: InspectRunTree = {
      runId: "run-a",
      name: "run-a",
      status: "ok",
      children: [node(root, [node(childTool)]), node(sibling)],
      metadata: {
        totalEvents: 3,
        confidenceBreakdown: { explicit: 3, correlated: 0, heuristic: 0, unknown: 0 },
        kinds: {
          RUN: 0,
          AGENT: 0,
          LLM: 0,
          TOOL: 2,
          CHAIN: 0,
          RETRIEVER: 0,
          DECISION: 0,
          RESULT: 0,
          ERROR: 0,
          LOGIC: 1,
          LOG: 0,
          OUTCOME: 0,
        },
      },
    };
    const read: TraceReadResult = {
      format: "agent-inspect-jsonl",
      runs: [run],
      events: [runEvent("run-a", { workflowStep: "outer" }), root, childTool, sibling],
      warnings: [],
      unsupportedFields: [],
      sourceFiles: [],
    };
    const pass = evaluateTraceContract(
      { read },
      defineTraceContract({
        scope: { rootEventId: "root" },
        tools: { required: ["run_tests"] },
      }),
    );
    expect(pass.status).toBe("pass");
    const failChargeOnly = evaluateTraceContract(
      { read },
      defineTraceContract({
        scope: { rootEventId: "root" },
        tools: { required: ["charge"] },
      }),
    );
    expect(failChargeOnly.status).toBe("fail");
  });

  it("keeps unscoped behavior for a single run", () => {
    const read = multiRead([{ runId: "verifier", events: verifierEvents }]);
    const result = evaluateTraceContract(
      { read },
      defineTraceContract({ tools: { required: ["run_tests"] } }),
    );
    expect(result.status).toBe("pass");
    expect(result.findings.some((f) => f.ruleId === "contract.scope.selected")).toBe(false);
  });

  it("explains and lints scope", () => {
    const contract = defineTraceContract({
      scope: { workflowStep: "verify" },
      tools: { required: ["run_tests"] },
    });
    expect(explainTraceContract(contract).some((line) => line.startsWith("Scope:"))).toBe(true);
    expect(() => defineTraceContract({ scope: {}, tools: { required: ["x"] } })).toThrow(
      /scope requires/,
    );
  });
});

describe("TraceContract observation provenance (#321)", () => {
  it("requires method and same-run evidence references", () => {
    const linked = persisted("tool-1", "run-p", {
      kind: "TOOL",
      name: "tool:charge",
      attributes: { toolName: "charge" },
    });
    const good = outcome("out-good", "run-p", "refund-confirmed", {
      method: "network",
      evidence: { eventId: "tool-1" },
    });
    const read = multiRead([{ runId: "run-p", events: [runEvent("run-p", {}), linked, good] }]);
    const pass = evaluateTraceContract(
      { read },
      defineTraceContract({
        observations: {
          required: ["refund-confirmed"],
          requireProvenance: {
            method: true,
            evidence: true,
            sameRunEventReference: true,
          },
        },
      }),
    );
    expect(pass.status).toBe("pass");
  });

  it("fails closed on missing method, missing evidence, and dangling refs", () => {
    const noMethod = outcome("out-1", "run-p", "refund-confirmed", {
      evidence: { eventId: "tool-1" },
    });
    const noEvidence = outcome("out-2", "run-p", "refund-confirmed", {
      method: "network",
    });
    const dangling = outcome("out-3", "run-p", "refund-confirmed", {
      method: "network",
      evidence: { eventId: "missing-event" },
    });
    const contract = defineTraceContract({
      observations: {
        required: ["refund-confirmed"],
        requireProvenance: {
          method: true,
          evidence: true,
          sameRunEventReference: true,
        },
      },
    });

    expect(
      evaluateTraceContract(
        { read: multiRead([{ runId: "run-p", events: [runEvent("run-p", {}), noMethod] }]) },
        contract,
      ).status,
    ).toBe("fail");
    expect(
      evaluateTraceContract(
        { read: multiRead([{ runId: "run-p", events: [runEvent("run-p", {}), noEvidence] }]) },
        contract,
      ).status,
    ).toBe("fail");
    expect(
      evaluateTraceContract(
        { read: multiRead([{ runId: "run-p", events: [runEvent("run-p", {}), dangling] }]) },
        contract,
      ).findings.some((f) => f.ruleId === "contract.observation.provenance.same-run"),
    ).toBe(true);
  });

  it("rejects fabricated pass labels without provenance while leaving old contracts unchanged", () => {
    const fabricated = outcome("out-f", "run-p", "refund-confirmed", {});
    const read = multiRead([{ runId: "run-p", events: [runEvent("run-p", {}), fabricated] }]);
    expect(
      evaluateTraceContract(
        { read },
        defineTraceContract({ observations: { required: ["refund-confirmed"] } }),
      ).status,
    ).toBe("pass");
    expect(
      evaluateTraceContract(
        { read },
        defineTraceContract({
          observations: {
            required: ["refund-confirmed"],
            requireProvenance: { method: true, evidence: true },
          },
        }),
      ).status,
    ).toBe("fail");
  });

  it("lints provenance without required names", () => {
    const diagnostics = lintTraceContract(
      defineTraceContract({
        observations: {
          requireProvenance: { method: true },
        },
      }),
    );
    expect(
      diagnostics.some((d) => d.code === "contract.observation.provenance.without-required"),
    ).toBe(true);
  });
});
