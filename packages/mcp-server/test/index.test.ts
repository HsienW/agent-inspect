import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Readable, Writable } from "node:stream";

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { inspectRun } from "agent-inspect";

import { READ_ONLY_TOOLS, callReadOnlyTool, createMcpServerContext } from "../src/tools.js";
import { runReadOnlyMcpServer } from "../src/index.js";

describe("@agent-inspect/mcp-server", () => {
  let traceDir: string;
  let runId: string;

  beforeEach(async () => {
    traceDir = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-mcp-server-"));
    process.env.AGENT_INSPECT_TRACE_DIR = traceDir;
    await inspectRun("mcp-server-run", async () => {}, { traceDir });
    const context = createMcpServerContext({ traceDir });
    const listed = await callReadOnlyTool(context, "list_traces", {});
    const payload = JSON.parse(listed.content[0]!.text as string) as Array<{ runId: string }>;
    runId = payload[0]!.runId;
  });

  afterEach(async () => {
    delete process.env.AGENT_INSPECT_TRACE_DIR;
    await rm(traceDir, { recursive: true, force: true });
  });

  it("exposes read-only tool catalog", () => {
    const names = READ_ONLY_TOOLS.map((tool) => tool.name);
    expect(names).toContain("list_recent_runs");
    expect(names).toContain("get_first_causal_failure");
    expect(names).toContain("create_share_checked_evidence");
    expect(names).toContain("list_traces");
    expect(names).toContain("create_share_safe_bundle");
    expect(new Set(names).size).toBe(names.length);
  });

  it("resolves flagship tool aliases", async () => {
    const context = createMcpServerContext({ traceDir });
    const listed = await callReadOnlyTool(context, "list_recent_runs", {});
    expect(listed.isError).toBe(false);
    const causal = await callReadOnlyTool(context, "get_first_causal_failure", { runId });
    expect(causal.isError).toBe(false);
    const payload = JSON.parse(causal.content[0]!.text as string) as {
      engine?: string;
      kind?: string;
    };
    expect(payload.engine).toBe("conservative-causal-v1");
    expect(payload.kind).toBeTruthy();
  });

  it("defaults redaction profile to share", () => {
    const context = createMcpServerContext({ traceDir });
    expect(context.redactionProfile).toBe("share");
  });

  it("lists traces via tool handler", async () => {
    const context = createMcpServerContext({ traceDir });
    const result = await callReadOnlyTool(context, "list_traces", {});
    expect(result.isError).toBe(false);
    const payload = JSON.parse(result.content[0]!.text as string) as Array<{ runId: string }>;
    expect(payload.length).toBeGreaterThan(0);
  });

  it("summarizes failed run via tool handler", async () => {
    const context = createMcpServerContext({ traceDir });
    const result = await callReadOnlyTool(context, "summarize_failed_run", { runId });
    expect(result.isError).toBe(false);
    const payload = JSON.parse(result.content[0]!.text as string) as { runId: string };
    expect(payload.runId).toBe(runId);
  });

  it("creates share-safe bundle via tool handler", async () => {
    const context = createMcpServerContext({ traceDir });
    const result = await callReadOnlyTool(context, "create_share_safe_bundle", { runId });
    expect(result.isError).toBe(false);
    const payload = JSON.parse(result.content[0]!.text as string) as {
      metadata: { safeStatus: string };
    };
    expect(["SAFE", "SAFE_WITH_WARNINGS"]).toContain(payload.metadata.safeStatus);
  });

  it("creates share-checked evidence with evidence.json", async () => {
    const context = createMcpServerContext({ traceDir });
    const result = await callReadOnlyTool(context, "create_share_checked_evidence", { runId });
    expect(result.isError).toBe(false);
    const payload = JSON.parse(result.content[0]!.text as string) as {
      evidenceFormatVersion?: string;
      files: Record<string, string>;
    };
    expect(payload.evidenceFormatVersion).toBe("1.0");
    expect(payload.files["evidence.json"]).toContain("evidenceFormatVersion");
  });

  it("applies MCP result boundary on read_trace", async () => {
    const context = createMcpServerContext({ traceDir });
    const result = await callReadOnlyTool(context, "read_trace", { runId });
    expect(result.isError).toBe(false);
    const text = result.content[0]!.text as string;
    expect(text.length).toBeGreaterThan(0);
    expect(text.length).toBeLessThan(600_000);
  });

  it("handles tools/list over stdio", async () => {
    const input = Readable.from([
      `${JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" })}\n`,
    ]);
    const chunks: string[] = [];
    const output = new Writable({
      write(chunk, _encoding, callback) {
        chunks.push(String(chunk));
        callback();
      },
    });
    const done = runReadOnlyMcpServer({ traceDir, input, output });
    await done;
    const response = JSON.parse(chunks[0]!);
    expect(response.result.tools.length).toBeGreaterThan(0);
  });
});
