import { describe, expect, it } from "vitest";

import { buildMcpClientConfig, isMcpConfigureClient } from "../src/mcp-configure.js";

describe("mcp configure", () => {
  it("builds cursor config with share redaction and --dir", () => {
    const config = buildMcpClientConfig("cursor", ".agent-inspect");
    expect(config).toEqual({
      mcpServers: {
        "agent-inspect": {
          command: "npx",
          args: ["-y", "@agent-inspect/mcp-server", "--dir", ".agent-inspect"],
          env: {
            AGENT_INSPECT_TRACE_DIR: ".agent-inspect",
            AGENT_INSPECT_MCP_REDACTION_PROFILE: "share",
          },
        },
      },
    });
  });

  it("accepts supported clients only", () => {
    expect(isMcpConfigureClient("cursor")).toBe(true);
    expect(isMcpConfigureClient("claude-code")).toBe(true);
    expect(isMcpConfigureClient("codex")).toBe(true);
    expect(isMcpConfigureClient("gemini")).toBe(true);
    expect(isMcpConfigureClient("unknown")).toBe(false);
  });
});
