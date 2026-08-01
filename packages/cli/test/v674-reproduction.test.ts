/**
 * v6.7.4-0 reproducers for CLI check shorthand blockers.
 */
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkCommand } from "../src/check.js";

function jsonl(...rows: unknown[]): string {
  return `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
}

async function runCheck(target: string, options: Parameters<typeof checkCommand>[1] = {}) {
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  await checkCommand(target, { json: true, ...options });
  const output = String(logSpy.mock.calls[0]?.[0] ?? "{}");
  logSpy.mockRestore();
  return JSON.parse(output) as {
    status?: string;
    findings?: { ruleId?: string; message?: string }[];
  };
}

describe("v6.7.4-0 cli check reproduction", () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-v674-check-"));
    process.exitCode = 0;
  });

  afterEach(async () => {
    process.exitCode = 0;
    vi.restoreAllMocks();
    await rm(tmp, { recursive: true, force: true });
  });

  it(
    "shorthand --required-tool produces a tool.usage finding without explicit --rule select",
    async () => {
      const file = path.join(tmp, "no-tool.jsonl");
      await writeFile(
        file,
        jsonl(
          {
            schemaVersion: "0.2",
            eventId: "e1",
            runId: "run-shorthand",
            kind: "RUN",
            name: "shorthand",
            status: "ok",
            timestamp: "2026-08-01T00:00:00.000Z",
            confidence: "explicit",
            source: { type: "manual" },
          },
          {
            schemaVersion: "0.2",
            eventId: "e2",
            runId: "run-shorthand",
            parentId: undefined,
            kind: "LLM",
            name: "llm:model",
            status: "ok",
            timestamp: "2026-08-01T00:00:01.000Z",
            confidence: "explicit",
            source: { type: "manual" },
          },
        ),
        "utf-8",
      );

      const result = await runCheck(file, { requiredTool: ["search_docs"] });
      expect(result.status).toBe("fail");
      expect(
        result.findings?.some(
          (f) =>
            (f.ruleId ?? "").includes("tool") ||
            (f.message ?? "").toLowerCase().includes("search_docs"),
        ),
      ).toBe(true);
    },
  );
});
