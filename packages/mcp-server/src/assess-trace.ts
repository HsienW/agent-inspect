import { readFile } from "node:fs/promises";

import {
  createSafetyOversizedAttributeRule,
  createSafetyRawContentRule,
  createSafetyRedactionRule,
  createSafetySecretPatternRule,
  runTraceChecks,
  type TraceCheckFinding,
} from "agent-inspect/checks";
import { openTrace } from "agent-inspect/readers";
import { redact, type RedactionProfile } from "@agent-inspect/redact";

const DEFAULT_MAX_STRING_LENGTH = 16_384;
const DEFAULT_MAX_ARRAY_LENGTH = 1_000;
const DEFAULT_MAX_OBJECT_KEYS = 200;
const DEFAULT_MAX_SERIALIZED_BYTES = 128 * 1024;

function buildMcpSafetyRules() {
  return [
    createSafetyRawContentRule(),
    createSafetyRedactionRule(),
    createSafetySecretPatternRule(),
    createSafetyOversizedAttributeRule({
      maxStringLength: DEFAULT_MAX_STRING_LENGTH,
      maxArrayLength: DEFAULT_MAX_ARRAY_LENGTH,
      maxObjectKeys: DEFAULT_MAX_OBJECT_KEYS,
      maxSerializedBytes: DEFAULT_MAX_SERIALIZED_BYTES,
    }),
  ];
}

export type McpTraceSafetyStatus =
  | "SAFE"
  | "SAFE WITH WARNINGS"
  | "UNSAFE"
  | "UNKNOWN";

export interface McpTraceSafetyAssessment {
  status: McpTraceSafetyStatus;
  errors: number;
  warnings: number;
  findings: number;
  sourceStatus?: McpTraceSafetyStatus;
}

function statusFrom(
  findings: readonly TraceCheckFinding[],
  hasErrors: boolean,
): McpTraceSafetyStatus {
  if (hasErrors) return "UNKNOWN";
  if (findings.some((item) => item.severity === "error")) return "UNSAFE";
  if (findings.some((item) => item.severity === "warning")) return "SAFE WITH WARNINGS";
  return "SAFE";
}

function redactJsonl(content: string, profile: RedactionProfile): string {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (
        parsed !== null &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        ("schemaVersion" in parsed || "eventId" in parsed || "runId" in parsed)
      ) {
        // single-line JSONL — fall through to line mode
      } else {
        const result = redact(parsed, { profile });
        return `${JSON.stringify(result.value)}\n`;
      }
    } catch {
      // fall through
    }
  }

  const lines = content.split(/\r?\n/);
  const out: string[] = [];
  for (const line of lines) {
    if (line.trim() === "") continue;
    const parsed = JSON.parse(line) as unknown;
    const result = redact(parsed, { profile });
    out.push(JSON.stringify(result.value));
  }
  return out.length === 0 ? "" : `${out.join("\n")}\n`;
}

/**
 * Assess trace safety for MCP (mirrors CLI scan rules on the opened read).
 */
export function assessTraceForMcp(
  read: Awaited<ReturnType<typeof openTrace>>,
  runId: string,
): McpTraceSafetyAssessment {
  const rules = buildMcpSafetyRules();
  const checkResult = runTraceChecks({ read }, { rules, runId });
  const hasErrors = checkResult.diagnostics.some((item) => item.severity === "error");
  const status = statusFrom(checkResult.findings, hasErrors);
  return {
    status,
    errors:
      checkResult.diagnostics.filter((item) => item.severity === "error").length +
      checkResult.findings.filter((item) => item.severity === "error").length,
    warnings:
      checkResult.diagnostics.filter((item) => item.severity === "warning").length +
      checkResult.findings.filter((item) => item.severity === "warning").length,
    findings: checkResult.findings.length,
  };
}

/**
 * Source + redacted-artifact assessment for MCP share-safe bundle gating (6.9 parity).
 */
export async function assessTraceArtifactForMcp(options: {
  read: Awaited<ReturnType<typeof openTrace>>;
  runId: string;
  filePath: string;
  profile: RedactionProfile;
}): Promise<McpTraceSafetyAssessment> {
  const source = assessTraceForMcp(options.read, options.runId);
  try {
    const raw = await readFile(options.filePath, "utf-8");
    const redacted = redactJsonl(raw, options.profile);
    const artifactRead = await openTrace(
      { type: "string", content: redacted },
      { format: "agent-inspect-jsonl" },
    );
    const artifact = assessTraceForMcp(artifactRead, options.runId);
    return {
      ...artifact,
      sourceStatus: source.status,
    };
  } catch {
    return {
      status: "UNKNOWN",
      errors: Math.max(1, source.errors),
      warnings: source.warnings,
      findings: source.findings,
      sourceStatus: source.status,
    };
  }
}
