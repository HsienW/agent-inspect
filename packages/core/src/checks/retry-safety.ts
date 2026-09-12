/**
 * Retry / side-effect safety checks for TraceContract (6.23).
 *
 * Uses explicit attempt identity from session workflow metadata.
 * AgentInspect evaluates; it does not perform retries.
 *
 * @experimental
 */

import type { TraceCheckEvidence, TraceCheckFinding } from "./index.js";
import { resolveCanonicalToolName } from "./logical-events.js";
import { extractSessionWorkflowMetadata } from "../sessions/metadata.js";
import type { PersistedInspectEvent } from "../types/persisted-inspect-event.js";
import type { SessionWorkflowMetadata } from "../sessions/types.js";

export interface TraceContractRetryRules {
  /**
   * Maximum attempts per `operationId` (or `attemptOf` grouping).
   * Counts distinct `attemptId` values when present, else finished tool/LLM events.
   */
  maxAttempts?: number;
  /**
   * When true, every operation with attempts must include a non-running terminal event.
   */
  requireTerminalResult?: boolean;
  /**
   * Fail when `fallbackOf` is set without a prior error attempt for the referenced operation.
   */
  fallbackOnlyAfterFailure?: boolean;
  /**
   * Tool names treated as non-idempotent. A later attempt after an `ok` occurrence fails
   * unless idempotency / no-side-effect evidence is present on the retry.
   */
  nonIdempotentTools?: string[];
  /**
   * When true, retries require `idempotencyKey` or `attributes.noSideEffect === true`.
   */
  requireIdempotencyEvidenceForRetry?: boolean;
  /**
   * When true, recovered success paths must still retain at least one error attempt event.
   */
  requireRecoveredFailureVisible?: boolean;
}

function fail(
  ruleId: string,
  message: string,
  evidence: readonly TraceCheckEvidence[],
  expected?: unknown,
  actual?: unknown,
): TraceCheckFinding {
  return {
    ruleId,
    severity: "error",
    status: "fail",
    message,
    ...(expected !== undefined ? { expected } : {}),
    ...(actual !== undefined ? { actual } : {}),
    evidence: [...evidence],
  };
}

function workflowFor(event: PersistedInspectEvent): SessionWorkflowMetadata {
  const attrs = event.attributes;
  if (!attrs || typeof attrs !== "object") return {};
  const direct = extractSessionWorkflowMetadata(attrs);
  const nested =
    attrs.metadata && typeof attrs.metadata === "object"
      ? extractSessionWorkflowMetadata(attrs.metadata as Record<string, unknown>)
      : undefined;
  return { ...nested, ...direct };
}

function hasIdempotencyEvidence(event: PersistedInspectEvent): boolean {
  const workflow = workflowFor(event);
  if (typeof workflow.idempotencyKey === "string" && workflow.idempotencyKey.trim() !== "") {
    return true;
  }
  const attrs = event.attributes ?? {};
  if (attrs.noSideEffect === true) return true;
  if (attrs.sideEffect === false) return true;
  return false;
}

function eventEvidence(event: PersistedInspectEvent): TraceCheckEvidence {
  return {
    runId: event.runId,
    eventId: event.eventId,
    kind: event.kind,
    name: event.name,
    status: event.status,
  };
}

/**
 * Evaluate retry / side-effect safety invariants.
 */
