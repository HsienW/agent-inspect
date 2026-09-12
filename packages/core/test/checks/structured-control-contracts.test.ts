import { describe, expect, it } from "vitest";

import {
  defineTraceContract,
  evaluateTraceContract,
  explainTraceContract,
  lintTraceContract,
  resolveJsonPointer,
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
  attributes: Record<string, unknown> = {},
): PersistedInspectEvent {
  return persisted(eventId, runId, {
    kind: "TOOL",
    name: `tool:${name}`,
    attributes: { toolName: name, ...attributes },
    timestamp: startedAt,
    startedAt,
    endedAt,
  });
}

function runEvent(
  runId: string,
  attributes: Record<string, unknown> = {},
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
): PersistedInspectEvent {
  return persisted(eventId, runId, {
    kind: "OUTCOME",
    name,
    attributes: {
      outcomeStatus: "passed",
      expectation: name,
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

function readOf(events: PersistedInspectEvent[]): TraceReadResult {
  const runId = events[0]?.runId ?? "run-1";
  const children = events.filter((event) => event.kind !== "RUN").map((event) => node(event));
  const tree: InspectRunTree = {
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
  return {
    format: "agent-inspect-jsonl",
    events,
    runs: [tree],
    warnings: [],
    unsupportedFields: [],
    sourceFiles: [],
  };
}

describe("6.23 structured control contracts", () => {
  it("resolves JSON Pointer paths", () => {
    expect(resolveJsonPointer({ dryRun: true }, "/dryRun")).toEqual({
      found: true,
      value: true,
    });
    expect(resolveJsonPointer({ a: { b: 1 } }, "/a/b")).toEqual({ found: true, value: 1 });
    expect(resolveJsonPointer({ a: 1 }, "/missing").found).toBe(false);
  });

  it("passes equals argument checks and never embeds actual values", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "charge", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        arguments: { dryRun: true, card: "secret-pan" },
      }),
    ];
    const contract = defineTraceContract({
      tools: {
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
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(true);
    const serialized = JSON.stringify(result);
    expect(serialized).not.toContain("secret-pan");
  });

  it("fails closed when structured argument evidence is unavailable", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "charge", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        // preview-only string is not structured evidence
      }),
    ];
    events[1]!.inputSummary = "dryRun=true card=…";
    const contract = defineTraceContract({
      tools: {
        arguments: [
          {
            tool: "charge",
            path: "/dryRun",
            operator: "equals",
            expected: true,
          },
        ],
      },
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(result.findings)).toContain("AI_CHECK_TOOL_ARGUMENT_EVIDENCE_UNAVAILABLE");
  });

  it("supports mixed orderRules modes additively", () => {
    const events = [
      runEvent("run-1"),
      tool("a1", "run-1", "authorize", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z"),
      tool("c1", "run-1", "charge", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z"),
      tool("r1", "run-1", "retrieve", "2026-09-12T00:00:05.000Z", "2026-09-12T00:00:06.000Z"),
      tool("g1", "run-1", "generate", "2026-09-12T00:00:07.000Z", "2026-09-12T00:00:08.000Z"),
    ];
    const contract = defineTraceContract({
      tools: {
        defaultOccurrenceMode: "first-occurrence",
        orderRules: [
          {
            before: "authorize",
            after: "charge",
            occurrenceMode: "all-occurrences",
          },
          {
            before: "retrieve",
            after: "generate",
            occurrenceMode: "first-occurrence",
          },
        ],
      },
    });
    expect(evaluateTraceContract({ read: readOf(events) }, contract).ok).toBe(true);
  });

  it("keeps declared and enforced control sets distinct", () => {
    const events = [
      runEvent("run-1", {
        declaredTools: ["search", "charge"],
        enforcedTools: ["search"],
      }),
      tool("t1", "run-1", "search", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z"),
      tool("t2", "run-1", "charge", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z"),
      outcome("o1", "run-1", "control.enforced"),
    ];
    const contract = defineTraceContract({
      controls: {
        declaredToolsAttribute: "declaredTools",
        enforcedToolsAttribute: "enforcedTools",
        requireDeclaredMatchesEnforced: true,
        requireObservedWithinEnforced: true,
        requiredStages: [{ stage: "enforced" }],
      },
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    const ids = result.findings.map((finding) => finding.ruleId);
    expect(ids).toContain("contract.controls.declared-matches-enforced");
    expect(ids).toContain("contract.controls.observed-within-enforced");
  });

  it("fails retry after confirmed non-idempotent side effect", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "charge", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
      }),
      tool("t2", "run-1", "charge", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
      }),
    ];
    const contract = defineTraceContract({
      retry: {
        nonIdempotentTools: ["charge"],
        maxAttempts: 1,
      },
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    expect(result.findings.some((finding) => finding.ruleId.includes("retry"))).toBe(true);
  });

  it("allows retry when idempotency evidence is present", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "charge", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
        status: "error",
      }),
      tool("t2", "run-1", "charge", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
        idempotencyKey: "charge-op-1",
      }),
    ];
    events[1]!.status = "error";
    const contract = defineTraceContract({
      retry: {
        nonIdempotentTools: ["charge"],
        requireIdempotencyEvidenceForRetry: true,
        maxAttempts: 2,
        requireRecoveredFailureVisible: true,
      },
    });
    expect(evaluateTraceContract({ read: readOf(events) }, contract).ok).toBe(true);
  });

  it("fails error→success retry without idempotency evidence", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "charge", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
      }),
      tool("t2", "run-1", "charge", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
      }),
    ];
    events[1]!.status = "error";
    const contract = defineTraceContract({
      retry: {
        requireIdempotencyEvidenceForRetry: true,
        requireRecoveredFailureVisible: true,
        maxAttempts: 2,
      },
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some((finding) => finding.ruleId === "contract.retry.idempotency-evidence"),
    ).toBe(true);
  });

  it("allows error→success retry with noSideEffect evidence", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "search", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
      }),
      tool("t2", "run-1", "search", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
        noSideEffect: true,
      }),
    ];
    events[1]!.status = "error";
    const contract = defineTraceContract({
      retry: {
        requireIdempotencyEvidenceForRetry: true,
        requireRecoveredFailureVisible: true,
        maxAttempts: 2,
      },
    });
    expect(evaluateTraceContract({ read: readOf(events) }, contract).ok).toBe(true);
  });

  it("does not group unrelated same-name tools across operations", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "charge", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-a",
        attemptId: "a1",
        attemptNumber: 1,
      }),
      tool("t2", "run-1", "charge", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-b",
        attemptId: "b1",
        attemptNumber: 1,
      }),
    ];
    events[1]!.status = "error";
    const contract = defineTraceContract({
      retry: {
        requireIdempotencyEvidenceForRetry: true,
        maxAttempts: 1,
      },
    });
    expect(evaluateTraceContract({ read: readOf(events) }, contract).ok).toBe(true);
  });

  it("requires fallback to follow an earlier failure in the related operation", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "primary", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-primary",
        attemptId: "p1",
      }),
      tool("t2", "run-1", "backup", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-fallback",
        attemptId: "f1",
        fallbackOf: "op-primary",
      }),
    ];
    events[1]!.status = "error";
    const contract = defineTraceContract({
      retry: {
        fallbackOnlyAfterFailure: true,
      },
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some((finding) => finding.ruleId === "contract.retry.fallback-after-failure"),
    ).toBe(true);
  });

  it("fails recovered-failure visibility for success→error order", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "search", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
      }),
      tool("t2", "run-1", "search", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
      }),
    ];
    events[2]!.status = "error";
    const contract = defineTraceContract({
      retry: {
        requireRecoveredFailureVisible: true,
      },
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some(
        (finding) => finding.ruleId === "contract.retry.recovered-failure-visible",
      ),
    ).toBe(true);
  });

  it("fails invalid retryOf targets under strict idempotency evidence", () => {
    const events = [
      runEvent("run-1"),
      tool("t1", "run-1", "search", "2026-09-12T00:00:01.000Z", "2026-09-12T00:00:02.000Z", {
        operationId: "op-1",
        attemptId: "a1",
        attemptNumber: 1,
      }),
      tool("t2", "run-1", "search", "2026-09-12T00:00:03.000Z", "2026-09-12T00:00:04.000Z", {
        operationId: "op-1",
        attemptId: "a2",
        attemptNumber: 2,
        retryOf: "missing-attempt",
        idempotencyKey: "k1",
      }),
    ];
    events[1]!.status = "error";
    const contract = defineTraceContract({
      retry: {
        requireIdempotencyEvidenceForRetry: true,
      },
    });
    const result = evaluateTraceContract({ read: readOf(events) }, contract);
    expect(result.ok).toBe(false);
    expect(
      result.findings.some((finding) => finding.ruleId === "contract.retry.ambiguous-identity"),
    ).toBe(true);
  });

  it("lints duplicate orderRules and explains new surfaces", () => {
    const contract = defineTraceContract({
      tools: {
        orderRules: [
          { before: "a", after: "b" },
          { before: "a", after: "b" },
        ],
        arguments: [{ tool: "charge", path: "/dryRun", operator: "exists" }],
      },
      controls: { requireObservedWithinEnforced: true, enforcedTools: ["a"] },
      retry: { maxAttempts: 2 },
    });
    const lint = lintTraceContract(contract);
    expect(lint.some((item) => item.code === "contract.tools.orderRules.duplicate")).toBe(true);
    const explained = explainTraceContract(contract).join("\n");
    expect(explained).toContain("orderRules");
    expect(explained).toContain("tool-argument");
    expect(explained).toContain("control");
    expect(explained).toContain("retry");
  });
});
