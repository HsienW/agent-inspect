import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  MCP_MAX_REQUEST_BYTES,
  MCP_PROTOCOL_VERSION,
  handleMcpProtocolLine,
  type ProtocolSession,
} from "../src/protocol.js";
import { createMcpServerContext } from "../src/tools.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const corpusPath = path.join(root, "fixtures/mcp/protocol-conformance.v1.json");

function session(out: string[]): ProtocolSession {
  return {
    context: createMcpServerContext({ traceDir: "." }),
    serverName: "@agent-inspect/mcp-server",
    serverVersion: "test",
    write: (line) => out.push(line),
    inflight: new Map(),
  };
}

describe("mcp protocol/privacy conformance corpus", () => {
  const corpus = JSON.parse(readFileSync(corpusPath, "utf8")) as {
    cases: Array<Record<string, unknown>>;
    privacy: Record<string, unknown>;
  };

  it("locks privacy defaults", () => {
    expect(corpus.privacy.defaultRedactionProfile).toBe("share");
    expect(corpus.privacy.readOnly).toBe(true);
    expect(corpus.privacy.noNetwork).toBe(true);
  });

  it("covers required protocol cases", async () => {
    const ids = corpus.cases.map((item) => item.id);
    for (const required of [
      "initialize",
      "tools_list",
      "tools_call_unknown",
      "cancelled",
      "malformed",
      "oversized",
      "unknown_method",
      "protocol_negotiation",
    ]) {
      expect(ids).toContain(required);
    }

    for (const testCase of corpus.cases) {
      const out: string[] = [];
      const s = session(out);
      if (typeof testCase.raw === "string") {
        await handleMcpProtocolLine(s, testCase.raw);
        expect(JSON.parse(out[0]!).error.code).toBe(testCase.expectErrorCode);
        continue;
      }
      if (typeof testCase.oversizedBytes === "number") {
        await handleMcpProtocolLine(s, "x".repeat(testCase.oversizedBytes as number));
        expect(JSON.parse(out[0]!).error.code).toBe(testCase.expectErrorCode);
        expect(testCase.oversizedBytes).toBeGreaterThan(MCP_MAX_REQUEST_BYTES);
        continue;
      }
      const payload: Record<string, unknown> = {
        jsonrpc: "2.0",
        id: 1,
        method: testCase.method,
      };
      if (testCase.params) payload.params = testCase.params;
      if (testCase.method === null) delete payload.method;
      await handleMcpProtocolLine(s, JSON.stringify(payload));
      if (testCase.expect === "no-response") {
        expect(out).toHaveLength(0);
        continue;
      }
      const body = JSON.parse(out[0]!);
      if (testCase.expectToolError) {
        expect(body.result?.isError).toBe(true);
        continue;
      }
      if (testCase.expectError || testCase.expectErrorCode) {
        expect(body.error).toBeTruthy();
        if (testCase.expectErrorCode) expect(body.error.code).toBe(testCase.expectErrorCode);
        continue;
      }
      if (testCase.expect === "protocolVersion") {
        expect(body.result.protocolVersion).toBe(MCP_PROTOCOL_VERSION);
      }
      if (testCase.expect === "tools") {
        expect(Array.isArray(body.result.tools)).toBe(true);
      }
      if (testCase.expect === "empty-result") {
        expect(body.result).toEqual({});
      }
    }
  });
});
