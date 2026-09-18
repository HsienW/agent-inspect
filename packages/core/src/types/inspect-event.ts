export type AttributionConfidence =
  | "explicit"
  | "correlated"
  | "heuristic"
  | "unknown";

/** Canonical attribution-confidence literals (weakest → strongest order is rank-based). */
export const ATTRIBUTION_CONFIDENCES: readonly AttributionConfidence[] = [
  "unknown",
  "heuristic",
  "correlated",
  "explicit",
] as const;

export function isAttributionConfidence(value: unknown): value is AttributionConfidence {
  return (
    typeof value === "string" &&
    (ATTRIBUTION_CONFIDENCES as readonly string[]).includes(value)
  );
}

/** Rank for threshold comparisons; unknown is weakest (0). */
export const ATTRIBUTION_CONFIDENCE_RANK: Record<AttributionConfidence, number> = {
  unknown: 0,
  heuristic: 1,
  correlated: 2,
  explicit: 3,
};

export type InspectKind =
  | "RUN"
  | "AGENT"
  | "LLM"
  | "TOOL"
  | "CHAIN"
  | "RETRIEVER"
  | "DECISION"
  | "RESULT"
  | "ERROR"
  | "LOGIC"
  | "LOG"
  | "OUTCOME";

export interface EventSource {
  type: "manual" | "json-log" | "log4js" | "pino" | "winston" | "adapter";
  file?: string;
  line?: number;
}

export interface InspectEvent {
  eventId: string;
  runId: string;
  parentId?: string;
  name: string;
  kind: InspectKind;
  timestamp: number;
  status?: "running" | "ok" | "error";
  durationMs?: number;
  attributes?: Record<string, unknown>;
  confidence: AttributionConfidence;
  source: EventSource;
}

export interface InspectNode {
  event: InspectEvent;
  children: InspectNode[];
  depth: number;
}

/** Bounded parent/cycle summary for visibility-first tree building (6.14.2+). */
export interface RelationshipSummary {
  rootCount: number;
  selfParentCount: number;
  cycleCount: number;
  unresolvedParentCount: number;
  normalizedEdgeCount: number;
}

export interface InspectRunTree {
  runId: string;
  name?: string;
  status?: "running" | "ok" | "error";
  startedAt?: number;
  endedAt?: number;
  durationMs?: number;
  children: InspectNode[];
  metadata: {
    totalEvents: number;
    confidenceBreakdown: Record<AttributionConfidence, number>;
    kinds: Record<InspectKind, number>;
    relationshipSummary?: RelationshipSummary;
  };
}

