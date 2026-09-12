import type { TraceCheckDiagnostic, TraceCheckInput } from "./index.js";
import { extractSessionWorkflowMetadata } from "../sessions/metadata.js";
import type { InspectNode, InspectRunTree } from "../types/inspect-event.js";
import type { PersistedInspectEvent } from "../types/persisted-inspect-event.js";
import type { SessionWorkflowMetadata } from "../sessions/types.js";

/**
 * Explicit actor/run projection for TraceContract evaluation (#320).
 *
 * Selectors use only declared metadata (or explicit event ids). Zero matches
 * and singular-actor ambiguity fail closed. No timestamp or display-name
 * inference.
 *
 * @experimental
 */
export interface TraceContractScope {
  runId?: string;
  subAgentId?: string;
  groupId?: string;
  workflowStep?: string;
  /** Explicit root event id; evaluation projects to that event and descendants. */
  rootEventId?: string;
}

export interface ResolvedContractScope {
  runId: string;
  rootEventId?: string;
  matchedSelectors: Record<string, string>;
  evidenceEventCount: number;
  input: TraceCheckInput;
}

function diagnostic(
  code: TraceCheckDiagnostic["code"],
  message: string,
  ruleId?: string,
): TraceCheckDiagnostic {
  return {
    code,
    message,
    severity: "error",
    ...(ruleId !== undefined ? { ruleId } : {}),
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function scopeEntries(scope: TraceContractScope): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  if (isNonEmptyString(scope.runId)) out.push(["runId", scope.runId.trim()]);
  if (isNonEmptyString(scope.subAgentId)) out.push(["subAgentId", scope.subAgentId.trim()]);
  if (isNonEmptyString(scope.groupId)) out.push(["groupId", scope.groupId.trim()]);
  if (isNonEmptyString(scope.workflowStep)) {
    out.push(["workflowStep", scope.workflowStep.trim()]);
  }
  if (isNonEmptyString(scope.rootEventId)) {
    out.push(["rootEventId", scope.rootEventId.trim()]);
  }
  return out;
}

function mergeWorkflowMeta(
  into: SessionWorkflowMetadata,
  from: SessionWorkflowMetadata | undefined,
): void {
  if (!from) return;
  for (const [key, value] of Object.entries(from) as Array<
    [keyof SessionWorkflowMetadata, SessionWorkflowMetadata[keyof SessionWorkflowMetadata]]
  >) {
    if (value === undefined) continue;
    if (into[key] === undefined) {
      (into as Record<string, unknown>)[key] = value;
    }
  }
}

/**
 * Collect explicit session/workflow metadata for a run from persisted events.
 * Prefers RUN-kind attributes; never invents identity from timestamps.
 */
export function workflowMetadataForRun(
  events: readonly PersistedInspectEvent[],
  runId: string,
): SessionWorkflowMetadata {
  const preferred: SessionWorkflowMetadata = {};
  const fallback: SessionWorkflowMetadata = {};
  for (const event of events) {
    if (event.runId !== runId) continue;
    const attrs = event.attributes;
    if (!attrs || typeof attrs !== "object") continue;
    const direct = extractSessionWorkflowMetadata(attrs);
    const nested =
      attrs.metadata && typeof attrs.metadata === "object"
        ? extractSessionWorkflowMetadata(attrs.metadata as Record<string, unknown>)
        : undefined;
    const bag: SessionWorkflowMetadata = {};
    mergeWorkflowMeta(bag, direct);
    mergeWorkflowMeta(bag, nested);
    if (event.kind === "RUN") {
      mergeWorkflowMeta(preferred, bag);
    } else {
      mergeWorkflowMeta(fallback, bag);
    }
  }
  mergeWorkflowMeta(preferred, fallback);
  return preferred;
}

function flattenNodes(nodes: readonly InspectNode[]): InspectNode[] {
  return nodes.flatMap((node) => [node, ...flattenNodes(node.children)]);
}

function collectSubtreeEventIds(
  run: InspectRunTree,
  rootEventId: string,
): Set<string> | undefined {
  const nodes = flattenNodes(run.children);
  const byId = new Map(nodes.map((node) => [node.event.eventId, node]));
  const root = byId.get(rootEventId);
  if (!root) return undefined;
  const ids = new Set<string>();
  const visit = (node: InspectNode): void => {
    ids.add(node.event.eventId);
    for (const child of node.children) visit(child);
  };
  visit(root);
  return ids;
}

function filterTree(nodes: readonly InspectNode[], keep: Set<string>): InspectNode[] {
  const out: InspectNode[] = [];
  for (const node of nodes) {
    if (!keep.has(node.event.eventId)) continue;
    out.push({
      ...node,
      children: filterTree(node.children, keep),
    });
  }
  return out;
}

function projectInput(
  input: TraceCheckInput,
  run: InspectRunTree,
  eventIds: Set<string> | undefined,
): { input: TraceCheckInput; evidenceEventCount: number } {
  const runEvents = input.read.events.filter((event) => event.runId === run.runId);
  const projectedEvents =
    eventIds === undefined
      ? runEvents
      : runEvents.filter((event) => eventIds.has(event.eventId) || event.kind === "RUN");
  const projectedChildren =
    eventIds === undefined ? run.children : filterTree(run.children, eventIds);
  const projectedRun: InspectRunTree = {
    ...run,
    children: projectedChildren,
    metadata: {
      ...run.metadata,
      totalEvents: flattenNodes(projectedChildren).length,
    },
  };
  return {
    evidenceEventCount: projectedEvents.length,
    input: {
      ...input,
      selectedRun: projectedRun,
      read: {
        ...input.read,
        runs: [projectedRun],
        events: projectedEvents,
      },
    },
  };
}

/**
 * Resolve TraceContract `scope` against a check input.
 * Returns diagnostics on zero/ambiguous matches or missing root events.
 */
export function resolveTraceContractScope(
  input: TraceCheckInput,
  scope: TraceContractScope | undefined,
): { resolved?: ResolvedContractScope; diagnostics: TraceCheckDiagnostic[] } {
  if (scope === undefined) {
    return { diagnostics: [] };
  }
  const entries = scopeEntries(scope);
  if (entries.length === 0) {
    return {
      diagnostics: [
        diagnostic(
          "AI_CHECK_INVALID_CONFIG",
          "TraceContract scope requires at least one explicit selector (runId, subAgentId, groupId, workflowStep, or rootEventId).",
          "contract.scope.empty",
        ),
      ],
    };
  }

  const matchedSelectors = Object.fromEntries(entries);
  const actorKeys = entries.filter(([key]) => key !== "rootEventId");
  const rootEventId = matchedSelectors.rootEventId;

  let candidates = [...input.read.runs];

  if (matchedSelectors.runId) {
    candidates = candidates.filter((run) => run.runId === matchedSelectors.runId);
  }

  for (const [key, value] of actorKeys) {
    if (key === "runId") continue;
    candidates = candidates.filter((run) => {
      const meta = workflowMetadataForRun(input.read.events, run.runId);
      const actual = meta[key as "subAgentId" | "groupId" | "workflowStep"];
      return actual === value;
    });
  }

  // rootEventId alone selects among runs that contain that event.
  if (rootEventId && actorKeys.length === 0) {
    candidates = candidates.filter((run) =>
      flattenNodes(run.children).some((node) => node.event.eventId === rootEventId),
    );
  }

  if (candidates.length === 0) {
    return {
      diagnostics: [
        diagnostic(
          "AI_CHECK_RUN_SELECTION_REQUIRED",
          `TraceContract scope matched zero actors for ${JSON.stringify(matchedSelectors)}. Missing actor metadata does not fall back to the whole session.`,
          "contract.scope.zero-match",
        ),
      ],
    };
  }

  if (candidates.length > 1) {
    return {
      diagnostics: [
        diagnostic(
          "AI_CHECK_RUN_SELECTION_REQUIRED",
          `TraceContract scope matched ${candidates.length} actors for ${JSON.stringify(matchedSelectors)} (runIds: ${candidates
            .map((run) => run.runId)
            .sort()
            .join(", ")}). Singular actor selectors must resolve to exactly one run.`,
          "contract.scope.ambiguous",
        ),
      ],
    };
  }

  const run = candidates[0]!;
  let eventIds: Set<string> | undefined;
  if (rootEventId) {
    eventIds = collectSubtreeEventIds(run, rootEventId);
    if (eventIds === undefined) {
      return {
        diagnostics: [
          diagnostic(
            "AI_CHECK_INVALID_ARGUMENTS",
            `TraceContract scope rootEventId ${rootEventId} was not found in run ${run.runId}.`,
            "contract.scope.root-missing",
          ),
        ],
      };
    }
  }

  const projected = projectInput(input, run, eventIds);
  return {
    resolved: {
      runId: run.runId,
      ...(rootEventId !== undefined ? { rootEventId } : {}),
      matchedSelectors,
      evidenceEventCount: projected.evidenceEventCount,
      input: projected.input,
    },
    diagnostics: [],
  };
}
