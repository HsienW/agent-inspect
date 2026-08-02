/**
 * Conservative first-causal-failure analysis (v6.11+).
 *
 * @experimental Available through `agent-inspect/advanced`.
 */
import { extractOutcomesFromTraceEvents } from "./outcomes/extract.js";
import { buildRunTimeline } from "./timeline.js";
import type { StepCompletedEvent, StepStartedEvent, TraceEvent } from "./types.js";

export type CausalFailureKind =
  | "explicit_error_event"
  | "failed_observed_outcome"
  | "contract_failure"
  | "failed_ancestor_or_child"
  | "none";

export interface CausalContractFindingInput {
  ruleId: string;
  status: "fail" | "pass" | "warning" | string;
  /** Linked event/step ids from check evidence. */
  evidenceIds?: string[];
  message?: string;
}

export interface FirstCausalFailure {
  kind: CausalFailureKind;
  /** Stable evidence ids (stepId / outcomeId / event-linked ids). No raw paths. */
  evidenceIds: string[];
  rationale: string;
  /** 1–4 when matched; 0 when none. */
  orderIndex: 0 | 1 | 2 | 3 | 4;
  runId?: string;
  primary?: {
    stepId?: string;
    outcomeId?: string;
    ruleId?: string;
    name?: string;
  };
  relationship?: {
    role: "self" | "ancestor" | "child";
    relatedIds: string[];
  };
  engine: "conservative-causal-v1";
}

export interface FindFirstCausalFailureOptions {
  /** Optional contract/check failures (step 3). Omitted → skip contract stage. */
  contractFindings?: readonly CausalContractFindingInput[];
}

function runIdFromEvents(events: readonly TraceEvent[]): string | undefined {
  for (const event of events) {
    if ("runId" in event && typeof event.runId === "string") return event.runId;
  }
  return undefined;
}

function noneResult(runId: string | undefined, rationale: string): FirstCausalFailure {
  return {
    kind: "none",
    evidenceIds: [],
    rationale,
    orderIndex: 0,
    runId,
    engine: "conservative-causal-v1",
  };
}

/**
 * Find the first causal failure using the locked conservative order.
 * Does not infer from timing correlation alone.
 */
