import { describe, expect, it } from "vitest";

import { buildTraceFacts, deriveRelationshipFacts } from "../../src/checks/trace-facts.js";
import {
  BUILTIN_MAPPING_LEDGERS,
  getMappingLedger,
} from "../../src/readers/mapping-ledger.js";
import { createOmittedPayloadCommitment } from "../../src/safety/omitted-payload.js";
import { extractSessionWorkflowMetadata } from "../../src/sessions/metadata.js";
import type { PersistedInspectEvent } from "../../src/types/persisted-inspect-event.js";

function event(
  eventId: string,
  overrides: Partial<PersistedInspectEvent> = {},
): PersistedInspectEvent {
  return {
    schemaVersion: "0.2",
    eventId,
    runId: "run-a",
    kind: "LOGIC",
    name: eventId,
    status: "ok",
    timestamp: "2026-09-12T10:00:00.000Z",
    confidence: "explicit",
    source: { type: "manual" },
    ...overrides,
  };
}

describe("6.22 relationship facts", () => {
  it("derives parent-child and explicit retry/evidence edges without inventing time links", () => {
    const events = [
      event("root"),
      event("child", { parentId: "root", kind: "TOOL", name: "tool:charge" }),
      event("retry", {
        attributes: { retryOf: "run-a", attempt: 2, operationId: "op-1" },
      }),
      event("proof", { attributes: { evidenceFor: "child" } }),
    ];
    const { relationships, diagnostics } = deriveRelationshipFacts(events);
    expect(relationships.some((r) => r.type === "parent-child" && r.toEventId === "child")).toBe(
      true,
    );
    expect(relationships.some((r) => r.type === "retry-of")).toBe(true);
    expect(relationships.some((r) => r.type === "evidence-for" && r.toEventId === "child")).toBe(
      true,
    );
    expect(diagnostics.some((d) => d.code === "AI_RELATIONSHIP_PARENT_MISSING")).toBe(false);

    const facts = buildTraceFacts(events);
    expect(facts.relationships.length).toBeGreaterThan(0);
    expect(facts.relationshipDiagnostics).toEqual(diagnostics);
  });

  it("reports unsupported relationship types without flattening", () => {
    const { diagnostics } = deriveRelationshipFacts([
      event("x", { attributes: { relationshipType: "telepathy" } }),
    ]);
    expect(diagnostics.some((d) => d.code === "AI_RELATIONSHIP_UNSUPPORTED_TYPE")).toBe(true);
  });
});

describe("6.22 mapping ledger", () => {
  it("exposes pinned OpenInference and OTLP ledgers", () => {
    expect(BUILTIN_MAPPING_LEDGERS.length).toBeGreaterThanOrEqual(2);
    expect(getMappingLedger("otlp-json-to-agent-inspect")?.convention?.version).toBe("1.36.0");
    expect(getMappingLedger("openinference-to-agent-inspect")?.knownLosses.length).toBeGreaterThan(
      0,
    );
  });
});

describe("6.22 operation identity metadata", () => {
  it("extracts operationId attemptId fallbackOf and idempotencyKey", () => {
    expect(
      extractSessionWorkflowMetadata({
        operationId: "op-9",
        attemptId: "att-1",
        attemptNumber: 2,
        fallbackOf: "op-8",
        idempotencyKey: "idem-1",
      }),
    ).toMatchObject({
      operationId: "op-9",
      attemptId: "att-1",
      attemptNumber: 2,
      fallbackOf: "op-8",
      idempotencyKey: "idem-1",
    });
  });
});

describe("6.22 omitted payload commitment", () => {
  it("creates a sha256 digest without retaining payload", () => {
    const commitment = createOmittedPayloadCommitment('{"secret":true}', {
      contentType: "application/json",
      shape: "object",
    });
    expect(commitment.algorithm).toBe("sha256");
    expect(commitment.digest).toHaveLength(64);
    expect(commitment.byteLength).toBeGreaterThan(0);
    expect(commitment.capturePolicy).toBe("digest-only");
  });
});
