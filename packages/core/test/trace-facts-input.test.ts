import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildTraceFacts } from "../src/checks/trace-facts.js";
import { openTraceFile, openTraceText } from "../src/readers/index.js";

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/langgraph",
);

describe("6.15-5 buildTraceFacts input ergonomics", () => {
  it("accepts TraceReadResult and PersistedInspectEvent[] equivalently", async () => {
    const file = path.join(fixturesDir, "deep-swarm-nested-ok.jsonl");
    const read = await openTraceFile(file);
    const fromRead = buildTraceFacts(read);
    const fromEvents = buildTraceFacts(read.events);
    expect(fromRead.summary.finishedToolNames).toEqual(fromEvents.summary.finishedToolNames);
    expect(fromRead.logicalEvents.length).toBe(fromEvents.logicalEvents.length);
    expect([...fromRead.toolsByName.keys()]).toContain("get_navan_rewards");
  });

  it("rejects raw v0.1 TraceEvent rows with a remediation message", async () => {
    const raw = JSON.parse(
      readFileSync(path.join(fixturesDir, "plain-root.jsonl"), "utf8")
        .trim()
        .split("\n")[0]!,
    );
    expect(() => buildTraceFacts([raw] as never)).toThrow(
      /AI_TRACE_FACTS_INPUT_NOT_NORMALIZED/,
    );
    expect(() => buildTraceFacts([raw] as never)).toThrow(/openTraceFile/);
  });

  it("works with openTraceText → buildTraceFacts(read)", async () => {
    const content = readFileSync(
      path.join(fixturesDir, "dynamic-tool-name.jsonl"),
      "utf8",
    );
    const read = await openTraceText(content);
    const facts = buildTraceFacts(read);
    expect(facts.summary.finishedToolCount).toBeGreaterThan(0);
  });
});
