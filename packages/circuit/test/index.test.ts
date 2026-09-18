import { describe, expect, it } from "vitest";

import {
  evaluateSameArgsRepetition,
  evaluateSameToolRepetition,
  evaluateToolTimeout,
  runCircuits,
  type CircuitTraceEvent,
} from "../src/index.js";

const toolEvents = (count: number, args: unknown = { q: "x" }): CircuitTraceEvent[] =>
  Array.from({ length: count }, (_, index) => ({
    eventId: `e-${index}`,
    name: "tool:search",
    kind: "tool",
    attributes: { toolName: "search", arguments: args },
  }));

describe("@agent-inspect/circuit", () => {
  it("treats uppercase TOOL kind as a tool without name prefix", () => {
    const events: CircuitTraceEvent[] = Array.from({ length: 4 }, (_, index) => ({
      eventId: `e-${index}`,
      name: "retrieve_policy",
      kind: "TOOL",
      attributes: { toolName: "retrieve_policy" },
    }));
    const result = evaluateSameToolRepetition(events, 3);
    expect(result.status).toBe("open");
    expect(result.evidence[0]?.count).toBe(4);
  });

  it("does not treat explicit LOGIC kind as a tool from an ambiguous name", () => {
    const events: CircuitTraceEvent[] = Array.from({ length: 5 }, (_, index) => ({
      eventId: `e-${index}`,
      name: "tool:retrieve_policy",
      kind: "LOGIC",
    }));
    const result = evaluateSameToolRepetition(events, 3);
    expect(result.status).toBe("closed");
  });

  it("opens on same tool repetition", () => {
    const result = evaluateSameToolRepetition(toolEvents(4), 3);
    expect(result.status).toBe("open");
    expect(result.evidence[0]?.toolName).toBe("search");
  });

  it("opens on same args repetition", () => {
    const result = evaluateSameArgsRepetition(toolEvents(3, { q: "same" }), 2);
    expect(result.status).toBe("open");
  });

  it("warns on tool timeout", () => {
    const result = evaluateToolTimeout(
      [{ name: "tool:slow", kind: "tool", durationMs: 5_000, attributes: { toolName: "slow" } }],
      1_000,
    );
    expect(result.status).toBe("warn");
  });

  it("runs configured circuits", () => {
    const result = runCircuits(toolEvents(5), {
      rules: ["circuit.same-tool-repetition"],
      sameToolRepetition: { maxRepeats: 2 },
    });
    expect(result.ok).toBe(false);
    expect(result.results).toHaveLength(1);
  });
});
