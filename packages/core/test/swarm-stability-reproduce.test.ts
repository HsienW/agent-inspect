/**
 * 6.14.2-0 — Reproduce N-4 (self-parent cycle) and N-6 (token-config credential FP)
 * from anonymized fixtures. These assertions document current broken behavior and
 * must be flipped when later 6.14.2 chunks land the fixes.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  createSafetyRedactionRule,
  createStructureCycleRule,
  projectLogicalEvents,
  runTraceChecks,
} from "../src/checks/index.js";
import { openTrace } from "../src/readers/index.js";
import type { TraceReadResult } from "../src/readers/index.js";
import type { InspectNode, InspectRunTree } from "../src/types/inspect-event.js";
import type { PersistedInspectEvent } from "../src/types/persisted-inspect-event.js";

const fixturesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures",
);

function persisted(
  eventId: string,
  overrides: Partial<PersistedInspectEvent> = {},
): PersistedInspectEvent {
  return {
    schemaVersion: "0.2",
    eventId,
    runId: "run-n6-token-config",
    kind: "LLM",
    name: "llm:config",
    status: "ok",
    timestamp: "2026-08-07T00:00:01.000Z",
    confidence: "explicit",
    source: { type: "manual" },
    ...overrides,
  };
}

function readResult(events: readonly PersistedInspectEvent[]): TraceReadResult {
  const children: InspectNode[] = events.map((event) => ({
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
      source: { type: "manual" as const },
    },
    children: [],
    depth: 0,
  }));
  const run: InspectRunTree = {
    runId: "run-n6-token-config",
    name: "n6",
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
        LLM: children.length,
        TOOL: 0,
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
  };
  return {
    format: "agent-inspect-jsonl",
    events: [...events],
    runs: [run],
    warnings: [],
    unsupportedFields: [],
    sourceFiles: [],
  };
}

describe("6.14.2-0 swarm stability defect reproduction", () => {
  it("N-4: deep-swarm self-parent fixture normalizes away self-edges (post 6.14.2-3)", async () => {
    const content = readFileSync(
      path.join(fixturesRoot, "langgraph/deep-swarm-self-parent.jsonl"),
      "utf8",
    );
    // Raw rows still carry parentId === stepId (defect artifact).
    expect(content).toContain('"parentId":"seq_nested"');
    expect(content).toContain('"stepId":"seq_nested"');

    const read = await openTrace({ type: "string", content });
    const projection = projectLogicalEvents(read.events);
    const selfParents = projection.logicalEvents.filter(
      (event) => event.parentId !== undefined && event.parentId === event.eventId,
    );
    expect(selfParents).toHaveLength(0);
    expect(
      projection.diagnostics.some((d) => d.code === "AI_LOGICAL_SELF_PARENT_REMOVED"),
    ).toBe(true);

    const checks = runTraceChecks(
      { read },
      { rules: [createStructureCycleRule()] },
    );
    expect(checks.findings.some((finding) => finding.ruleId === "structure.cycle")).toBe(false);
  });

  it("N-6: ls_max_tokens / max_tokens / token_count are not credential keys (post 6.14.2-5)", () => {
    const fixture = readFileSync(
      path.join(fixturesRoot, "safety/ls-max-tokens-config.jsonl"),
      "utf8",
    );
    expect(fixture).toContain("ls_max_tokens");
    expect(fixture).toContain("max_tokens");
    expect(fixture).toContain("token_count");

    const config = persisted("event-token-config", {
      attributes: {
        ls_max_tokens: "undefined",
        max_tokens: 4096,
        token_count: 1120,
        metadata: { tokens: { input: 1000, output: 120 } },
      },
    });
    const secret = persisted("event-real-secret", {
      attributes: {
        access_token: "sk-fixtureSecretValue123456",
      },
    });
    const configChecks = runTraceChecks(
      { read: readResult([config]) },
      { rules: [createSafetyRedactionRule()] },
    );
    expect(
      configChecks.findings.filter((finding) => finding.ruleId === "safety.redaction"),
    ).toHaveLength(0);

    const secretChecks = runTraceChecks(
      { read: readResult([secret]) },
      { rules: [createSafetyRedactionRule()] },
    );
    expect(secretChecks.status).toBe("fail");
    expect(
      secretChecks.findings.some((finding) => finding.ruleId === "safety.redaction"),
    ).toBe(true);
  });
});
