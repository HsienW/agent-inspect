/**
 * Multi-agent / swarm-shaped LangGraph callback recipe (no Nest, no LangGraph runtime).
 * Two agent graphs hand off via langGraph.handoffFrom task ids; metadata-only; local JSONL.
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

import { AgentInspectCallback } from "@agent-inspect/langchain";
import { readTraceEvents } from "agent-inspect/advanced";

const relativeTraceDir = ".agent-inspect-runs";
const traceDir = path.join(process.cwd(), relativeTraceDir);
const runId = "run_langgraph_swarm_recipe";

await rm(traceDir, { recursive: true, force: true });
await mkdir(traceDir, { recursive: true });

function serialized(name: string) {
  return {
    lc: 1,
    type: "constructor" as const,
    id: ["langgraph", name],
    name,
    kwargs: {},
  };
}

const callback = new AgentInspectCallback({
  traceDir: relativeTraceDir,
  runId,
  runName: "langgraph-swarm-local",
  capture: "metadata-only",
});

// Outer swarm envelope keeps active lifecycle until both agents finish.
await callback.handleChainStart(
  serialized("CompiledStateGraph") as never,
  {} as never,
  "swarm-root" as never,
  "LangGraph" as never,
  ["langgraph", "swarm"] as never,
  {
    langgraph: {
      graphId: "swarm-graph",
      taskId: "task-swarm",
      nodeName: "swarm",
    },
  } as never,
  "swarm_graph" as never,
);

// Planner agent (child of swarm)
await callback.handleChainStart(
  serialized("CompiledStateGraph") as never,
  {} as never,
  "planner-root" as never,
  "swarm-root" as never,
  ["langgraph", "swarm:planner"] as never,
  {
    langgraph: {
      graphId: "planner-graph",
      taskId: "task-planner",
      nodeName: "planner",
    },
  } as never,
  "planner_graph" as never,
);
await callback.handleChainEnd(
  { plan: "delegate" } as never,
  "planner-root" as never,
  "swarm-root" as never,
);

// Worker agent correlated via handoffFrom → planner taskId
await callback.handleChainStart(
  serialized("CompiledStateGraph") as never,
  {} as never,
  "worker-root" as never,
  "swarm-root" as never,
  ["langgraph", "swarm:worker"] as never,
  {
    langgraph: {
      graphId: "worker-graph",
      taskId: "task-worker",
      nodeName: "worker",
      handoffFrom: "task-planner",
    },
  } as never,
  "worker_graph" as never,
);
await callback.handleToolStart(
  serialized("DynamicStructuredTool") as never,
  "{}" as never,
  "tool-worker" as never,
  "worker-root" as never,
  ["tool"] as never,
  { toolName: "fetch_itinerary" } as never,
  "fetch_itinerary" as never,
);
await callback.handleToolEnd(
  { ok: true } as never,
  "tool-worker" as never,
  "worker-root" as never,
);
await callback.handleChainEnd(
  { ok: true } as never,
  "worker-root" as never,
  "swarm-root" as never,
);

await callback.handleChainEnd(
  { ok: true } as never,
  "swarm-root" as never,
  "LangGraph" as never,
);
await callback.close();

const events = await readTraceEvents(runId, traceDir);
const eventNames = events.map((e) => e.event);
const worker = events.find(
  (e) => e.event === "step_started" && e.name === "chain:worker_graph",
);
const tool = events.find(
  (e) => e.event === "step_started" && e.name === "tool:fetch_itinerary",
);
const diagnostics = callback.getDiagnostics();

console.log("LangGraph swarm recipe complete");
console.log(`  events: ${eventNames.join(", ")}`);
console.log(`  run_completed: ${eventNames.includes("run_completed")}`);
console.log(
  `  worker parentMapping: ${String(worker && "metadata" in worker ? worker.metadata?.parentMapping : "")}`,
);
console.log(`  tool name: ${String(tool && "name" in tool ? tool.name : "")}`);
console.log(`  diagnostics.finalized: ${String(diagnostics.finalized)}`);
console.log("");
console.log("Inspect:");
console.log(
  `  npx agent-inspect list --dir ./examples/recipes/langgraph-swarm-local/${relativeTraceDir}`,
);
console.log(
  `  npx agent-inspect view ${runId} --dir ./examples/recipes/langgraph-swarm-local/${relativeTraceDir}`,
);

if (!eventNames.includes("run_completed")) {
  throw new Error("Expected run_completed");
}
if (!tool || tool.event !== "step_started" || tool.name !== "tool:fetch_itinerary") {
  throw new Error("Expected human tool identity tool:fetch_itinerary");
}
if (
  !worker ||
  worker.event !== "step_started" ||
  worker.metadata?.parentMapping !== "langgraph-metadata"
) {
  throw new Error("Expected worker parentMapping langgraph-metadata via handoffFrom");
}
