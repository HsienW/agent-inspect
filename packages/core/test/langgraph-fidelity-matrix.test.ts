/**
 * 6.15-2 — Fidelity-class fixture suite for nested subgraph (D) and swarm (E).
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
import { openTrace } from "../src/readers/index.js";

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/langgraph",
);

async function openFixture(file: string) {
  const content = readFileSync(path.join(fixturesDir, file), "utf8");
  return openTrace({ type: "string", content });
}

describe("6.15-2 LangGraph fidelity class fixture suite", () => {
  it("Class D nested-subgraph fixture keeps LLM+tool under nested parents", async () => {
    const read = await openFixture("conformance-nested-subgraph.jsonl");
    const starts = read.events.filter((e) => e.kind !== "RUN");
    const byName = Object.fromEntries(starts.map((e) => [e.name, e]));

    expect(byName["chain:CompiledStateGraph"]).toBeDefined();
    expect(byName["llm:ChatOpenAI"]?.parentId).toBeDefined();
    expect(byName["tool:lookup_item"]?.parentId).toBeDefined();
    expect(byName["tool:lookup_item"]?.name).toBe("tool:lookup_item");

    const projection = projectLogicalEvents(read.events);
    expect(
      projection.logicalEvents.some(
        (e) => e.parentId !== undefined && e.parentId === e.eventId,
      ),
    ).toBe(false);

    const cycle = runTraceChecks(
      { read },
      { rules: [createStructureCycleRule()] },
    );
    expect(cycle.findings.filter((f) => f.ruleId === "structure.cycle")).toHaveLength(0);
  });

  it("Class E deep-swarm nested-ok shows nested LLM+tool without cycles", async () => {
    const read = await openFixture("deep-swarm-nested-ok.jsonl");
    const llm = read.events.find((e) => e.kind === "LLM");
    const tool = read.events.find((e) => e.kind === "TOOL");
    expect(llm?.parentId).toBeDefined();
    expect(tool?.parentId).toBeDefined();
    expect(tool?.name).toContain("get_navan_rewards");

    const cycle = runTraceChecks(
      { read },
      { rules: [createStructureCycleRule()] },
    );
    expect(cycle.findings.filter((f) => f.ruleId === "structure.cycle")).toHaveLength(0);
  });

  it("Class C moderate structured-output allows multiple roots without cycles", async () => {
    const read = await openFixture("moderate-structured-output.jsonl");
    expect(read.runs.length).toBeGreaterThanOrEqual(1);
    const cycle = runTraceChecks(
      { read },
      { rules: [createStructureCycleRule()] },
    );
    expect(cycle.findings.filter((f) => f.ruleId === "structure.cycle")).toHaveLength(0);
  });

  it("maps A–E primary fixtures into the corpus", () => {
    const map: Record<string, string> = {
      A: "plain-root.jsonl",
      B: "dynamic-tool-name.jsonl",
      C: "moderate-structured-output.jsonl",
      D: "conformance-nested-subgraph.jsonl",
      E: "deep-swarm-nested-ok.jsonl",
    };
    for (const [klass, file] of Object.entries(map)) {
      const content = readFileSync(path.join(fixturesDir, file), "utf8");
      expect(content.length, `class ${klass}`).toBeGreaterThan(0);
      expect(content).toContain("run_started");
      expect(content).toContain("run_completed");
    }
  });
});
