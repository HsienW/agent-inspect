/**
 * Shared semantic parity summary over logical lifecycle projection.
 *
 * @experimental Available through `agent-inspect/checks`; formal TraceFacts in 6.13.
 */

import type { PersistedInspectEvent } from "../types/persisted-inspect-event.js";
import {
  projectLogicalEvents,
  resolveCanonicalToolName,
  type LogicalProjectionDiagnostic,
  type LogicalTraceEvent,
} from "./logical-events.js";

/**
 * Bounded semantic counts shared by check / contract / MCP / Evidence consumers.
 *
 * @experimental
 */
export interface SemanticParitySummary {
  readonly rawEventCount: number;
  readonly logicalEventCount: number;
  readonly runningLogicalCount: number;
  readonly finishedToolNames: readonly string[];
  readonly finishedToolCount: number;
  readonly pairedCount: number;
  readonly parentRemapCount: number;
  readonly diagnostics: readonly LogicalProjectionDiagnostic[];
}

/**
 * Summarize logical projection for cross-surface parity assertions.
 *
 * @experimental
 */
export function summarizeSemanticParity(
  events: readonly PersistedInspectEvent[],
): SemanticParitySummary {
  const projection = projectLogicalEvents(events);
  const logical = projection.logicalEvents;
  const finishedTools = logical.filter(
    (event) => event.kind === "TOOL" && event.status !== "running",
  );
  const finishedToolNames = Object.freeze(
    finishedTools.map((event) => resolveCanonicalToolName(event)).sort((a, b) => a.localeCompare(b)),
  );
  return {
    rawEventCount: events.length,
    logicalEventCount: logical.length,
    runningLogicalCount: logical.filter((event) => event.status === "running").length,
    finishedToolNames,
    finishedToolCount: finishedTools.length,
    pairedCount: logical.filter((event) => event.projection.paired).length,
    parentRemapCount: projection.diagnostics.filter(
      (item) => item.code === "AI_LOGICAL_PARENT_REMAPPED",
    ).length,
    diagnostics: projection.diagnostics,
  };
}

/**
 * Experimental TraceFacts foundation (6.13): indexes over logical events.
 *
 * Extends the 6.12.2 projection rather than introducing a parallel evaluator.
 *
 * @experimental
 */
export interface TraceFacts {
  readonly rawEvents: readonly PersistedInspectEvent[];
  readonly logicalEvents: readonly LogicalTraceEvent[];
  readonly diagnostics: readonly LogicalProjectionDiagnostic[];
  readonly toolsByName: ReadonlyMap<string, readonly LogicalTraceEvent[]>;
  readonly llmEvents: readonly LogicalTraceEvent[];
  readonly outcomeEvents: readonly LogicalTraceEvent[];
  readonly summary: SemanticParitySummary;
}

/**
 * Build TraceFacts from raw persisted events.
 *
 * @experimental
 */
export function buildTraceFacts(
  events: readonly PersistedInspectEvent[],
): TraceFacts {
  const projection = projectLogicalEvents(events);
  const toolsByName = new Map<string, LogicalTraceEvent[]>();
  const llmEvents: LogicalTraceEvent[] = [];
  const outcomeEvents: LogicalTraceEvent[] = [];

  for (const event of projection.logicalEvents) {
    if (event.kind === "TOOL" && event.status !== "running") {
      const name = resolveCanonicalToolName(event);
      const list = toolsByName.get(name) ?? [];
      list.push(event);
      toolsByName.set(name, list);
    }
    if (event.kind === "LLM" && event.status !== "running") {
      llmEvents.push(event);
    }
    if (event.kind === "OUTCOME") {
      outcomeEvents.push(event);
    }
  }

  for (const [name, list] of [...toolsByName.entries()]) {
    toolsByName.set(name, Object.freeze([...list]) as LogicalTraceEvent[]);
  }

  return {
    rawEvents: Object.freeze([...events]),
    logicalEvents: projection.logicalEvents,
    diagnostics: projection.diagnostics,
    toolsByName,
    llmEvents: Object.freeze(llmEvents),
    outcomeEvents: Object.freeze(outcomeEvents),
    summary: summarizeSemanticParity(events),
  };
}
