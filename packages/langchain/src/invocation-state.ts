/**
 * Per-invocation lifecycle state for LangChain/LangGraph callback persistence.
 *
 * @experimental Part of the v6.8 fidelity contract. Subject to refinement.
 * @see docs/LANGGRAPH-FIDELITY.md
 */

export interface ActiveCallbackRun {
  readonly lcRunId: string;
  readonly parentLcRunId?: string;
  readonly startedAt: number;
  stepId?: string;
  kind?: string;
}

export interface PendingRelationship {
  readonly childLcRunId: string;
  readonly parentLcRunId: string;
  readonly reason: "unobserved-parent";
}

export interface StructuredAdapterError {
  readonly message: string;
}

/**
 * One AgentInspect envelope (standalone invocation) of callback activity.
 */
export interface AdapterInvocationState {
  envelopeRunId: string;
  readonly activeRuns: Map<string, ActiveCallbackRun>;
  readonly endedRuns: Set<string>;
  /** childLcRunId → parentLcRunId when the parent was an observed callback run. */
  readonly knownRelationships: Map<string, string>;
  readonly pendingRelationships: PendingRelationship[];
  terminalError?: StructuredAdapterError;
  /** Bumped on each start/end that invalidates a deferred finalize. */
  completionGeneration: number;
  envelopeStarted: boolean;
  finalized: boolean;
  runStartTime?: number;
}

export function createInvocationState(envelopeRunId: string): AdapterInvocationState {
  return {
    envelopeRunId,
    activeRuns: new Map(),
    endedRuns: new Set(),
    knownRelationships: new Map(),
    pendingRelationships: [],
    completionGeneration: 0,
    envelopeStarted: false,
    finalized: false,
  };
}

/** True when `parentLcRunId` matches a callback run already observed in this invocation. */
export function isObservedCallbackRun(
  state: AdapterInvocationState,
  parentLcRunId: string,
): boolean {
  return state.activeRuns.has(parentLcRunId) || state.endedRuns.has(parentLcRunId);
}

/**
 * Record a callback start. Bumps completion generation.
 * Explicit parents are recorded only when the parent run was already observed.
 */
export function beginCallbackRun(
  state: AdapterInvocationState,
  input: {
    lcRunId: string;
    parentLcRunId?: string;
    startedAt: number;
    kind?: string;
    stepId?: string;
  },
): ActiveCallbackRun {
  state.completionGeneration += 1;
  const run: ActiveCallbackRun = {
    lcRunId: input.lcRunId,
    ...(input.parentLcRunId !== undefined ? { parentLcRunId: input.parentLcRunId } : {}),
    startedAt: input.startedAt,
    ...(input.kind !== undefined ? { kind: input.kind } : {}),
    ...(input.stepId !== undefined ? { stepId: input.stepId } : {}),
  };
  state.activeRuns.set(input.lcRunId, run);

  if (input.parentLcRunId !== undefined) {
    if (isObservedCallbackRun(state, input.parentLcRunId)) {
      state.knownRelationships.set(input.lcRunId, input.parentLcRunId);
    } else {
      state.pendingRelationships.push({
        childLcRunId: input.lcRunId,
        parentLcRunId: input.parentLcRunId,
        reason: "unobserved-parent",
      });
    }
  }

  return run;
}

/**
 * Record a callback end. Returns false when the run was not active (late/duplicate end).
 * Bumps completion generation when a live run ends.
 */
export function endCallbackRun(
  state: AdapterInvocationState,
  lcRunId: string,
): { ended: boolean; late: boolean } {
  const active = state.activeRuns.get(lcRunId);
  if (active === undefined) {
    if (state.endedRuns.has(lcRunId) || state.finalized) {
      return { ended: false, late: true };
    }
    // End without a prior start — treat as late/orphan for diagnostics (caller may synthesize).
    return { ended: false, late: true };
  }

  state.completionGeneration += 1;
  state.activeRuns.delete(lcRunId);
  state.endedRuns.add(lcRunId);
  return { ended: true, late: false };
}

export function markEnvelopeStarted(
  state: AdapterInvocationState,
  startTime: number,
): boolean {
  if (state.envelopeStarted) return false;
  state.envelopeStarted = true;
  state.runStartTime = startTime;
  return true;
}

/** Idempotent finalize mark. Returns true the first time finalize is accepted. */
export function markFinalized(state: AdapterInvocationState): boolean {
  if (state.finalized) return false;
  if (!state.envelopeStarted) return false;
  state.finalized = true;
  return true;
}

export function noteTerminalError(
  state: AdapterInvocationState,
  message: string,
): void {
  state.terminalError = { message };
}

export function canScheduleFinalize(state: AdapterInvocationState): boolean {
  return (
    state.envelopeStarted &&
    !state.finalized &&
    state.activeRuns.size === 0
  );
}

export function bumpCompletionGeneration(state: AdapterInvocationState): number {
  state.completionGeneration += 1;
  return state.completionGeneration;
}

export function resetInvocationState(
  state: AdapterInvocationState,
  nextEnvelopeRunId?: string,
): void {
  state.activeRuns.clear();
  state.endedRuns.clear();
  state.knownRelationships.clear();
  state.pendingRelationships.length = 0;
  state.terminalError = undefined;
  state.completionGeneration += 1;
  state.envelopeStarted = false;
  state.finalized = false;
  state.runStartTime = undefined;
  if (nextEnvelopeRunId !== undefined) {
    state.envelopeRunId = nextEnvelopeRunId;
  }
}
