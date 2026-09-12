/**
 * Read-time typed relationship facts (6.22).
 *
 * Facts never rewrite parent hierarchy. Confidence is explicit or correlated only —
 * never inferred from timestamps alone.
 *
 * @experimental Available through `agent-inspect/checks`.
 */

import type { PersistedInspectEvent } from "../types/persisted-inspect-event.js";
import { extractSessionWorkflowMetadata } from "../sessions/metadata.js";

export type TraceRelationshipType =
  | "parent-child"
  | "source-lineage"
  | "attempt-of"
  | "retry-of"
  | "fallback-of"
  | "remediation-of"
  | "evidence-for"
  | "accepted-by"
  | "supersedes";

export type TraceRelationshipConfidence = "explicit" | "correlated" | "unknown";

/**
 * Bounded relationship edge derived at read time.
 *
 * @experimental
 */
export interface TraceRelationship {
  type: TraceRelationshipType;
  fromEventId: string;
  toEventId?: string;
  externalRef?: string;
  confidence: TraceRelationshipConfidence;
  basis: readonly string[];
}

export interface TraceRelationshipDiagnostic {
  code: string;
  message: string;
  eventId?: string;
}

function attrs(event: PersistedInspectEvent): Record<string, unknown> {
  return event.attributes && typeof event.attributes === "object"
    ? event.attributes
    : {};
}

function stringAttr(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

/**
 * Derive typed relationship facts from persisted events without mutating hierarchy.
 */
export function deriveRelationshipFacts(
  events: readonly PersistedInspectEvent[],
): {
  relationships: readonly TraceRelationship[];
  diagnostics: readonly TraceRelationshipDiagnostic[];
} {
  const relationships: TraceRelationship[] = [];
  const diagnostics: TraceRelationshipDiagnostic[] = [];
  const byId = new Map(events.map((event) => [event.eventId, event]));
  const seen = new Set<string>();

  const push = (edge: TraceRelationship): void => {
    const key = `${edge.type}:${edge.fromEventId}:${edge.toEventId ?? ""}:${edge.externalRef ?? ""}`;
    if (seen.has(key)) return;
    seen.add(key);
    relationships.push(edge);
  };

  for (const event of events) {
    if (event.parentId) {
      push({
        type: "parent-child",
        fromEventId: event.parentId,
        toEventId: event.eventId,
        confidence: byId.has(event.parentId) ? "explicit" : "unknown",
        basis: ["persisted.parentId"],
      });
      if (!byId.has(event.parentId)) {
        diagnostics.push({
          code: "AI_RELATIONSHIP_PARENT_MISSING",
          message: `parentId ${event.parentId} is not present in the event set.`,
          eventId: event.eventId,
        });
      }
    }

    const bag = attrs(event);
    const meta = extractSessionWorkflowMetadata(bag) ?? {};
    const nested =
      bag.metadata && typeof bag.metadata === "object"
        ? extractSessionWorkflowMetadata(bag.metadata as Record<string, unknown>)
        : undefined;
    const workflow = { ...meta, ...nested };

    if (workflow.retryOf) {
      const target = events.find((candidate) => candidate.runId === workflow.retryOf);
      push({
        type: "retry-of",
        fromEventId: event.eventId,
        ...(target ? { toEventId: target.eventId } : {}),
        externalRef: workflow.retryOf,
        confidence: target ? "explicit" : "correlated",
        basis: ["attributes.retryOf"],
      });
    }

    const attemptOf = stringAttr(bag, "attemptOf") ?? stringAttr(bag, "operationId");
    if (attemptOf && workflow.attempt !== undefined) {
      push({
        type: "attempt-of",
        fromEventId: event.eventId,
        externalRef: attemptOf,
        confidence: "explicit",
        basis: workflow.attempt !== undefined ? ["attributes.attempt", "attributes.operationId"] : ["attributes.operationId"],
      });
    }

    const fallbackOf = stringAttr(bag, "fallbackOf");
    if (fallbackOf) {
      push({
        type: "fallback-of",
        fromEventId: event.eventId,
        externalRef: fallbackOf,
        confidence: "explicit",
        basis: ["attributes.fallbackOf"],
      });
    }

    const remediationOf = stringAttr(bag, "remediationOf");
    if (remediationOf) {
      push({
        type: "remediation-of",
        fromEventId: event.eventId,
        externalRef: remediationOf,
        confidence: "explicit",
        basis: ["attributes.remediationOf"],
      });
    }

    const evidenceFor = stringAttr(bag, "evidenceFor");
    if (evidenceFor) {
      push({
        type: "evidence-for",
        fromEventId: event.eventId,
        ...(byId.has(evidenceFor) ? { toEventId: evidenceFor } : { externalRef: evidenceFor }),
        confidence: byId.has(evidenceFor) ? "explicit" : "correlated",
        basis: ["attributes.evidenceFor"],
      });
    }

    const acceptedBy = stringAttr(bag, "acceptedBy");
    if (acceptedBy) {
      push({
        type: "accepted-by",
        fromEventId: event.eventId,
        ...(byId.has(acceptedBy) ? { toEventId: acceptedBy } : { externalRef: acceptedBy }),
        confidence: byId.has(acceptedBy) ? "explicit" : "correlated",
        basis: ["attributes.acceptedBy"],
      });
    }

    const supersedes = stringAttr(bag, "supersedes");
    if (supersedes) {
      push({
        type: "supersedes",
        fromEventId: event.eventId,
        ...(byId.has(supersedes) ? { toEventId: supersedes } : { externalRef: supersedes }),
        confidence: byId.has(supersedes) ? "explicit" : "correlated",
        basis: ["attributes.supersedes"],
      });
    }

    const sourceLineage = stringAttr(bag, "sourceLineage") ?? stringAttr(bag, "sourceEventId");
    if (sourceLineage) {
      push({
        type: "source-lineage",
        fromEventId: event.eventId,
        externalRef: sourceLineage,
        confidence: "explicit",
        basis: ["attributes.sourceLineage"],
      });
    }

    const unsupported = stringAttr(bag, "relationshipType");
    if (
      unsupported &&
      unsupported !== "parent-child" &&
      ![
        "source-lineage",
        "attempt-of",
        "retry-of",
        "fallback-of",
        "remediation-of",
        "evidence-for",
        "accepted-by",
        "supersedes",
      ].includes(unsupported)
    ) {
      diagnostics.push({
        code: "AI_RELATIONSHIP_UNSUPPORTED_TYPE",
        message: `Unsupported relationshipType ${unsupported} was reported without flattening.`,
        eventId: event.eventId,
      });
    }
  }

  return {
    relationships: Object.freeze(relationships),
    diagnostics: Object.freeze(diagnostics),
  };
}
