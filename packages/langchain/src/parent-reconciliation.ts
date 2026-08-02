/**
 * Conservative parent reconciliation for LangChain/LangGraph callbacks.
 *
 * Precedence: exact run ID → LangGraph metadata → unique semantic label → unresolved.
 * Never invents parent edges from timestamps alone.
 *
 * @experimental Part of the v6.8 fidelity contract.
 * @see docs/LANGGRAPH-FIDELITY.md
 */

export type ParentMappingKind =
  | "exact"
  | "langgraph-metadata"
  | "semantic-name"
  | "synthetic-group"
  | "unresolved";

export type ParentConfidence = "explicit" | "correlated" | "synthetic" | "unresolved";

export interface ParentResolution {
  readonly parentStepId?: string;
  readonly confidence: ParentConfidence;
  readonly parentMapping: ParentMappingKind;
  /** Observed when parentLcRunId looks like a framework semantic label. */
  readonly semanticParentLabel?: string;
  readonly unresolvedParentRunId?: string;
  /** Which LangGraph key produced a metadata correlation. */
  readonly correlatedVia?: string;
}

/** Framework labels commonly seen as LangGraph `parentRunId` without a callback run. */
export const WELL_KNOWN_SEMANTIC_PARENTS: ReadonlySet<string> = new Set([
  "LangGraph",
  "__start__",
  "__end__",
]);

export function isSemanticParentLabel(parentLcRunId: string): boolean {
  if (WELL_KNOWN_SEMANTIC_PARENTS.has(parentLcRunId)) return true;
  // LangGraph internal double-underscore tokens
  return parentLcRunId.startsWith("__") && parentLcRunId.endsWith("__");
}

export interface ParentLookupTables {
  /** LangChain callback runId → AgentInspect stepId */
  readonly exactStepByLcRunId: (lcRunId: string) => string | undefined;
  /**
   * Unique index lookup. Must return undefined when zero or multiple matches
   * (ambiguity must not invent a parent).
   */
  readonly uniqueStepByLangGraphKey: (
    key: string,
    value: string,
  ) => string | undefined;
  /** Unique step whose semantic label / run name matches. */
  readonly uniqueStepBySemanticLabel: (label: string) => string | undefined;
}

const LANGGRAPH_PARENT_KEYS = [
  "handoffFrom",
  "taskId",
  "nodeId",
  "nodeName",
  "checkpointNamespace",
] as const;

function langGraphRecord(
  attributes: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  const lg = attributes?.langGraph;
  if (typeof lg !== "object" || lg === null || Array.isArray(lg)) return undefined;
  return lg as Record<string, unknown>;
}

/**
 * Resolve a parent for a new step without fabricating hierarchy.
 */
export function resolveParentRelationship(
  input: {
    parentLcRunId?: string;
    attributes?: Record<string, unknown>;
  },
  lookup: ParentLookupTables,
): ParentResolution {
  const parentLcRunId = input.parentLcRunId;

  // 1. Exact parent run ID
  if (parentLcRunId) {
    const exact = lookup.exactStepByLcRunId(parentLcRunId);
    if (exact) {
      return {
        parentStepId: exact,
        confidence: "explicit",
        parentMapping: "exact",
      };
    }
  }

  // 2. Explicit LangGraph metadata relationship (unique keys only)
  const lg = langGraphRecord(input.attributes);
  if (lg) {
    for (const key of LANGGRAPH_PARENT_KEYS) {
      // Prefer dedicated parent-like keys first; taskId/nodeName on the child
      // describe the child itself — only handoffFrom / checkpointNamespace are
      // parent pointers. Keep taskId/nodeId/nodeName for *parent* correlation
      // only when they appear as handoff targets (handled via handoffFrom).
      if (key !== "handoffFrom" && key !== "checkpointNamespace") continue;
      const raw = lg[key];
      if (typeof raw !== "string" || !raw.trim()) continue;
      const stepId = lookup.uniqueStepByLangGraphKey(key === "handoffFrom" ? "taskId" : key, raw);
      // Also try matching handoffFrom against nodeName when taskId misses.
      const matched =
        stepId ??
        (key === "handoffFrom"
          ? lookup.uniqueStepByLangGraphKey("nodeName", raw) ??
            lookup.uniqueStepByLangGraphKey("nodeId", raw)
          : undefined);
      if (matched) {
        return {
          parentStepId: matched,
          confidence: "correlated",
          parentMapping: "langgraph-metadata",
          correlatedVia: key,
        };
      }
    }
  }

  // 3. Unique semantic-name correlation (e.g. parentRunId === "__start__")
  if (parentLcRunId && isSemanticParentLabel(parentLcRunId)) {
    const semantic = lookup.uniqueStepBySemanticLabel(parentLcRunId);
    if (semantic) {
      return {
        parentStepId: semantic,
        confidence: "correlated",
        parentMapping: "semantic-name",
        semanticParentLabel: parentLcRunId,
      };
    }
    return {
      confidence: "unresolved",
      parentMapping: "unresolved",
      semanticParentLabel: parentLcRunId,
      unresolvedParentRunId: parentLcRunId,
    };
  }

  // 5. Unresolved and visible (unobserved callback / external id)
  if (parentLcRunId) {
    return {
      confidence: "unresolved",
      parentMapping: "unresolved",
      unresolvedParentRunId: parentLcRunId,
    };
  }

  // No parent reference — root-like step (not unresolved).
  return {
    confidence: "explicit",
    parentMapping: "exact",
  };
}

/** Apply resolution fields onto step metadata (mutates). */
export function applyParentResolutionMetadata(
  metadata: Record<string, unknown>,
  resolution: ParentResolution,
): void {
  const hasParentSignal =
    Boolean(resolution.parentStepId) ||
    Boolean(resolution.unresolvedParentRunId) ||
    Boolean(resolution.semanticParentLabel) ||
    Boolean(resolution.correlatedVia);
  if (!hasParentSignal) return;

  metadata.parentMapping = resolution.parentMapping;
  metadata.parentConfidence = resolution.confidence;
  if (resolution.semanticParentLabel) {
    metadata.semanticParentLabel = resolution.semanticParentLabel;
  }
  if (resolution.unresolvedParentRunId) {
    metadata.unresolvedParentRunId = resolution.unresolvedParentRunId;
  }
  if (resolution.correlatedVia) {
    metadata.parentCorrelatedVia = resolution.correlatedVia;
  }
  if (resolution.parentMapping === "synthetic-group") {
    metadata.synthetic = true;
  }
}
