import {
  createRunId,
  createStepId,
  getCurrentRunId,
  getTraceDirFromContext,
  hasActiveContext,
  initializeTraceFile,
  prepareTraceEventForDisk,
  resolveTraceDir,
  resolveTraceSafetyOptions,
  writeTraceEvent,
  type InspectKind,
  type StepMetadata,
  type StepType,
  type TraceEvent,
} from "agent-inspect/advanced";
import type { RedactionRule } from "agent-inspect/logs";
import {
  beginCallbackRun,
  canScheduleFinalize,
  createInvocationState,
  endCallbackRun,
  markEnvelopeStarted,
  markFinalized,
  noteTerminalError,
  resetInvocationState,
  type AdapterInvocationState,
} from "./invocation-state.js";

export interface LangChainTracePersistenceOptions {
  runName?: string;
  traceDir?: string;
  runId?: string;
  redact?: RedactionRule[];
  silent?: boolean;
  maxPreviewChars?: number;
}

function kindToStepType(kind: InspectKind): StepType {
  switch (kind) {
    case "LLM":
      return "llm";
    case "TOOL":
      return "tool";
    case "DECISION":
      return "decision";
    default:
      return "logic";
  }
}

function toStepMetadata(attrs: Record<string, unknown>): StepMetadata {
  const out: StepMetadata = {
    adapter: "langchain",
    confidence: "explicit",
  };
  for (const [k, v] of Object.entries(attrs)) {
    out[k] = v;
  }
  return out;
}

/**
 * Maps LangChain callback lifecycle to schemaVersion "0.1" manual JSONL events.
 * One callback session creates one standalone run; inside inspectRun, steps append to the active run.
 *
 * Standalone envelope completion is driven by {@link AdapterInvocationState}
 * (activeRuns / completionGeneration / finalized) — not by empty parentRunId heuristics.
 */
export class LangChainTracePersistence {
  readonly #traceDir: string;
  #runId: string;
  readonly #runName: string;
  readonly #standalone: boolean;
  readonly #silent: boolean;
  readonly #safety: ReturnType<typeof resolveTraceSafetyOptions>;
  readonly #lifecycle: AdapterInvocationState;
  readonly #lcToStepId = new Map<string, string>();
  #lateEventCount = 0;

