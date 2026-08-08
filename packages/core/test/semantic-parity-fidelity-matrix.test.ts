/**
 * 6.15-9 — Cross-surface semantic parity for fidelity classes A–E.
 *
 * Same fixture must agree on status, tools, roots, relationship/safety results
 * across TraceFacts, TraceContract, checks, metadata, and explain.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildTraceFacts,
  createSafetyRedactionRule,
  createStructureCycleRule,
  createStructureIncompleteRule,
  createToolUsageRule,
  defineTraceContract,
  evaluateTraceContractRead,
  runTraceChecks,
  summarizeSemanticParity,
} from "../src/checks/index.js";
import { buildLocalExplanation } from "../src/explain.js";
import { openTraceFile } from "../src/readers/index.js";
import { extractMetadata } from "../src/trace-metadata.js";

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/langgraph",
);

type ClassCase = {
  klass: "A" | "B" | "C" | "D" | "E";
  file: string;
  requiredTools?: string[];
  expectCompleted?: boolean;
};

const CASES: ClassCase[] = [
  { klass: "A", file: "plain-root.jsonl" },
  { klass: "B", file: "dynamic-tool-name.jsonl", requiredTools: ["get_navan_rewards"] },
  { klass: "C", file: "moderate-structured-output.jsonl" },
  { klass: "D", file: "conformance-nested-subgraph.jsonl", requiredTools: ["lookup_item"] },
  { klass: "E", file: "deep-swarm-nested-ok.jsonl", requiredTools: ["get_navan_rewards"] },
];

describe("6.15-9 cross-surface semantic parity (classes A–E)", () => {
  it.each(CASES)(
    "class $klass ($file) agrees across facts/contract/checks/metadata/explain",
    async ({ file, requiredTools }) => {
      const full = path.join(fixturesDir, file);
      const read = await openTraceFile(full);
      const summary = summarizeSemanticParity(read.events);
      const facts = buildTraceFacts(read);

      expect(facts.summary.finishedToolNames).toEqual(summary.finishedToolNames);
      expect(facts.summary.logicalEventCount).toBe(summary.logicalEventCount);
      expect(summary.runningLogicalCount).toBe(0);

      const rootCount = read.runs.reduce(
        (n, run) => n + run.children.filter((c) => !c.event.parentId).length,
        0,
      );
      expect(rootCount).toBeGreaterThanOrEqual(1);

      const cycle = runTraceChecks(
        { read },
        { rules: [createStructureCycleRule(), createStructureIncompleteRule()] },
      );
      expect(cycle.findings.filter((f) => f.ruleId === "structure.cycle")).toHaveLength(0);

      if (requiredTools && requiredTools.length > 0) {
        for (const tool of requiredTools) {
          expect(facts.toolsByName.has(tool) || summary.finishedToolNames.includes(tool)).toBe(
            true,
          );
        }
        const toolChecks = runTraceChecks(
          { read },
          { rules: [createToolUsageRule({ required: requiredTools })] },
        );
        expect(toolChecks.status).toBe("pass");

        const contract = evaluateTraceContractRead(
          read,
          defineTraceContract({
            run: { requireCompleted: true, allowedStatuses: ["ok", "success"] },
            tools: { required: requiredTools },
          }),
        );
        expect(contract.status).toBe("pass");
      } else {
        const contract = evaluateTraceContractRead(
          read,
          defineTraceContract({
            run: { requireCompleted: true, allowedStatuses: ["ok", "success"] },
          }),
        );
        expect(contract.status).toBe("pass");
      }

      const meta = await extractMetadata(full);
      expect(["success", "error"]).toContain(meta.status);

      const run = read.runs[0];
      expect(run).toBeDefined();
      const explained = buildLocalExplanation(run!);
      if (meta.status === "success") {
        expect(run!.status).toBe("ok");
        expect(explained.status).toBe("success");
      } else {
        expect(explained.status).toBe("error");
      }
    },
  );

  it("class E deep-swarm keeps token-config keys out of safety.redaction", async () => {
    const read = await openTraceFile(path.join(fixturesDir, "deep-swarm-nested-ok.jsonl"));
    const safety = runTraceChecks(
      { read },
      { rules: [createSafetyRedactionRule()] },
    );
    expect(
      safety.findings.filter((f) => f.ruleId === "safety.redaction"),
    ).toHaveLength(0);
  });
});
