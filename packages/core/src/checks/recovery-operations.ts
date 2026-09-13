/**
 * Bounded safe recovery operation contracts (6.27).
 *
 * Additive `retry.operations[]` rules for read-first recovery oracles.
 * AgentInspect evaluates traces; it does not perform retries.
 *
 * @experimental
 */

import type { TraceCheckEvidence, TraceCheckFinding } from "./index.js";
import { resolveCanonicalToolName } from "./logical-events.js";
import { extractToolArgumentPayload } from "./tool-arguments.js";
import { classifyRetryAttempt, countOperationAttempts } from "./retry-safety.js";
import { extractSessionWorkflowMetadata } from "../sessions/metadata.js";
import type { PersistedInspectEvent } from "../types/persisted-inspect-event.js";
import type { SessionWorkflowMetadata } from "../sessions/types.js";

/** How same-argument evidence may be compared across attempts. */
export type RecoverySameArgumentsMode = "structured-or-digest";

/**
 * Side-effect class for conservative write recovery semantics.
 * Read-only tools may recover without write idempotency proof.
 * Write tools treat timeout/unknown completion as fail/unevaluable
 * unless authoritative idempotency evidence is present.
 */
export type RecoverySideEffectClass = "read" | "write";

export interface TraceContractRecoveryRetryableErrors {
  /** Allowed error codes on failed attempts that precede a retry. */
  codes?: readonly string[];
}

export interface TraceContractRecoverySuccessfulResultDependency {
  /** Consumer kind that must observe the successful tool result. */
  consumerKind: "LLM";
  /**
   * When true, an LLM event must explicitly reference the successful tool
   * event id (attributes / workflow metadata), not merely follow it in time.
   */
  requireExplicitReference?: boolean;
}

/**
 * Per-tool bounded recovery oracle (additive under `retry.operations`).
 *
 * @experimental Additive in 6.27.
 */
