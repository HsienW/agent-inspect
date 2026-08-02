/**
 * Blessed NestJS + LangGraph-shaped local recipe (no Nest/LangGraph runtime).
 *
 * Demonstrates env-gated lazy callbacks, metadata-only capture, and a completed
 * LangGraph-shaped callback envelope without API keys or network I/O.
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { readTraceEvents } from "agent-inspect/advanced";

import {
  createAgentInspectCallbacks,
  isAgentInspectEnabled,
} from "./agent-inspect-callbacks.js";

const recipeRoot = process.cwd();
const relativeTraceDir = ".agent-inspect/langchain";
const absoluteTraceDir = path.join(recipeRoot, relativeTraceDir);
const runId = "run_nestjs_langgraph_recipe";

process.env.AGENT_INSPECT = process.env.AGENT_INSPECT ?? "1";

await rm(absoluteTraceDir, { recursive: true, force: true });
await mkdir(absoluteTraceDir, { recursive: true });

function serialized(name: string) {
  return {
    lc: 1,
    type: "constructor" as const,
    id: ["langgraph", name],
    name,
    kwargs: {},
  };
}

// When AGENT_INSPECT is unset/false, createAgentInspectCallbacks() returns [] —
// Nest production paths that spread the array stay behavior-identical.
if (!isAgentInspectEnabled()) {
  console.log("AGENT_INSPECT disabled — no callback adapter loaded.");
  process.exit(0);
}

const callbacks = await createAgentInspectCallbacks({
  runId,
  runName: "nestjs-langgraph-local",
  traceDir: relativeTraceDir,
});

if (callbacks.length !== 1) {
  throw new Error("Expected one AgentInspect callback when AGENT_INSPECT=1");
}

const cb = callbacks[0]!;

// LangGraph-shaped: parentRunId present on start and end (standalone completion).
await cb.handleChainStart(
  serialized("CompiledStateGraph") as never,
  { messages: ["do not persist this payload"] } as never,
  "node-1" as never,
  "external-root" as never,
  ["langgraph"] as never,
  {
    langgraph: {
      graphId: "nestjs-support-graph",
      graphName: "NestSupportGraph",
      threadId: "thread-nestjs-1",
    },
  } as never,
  "support_graph" as never,
);
await cb.handleToolStart(
  serialized("lookupTool") as never,
  "lookup" as never,
  "tool-1" as never,
  "node-1" as never,
  ["tool"] as never,
  { toolName: "lookup_docs" } as never,
  "lookup_docs" as never,
);
await cb.handleToolEnd({ ok: true } as never, "tool-1" as never, "node-1" as never);
await cb.handleChainEnd({ ok: true } as never, "node-1" as never, "external-root" as never);
await cb.close?.();

const diagnostics = cb.getDiagnostics?.() ?? {};
const events = await readTraceEvents(runId, absoluteTraceDir);
const eventNames = events.map((event) => event.event);
const eventsJson = JSON.stringify(events);

console.log("NestJS/LangGraph recipe complete");
console.log(`  enabled: ${isAgentInspectEnabled()}`);
console.log(`  callbacks: ${callbacks.length}`);
console.log(`  relativeTraceDir: ${relativeTraceDir}`);
console.log(`  events: ${eventNames.join(", ")}`);
console.log(`  run_completed: ${eventNames.includes("run_completed")}`);
console.log(`  absolute path leaked: ${eventsJson.includes(absoluteTraceDir)}`);
console.log(`  diagnostics.finalized: ${String(diagnostics.finalized)}`);
console.log(`  diagnostics.lateEventCount: ${String(diagnostics.lateEventCount ?? 0)}`);
console.log("");
console.log("Inspect:");
console.log(
  `  npx agent-inspect list --dir ./examples/recipes/nestjs-langgraph-local/${relativeTraceDir}`,
);
console.log(
  `  npx agent-inspect view ${runId} --dir ./examples/recipes/nestjs-langgraph-local/${relativeTraceDir}`,
);

if (!eventNames.includes("run_completed")) {
  throw new Error("Expected run_completed for LangGraph-shaped callbacks");
}
if (eventsJson.includes(absoluteTraceDir)) {
  throw new Error("Absolute traceDir must not appear in persisted events");
}