  constructor(options: LangChainTracePersistenceOptions = {}) {
    const inContext = hasActiveContext();
    this.#standalone = !inContext;
    this.#silent = options.silent ?? false;
    this.#traceDir = inContext
      ? (getTraceDirFromContext() ?? resolveTraceDir({ dir: options.traceDir }))
      : resolveTraceDir({ dir: options.traceDir });
    const contextRunId = inContext ? getCurrentRunId() : undefined;
    this.#runId = contextRunId ?? options.runId ?? createRunId();
    this.#runName = options.runName ?? "langchain-agent";
    this.#safety = resolveTraceSafetyOptions({
      redact: options.redact ? { rules: options.redact } : true,
      maxPreviewLength: options.maxPreviewChars,
    });
    this.#lifecycle = createInvocationState(this.#runId);
  }

  get runId(): string {
    return this.#runId;
  }

  get traceDir(): string {
    return this.#traceDir;
  }

  /** @internal Test / diagnostics access to per-invocation lifecycle. */
  get lifecycle(): Readonly<AdapterInvocationState> {
    return this.#lifecycle;
  }

  /** Count of end/start events ignored after finalize (diagnostics). */
  get lateEventCount(): number {
    return this.#lateEventCount;
  }

  /**
   * Start a fresh envelope after a prior invocation finalized (callback reuse).
   * Allocates a new run id unless still nested in an inspectRun context.
   */
  beginNewInvocation(): void {
    if (hasActiveContext()) {
      const ctxId = getCurrentRunId();
      if (ctxId) {
        this.#runId = ctxId;
        resetInvocationState(this.#lifecycle, this.#runId);
        this.#lcToStepId.clear();
        this.#lateEventCount = 0;
        return;
      }
    }
    this.#runId = createRunId();
    resetInvocationState(this.#lifecycle, this.#runId);
    this.#lcToStepId.clear();
    this.#lateEventCount = 0;
  }

  reset(): void {
    resetInvocationState(this.#lifecycle);
    this.#lcToStepId.clear();
    this.#lateEventCount = 0;
  }

  /** Rotate when a prior standalone invocation already finalized. */
  #prepareForStart(): void {
    if (this.#standalone && this.#lifecycle.finalized) {
      this.beginNewInvocation();
    }
  }

  /**
   * @deprecated Root-ID heuristics are no longer used for envelope completion.
   * Retained as a no-op for call-site compatibility during the v6.8 train.
   */
  noteRoot(_lcRunId: string, _parentRunId?: string): void {
    // Intentionally empty — completion uses activeRuns lifecycle state.
  }

  resolveParentId(lcParentRunId?: string): string | undefined {
    if (!lcParentRunId) return undefined;
    return this.#lcToStepId.get(lcParentRunId);
  }

  async onStepStart(params: {
    lcRunId: string;
    lcParentRunId?: string;
    name: string;
    kind: InspectKind;
    startTime: number;
    attributes: Record<string, unknown>;
  }): Promise<void> {
    try {
      this.#prepareForStart();
      const stepId = createStepId();
      this.#lcToStepId.set(params.lcRunId, stepId);
      beginCallbackRun(this.#lifecycle, {
        lcRunId: params.lcRunId,
        parentLcRunId: params.lcParentRunId,
        startedAt: params.startTime,
        kind: params.kind,
        stepId,
      });

      if (this.#standalone && !this.#lifecycle.envelopeStarted) {
        await this.#ensureRunStarted(params.startTime, params.attributes);
      }

      const parentId = this.resolveParentId(params.lcParentRunId);
      const metadata = toStepMetadata(params.attributes);
      if (params.lcParentRunId && !parentId) {
        metadata.parentMapping = "unresolved";
        metadata.unresolvedParentRunId = params.lcParentRunId;
      }
      if (
        params.lcParentRunId &&
        this.#lifecycle.knownRelationships.get(params.lcRunId) === params.lcParentRunId
      ) {
        metadata.parentConfidence = "explicit";
      }

      const event: TraceEvent = {
        schemaVersion: "0.1",
        event: "step_started",
        timestamp: params.startTime,
        runId: this.#runId,
        stepId,
        ...(parentId ? { parentId } : {}),
        name: params.name,
        type: kindToStepType(params.kind),
        startTime: params.startTime,
        metadata,
      };

      await this.#write(event);
    } catch (err) {
      this.#warn(err);
    }
  }

  async onStepEnd(params: {
    lcRunId: string;
    lcParentRunId?: string;
    endTime: number;
    durationMs?: number;
    status: "success" | "error";
    errorMessage?: string;
    completionAttributes?: Record<string, unknown>;
  }): Promise<void> {
    try {
      if (
        this.#lifecycle.finalized &&
        !this.#lifecycle.activeRuns.has(params.lcRunId) &&
        !this.#lcToStepId.has(params.lcRunId)
      ) {
        this.#lateEventCount += 1;
        return;
      }

      let stepId = this.#lcToStepId.get(params.lcRunId);
      if (!stepId && params.completionAttributes) {
        if (this.#lifecycle.finalized) {
          this.#lateEventCount += 1;
          return;
        }
        stepId = createStepId();
        this.#lcToStepId.set(params.lcRunId, stepId);
        beginCallbackRun(this.#lifecycle, {
          lcRunId: params.lcRunId,
          parentLcRunId: params.lcParentRunId,
          startedAt: params.endTime - (params.durationMs ?? 0),
          kind:
            (params.completionAttributes.kind as InspectKind | undefined) ?? "LLM",
          stepId,
        });
        const parentId = this.resolveParentId(params.lcParentRunId);
        const metadata = toStepMetadata(params.completionAttributes);
        if (params.lcParentRunId && !parentId) {
          metadata.parentMapping = "unresolved";
          metadata.unresolvedParentRunId = params.lcParentRunId;
        }
        const startTime = params.endTime - (params.durationMs ?? 0);
        const started: TraceEvent = {
          schemaVersion: "0.1",
          event: "step_started",
          timestamp: startTime,
          runId: this.#runId,
          stepId,
          ...(parentId ? { parentId } : {}),
          name: String(params.completionAttributes.name ?? "llm:llm"),
          type: kindToStepType(
            (params.completionAttributes.kind as InspectKind | undefined) ?? "LLM",
          ),
          startTime,
          metadata,
        };
        if (this.#standalone && !this.#lifecycle.envelopeStarted) {
          await this.#ensureRunStarted(startTime, params.completionAttributes);
        }
        await this.#write(started);
      }
      if (!stepId) return;

      const durationMs =
        typeof params.durationMs === "number" && Number.isFinite(params.durationMs)
          ? Math.max(0, Math.floor(params.durationMs))
          : Math.max(
              0,
              params.endTime - (this.#lifecycle.runStartTime ?? params.endTime),
            );

      const event: TraceEvent = {
        schemaVersion: "0.1",
        event: "step_completed",
        timestamp: params.endTime,
        runId: this.#runId,
        stepId,
        status: params.status,
        endTime: params.endTime,
        durationMs,
        ...(params.status === "error" && params.errorMessage
          ? { error: { message: params.errorMessage } }
          : {}),
      };

      await this.#write(event);

      if (params.status === "error") {
        noteTerminalError(
          this.#lifecycle,
          params.errorMessage ?? "adapter step error",
        );
      }
      endCallbackRun(this.#lifecycle, params.lcRunId);
      await this.#scheduleStandaloneFinalization(params.endTime);
    } catch (err) {
      this.#warn(err);
    }
  }

  /** Point-in-time adapter events (e.g. agent action) — writes start + completed pair. */
  async onInstantStep(params: {
    lcRunId: string;
    lcParentRunId?: string;
    name: string;
    kind: InspectKind;
    timestamp: number;
    attributes: Record<string, unknown>;
    status: "success" | "error";
    errorMessage?: string;
  }): Promise<void> {
    try {
      this.#prepareForStart();
      const stepId = createStepId();
      this.#lcToStepId.set(params.lcRunId, stepId);
      beginCallbackRun(this.#lifecycle, {
        lcRunId: params.lcRunId,
        parentLcRunId: params.lcParentRunId,
        startedAt: params.timestamp,
        kind: params.kind,
        stepId,
      });

      if (this.#standalone && !this.#lifecycle.envelopeStarted) {
        await this.#ensureRunStarted(params.timestamp, params.attributes);
      }

      const parentId = this.resolveParentId(params.lcParentRunId);
      const metadata = toStepMetadata(params.attributes);
      if (params.lcParentRunId && !parentId) {
        metadata.parentMapping = "unresolved";
        metadata.unresolvedParentRunId = params.lcParentRunId;
      }

      const started: TraceEvent = {
        schemaVersion: "0.1",
        event: "step_started",
        timestamp: params.timestamp,
        runId: this.#runId,
        stepId,
        ...(parentId ? { parentId } : {}),
        name: params.name,
        type: kindToStepType(params.kind),
        startTime: params.timestamp,
        metadata,
      };
      await this.#write(started);

      const completed: TraceEvent = {
        schemaVersion: "0.1",
        event: "step_completed",
        timestamp: params.timestamp,
        runId: this.#runId,
        stepId,
        status: params.status,
        endTime: params.timestamp,
        durationMs: 0,
        ...(params.status === "error" && params.errorMessage
          ? { error: { message: params.errorMessage } }
          : {}),
      };
      await this.#write(completed);

      if (params.status === "error") {
        noteTerminalError(
          this.#lifecycle,
          params.errorMessage ?? "adapter step error",
        );
      }
      endCallbackRun(this.#lifecycle, params.lcRunId);
      await this.#scheduleStandaloneFinalization(params.timestamp);
    } catch (err) {
      this.#warn(err);
    }
  }

  /**
   * When the last active LangChain callback ends, yield one microtask so a
   * same-turn sibling start can cancel finalization, then write run_completed
   * before the callback promise settles. Unresolved external parents do not
   * block the envelope.
   */
  async #scheduleStandaloneFinalization(endTime: number): Promise<void> {
    if (!this.#standalone || !canScheduleFinalize(this.#lifecycle)) return;

    const generation = this.#lifecycle.completionGeneration;
    await Promise.resolve();
    if (this.#lifecycle.completionGeneration !== generation) return;
    if (!this.#standalone || !canScheduleFinalize(this.#lifecycle)) return;

    const status = this.#lifecycle.terminalError ? "error" : "success";
    await this.#ensureRunCompleted(
      endTime,
      status,
      status === "error" ? this.#lifecycle.terminalError?.message : undefined,
    );
  }

  async #ensureRunStarted(
    startTime: number,
    attrs: Record<string, unknown>,
  ): Promise<void> {
    if (!markEnvelopeStarted(this.#lifecycle, startTime)) return;

    await initializeTraceFile(this.#runId, this.#traceDir);

    const metadata: Record<string, unknown> = {
      adapter: "langchain",
      confidence: "explicit",
    };
    if (attrs.langchainRunId) metadata.langchainRunId = attrs.langchainRunId;
    if (attrs.adapterRunName) metadata.adapterRunName = attrs.adapterRunName;

    const event: TraceEvent = {
      schemaVersion: "0.1",
      event: "run_started",
      timestamp: startTime,
      runId: this.#runId,
      name: this.#runName,
      startTime,
      metadata,
    };
    await this.#write(event);
  }

  async #ensureRunCompleted(
    endTime: number,
    stepStatus: "success" | "error",
    errorMessage?: string,
  ): Promise<void> {
    if (!markFinalized(this.#lifecycle)) return;

    const startTime = this.#lifecycle.runStartTime ?? endTime;
    const durationMs = Math.max(0, endTime - startTime);
    const runStatus = stepStatus === "error" ? "error" : "success";

    const event: TraceEvent = {
      schemaVersion: "0.1",
      event: "run_completed",
      timestamp: endTime,
      runId: this.#runId,
      status: runStatus,
      endTime,
      durationMs,
      ...(runStatus === "error" && errorMessage
        ? { error: { message: errorMessage } }
        : {}),
    };
    await this.#write(event);
  }

  async #write(event: TraceEvent): Promise<void> {
    const safe = prepareTraceEventForDisk(event, this.#safety);
    await writeTraceEvent(safe, this.#traceDir);
  }

  #warn(err: unknown): void {
    if (!this.#silent) {
      console.error("[agent-inspect:langchain]", err);
    }
  }
}
