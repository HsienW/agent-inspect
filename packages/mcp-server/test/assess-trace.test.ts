import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { openTrace } from "agent-inspect/readers";

import { assessTraceArtifactForMcp, assessTraceForMcp } from "../src/assess-trace.js";

function jsonl(...rows: unknown[]): string {
  return `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`;
}

function event(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schemaVersion: "0.2",
    eventId: "event-a",
    runId: "run-mcp-safety",
    kind: "RUN",
    name: "mcp-safety",
    status: "ok",
    timestamp: "2026-06-26T00:00:00.000Z",
    confidence: "explicit",
    source: { type: "manual" },
    ...overrides,
  };
}

describe("MCP safety artifact parity", () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-mcp-safety-"));
  });

  afterEach(async () => {
    await rm(tmp, { recursive: true, force: true });
  });

  it("gates on redacted artifact when source-only secrets redact away", async () => {
    const filePath = path.join(tmp, "run-mcp-safety.jsonl");
    await writeFile(
      filePath,
      jsonl(
        event({
          attributes: {
            apiKey: "sk-mcpParitySecretValue1234567890",
          },
        }),
      ),
      "utf-8",
    );
    const read = await openTrace({ type: "file", path: filePath }, { format: "agent-inspect-jsonl" });
    const source = assessTraceForMcp(read, "run-mcp-safety");
    expect(source.status).toBe("UNSAFE");

    const artifact = await assessTraceArtifactForMcp({
      read,
      runId: "run-mcp-safety",
      filePath,
      profile: "share",
    });
    expect(artifact.sourceStatus).toBe("UNSAFE");
    expect(["SAFE", "SAFE WITH WARNINGS"]).toContain(artifact.status);
  });

  it("keeps artifact UNSAFE when share redaction cannot remove raw prompt", async () => {
    const filePath = path.join(tmp, "run-mcp-prompt.jsonl");
    await writeFile(
      filePath,
      jsonl(
        event({
          runId: "run-mcp-prompt",
          attributes: { prompt: "raw prompt remains after share" },
        }),
      ),
      "utf-8",
    );
    const read = await openTrace({ type: "file", path: filePath }, { format: "agent-inspect-jsonl" });
    const artifact = await assessTraceArtifactForMcp({
      read,
      runId: "run-mcp-prompt",
      filePath,
      profile: "share",
    });
    expect(artifact.status).toBe("UNSAFE");
  });
});
