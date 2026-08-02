import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { createMcpServerContext } from "../src/tools.js";
import { parseMcpServerCliArgs } from "../src/cli.js";

const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const binPath = path.join(pkgRoot, "bin/agent-inspect-mcp-server.cjs");

describe("mcp-server CLI args", () => {
  afterEach(() => {
    delete process.env.AGENT_INSPECT_MCP_REDACTION_PROFILE;
  });

  it("parses --dir and redaction profile", () => {
    const parsed = parseMcpServerCliArgs([
      "--dir",
      ".agent-inspect",
      "--redaction-profile=share",
      "--max-events",
      "100",
    ]);
    expect(parsed.error).toBeUndefined();
    expect(parsed.options.traceDir).toBe(".agent-inspect");
    expect(parsed.options.redactionProfile).toBe("share");
    expect(parsed.options.maxEvents).toBe(100);
  });

  it("flags help without starting options errors", () => {
    expect(parseMcpServerCliArgs(["--help"]).help).toBe(true);
    expect(parseMcpServerCliArgs(["-V"]).version).toBe(true);
  });

  it("rejects unknown flags", () => {
    const parsed = parseMcpServerCliArgs(["--upload"]);
    expect(parsed.error).toMatch(/Unknown argument/);
  });

  it("honors AGENT_INSPECT_MCP_REDACTION_PROFILE", () => {
    process.env.AGENT_INSPECT_MCP_REDACTION_PROFILE = "strict";
    const context = createMcpServerContext({ traceDir: "." });
    expect(context.redactionProfile).toBe("strict");
  });

  it("bin wrapper prints help via exported main", () => {
    const result = spawnSync(process.execPath, [binPath, "--help"], {
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("agent-inspect-mcp-server");
    expect(result.stdout).toContain("--dir");
  });
});
