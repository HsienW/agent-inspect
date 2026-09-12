import { buildTraceFacts, deriveRelationshipFacts } from "agent-inspect/checks";

function event(eventId: string, overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: "0.2" as const,
    eventId,
    runId: "run-mcp",
    kind: "LOGIC" as const,
    name: eventId,
    status: "ok" as const,
    timestamp: "2026-09-12T10:00:00.000Z",
    confidence: "explicit" as const,
    source: { type: "manual" as const },
    ...overrides,
  };
}

function evaluate(propagated: boolean): "LINKED" | "UNLINKED" {
  const traceId = "4bf92f3577b34da6a3ce929d0e0e4736";
  const spanId = "00f067aa0ba902b7";
  const intent = event("intent", {
    kind: "AGENT",
    attributes: {
      operationId: "intent-1",
      ...(propagated
        ? {
            traceparent: `00-${traceId}-${spanId}-01`,
            "trace.traceId": traceId,
            "trace.spanId": spanId,
          }
        : {}),
    },
  });
  const tool = event("mcp-tool", {
    kind: "TOOL",
    name: "tool:lookup",
    attributes: {
      toolName: "lookup",
      toolCallId: "call-1",
      mcpToolCallId: "mcp-call-1",
      operationId: "intent-1",
      attemptNumber: 1,
      ...(propagated
        ? {
            traceparent: `00-${traceId}-${spanId}-01`,
            "trace.traceId": traceId,
            sourceLineage: "intent",
          }
        : {}),
    },
  });
  const facts = buildTraceFacts([intent, tool]);
  const lineage = deriveRelationshipFacts([intent, tool]).relationships.filter(
    (edge) => edge.type === "source-lineage" || edge.type === "attempt-of",
  );
  const linked =
    propagated &&
    lineage.some((edge) => edge.externalRef === "intent" || edge.externalRef === "intent-1") &&
    facts.relationships.length > 0;
  return linked ? "LINKED" : "UNLINKED";
}

console.log(`propagated ${evaluate(true)}`);
console.log(`unpropagated ${evaluate(false)}`);
