/**
 * Declared-versus-enforced control checks for TraceContract (6.23).
 *
 * A stored declaration is not proof of enforcement.
 *
 * @experimental
 */

import type { TraceCheckEvidence, TraceCheckFinding } from "./index.js";
import { resolveCanonicalToolName } from "./logical-events.js";
import type { PersistedInspectEvent } from "../types/persisted-inspect-event.js";

export type ControlStage =
  | "declared"
  | "presented"
  | "validated"
  | "enforced"
  | "observed"
  | "accepted";

export interface TraceContractControlRules {
  /**
   * Tools declared/presented to the agent (inline). Distinct from `enforcedTools`.
   */
  declaredTools?: string[];
  /**
   * Tools the harness claims to enforce (inline allowlist).
   */
  enforcedTools?: string[];
  /**
   * RUN/event attribute holding a string[] of declared tool names.
   * Used when `declaredTools` is omitted.
   */
  declaredToolsAttribute?: string;
  /**
   * RUN/event attribute holding a string[] of enforced tool names.
   */
  enforcedToolsAttribute?: string;
  /**
   * Fail when both declared and enforced sets resolve and differ.
   */
  requireDeclaredMatchesEnforced?: boolean;
  /**
   * Fail when any observed finished tool is outside the enforced set.
   */
  requireObservedWithinEnforced?: boolean;
  /**
   * Fail when any observed finished tool is outside the declared set.
   */
  requireObservedWithinDeclared?: boolean;
  /**
   * Require observation names for control stages (default `control.<stage>`).
   */
  requiredStages?: Array<{
    stage: ControlStage;
    /** Observation name; defaults to `control.<stage>`. */
    observation?: string;
  }>;
}

function asStringList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || item.trim() === "") return undefined;
    out.push(item.trim());
  }
  return out;
}

function attributeList(
  events: readonly PersistedInspectEvent[],
  attribute: string | undefined,
): string[] | undefined {
  if (!attribute) return undefined;
  for (const event of events) {
    const attrs = event.attributes;
    if (!attrs || typeof attrs !== "object") continue;
    const direct = asStringList(attrs[attribute]);
    if (direct) return direct;
    const nested =
      attrs.metadata && typeof attrs.metadata === "object"
        ? asStringList((attrs.metadata as Record<string, unknown>)[attribute])
        : undefined;
    if (nested) return nested;
  }
  return undefined;
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

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function setEqual(left: readonly string[], right: readonly string[]): boolean {
  const a = sortedUnique(left);
  const b = sortedUnique(right);
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

/**
 * Evaluate declared/enforced/stage control invariants.
 */
export function evaluateControlRules(
  events: readonly PersistedInspectEvent[],
  rules: TraceContractControlRules,
  runEvidence: readonly TraceCheckEvidence[],
  observationNames: ReadonlySet<string>,
): TraceCheckFinding[] {
  const findings: TraceCheckFinding[] = [];
  const declared =
    rules.declaredTools ??
    attributeList(events, rules.declaredToolsAttribute);
  const enforced =
    rules.enforcedTools ??
    attributeList(events, rules.enforcedToolsAttribute);

  if (rules.requireDeclaredMatchesEnforced) {
    if (declared === undefined || enforced === undefined) {
      findings.push(
        fail(
          "contract.controls.declared-matches-enforced",
          "Declared and enforced tool sets could not both be resolved.",
          runEvidence,
          { declaredDefined: declared !== undefined, enforcedDefined: enforced !== undefined },
          { code: "AI_CHECK_CONTROL_EVIDENCE_UNAVAILABLE" },
        ),
      );
    } else if (!setEqual(declared, enforced)) {
      findings.push(
        fail(
          "contract.controls.declared-matches-enforced",
          "Declared tools differ from enforced tools.",
          runEvidence,
          sortedUnique(declared),
          sortedUnique(enforced),
        ),
      );
    }
  }

  const observedTools = sortedUnique(
    events
      .filter((event) => event.kind === "TOOL" && event.status !== "running")
      .map((event) => resolveCanonicalToolName(event)),
  );

  if (rules.requireObservedWithinEnforced) {
    if (enforced === undefined) {
      findings.push(
        fail(
          "contract.controls.observed-within-enforced",
          "Enforced tool set unavailable for observed-within-enforced check.",
          runEvidence,
          undefined,
          { code: "AI_CHECK_CONTROL_EVIDENCE_UNAVAILABLE" },
        ),
      );
    } else {
      const enforcedSet = new Set(enforced);
      const outside = observedTools.filter((name) => !enforcedSet.has(name));
      if (outside.length > 0) {
        findings.push(
          fail(
            "contract.controls.observed-within-enforced",
            `Observed tools outside enforced allowlist: ${outside.join(", ")}.`,
            runEvidence,
            sortedUnique(enforced),
            outside,
          ),
        );
      }
    }
  }

  if (rules.requireObservedWithinDeclared) {
    if (declared === undefined) {
      findings.push(
        fail(
          "contract.controls.observed-within-declared",
          "Declared tool set unavailable for observed-within-declared check.",
          runEvidence,
          undefined,
          { code: "AI_CHECK_CONTROL_EVIDENCE_UNAVAILABLE" },
        ),
      );
    } else {
      const declaredSet = new Set(declared);
      const outside = observedTools.filter((name) => !declaredSet.has(name));
      if (outside.length > 0) {
        findings.push(
          fail(
            "contract.controls.observed-within-declared",
            `Observed tools outside declared set: ${outside.join(", ")}.`,
            runEvidence,
            sortedUnique(declared),
            outside,
          ),
        );
      }
    }
  }

  for (const stage of rules.requiredStages ?? []) {
    const observation = stage.observation ?? `control.${stage.stage}`;
    if (!observationNames.has(observation)) {
      findings.push(
        fail(
          `contract.controls.stage.${stage.stage}`,
          `Required control stage observation missing: ${observation}.`,
          runEvidence,
          observation,
          [...observationNames],
        ),
      );
    }
  }

  return findings;
}
