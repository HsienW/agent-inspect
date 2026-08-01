/**
 * v6.7.4-2: cross-command run-status golden.
 * metadata / explain / stats / check agree on completed-run status.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { createRunStatusRule, runTraceChecks } from "../src/checks/index.js";
import { buildLocalExplanation } from "../src/explain.js";
import { openTrace } from "../src/readers/index.js";
import { buildTraceStats } from "../src/stats.js";
import { extractMetadata } from "../src/trace-metadata.js";

const fixturesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../fixtures/traces",
);

describe("v6.7.4-2 cross-command run status golden", () => {
  it("completed success fixture agrees across metadata, explain, stats, and check", async () => {
    const file = path.join(fixturesDir, "minimal-success.jsonl");
    const meta = await extractMetadata(file);
    expect(meta.status).toBe("success");

    const opened = await openTrace({ type: "file", path: file });
    const run = opened.runs[0];
    expect(run).toBeDefined();
    const explained = buildLocalExplanation(run!);
    expect(explained.status).toBe("success");
    const statusFact = explained.facts.find((f) => f.id === "run.status");
    expect(statusFact?.value).toBe("success");

    const stats = await buildTraceStats([meta], { traceDir: fixturesDir });
    expect(stats.successCount).toBe(1);
    expect(stats.runningCount).toBe(0);
    expect(stats.errorCount).toBe(0);

    // Check rules use the reader tree vocabulary ("ok"), while user-facing
    // surfaces use "success" — both must reflect a completed successful run.
    const check = runTraceChecks(
      { read: opened },
      {
        rules: [createRunStatusRule({ expected: "ok", allowIncomplete: true })],
      },
    );
    expect(check.status).toBe("pass");
    expect(run!.status).toBe("ok");
  });

  it("completed error fixture agrees across metadata and explain", async () => {
    const file = path.join(fixturesDir, "minimal-error.jsonl");
    const meta = await extractMetadata(file);
    expect(meta.status).toBe("error");

    const opened = await openTrace({ type: "file", path: file });
    const explained = buildLocalExplanation(opened.runs[0]!);
    expect(explained.status).toBe("error");
  });
});