export function evaluateRetrySafetyRules(
  events: readonly PersistedInspectEvent[],
  rules: TraceContractRetryRules,
  _runEvidence: readonly TraceCheckEvidence[],
): TraceCheckFinding[] {
  const findings: TraceCheckFinding[] = [];
  const byOperation = new Map<string, PersistedInspectEvent[]>();

  for (const event of events) {
    const workflow = workflowFor(event);
    const operationId = workflow.operationId;
    if (!operationId) continue;
    const list = byOperation.get(operationId) ?? [];
    list.push(event);
    byOperation.set(operationId, list);
  }

  if (rules.maxAttempts !== undefined) {
    for (const [operationId, members] of byOperation) {
      const attemptIds = new Set(
        members
          .map((event) => workflowFor(event).attemptId)
          .filter((value): value is string => typeof value === "string" && value.trim() !== ""),
      );
      const attemptNumbers = members
        .map((event) => workflowFor(event).attemptNumber ?? workflowFor(event).attempt)
        .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
      const count =
        attemptIds.size > 0
          ? attemptIds.size
          : attemptNumbers.length > 0
            ? Math.max(...attemptNumbers)
            : members.filter((event) => event.kind === "TOOL" || event.kind === "LLM").length;
      if (count > rules.maxAttempts) {
        findings.push(
          fail(
            "contract.retry.max-attempts",
            `Operation ${operationId} exceeded maxAttempts ${rules.maxAttempts}.`,
            members.slice(0, 4).map(eventEvidence),
            rules.maxAttempts,
            count,
          ),
        );
      }
    }
  }

  if (rules.requireTerminalResult) {
    for (const [operationId, members] of byOperation) {
      const hasTerminal = members.some((event) => event.status === "ok" || event.status === "error");
      if (!hasTerminal) {
        findings.push(
          fail(
            "contract.retry.terminal-result",
            `Operation ${operationId} has no terminal ok/error result.`,
            members.slice(0, 4).map(eventEvidence),
            "ok|error",
            members.map((event) => event.status),
          ),
        );
      }
    }
  }

  if (rules.fallbackOnlyAfterFailure) {
    for (const event of events) {
      const workflow = workflowFor(event);
      const fallbackOf = workflow.fallbackOf;
      if (!fallbackOf) continue;
      const prior = byOperation.get(fallbackOf) ?? events.filter((candidate) => {
        const meta = workflowFor(candidate);
        return meta.operationId === fallbackOf || candidate.runId === fallbackOf;
      });
      const priorFailure = prior.some((candidate) => candidate.status === "error");
      if (!priorFailure) {
        findings.push(
          fail(
            "contract.retry.fallback-after-failure",
            `Fallback for ${fallbackOf} appeared without a prior failure.`,
            [eventEvidence(event)],
            "prior error attempt",
            { fallbackOf },
          ),
        );
      }
    }
  }

  const nonIdempotent = new Set(rules.nonIdempotentTools ?? []);
  if (nonIdempotent.size > 0 || rules.requireIdempotencyEvidenceForRetry) {
    const toolEvents = events.filter(
      (event) => event.kind === "TOOL" && event.status !== "running",
    );
    const byToolOp = new Map<string, PersistedInspectEvent[]>();
    for (const event of toolEvents) {
      const name = resolveCanonicalToolName(event);
      const workflow = workflowFor(event);
      const key = `${workflow.operationId ?? name}::${name}`;
      const list = byToolOp.get(key) ?? [];
      list.push(event);
      byToolOp.set(key, list);
    }
    for (const [, members] of byToolOp) {
      const ordered = [...members].sort((a, b) => {
        const aTime = a.startedAt ?? a.timestamp ?? "";
        const bTime = b.startedAt ?? b.timestamp ?? "";
        return aTime.localeCompare(bTime);
      });
      let sawOk = false;
      let sawSideEffectOk = false;
      for (const event of ordered) {
        const name = resolveCanonicalToolName(event);
        const isRetry = sawOk;
        if (isRetry) {
          if (rules.requireIdempotencyEvidenceForRetry && !hasIdempotencyEvidence(event)) {
            findings.push(
              fail(
                "contract.retry.idempotency-evidence",
                `Retry of tool ${name} lacks idempotencyKey / noSideEffect evidence.`,
                [eventEvidence(event)],
                "idempotencyKey|noSideEffect",
                { code: "AI_CHECK_RETRY_EVIDENCE_UNAVAILABLE" },
              ),
            );
          }
          if (nonIdempotent.has(name) && sawSideEffectOk && !hasIdempotencyEvidence(event)) {
            findings.push(
              fail(
                "contract.retry.non-idempotent-side-effect",
                `Retry of non-idempotent tool ${name} after a confirmed ok side effect.`,
                [eventEvidence(event)],
                "no retry after side effect",
                name,
              ),
            );
          }
        }
        if (event.status === "ok") {
          sawOk = true;
          if (nonIdempotent.has(name) && !hasIdempotencyEvidence(event)) {
            sawSideEffectOk = true;
          }
        }
      }
    }
  }

  if (rules.requireRecoveredFailureVisible) {
    for (const [operationId, members] of byOperation) {
      const hasOk = members.some((event) => event.status === "ok");
      const hasError = members.some((event) => event.status === "error");
      const attemptish =
        members.some((event) => {
          const meta = workflowFor(event);
          return (
            meta.attemptId !== undefined ||
            meta.attemptNumber !== undefined ||
            meta.attempt !== undefined
          );
        }) || members.length > 1;
      if (hasOk && attemptish && !hasError) {
        findings.push(
          fail(
            "contract.retry.recovered-failure-visible",
            `Operation ${operationId} recovered without retaining a visible failure attempt.`,
            members.slice(0, 4).map(eventEvidence),
            "error attempt retained",
            { hasOk, hasError },
          ),
        );
      }
    }
  }

  return findings;
}
