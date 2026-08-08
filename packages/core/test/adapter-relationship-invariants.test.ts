/**
 * 6.15-1 — Adapter relationship invariants over LangGraph conformance fixtures.
 *
 * Positive corpus must remain acyclic after projection with all started steps
 * visible. Defect / legacy shapes (self-parent, two-node cycle) must normalize
 * without hiding nodes.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  createStructureCycleRule,
  projectLogicalEvents,
  runTraceChecks,
} from "../src/checks/index.js";
import { linkNodesVisibilityFirst } from "../src/logs/tree-builder.js";
import { openTrace } from "../src/readers/index.js";
import type { InspectNode } from "../src/types/inspect-event.js";

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/langgraph",
);

const POSITIVE = [
  "conformance-unresolved-external.jsonl",
  "conformance-multiple-roots.jsonl",
  "conformance-synthetic-group.jsonl",
  "conformance-nested-subgraph.jsonl",
  "parallel-children.jsonl",
  "deep-swarm-nested-ok.jsonl",
] as const;

const DEFECT = [
  "conformance-self-parent.jsonl",
  "conformance-two-node-cycle.jsonl",
  "deep-swarm-self-parent.jsonl",
] as const;

function flatten(nodes: readonly InspectNode[]): InspectNode[] {
  const out: InspectNode[] = [];
  const walk = (list: readonly InspectNode[]) => {
    for (const n of list) {
      out.push(n);
      walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

function countTreeCycles(roots: readonly InspectNode[]): number {
  let cycles = 0;
  const walk = (node: InspectNode, stack: Set<string>) => {
    if (stack.has(node.event.eventId)) {
      cycles += 1;
      return;
    }
    stack.add(node.event.eventId);
    for (const child of node.children) walk(child, stack);
    stack.delete(node.event.eventId);
  };
  for (const root of roots) walk(root, new Set());
  return cycles;
}

describe("6.15-1 adapter relationship invariants", () => {
  it.each([...POSITIVE])("%s: no self-parent, acyclic projection, all steps visible", async (file) => {
    const content = readFileSync(path.join(fixturesDir, file), "utf8");
    const read = await openTrace({ type: "string", content });
    const projection = projectLogicalEvents(read.events);

    expect(
      projection.logicalEvents.filter(
        (e) => e.parentId !== undefined && e.parentId === e.eventId,
      ),
    ).toHaveLength(0);

    const cycle = runTraceChecks(
      { read },
      { rules: [createStructureCycleRule()] },
    );
    expect(cycle.findings.filter((f) => f.ruleId === "structure.cycle")).toHaveLength(0);

    const started = [...content.matchAll(/"event":"step_started"/g)].length;
    expect(flatten(read.runs.flatMap((r) => r.children)).length).toBeGreaterThanOrEqual(
      started,
    );

    for (const run of read.runs) {
      expect(countTreeCycles(run.children)).toBe(0);
    }

    const completedSteps = [...content.matchAll(/"event":"step_completed"/g)].length;
    expect(completedSteps).toBeGreaterThan(0);
  });

  it.each([...DEFECT])("%s: normalize without hiding nodes", async (file) => {
    const content = readFileSync(path.join(fixturesDir, file), "utf8");
    const read = await openTrace({ type: "string", content });
    const projection = projectLogicalEvents(read.events);

    expect(
      projection.logicalEvents.filter(
        (e) => e.parentId !== undefined && e.parentId === e.eventId,
      ),
    ).toHaveLength(0);

    const started = [...content.matchAll(/"event":"step_started"/g)].length;
    const visible = flatten(read.runs.flatMap((r) => r.children));
    expect(visible.length).toBeGreaterThanOrEqual(started);

    for (const run of read.runs) {
      expect(countTreeCycles(run.children)).toBe(0);
    }

    if (file.includes("self-parent")) {
      expect(content.includes('"stepId":"step_cycle"') || content.includes('"stepId":"seq_nested"')).toBe(
        true,
      );
      expect(content.includes('"parentId":"step_cycle"') || content.includes('"parentId":"seq_nested"')).toBe(
        true,
      );
      expect(
        projection.diagnostics.some((d) => d.code === "AI_LOGICAL_SELF_PARENT_REMOVED"),
      ).toBe(true);
    }

    if (file.includes("two-node-cycle")) {
      // Visibility-first linking breaks the A↔B cycle while keeping both nodes.
      const nodes = new Map<string, InspectNode>();
      for (const id of ["step_a", "step_b"] as const) {
        nodes.set(id, {
          event: {
            eventId: id,
            runId: "lg_conf_two_node_cycle",
            parentId: id === "step_a" ? "step_b" : "step_a",
            kind: "CHAIN",
            name: id,
            timestamp: 1,
            confidence: "explicit",
            source: { type: "manual" },
          },
          children: [],
          depth: 0,
        });
      }
      const { roots, summary } = linkNodesVisibilityFirst(nodes);
      expect(summary.cycleCount).toBeGreaterThan(0);
      expect(flatten(roots)).toHaveLength(2);
      expect(countTreeCycles(roots)).toBe(0);

      const cycle = runTraceChecks(
        { read },
        { rules: [createStructureCycleRule()] },
      );
      expect(cycle.findings.some((f) => f.ruleId === "structure.cycle")).toBe(true);
    }
  });

  it("positive corpus includes every §9.3 conformance shape", () => {
    const shapes = [
      "conformance-self-parent.jsonl",
      "conformance-two-node-cycle.jsonl",
      "conformance-unresolved-external.jsonl",
      "conformance-multiple-roots.jsonl",
      "conformance-synthetic-group.jsonl",
      "conformance-nested-subgraph.jsonl",
      "parallel-children.jsonl",
    ];
    for (const file of shapes) {
      expect(readFileSync(path.join(fixturesDir, file), "utf8").length).toBeGreaterThan(0);
    }
  });
});
