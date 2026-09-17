import { describe, expect, it } from "vitest";

import {
  FLAGSHIP_TOOLS,
  LEGACY_TOOLS,
  LOCAL_READONLY_TOOL_ANNOTATIONS,
  READ_ONLY_TOOLS,
  assertToolsFullyAnnotated,
  withReadonlyAnnotations,
} from "../src/tools.js";
import {
  handleMcpProtocolLine,
  type ProtocolSession,
} from "../src/protocol.js";
import { createMcpServerContext } from "../src/tools.js";

function sessionWithCapture(lines: string[]): ProtocolSession {
  return {
    context: createMcpServerContext({ traceDir: "." }),
    serverName: "@agent-inspect/mcp-server",
    serverVersion: "0.0.0-test",
    write: (line) => {
      lines.push(line);
    },
    inflight: new Map(),
  };
}

describe("MCP tool annotations", () => {
  it("annotates every flagship and legacy tool with local-readonly hints", () => {
    expect(FLAGSHIP_TOOLS.length + LEGACY_TOOLS.length).toBe(READ_ONLY_TOOLS.length);
    assertToolsFullyAnnotated(READ_ONLY_TOOLS);
    for (const tool of READ_ONLY_TOOLS) {
      expect(tool.annotations).toEqual(LOCAL_READONLY_TOOL_ANNOTATIONS);
    }
  });

  it("rejects a tool missing annotations (completeness guard)", () => {
    expect(() =>
      assertToolsFullyAnnotated([
        {
          name: "future_tool",
          description: "missing annotations",
          inputSchema: { type: "object", properties: {} },
          annotations: {
            readOnlyHint: true,
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
          },
        },
      ]),
    ).toThrow(/future_tool/);
  });

  it("emits annotations on the tools/list wire payload", async () => {
    const out: string[] = [];
    await handleMcpProtocolLine(
      sessionWithCapture(out),
      JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    );
    const body = JSON.parse(out[0]!);
    const tools = body.result.tools as Array<{
      name: string;
      description: string;
      inputSchema: unknown;
      annotations: typeof LOCAL_READONLY_TOOL_ANNOTATIONS;
    }>;
    expect(tools.length).toBe(READ_ONLY_TOOLS.length);
    for (const tool of tools) {
      expect(tool.annotations).toEqual(LOCAL_READONLY_TOOL_ANNOTATIONS);
      expect(typeof tool.description).toBe("string");
      expect(tool.inputSchema).toBeTruthy();
    }
  });

  it("withReadonlyAnnotations copies the canonical hint object", () => {
    const tool = withReadonlyAnnotations({
      name: "x",
      description: "y",
      inputSchema: { type: "object", properties: {} },
    });
    expect(tool.annotations).toEqual(LOCAL_READONLY_TOOL_ANNOTATIONS);
    expect(tool.annotations).not.toBe(LOCAL_READONLY_TOOL_ANNOTATIONS);
  });
});
