/**
 * Bounded JSON Pointer evaluation for TraceContract tool-argument checks (6.23).
 *
 * No JSONPath, regex, or arbitrary code execution.
 *
 * @experimental
 */

export type JsonPointerValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonPointerValue[]
  | { readonly [key: string]: JsonPointerValue };

function decodeToken(token: string): string {
  return token.replace(/~1/g, "/").replace(/~0/g, "~");
}

/**
 * Resolve an RFC 6901 JSON Pointer against a JSON-like value.
 * Returns `{ found: false }` when the path does not exist.
 */
export function resolveJsonPointer(
  document: unknown,
  pointer: string,
): { found: true; value: unknown } | { found: false } {
  if (pointer === "") {
    return { found: true, value: document };
  }
  if (!pointer.startsWith("/")) {
    return { found: false };
  }
  const tokens = pointer.slice(1).split("/").map(decodeToken);
  let current: unknown = document;
  for (const token of tokens) {
    if (current === null || current === undefined) {
      return { found: false };
    }
    if (Array.isArray(current)) {
      if (!/^(0|[1-9][0-9]*)$/.test(token)) {
        return { found: false };
      }
      const index = Number(token);
      if (index >= current.length) {
        return { found: false };
      }
      current = current[index];
      continue;
    }
    if (typeof current !== "object") {
      return { found: false };
    }
    const record = current as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(record, token)) {
      return { found: false };
    }
    current = record[token];
  }
  return { found: true, value: current };
}

export type ToolArgumentOperator = "exists" | "type" | "equals" | "oneOf";
export type ToolArgumentOccurrence = "first" | "last" | "any" | "all";

export interface ToolArgumentCheck {
  tool: string;
  path: string;
  operator: ToolArgumentOperator;
  occurrence?: ToolArgumentOccurrence;
  /** Required for `equals`. */
  expected?: unknown;
  /** Required for `oneOf`. */
  oneOf?: readonly unknown[];
  /** Required for `type` (`string` | `number` | `boolean` | `object` | `array` | `null`). */
  type?: "string" | "number" | "boolean" | "object" | "array" | "null";
}

function jsonType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function valuesEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export type ToolArgumentEval =
  | { status: "pass" }
  | { status: "fail"; message: string; code: string }
  | { status: "unavailable"; message: string; code: "AI_CHECK_TOOL_ARGUMENT_EVIDENCE_UNAVAILABLE" };

/**
 * Extract structured tool-argument evidence from a tool event.
 * Preview-only strings and digests do not count as structured evidence.
 */
export function extractToolArgumentPayload(event: {
  attributes?: Record<string, unknown>;
  inputSummary?: unknown;
}): { present: boolean; value: unknown } {
  const attrs = event.attributes ?? {};
  for (const key of ["arguments", "input", "toolArguments"] as const) {
    const candidate = attrs[key];
    if (candidate !== undefined && candidate !== null && typeof candidate === "object") {
      return { present: true, value: candidate };
    }
  }
  if (
    event.inputSummary !== undefined &&
    event.inputSummary !== null &&
    typeof event.inputSummary === "object"
  ) {
    return { present: true, value: event.inputSummary };
  }
  return { present: false, value: undefined };
}

export function evaluateToolArgumentValue(
  value: unknown,
  check: ToolArgumentCheck,
  evidencePresent: boolean,
): ToolArgumentEval {
  if (!evidencePresent) {
    return {
      status: "unavailable",
      code: "AI_CHECK_TOOL_ARGUMENT_EVIDENCE_UNAVAILABLE",
      message: `Structured argument evidence unavailable for tool ${check.tool} at ${check.path}.`,
    };
  }
  const resolved = resolveJsonPointer(value, check.path);
  if (check.operator === "exists") {
    return resolved.found
      ? { status: "pass" }
      : {
          status: "fail",
          code: "AI_CHECK_TOOL_ARGUMENT_MISSING",
          message: `Expected path ${check.path} to exist on tool ${check.tool}.`,
        };
  }
  if (!resolved.found) {
    return {
      status: "unavailable",
      code: "AI_CHECK_TOOL_ARGUMENT_EVIDENCE_UNAVAILABLE",
      message: `Path ${check.path} missing for tool ${check.tool}.`,
    };
  }
  if (check.operator === "type") {
    const actual = jsonType(resolved.value);
    if (check.type === undefined) {
      return {
        status: "fail",
        code: "AI_CHECK_TOOL_ARGUMENT_INVALID_CONFIG",
        message: "type operator requires check.type",
      };
    }
    return actual === check.type
      ? { status: "pass" }
      : {
          status: "fail",
          code: "AI_CHECK_TOOL_ARGUMENT_TYPE",
          message: `Expected type ${check.type} at ${check.path} for tool ${check.tool}; found ${actual}.`,
        };
  }
  if (check.operator === "equals") {
    return valuesEqual(resolved.value, check.expected)
      ? { status: "pass" }
      : {
          status: "fail",
          code: "AI_CHECK_TOOL_ARGUMENT_EQUALS",
          message: `Value at ${check.path} for tool ${check.tool} did not equal expected (bounded comparison).`,
        };
  }
  if (check.operator === "oneOf") {
    const options = check.oneOf ?? [];
    if (options.length === 0) {
      return {
        status: "fail",
        code: "AI_CHECK_TOOL_ARGUMENT_INVALID_CONFIG",
        message: "oneOf operator requires a non-empty oneOf array",
      };
    }
    return options.some((option) => valuesEqual(resolved.value, option))
      ? { status: "pass" }
      : {
          status: "fail",
          code: "AI_CHECK_TOOL_ARGUMENT_ONE_OF",
          message: `Value at ${check.path} for tool ${check.tool} was not in the allowed oneOf set.`,
        };
  }
  return {
    status: "fail",
    code: "AI_CHECK_TOOL_ARGUMENT_INVALID_CONFIG",
    message: `Unsupported operator.`,
  };
}
