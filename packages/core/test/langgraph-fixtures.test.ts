/**
 * v6.7.4-7: synthetic LangGraph fixture corpus envelope checks.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { extractMetadata } from "../src/trace-metadata.js";
import { readTraceEventsFromFile } from "../src/storage.js";

const fixturesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/langgraph",
);

describe("v6.7.4-7 langgraph fixture corpus", () => {
  it("each fixture has one run_started and one terminal run_completed", async () => {
    const files = (await readdir(fixturesDir)).filter((f) => f.endsWith(".jsonl")).sort();
    expect(files.length).toBeGreaterThanOrEqual(6);

    for (const file of files) {
      const full = path.join(fixturesDir, file);
      const events = await readTraceEventsFromFile(full);
      expect(events.filter((e) => e.event === "run_started"), file).toHaveLength(1);
      expect(events.filter((e) => e.event === "run_completed"), file).toHaveLength(1);
      const meta = await extractMetadata(full);
      expect(["success", "error"], file).toContain(meta.status);
    }
  });

  it("dynamic-tool fixture uses human tool step name", async () => {
    const events = await readTraceEventsFromFile(
      path.join(fixturesDir, "dynamic-tool-name.jsonl"),
    );
    const tool = events.find((e) => e.event === "step_started" && e.type === "tool");
    expect(tool && "name" in tool ? tool.name : undefined).toBe("tool:get_navan_rewards");
  });
});