export function findFirstCausalFailure(
  events: readonly TraceEvent[],
  options: FindFirstCausalFailureOptions = {},
): FirstCausalFailure {
  const runId = runIdFromEvents(events);

  // 1. Explicit failed/error event (timeline isError / step_completed error / run error)
  const timeline = buildRunTimeline(events);
  const firstError = timeline.entries.find((entry) => entry.isError);
  if (firstError) {
    return {
      kind: "explicit_error_event",
      evidenceIds: [firstError.stepId],
      rationale:
        "First timeline step with status error (explicit failure; no timing-only inference).",
      orderIndex: 1,
      runId: timeline.runId || runId,
      primary: {
        stepId: firstError.stepId,
        name: firstError.name,
      },
      relationship: { role: "self", relatedIds: [] },
      engine: "conservative-causal-v1",
    };
  }

  const runCompletedError = events.find(
    (event): event is Extract<TraceEvent, { event: "run_completed" }> =>
      event.event === "run_completed" && event.status === "error",
  );
  if (runCompletedError) {
    return {
      kind: "explicit_error_event",
      evidenceIds: [runCompletedError.runId],
      rationale: "Run completed with status error and no earlier errored step.",
      orderIndex: 1,
      runId: runCompletedError.runId,
      primary: { name: "run", stepId: runCompletedError.runId },
      relationship: { role: "self", relatedIds: [] },
      engine: "conservative-causal-v1",
    };
  }

  // 2. Failed observed outcome
  const outcomes = extractOutcomesFromTraceEvents(events);
  const failedOutcome = outcomes.find((outcome) => outcome.status === "failed");
  if (failedOutcome) {
    const evidenceIds = [failedOutcome.outcomeId];
    if (failedOutcome.parentId) evidenceIds.push(failedOutcome.parentId);
    return {
      kind: "failed_observed_outcome",
      evidenceIds,
      rationale: "First observed outcome with status failed.",
      orderIndex: 2,
      runId: failedOutcome.runId || runId,
      primary: {
        outcomeId: failedOutcome.outcomeId,
        stepId: failedOutcome.parentId,
        name: failedOutcome.name,
      },
      relationship: failedOutcome.parentId
        ? { role: "child", relatedIds: [failedOutcome.parentId] }
        : { role: "self", relatedIds: [] },
      engine: "conservative-causal-v1",
    };
  }

  // 3. Contract failure linked to an event
  const contractFail = (options.contractFindings ?? []).find(
    (finding) => finding.status === "fail" && (finding.evidenceIds?.length ?? 0) > 0,
  );
  if (contractFail) {
    const evidenceIds = [...(contractFail.evidenceIds ?? [])];
    return {
      kind: "contract_failure",
      evidenceIds,
      rationale:
        contractFail.message ??
        `Contract rule ${contractFail.ruleId} failed with linked evidence ids.`,
      orderIndex: 3,
      runId,
      primary: {
        ruleId: contractFail.ruleId,
        stepId: evidenceIds[0],
        name: contractFail.ruleId,
      },
      relationship: { role: "self", relatedIds: [] },
      engine: "conservative-causal-v1",
    };
  }

  // 4. Nearest failed ancestor/child — only when we have structural parent links
  // among completed steps that somehow weren't marked isError (defensive) or
  // when a success parent wraps a failed child already handled above.
  // If no explicit error steps exist, look for parent/child pairs where a child
  // completed with error relative to a parent (already covered by step 1).
  // Here: if any step has a parent that also completed with error, prefer the
  // child tip — but step 1 would have caught any error step. So this stage
  // only fires when contractFindings lacked event links but we can still find
  // parent/child error adjacency from raw events that timeline missed.
  const completed = events.filter(
    (event): event is StepCompletedEvent => event.event === "step_completed",
  );
  const started = events.filter(
    (event): event is StepStartedEvent => event.event === "step_started",
  );
  const parentByStep = new Map<string, string | undefined>();
  for (const start of started) {
    parentByStep.set(start.stepId, start.parentId);
  }
  const errorSteps = completed.filter((event) => event.status === "error");
  if (errorSteps.length > 0) {
    // Prefer deepest error (has parent that is also error or any parent)
    const sorted = [...errorSteps].sort((a, b) => {
      const depth = (id: string): number => {
        let d = 0;
        let cur: string | undefined = id;
        const seen = new Set<string>();
        while (cur && parentByStep.has(cur) && !seen.has(cur)) {
          seen.add(cur);
          const parent = parentByStep.get(cur);
          if (!parent) break;
          d += 1;
          cur = parent;
        }
        return d;
      };
      return depth(b.stepId) - depth(a.stepId);
    });
    const tip = sorted[0]!;
    const parentId = parentByStep.get(tip.stepId);
    const relatedIds = parentId ? [parentId] : [];
    return {
      kind: "failed_ancestor_or_child",
      evidenceIds: [tip.stepId, ...relatedIds],
      rationale: parentId
        ? "Deepest explicit error step with parent link (nearest ancestor relationship)."
        : "Explicit error step used as structural tip (no parent id).",
      orderIndex: 4,
      runId: tip.runId || runId,
      primary: { stepId: tip.stepId, name: started.find((s) => s.stepId === tip.stepId)?.name },
      relationship: {
        role: parentId ? "child" : "self",
        relatedIds,
      },
      engine: "conservative-causal-v1",
    };
  }

  // 5. No timing-only inference
  return noneResult(
    runId,
    "No explicit error event, failed outcome, or linked contract failure; refusing timing-only inference.",
  );
}
