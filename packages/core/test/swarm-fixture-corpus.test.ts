/**
 * 6.14.2-7 — moderate + deep-swarm regression corpus expectations.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  createSafetyRedactionRule,
  createStructureCycleRule,
  createStructureIncompleteRule,
  createStructureOrphanRule,
  createToolUsageRule,
  runTraceChecks,
} from "../src/checks/index.js";
import { openTrace } from "../src/readers/index.js";

const fixturesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/langgraph",
);

async function openFixture(name: string) {
  const content = readFileSync(path.join(fixturesRoot, name), "utf8");
  return openTrace({ type: "string", content });
}

describe("6.14.2-7 swarm fixture corpus", () => {
  it("moderate structured-output fixture passes check without tools", async () => {
    const read = await openFixture("moderate-structured-output.jsonl");
    const checks = runTraceChecks(
      { read },
      {
        rules: [
          createStructureIncompleteRule(),
          createStructureOrphanRule(),
          createStructureCycleRule(),
          createSafetyRedactionRule(),
        ],
      },
    );
    expect(checks.status).toBe("pass");
  });

  it("deep-swarm nested-ok fixture shows tool and passes cycle + required-tool", async () => {
    const read = await openFixture("deep-swarm-nested-ok.jsonl");
    const checks = runTraceChecks(
      { read },
      {
        rules: [
          createStructureIncompleteRule(),
          createStructureOrphanRule(),
          createStructureCycleRule(),
          createToolUsageRule({ required: ["get_navan_rewards"] }),
          createSafetyRedactionRule(),
        ],
      },
    );
    expect(checks.status).toBe("pass");
    expect(checks.findings.filter((f) => f.status === "fail")).toHaveLength(0);
  });
});
