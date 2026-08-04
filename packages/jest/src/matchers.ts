/**
 * Experimental Jest matchers for AgentInspect TraceFacts / TraceContract.
 *
 * @experimental Part of the v6.13 TraceFacts train.
 */

import {
  buildTraceFacts,
  defineTraceContract,
  evaluateTraceContract,
  type TraceCheckInput,
  type TraceContractInput,
} from "agent-inspect/checks";

type TraceLike =
  | TraceCheckInput
  | { readonly events: TraceCheckInput["read"]["events"] }
  | TraceCheckInput["read"]["events"];

function eventsFrom(trace: TraceLike): TraceCheckInput["read"]["events"] {
  if (Array.isArray(trace)) return trace;
  if ("read" in trace && trace.read?.events) return trace.read.events;
  if ("events" in trace && Array.isArray(trace.events)) return trace.events;
  return [];
}

function inputFrom(trace: TraceLike): TraceCheckInput | undefined {
  if (!Array.isArray(trace) && "read" in trace && trace.read) {
    return trace as TraceCheckInput;
  }
  return undefined;
}

export const agentInspectJestMatchers = {
  toPassTraceContract(received: TraceLike, contract: TraceContractInput) {
    const input = inputFrom(received);
    if (!input) {
      return {
        pass: false,
        message: () =>
          "toPassTraceContract expects TraceCheckInput ({ read }) so evaluateTraceContract can run.",
      };
    }
    const result = evaluateTraceContract(input, defineTraceContract(contract));
    return {
      pass: result.status === "pass",
      message: () =>
        result.status === "pass"
          ? "expected trace contract to fail"
          : `expected trace contract to pass; findings=${JSON.stringify(
              result.findings.filter((f) => f.status === "fail").map((f) => f.ruleId),
            )}`,
    };
  },
  toHaveRequiredTool(received: TraceLike, toolName: string) {
    const facts = buildTraceFacts(eventsFrom(received));
    const pass = facts.toolsByName.has(toolName);
    return {
      pass,
      message: () =>
        pass
          ? `expected tool ${toolName} to be absent`
          : `expected required tool ${toolName}; found=${JSON.stringify([
              ...facts.toolsByName.keys(),
            ])}`,
    };
  },
};

export type { TraceContractInput };
