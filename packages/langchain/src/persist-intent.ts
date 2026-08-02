/**
 * Persist-by-intent resolution for AgentInspectCallback.
 *
 * @experimental Part of the v6.8 fidelity contract.
 */

export interface PersistIntentInput {
  readonly persist?: boolean;
  readonly traceDir?: string;
}

export interface PersistIntent {
  readonly persist: boolean;
  /** True when traceDir was set while persist was explicitly false. */
  readonly contradictory: boolean;
}

/**
 * - traceDir provided + persist omitted → persist
 * - traceDir absent + persist omitted → in-memory
 * - persist false → in-memory (even if traceDir set)
 * - persist true → persist (default or supplied dir)
 */
export function resolvePersistIntent(input: PersistIntentInput): PersistIntent {
  const hasTraceDir =
    typeof input.traceDir === "string" && input.traceDir.trim().length > 0;
  const explicit = input.persist;

  if (explicit === false) {
    return { persist: false, contradictory: hasTraceDir };
  }
  if (explicit === true) {
    return { persist: true, contradictory: false };
  }
  return { persist: hasTraceDir, contradictory: false };
}
