/**
 * Human-meaningful tool identity vs implementation class.
 *
 * @experimental Part of the v6.8 fidelity contract.
 * @see docs/LANGGRAPH-FIDELITY.md
 */

import type { Serialized } from "@langchain/core/load/serializable";

export interface ToolIdentity {
  /** Human display name used in `tool:<name>` step labels. */
  readonly displayName: string;
  /** Same as displayName; canonical attribute for contracts/search. */
  readonly toolName: string;
  /** Serialized implementation class / id (e.g. DynamicStructuredTool). */
  readonly toolClass?: string;
  readonly toolCallId?: string;
  /** Original LangChain `runName` when present. */
  readonly frameworkRunName?: string;
}

function serializedLabel(s: Serialized): string | undefined {
  if (typeof s.name === "string" && s.name.trim()) return s.name.trim();
  if (Array.isArray(s.id) && s.id.length > 0) {
    const last = s.id[s.id.length - 1];
    if (typeof last === "string" && last.trim()) return last.trim();
  }
  return typeof s.type === "string" && s.type.trim() ? s.type.trim() : undefined;
}

function nonEmpty(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Precedence: runName → metadata.toolName → metadata.tool → serialized name → unknown-tool.
 * Implementation class is preserved separately when it differs from the display name.
 */
export function resolveToolIdentity(
  tool: Serialized,
  runName?: string,
  metadata?: Record<string, unknown>,
  toolCallId?: string,
): ToolIdentity {
  const frameworkRunName = nonEmpty(runName);
  const metaToolName = nonEmpty(metadata?.toolName);
  const metaTool = nonEmpty(metadata?.tool);
  const classLabel = serializedLabel(tool);
  const callId =
    nonEmpty(toolCallId) ??
    nonEmpty(metadata?.toolCallId) ??
    nonEmpty(metadata?.tool_call_id);

  const displayName =
    frameworkRunName ?? metaToolName ?? metaTool ?? classLabel ?? "unknown-tool";

  return {
    displayName,
    toolName: displayName,
    ...(classLabel && classLabel !== displayName ? { toolClass: classLabel } : {}),
    ...(callId ? { toolCallId: callId } : {}),
    ...(frameworkRunName ? { frameworkRunName } : {}),
  };
}

/** Attach identity fields onto step attributes (mutates). */
export function applyToolIdentityAttributes(
  attrs: Record<string, unknown>,
  identity: ToolIdentity,
): void {
  attrs.tool = identity.displayName;
  attrs.toolName = identity.toolName;
  if (identity.toolClass) attrs.toolClass = identity.toolClass;
  if (identity.toolCallId) attrs.toolCallId = identity.toolCallId;
  if (identity.frameworkRunName) attrs.frameworkRunName = identity.frameworkRunName;
}
