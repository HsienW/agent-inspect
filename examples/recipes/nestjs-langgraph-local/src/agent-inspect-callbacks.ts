/**
 * NestJS-friendly, environment-gated AgentInspect callback helper.
 *
 * - Lazy-imports `@agent-inspect/langchain` only when enabled (dev/local).
 * - Returns `[]` when disabled so production callback arrays stay unchanged.
 * - Uses metadata-only capture and a workspace-relative trace directory.
 * - Persist-by-intent: `traceDir` alone enables JSONL persistence.
 */

export type AgentInspectCallbackLike = {
  handleChainStart: (...args: never[]) => Promise<void>;
  handleChainEnd: (...args: never[]) => Promise<void>;
  handleToolStart: (...args: never[]) => Promise<void>;
  handleToolEnd: (...args: never[]) => Promise<void>;
  flush?: () => Promise<void>;
  finalize?: (options?: { status?: "success" | "error" }) => Promise<void>;
  close?: () => Promise<void>;
  getDiagnostics?: () => Record<string, unknown>;
};

export function isAgentInspectEnabled(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const value = env.AGENT_INSPECT?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

/**
 * Build the callbacks array fragment for LangGraph / LangChain invoke options.
 *
 * Usage in a Nest provider (conceptual — this recipe does not import Nest):
 *
 * ```ts
 * const callbacks = await createAgentInspectCallbacks();
 * const result = await graph.invoke(input, { callbacks });
 * await callbacks[0]?.close?.();
 * ```
 */
export async function createAgentInspectCallbacks(options: {
  runId?: string;
  runName?: string;
  traceDir?: string;
  env?: NodeJS.ProcessEnv;
} = {}): Promise<AgentInspectCallbackLike[]> {
  const env = options.env ?? process.env;
  if (!isAgentInspectEnabled(env)) {
    return [];
  }

  // Lazy import: production builds that never set AGENT_INSPECT never load the adapter.
  const { AgentInspectCallback } = await import("@agent-inspect/langchain");
  const callback = new AgentInspectCallback({
    capture: "metadata-only",
    runId: options.runId ?? `run_nestjs_langgraph_${Date.now()}`,
    runName: options.runName ?? "nestjs-langgraph",
    // Prefer relative paths so event metadata never embeds absolute machine paths.
    // Persist-by-intent: traceDir alone enables persistence.
    traceDir: options.traceDir ?? ".agent-inspect/langchain",
  });
  return [callback as unknown as AgentInspectCallbackLike];
}
