import type {
  TraceCheckEvidence,
  TraceCheckFinding,
  TraceCheckInput,
  TraceCheckResult,
  TraceCheckRule,
} from "./index.js";
import {
  createLlmUsageRule,
  createObservedOutcomeRule,
  createRunDurationRule,
  createRunStatusRule,
  createStructureIncompleteRule,
  createToolOrderingRule,
  createToolUsageRule,
  runTraceChecks,
} from "./index.js";
import { extractOutcomesFromPersistedEvents } from "../outcomes/index.js";
import type { TraceReadResult } from "../readers/index.js";

function contractFailFinding(
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

/**
 * @experimental Typed trace contract input. Evolves during v6.5.x.
 */
export interface TraceContractRunRules {
  requireCompleted?: boolean;
  allowedStatuses?: string[];
  maxDurationMs?: number;
}

export interface TraceContractToolRules {
  /**
   * Unconditional tool presence invariant. Every named tool must appear at least
   * once. Do not use for cache-hit or alternate-path shortcuts — prefer
   * `alternatives.anyOf` or `observations.required` when a legitimate path may
   * skip the tool.
   *
   * @see docs/TRACE-CONTRACTS.md
   */
  required?: string[];
  /** Alias of `required` (TraceContract v2 normalization). */
  requiredTools?: string[];
  forbidden?: string[];
  /** Alias of `forbidden`. */
  forbiddenTools?: string[];
  allowed?: string[];
  maxCalls?: number;
  /**
   * Required tool order expanded into adjacent pairs.
   *
   * `[A, B, C]` expands to “A before B” and “B before C”, each comparing the
   * selected `requiredOrderMode` to every pair. Unlisted intermediate tools
   * are allowed.
   *
   * TraceContract `requiredOrder` **implies presence**: every listed name is
   * added to the effective required-tool set. Low-level `createToolOrderingRule`
   * alone may still pass vacuously when an endpoint is missing.
   *
   * The default `first-occurrence` mode preserves first-occurrence encounter
   * ordering; overlapping intervals emit a non-failing warning. `happens-before`
   * requires the first before event to finish before the first after event starts.
   * `all-occurrences` applies that causal boundary to every occurrence.
   *
   * @see docs/TRACE-CONTRACTS.md
   * @beta Available through `agent-inspect/checks`. Additive changes may ship
   * in minor releases; breaking changes require a future major.
   */
  requiredOrder?: string[];
  /**
   * Ordering semantics applied to every adjacent pair in `requiredOrder`.
   * Causal modes fail closed when a required interval boundary is unavailable.
   *
   * @defaultValue `"first-occurrence"`
   * @beta Available through `agent-inspect/checks`.
   */
  requiredOrderMode?: "first-occurrence" | "happens-before" | "all-occurrences";
}

export interface TraceContractLlmRules {
  maxCalls?: number;
  maxTotalTokens?: number;
  allowedModels?: string[];
}

export interface TraceContractObservationRules {
  required?: string[];
  failOn?: Array<"failed" | "unknown" | "skipped">;
}

/**
 * One deterministic alternate path. Branch contracts are one level only —
 * nested `alternatives` are rejected.
 *
 * @experimental
 */
export interface TraceContractAlternativeBranch {
  /** Unique branch id within `alternatives.anyOf`. */
  id: string;
  description?: string;
  /** Branch body: run/tools/llm/observations only (no nested alternatives). */
  contract: TraceContractBody;
}

/**
 * Bounded alternative valid paths for legitimate shortcuts (GitHub #309).
 *
 * @experimental
 */
export interface TraceContractAlternatives {
  /**
   * One level of named branches. The overall contract passes when the base
   * rules pass and **at least one** complete branch passes.
   */
  anyOf: TraceContractAlternativeBranch[];
}

/** Contract body without alternatives (base or branch). */
export type TraceContractBody = {
  run?: TraceContractRunRules;
  tools?: TraceContractToolRules;
  llm?: TraceContractLlmRules;
  observations?: TraceContractObservationRules;
};

export interface TraceContractInput extends TraceContractBody {
  alternatives?: TraceContractAlternatives;
}

export interface TraceContract extends TraceContractBody {
  alternatives?: TraceContractAlternatives;
}

/**
 * Lint diagnostic for brittle or invalid TraceContract shapes.
 *
 * @experimental
 */
export interface TraceContractLintDiagnostic {
  code: string;
  severity: "error" | "warning" | "info";
  message: string;
  path?: string;
}

function normalizeStatus(status: string): "ok" | "error" | "running" {
  if (status === "ok" || status === "error" || status === "running") return status;
  if (status === "success") return "ok";
  if (status === "failed") return "error";
  return "error";
}

function cloneBody(body: TraceContractBody): TraceContractBody {
  return {
    ...(body.run ? { run: { ...body.run } } : {}),
    ...(body.tools ? { tools: { ...body.tools } } : {}),
    ...(body.llm ? { llm: { ...body.llm } } : {}),
    ...(body.observations ? { observations: { ...body.observations } } : {}),
  };
}

function bodyHasRules(body: TraceContractBody): boolean {
  return (
    body.run !== undefined ||
    body.tools !== undefined ||
    body.llm !== undefined ||
    body.observations !== undefined
  );
}

function contractToRules(contract: TraceContractBody): TraceCheckRule[] {
  const rules: TraceCheckRule[] = [];

  const allowedStatuses = contract.run?.allowedStatuses ?? [];
  if (allowedStatuses.length === 1) {
    rules.push(
      createRunStatusRule({
        expected: normalizeStatus(allowedStatuses[0]!),
        allowIncomplete: contract.run?.requireCompleted === false,
      }),
    );
  } else if (allowedStatuses.length > 1) {
    const expected = [...new Set(allowedStatuses.map(normalizeStatus))];
    const allowIncomplete = contract.run?.requireCompleted === false;
    rules.push({
      id: "contract.run.allowedStatuses",
      category: "run",
      defaultSeverity: "error",
      evaluate(context) {
        const findings: TraceCheckFinding[] = [];
        const actual = context.selectedRun?.status ?? "unknown";
        if (!expected.includes(actual as "ok" | "error" | "running")) {
          findings.push(
            contractFailFinding(
              "contract.run.allowedStatuses",
              `Run status ${actual} is not one of the allowed statuses: ${expected.join(", ")}.`,
              context.selectedRun
                ? [
                    {
                      runId: context.selectedRun.runId,
                      kind: "RUN",
                      name: context.selectedRun.name,
                      status: context.selectedRun.status,
                    },
                  ]
                : [],
              expected,
              actual,
            ),
          );
        }
        if (!allowIncomplete) {
          const running = (context.logicalEvents ?? context.events).filter(
            (event) => event.status === "running",
          );
          if (running.length > 0) {
            findings.push(
              contractFailFinding(
                "contract.run.allowedStatuses",
                "Run contains incomplete running events.",
                running.map((event) => ({
                  runId: event.runId,
                  eventId: event.eventId,
                  kind: event.kind,
                  name: event.name,
                  status: event.status,
                })),
                "no running events",
                running.length,
              ),
            );
          }
        }
        return findings;
      },
    });
  } else if (contract.run?.requireCompleted !== false) {
    rules.push(createRunStatusRule({ allowIncomplete: false }));
  }

  if (contract.run?.maxDurationMs !== undefined) {
    rules.push(createRunDurationRule({ maxDurationMs: contract.run.maxDurationMs }));
  }

  if (contract.run?.requireCompleted === true) {
    rules.push(createStructureIncompleteRule({ requireEndedAtForStarted: true }));
  }

  if (contract.tools) {
    const order = contract.tools.requiredOrder ?? [];
    const requiredOrderMode = contract.tools.requiredOrderMode ?? "first-occurrence";
    const required = [
      ...new Set([
        ...(contract.tools.required ?? []),
        ...(contract.tools.requiredTools ?? []),
        ...order,
      ]),
    ];
    const forbidden = [
      ...(contract.tools.forbidden ?? []),
      ...(contract.tools.forbiddenTools ?? []),
    ];
    rules.push(
      createToolUsageRule({
        ...(required.length > 0 ? { required } : {}),
        ...(forbidden.length > 0 ? { forbidden } : {}),
        ...(contract.tools.allowed ? { allowed: contract.tools.allowed } : {}),
        ...(contract.tools.maxCalls !== undefined ? { maxCount: contract.tools.maxCalls } : {}),
      }),
    );
    for (let i = 0; i < order.length - 1; i += 1) {
      rules.push(
        createToolOrderingRule({
          before: order[i]!,
          after: order[i + 1]!,
          id: `contract.tool.order.${i}`,
          mode: requiredOrderMode,
        }),
      );
    }
  }

  if (contract.llm) {
    rules.push(
      createLlmUsageRule({
        ...(contract.llm.maxCalls !== undefined ? { maxCalls: contract.llm.maxCalls } : {}),
        ...(contract.llm.maxTotalTokens !== undefined
          ? { maxTotalTokens: contract.llm.maxTotalTokens }
          : {}),
        ...(contract.llm.allowedModels ? { allowedModels: contract.llm.allowedModels } : {}),
      }),
    );
  }

  if (contract.observations) {
    const required = contract.observations.required ?? [];
    if (required.length > 0) {
      rules.push({
        id: "contract.observation.required",
        category: "run",
        defaultSeverity: "error",
        evaluate(context) {
          const outcomes = extractOutcomesFromPersistedEvents(context.events);
          const names = new Set(outcomes.map((item) => item.name));
          const missing = required.filter((name) => !names.has(name));
          if (missing.length === 0) return [];
          return [
            contractFailFinding(
              "contract.observation.required",
              `Required observations missing: ${missing.join(", ")}`,
              context.selectedRun
                ? [{ runId: context.selectedRun.runId, kind: "RUN", name: context.selectedRun.name }]
                : [],
              required,
              [...names],
            ),
          ];
        },
      });
    }
    if (contract.observations.failOn?.length) {
      rules.push(
        createObservedOutcomeRule({
          failOn: contract.observations.failOn.filter(
            (status): status is "failed" | "unknown" | "skipped" =>
              status === "failed" || status === "unknown" || status === "skipped",
          ),
        }),
      );
    }
  }

  return rules;
}

function validateAlternativesShape(
  alternatives: TraceContractAlternatives | undefined,
): TraceContractLintDiagnostic[] {
  const diagnostics: TraceContractLintDiagnostic[] = [];
  if (alternatives === undefined) return diagnostics;
  const branches = alternatives.anyOf ?? [];
  if (branches.length === 0) {
    diagnostics.push({
      code: "contract.alternatives.empty",
      severity: "error",
      message: "alternatives.anyOf must contain at least one branch.",
      path: "alternatives.anyOf",
    });
    return diagnostics;
  }
  const seen = new Set<string>();
  for (const [index, branch] of branches.entries()) {
    const path = `alternatives.anyOf[${index}]`;
    if (!branch?.id || branch.id.trim() === "") {
      diagnostics.push({
        code: "contract.alternatives.missing-id",
        severity: "error",
        message: "Each alternatives.anyOf branch requires a non-empty id.",
        path,
      });
      continue;
    }
    if (seen.has(branch.id)) {
      diagnostics.push({
        code: "contract.alternatives.duplicate-id",
        severity: "error",
        message: `Duplicate alternatives.anyOf branch id: ${branch.id}`,
        path: `${path}.id`,
      });
    }
    seen.add(branch.id);
    if (!bodyHasRules(branch.contract ?? {})) {
      diagnostics.push({
        code: "contract.alternatives.empty-branch",
        severity: "error",
        message: `Branch ${branch.id} must declare at least one run/tools/llm/observations rule.`,
        path: `${path}.contract`,
      });
    }
    const nested = (branch.contract as TraceContractBody & { alternatives?: unknown })
      ?.alternatives;
    if (nested !== undefined) {
      diagnostics.push({
        code: "contract.alternatives.nested",
        severity: "error",
        message:
          "Nested alternatives.anyOf is not supported. Keep one alternatives level only.",
        path: `${path}.contract.alternatives`,
      });
    }
  }
  return diagnostics;
}

function emptyPassResult(input: TraceCheckInput, runId?: string): TraceCheckResult {
  return {
    ok: true,
    status: "pass",
    format: input.read.format,
    ...(runId !== undefined ? { runId } : {}),
    summary: { passed: 0, failed: 0, warnings: 0, errors: 0, rulesEvaluated: 0 },
    findings: [],
    diagnostics: [],
    ruleExecutions: [],
  };
}

function mergeContractResults(
  input: TraceCheckInput,
  parts: readonly TraceCheckResult[],
  extraFindings: readonly TraceCheckFinding[] = [],
): TraceCheckResult {
  const findings = [...parts.flatMap((part) => part.findings), ...extraFindings];
  const diagnostics = parts.flatMap((part) => part.diagnostics);
  const ruleExecutions = parts.flatMap((part) => part.ruleExecutions);
  const failed = findings.filter(
    (finding) => finding.status === "fail" && finding.severity === "error",
  ).length;
  const errors = diagnostics.filter((item) => item.severity === "error").length;
  const status: TraceCheckResult["status"] =
    errors > 0 ? "error" : failed > 0 ? "fail" : "pass";
  const runId = parts.find((part) => part.runId !== undefined)?.runId;
  return {
    ok: status === "pass",
    status,
    format: input.read.format,
    ...(runId !== undefined ? { runId } : {}),
    summary: {
      passed: findings.filter((finding) => finding.status === "pass").length,
      failed,
      warnings: findings.filter(
        (finding) => finding.status === "warning" || finding.severity === "warning",
      ).length,
      errors,
      rulesEvaluated: ruleExecutions.length,
    },
    findings,
    diagnostics,
    ruleExecutions,
  };
}

function evaluateBody(
  input: TraceCheckInput,
  body: TraceContractBody,
  options: { runId?: string } = {},
): TraceCheckResult {
  const rules = contractToRules(body);
  if (rules.length === 0) {
    return emptyPassResult(input, options.runId);
  }
  return runTraceChecks(input, {
    rules,
    ...(options.runId !== undefined ? { runId: options.runId } : {}),
  });
}

/**
 * Define a normalized trace contract object.
 *
 * @experimental
 */
export function defineTraceContract(input: TraceContractInput): TraceContract {
  const shapeErrors = validateAlternativesShape(input.alternatives).filter(
    (item) => item.severity === "error",
  );
  if (shapeErrors.length > 0) {
    throw new TypeError(shapeErrors.map((item) => item.message).join(" "));
  }
  const body = cloneBody(input);
  const alternatives = input.alternatives
    ? {
        anyOf: input.alternatives.anyOf.map((branch) => ({
          id: branch.id,
          ...(branch.description !== undefined ? { description: branch.description } : {}),
          contract: cloneBody(branch.contract),
        })),
      }
    : undefined;
  return {
    ...body,
    ...(alternatives ? { alternatives } : {}),
  };
}

/**
 * Evaluate a trace contract against an opened trace read result.
 *
 * Base rules always apply. When `alternatives.anyOf` is present, at least one
 * complete branch must also pass.
 *
 * @experimental
 */
export function evaluateTraceContract(
  input: TraceCheckInput,
  contract: TraceContract,
  options: { runId?: string } = {},
): TraceCheckResult {
  const shapeErrors = validateAlternativesShape(contract.alternatives).filter(
    (item) => item.severity === "error",
  );
  if (shapeErrors.length > 0) {
    return {
      ok: false,
      status: "error",
      format: input.read.format,
      ...(options.runId !== undefined ? { runId: options.runId } : {}),
      summary: {
        passed: 0,
        failed: 0,
        warnings: 0,
        errors: shapeErrors.length,
        rulesEvaluated: 0,
      },
      findings: [],
      diagnostics: shapeErrors.map((item) => ({
        code: "AI_CHECK_INVALID_CONFIG",
        message: item.message,
        severity: "error" as const,
        ruleId: item.code,
      })),
      ruleExecutions: [],
    };
  }

  const base = evaluateBody(input, contract, options);
  const branches = contract.alternatives?.anyOf ?? [];
  if (branches.length === 0) {
    return base;
  }

  const branchEvaluations = branches.map((branch) => {
    const result = evaluateBody(input, branch.contract, options);
    return { branch, result };
  });
  const satisfied = branchEvaluations
    .filter((item) => item.result.ok && item.result.status === "pass")
    .map((item) => item.branch.id);
  const failedBranches = branchEvaluations.filter(
    (item) => !(item.result.ok && item.result.status === "pass"),
  );

  if (satisfied.length > 0) {
    const passFinding: TraceCheckFinding = {
      ruleId: "contract.alternatives.anyOf",
      severity: "info",
      status: "pass",
      message: `Satisfied alternative branch(es): ${satisfied.join(", ")}.`,
      expected: { anyOf: branches.map((branch) => branch.id) },
      actual: {
        satisfied,
        failed: failedBranches.map((item) => item.branch.id),
      },
      evidence: [],
    };
    return mergeContractResults(input, [base], [passFinding]);
  }

  const noneFinding: TraceCheckFinding = {
    ruleId: "contract.alternatives.none-satisfied",
    severity: "error",
    status: "fail",
    message: "No alternatives.anyOf branch fully satisfied its contract.",
    expected: { anyOf: branches.map((branch) => branch.id) },
    actual: {
      branchFailures: Object.fromEntries(
        failedBranches.map((item) => [
          item.branch.id,
          item.result.findings
            .filter((finding) => finding.status === "fail")
            .map((finding) => ({
              ruleId: finding.ruleId,
              message: finding.message,
            })),
        ]),
      ),
    },
    evidence: [],
  };
  const prefixedBranchFindings = failedBranches.flatMap((item) =>
    item.result.findings
      .filter((finding) => finding.status === "fail")
      .map((finding) => ({
        ...finding,
        ruleId: `contract.alternatives.${item.branch.id}.${finding.ruleId}`,
      })),
  );
  return mergeContractResults(input, [base], [noneFinding, ...prefixedBranchFindings]);
}

/**
 * Convenience: evaluate a contract against a TraceReadResult directly.
 *
 * @experimental Additive wrapper over `evaluateTraceContract({ read }, …)`.
 */
export function evaluateTraceContractRead(
  read: TraceReadResult,
  contract: TraceContract,
  options: { runId?: string } = {},
): TraceCheckResult {
  return evaluateTraceContract({ read }, contract, options);
}

/**
 * Lint a TraceContract for invalid or brittle shapes (does not evaluate a trace).
 *
 * @experimental
 */
export function lintTraceContract(contract: TraceContract): TraceContractLintDiagnostic[] {
  const diagnostics = validateAlternativesShape(contract.alternatives);
  const branches = contract.alternatives?.anyOf ?? [];
  if (branches.length === 1) {
    diagnostics.push({
      code: "contract.alternatives.single-branch",
      severity: "warning",
      message:
        "alternatives.anyOf has a single branch. Prefer base rules unless a second valid path exists.",
      path: "alternatives.anyOf",
    });
  }
  const required = [
    ...(contract.tools?.required ?? []),
    ...(contract.tools?.requiredTools ?? []),
  ];
  if (required.length > 0 && branches.length === 0) {
    diagnostics.push({
      code: "contract.brittle.unconditional-required",
      severity: "info",
      message:
        "tools.required is unconditional. Use alternatives.anyOf when a legitimate shortcut may skip a tool.",
      path: "tools.required",
    });
  }
  const order = contract.tools?.requiredOrder ?? [];
  if (order.length >= 2 && contract.tools?.requiredOrderMode === undefined) {
    diagnostics.push({
      code: "contract.brittle.first-occurrence-default",
      severity: "info",
      message:
        "requiredOrder defaults to first-occurrence. Set requiredOrderMode when repeated calls must fail.",
      path: "tools.requiredOrderMode",
    });
  }
  return diagnostics;
}

/**
 * Explain a TraceContract as short human-readable lines (does not evaluate a trace).
 *
 * @experimental
 */
export function explainTraceContract(contract: TraceContract): string[] {
  const lines: string[] = [];
  if (contract.run?.requireCompleted !== false) {
    lines.push("Base: run must complete (no running events).");
  }
  if (contract.run?.allowedStatuses?.length) {
    lines.push(`Base: run status in [${contract.run.allowedStatuses.join(", ")}].`);
  }
  if (contract.run?.maxDurationMs !== undefined) {
    lines.push(`Base: run duration <= ${contract.run.maxDurationMs}ms.`);
  }
  if (contract.tools) {
    const required = [
      ...new Set([
        ...(contract.tools.required ?? []),
        ...(contract.tools.requiredTools ?? []),
        ...(contract.tools.requiredOrder ?? []),
      ]),
    ];
    if (required.length > 0) {
      lines.push(`Base: required tools [${required.join(", ")}].`);
    }
    const forbidden = [
      ...(contract.tools.forbidden ?? []),
      ...(contract.tools.forbiddenTools ?? []),
    ];
    if (forbidden.length > 0) {
      lines.push(`Base: forbidden tools [${forbidden.join(", ")}].`);
    }
    if ((contract.tools.requiredOrder?.length ?? 0) >= 2) {
      const mode = contract.tools.requiredOrderMode ?? "first-occurrence";
      lines.push(
        `Base: requiredOrder [${contract.tools.requiredOrder!.join(" → ")}] mode=${mode}.`,
      );
    }
  }
  if (contract.llm) {
    if (contract.llm.maxCalls !== undefined) {
      lines.push(`Base: LLM maxCalls=${contract.llm.maxCalls}.`);
    }
    if (contract.llm.maxTotalTokens !== undefined) {
      lines.push(`Base: LLM maxTotalTokens=${contract.llm.maxTotalTokens}.`);
    }
    if (contract.llm.allowedModels?.length) {
      lines.push(`Base: LLM allowedModels [${contract.llm.allowedModels.join(", ")}].`);
    }
  }
  if (contract.observations?.required?.length) {
    lines.push(`Base: required observations [${contract.observations.required.join(", ")}].`);
  }
  if (contract.observations?.failOn?.length) {
    lines.push(`Base: fail on observations [${contract.observations.failOn.join(", ")}].`);
  }
  const branches = contract.alternatives?.anyOf ?? [];
  if (branches.length > 0) {
    lines.push(
      `Alternatives: at least one of [${branches.map((branch) => branch.id).join(", ")}] must fully pass.`,
    );
    for (const branch of branches) {
      const detail = branch.description ? ` — ${branch.description}` : "";
      lines.push(`  branch ${branch.id}${detail}`);
    }
  }
  if (lines.length === 0) {
    lines.push("Empty contract: no base rules and no alternatives.");
  }
  return lines;
}