export interface TraceContractRecoveryOperation {
  tool: string;
  maxAttempts?: number;
  retryableErrors?: TraceContractRecoveryRetryableErrors;
  requireFailureBeforeRetry?: boolean;
  /**
   * When true or `"structured-or-digest"`, retries must share structured
   * arguments or matching digests. Missing evidence fails closed.
   */
  requireSameArguments?: boolean | RecoverySameArgumentsMode;
  requireTerminalSuccess?: boolean;
  requireRecoveredFailureVisible?: boolean;
  successfulResultDependency?: TraceContractRecoverySuccessfulResultDependency;
  /**
   * Defaults to `"read"`. Write tools apply conservative timeout/unknown rules.
   */
  sideEffectClass?: RecoverySideEffectClass;
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

function eventEvidence(event: PersistedInspectEvent): TraceCheckEvidence {
  return {
    runId: event.runId,
    eventId: event.eventId,
    kind: event.kind,
    name: event.name,
    status: event.status,
  };
}

function eventTime(event: PersistedInspectEvent): string {
  return event.startedAt ?? event.timestamp ?? "";
}

function sortByTime(events: readonly PersistedInspectEvent[]): PersistedInspectEvent[] {
  return [...events].sort((a, b) => eventTime(a).localeCompare(eventTime(b)));
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

function errorCodeOf(event: PersistedInspectEvent): string | undefined {
  if (typeof event.error?.code === "string" && event.error.code.trim() !== "") {
    return event.error.code.trim();
  }
  const attrs = event.attributes ?? {};
  for (const key of ["errorCode", "code"] as const) {
    const value = attrs[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  const nested = attrs.error;
  if (nested && typeof nested === "object") {
    const code = (nested as { code?: unknown }).code;
    if (typeof code === "string" && code.trim() !== "") return code.trim();
  }
  return undefined;
}

function argumentDigestOf(event: PersistedInspectEvent): string | undefined {
  const attrs = event.attributes ?? {};
  for (const key of ["argumentsDigest", "inputDigest", "toolArgumentsDigest"] as const) {
    const value = attrs[key];
    if (typeof value === "string" && value.trim() !== "") return value.trim();
  }
  const commitment = attrs.omittedPayloadCommitment;
  if (commitment && typeof commitment === "object") {
    const digest = (commitment as { digest?: unknown }).digest;
    if (typeof digest === "string" && digest.trim() !== "") return digest.trim();
  }
  return undefined;
}

type ArgumentFingerprint =
  | { kind: "structured"; value: string }
  | { kind: "digest"; value: string }
  | { kind: "missing" };

function argumentFingerprint(event: PersistedInspectEvent): ArgumentFingerprint {
  const payload = extractToolArgumentPayload(event);
  if (payload.present) {
    try {
      return { kind: "structured", value: JSON.stringify(payload.value) };
    } catch {
      return { kind: "missing" };
    }
  }
  const digest = argumentDigestOf(event);
  if (digest) return { kind: "digest", value: digest };
  return { kind: "missing" };
}

function sameArguments(
  left: PersistedInspectEvent,
  right: PersistedInspectEvent,
): { ok: true } | { ok: false; reason: string; code: string } {
  const a = argumentFingerprint(left);
  const b = argumentFingerprint(right);
  if (a.kind === "missing" || b.kind === "missing") {
    return {
      ok: false,
      reason: "Structured or digest argument evidence unavailable for same-arguments check.",
      code: "AI_CHECK_RECOVERY_ARGUMENT_EVIDENCE_UNAVAILABLE",
    };
  }
  if (a.kind !== b.kind) {
    return {
      ok: false,
      reason: "Argument evidence kinds differ across attempts (structured vs digest).",
      code: "AI_CHECK_RECOVERY_ARGUMENT_EVIDENCE_MISMATCH",
    };
  }
  if (a.value !== b.value) {
    return {
      ok: false,
      reason: "Retry arguments do not match prior attempt.",
      code: "AI_CHECK_RECOVERY_ARGUMENTS_DIFFER",
    };
  }
  return { ok: true };
}

function isUnevaluableWriteCompletion(event: PersistedInspectEvent): boolean {
  if (event.status === "running" || event.status === "unknown") return true;
  const attrs = event.attributes ?? {};
  if (attrs.timeout === true) return true;
  if (attrs.completionState === "unknown" || attrs.completionState === "timeout") return true;
  const code = errorCodeOf(event)?.toUpperCase();
  if (code === "TIMEOUT" || code === "UNKNOWN_COMPLETION" || code === "DEADLINE_EXCEEDED") {
    return true;
  }
  return false;
}

function collectExplicitReferences(event: PersistedInspectEvent): Set<string> {
  const refs = new Set<string>();
  const attrs = event.attributes ?? {};
  const candidates: unknown[] = [
    attrs.referencedEventId,
    attrs.referencedEventIds,
    attrs.toolResultEventId,
    attrs.toolResultEventIds,
    attrs.inputEventIds,
    attrs.dependsOnEventIds,
    attrs.evidence,
    workflowFor(event).toolCallId,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim() !== "") {
      refs.add(candidate.trim());
      continue;
    }
    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        if (typeof item === "string" && item.trim() !== "") refs.add(item.trim());
        if (item && typeof item === "object") {
          const id = (item as { eventId?: unknown }).eventId;
          if (typeof id === "string" && id.trim() !== "") refs.add(id.trim());
        }
      }
      continue;
    }
    if (candidate && typeof candidate === "object") {
      const obj = candidate as { eventId?: unknown; eventIds?: unknown };
      if (typeof obj.eventId === "string" && obj.eventId.trim() !== "") {
        refs.add(obj.eventId.trim());
      }
      if (Array.isArray(obj.eventIds)) {
        for (const id of obj.eventIds) {
          if (typeof id === "string" && id.trim() !== "") refs.add(id.trim());
        }
      }
    }
  }
  return refs;
}

function llmReferencesTool(
  llm: PersistedInspectEvent,
  toolEvent: PersistedInspectEvent,
  requireExplicit: boolean,
): boolean {
  if (!requireExplicit) {
    return eventTime(llm) >= eventTime(toolEvent);
  }
  const refs = collectExplicitReferences(llm);
  if (refs.has(toolEvent.eventId)) return true;
  const toolCallId = workflowFor(toolEvent).toolCallId;
  if (toolCallId && refs.has(toolCallId)) return true;
  return false;
}

function groupToolAttempts(
  events: readonly PersistedInspectEvent[],
  toolName: string,
): Map<string, PersistedInspectEvent[]> {
  const groups = new Map<string, PersistedInspectEvent[]>();
  for (const event of events) {
    if (event.kind !== "TOOL") continue;
    if (resolveCanonicalToolName(event) !== toolName) continue;
    const workflow = workflowFor(event);
    const key = workflow.operationId ?? `__tool__:${toolName}`;
    const list = groups.get(key) ?? [];
    list.push(event);
    groups.set(key, list);
  }
  return groups;
}

/**
 * Evaluate additive `retry.operations[]` recovery oracles.
 */
export function evaluateRecoveryOperations(
  events: readonly PersistedInspectEvent[],
  operations: readonly TraceContractRecoveryOperation[],
): TraceCheckFinding[] {
  const findings: TraceCheckFinding[] = [];
  const llmEvents = events.filter((event) => event.kind === "LLM");

  for (const operation of operations) {
    const sideEffectClass = operation.sideEffectClass ?? "read";
    const groups = groupToolAttempts(events, operation.tool);

    if (groups.size === 0) {
      if (operation.requireTerminalSuccess) {
        findings.push(
          fail(
            "contract.retry.operations.terminal-success",
            `Recovery operation for tool ${operation.tool} requires a terminal success but no attempts were observed.`,
            [],
            "ok",
            "missing",
          ),
        );
      }
      continue;
    }

    for (const [operationKey, members] of groups) {
      const ordered = sortByTime(members);

      if (operation.maxAttempts !== undefined) {
        const count = countOperationAttempts(members);
        if (count > operation.maxAttempts) {
          findings.push(
            fail(
              "contract.retry.operations.max-attempts",
              `Tool ${operation.tool} operation ${operationKey} exceeded maxAttempts ${operation.maxAttempts}.`,
              members.slice(0, 4).map(eventEvidence),
              operation.maxAttempts,
              count,
            ),
          );
        }
      }

      if (sideEffectClass === "write") {
        for (const event of ordered) {
          if (isUnevaluableWriteCompletion(event) && !hasIdempotencyEvidence(event)) {
            findings.push(
              fail(
                "contract.retry.operations.write-completion-unevaluable",
                `Write tool ${operation.tool} has timeout/unknown completion without authoritative idempotency evidence.`,
                [eventEvidence(event)],
                "idempotencyKey|authoritative completion",
                {
                  code: "AI_CHECK_RECOVERY_WRITE_COMPLETION_UNAVAILABLE",
                  status: event.status,
                },
              ),
            );
          }
        }
      }

      const prior: PersistedInspectEvent[] = [];
      let sawEarlierError = false;
      let sawLaterOkAfterError = false;
      let lastOk: PersistedInspectEvent | undefined;

      for (const event of ordered) {
        const classification = classifyRetryAttempt(event, prior, members);
        const isRetry = classification.kind === "retry";

        if (isRetry && operation.requireFailureBeforeRetry) {
          const earlierFailure = prior.some(
            (candidate) =>
              candidate.status === "error" &&
              eventTime(candidate) !== "" &&
              eventTime(event) !== "" &&
              eventTime(candidate) < eventTime(event),
          );
          if (!earlierFailure) {
            findings.push(
              fail(
                "contract.retry.operations.failure-before-retry",
                `Retry of tool ${operation.tool} appeared without an earlier failure in the same operation.`,
                [eventEvidence(event)],
                "earlier error attempt",
                { operationKey },
              ),
            );
          }
        }

        if (isRetry && operation.retryableErrors?.codes && operation.retryableErrors.codes.length > 0) {
          const allowed = new Set(operation.retryableErrors.codes);
          const priorErrors = prior.filter((candidate) => candidate.status === "error");
          const lastError = priorErrors[priorErrors.length - 1];
          if (lastError) {
            const code = errorCodeOf(lastError);
            if (!code || !allowed.has(code)) {
              findings.push(
                fail(
                  "contract.retry.operations.retryable-error",
                  `Retry of tool ${operation.tool} followed a non-retryable or missing error code.`,
                  [eventEvidence(event), eventEvidence(lastError)],
                  [...allowed],
                  code ?? null,
                ),
              );
            }
          }
        }

        if (
          isRetry &&
          (operation.requireSameArguments === true ||
            operation.requireSameArguments === "structured-or-digest")
        ) {
          const baseline = prior[0] ?? prior[prior.length - 1];
          if (baseline) {
            const comparison = sameArguments(baseline, event);
            if (!comparison.ok) {
              findings.push(
                fail(
                  "contract.retry.operations.same-arguments",
                  comparison.reason,
                  [eventEvidence(baseline), eventEvidence(event)],
                  "matching structured args or digests",
                  { code: comparison.code },
                ),
              );
            }
          }
        }

        if (event.status === "error") {
          sawEarlierError = true;
        } else if (event.status === "ok" && sawEarlierError) {
          sawLaterOkAfterError = true;
        }
        if (event.status === "ok") {
          lastOk = event;
        }
        prior.push(event);
      }

      if (operation.requireTerminalSuccess) {
        const hasOk = ordered.some((event) => event.status === "ok");
        if (!hasOk) {
          findings.push(
            fail(
              "contract.retry.operations.terminal-success",
              `Tool ${operation.tool} operation ${operationKey} has no terminal ok success.`,
              ordered.slice(0, 4).map(eventEvidence),
              "ok",
              ordered.map((event) => event.status),
            ),
          );
        }
      }

      if (operation.requireRecoveredFailureVisible) {
        const hasOk = ordered.some((event) => event.status === "ok");
        // Only require visible failure when a multi-attempt recovery chain exists.
        if (ordered.length > 1 && hasOk && !sawLaterOkAfterError) {
          findings.push(
            fail(
              "contract.retry.operations.recovered-failure-visible",
              `Tool ${operation.tool} operation ${operationKey} does not show an earlier error before later success.`,
              ordered.slice(0, 4).map(eventEvidence),
              "earlier error then later ok",
              { sawEarlierError },
            ),
          );
        }
      }

      const dependency = operation.successfulResultDependency;
      if (dependency?.consumerKind === "LLM" && lastOk) {
        const requireExplicit = dependency.requireExplicitReference === true;
        const referenced = llmEvents.some((llmEvent) =>
          llmReferencesTool(llmEvent, lastOk!, requireExplicit),
        );
        if (!referenced) {
          findings.push(
            fail(
              "contract.retry.operations.successful-result-dependency",
              requireExplicit
                ? `Successful ${operation.tool} result is not explicitly referenced by a later LLM event.`
                : `Successful ${operation.tool} result has no later LLM consumer.`,
              [eventEvidence(lastOk)],
              "LLM reference to successful tool event",
              { code: "AI_CHECK_RECOVERY_RESULT_DEPENDENCY_MISSING" },
            ),
          );
        }
      }
    }
  }

  return findings;
}
