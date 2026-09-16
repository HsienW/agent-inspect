import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { inspectRun } from "agent-inspect";
import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { resetMcpToolCallIdsForTests, wrapMcpClient } from "../src/index.js";

class FakeSdkClient {
  public readonly _privateBookkeeping: string[] = [];

  connect(): string {
    this._privateBookkeeping.push("connect");
    return "connected";
  }

  close(): string {
    this._privateBookkeeping.push("close");
    return "closed";
  }

  listResources(): string[] {
    return ["res-a"];
  }

  async listTools() {
    return { tools: [{ name: "echo" }] };
  }

  async callTool({ name, arguments: args }: { name: string; arguments?: unknown }) {
    return {
      content: [{ type: "text", text: `ok:${name}:${JSON.stringify(args ?? {})}` }],
    };
  }
}

describe("wrapMcpClient preserves client identity (#420)", () => {
  let traceDir: string;

  beforeEach(async () => {
    resetMcpToolCallIdsForTests();
    traceDir = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-mcp-proxy-"));
    process.env.AGENT_INSPECT_TRACE_DIR = traceDir;
  });

  afterEach(async () => {
    delete process.env.AGENT_INSPECT_TRACE_DIR;
    await rm(traceDir, { recursive: true, force: true });
  });

  it("keeps prototype methods and private state on the original instance", async () => {
    const client = new FakeSdkClient();
    const wrapped = wrapMcpClient(client, { serverName: "fixture" });

    expect(Object.getPrototypeOf(wrapped)).toBe(FakeSdkClient.prototype);
    expect(wrapped).toBeInstanceOf(FakeSdkClient);
    expect(typeof wrapped.connect).toBe("function");
    expect(typeof wrapped.close).toBe("function");
    expect(typeof wrapped.listResources).toBe("function");
    expect(wrapped.connect()).toBe("connected");
    expect(wrapped.listResources()).toEqual(["res-a"]);
    expect(client._privateBookkeeping).toEqual(["connect"]);
    expect(wrapped._privateBookkeeping).toBe(client._privateBookkeeping);

    await inspectRun(
      "mcp-proxy-run",
      async () => {
        await wrapped.listTools?.();
        await wrapped.callTool({ name: "echo", arguments: { n: 1 } });
      },
      { silent: true, traceDir },
    );

    wrapped.close();
    expect(client._privateBookkeeping).toEqual(["connect", "close"]);

    const files = await readdir(traceDir);
    const body = (
      await Promise.all(
        files
          .filter((file) => file.endsWith(".jsonl"))
          .map((file) => readFile(path.join(traceDir, file), "utf8")),
      )
    ).join("\n");
    expect(body).toContain("mcp:tools/list");
    expect(body).toContain("mcp:echo");
  });
});
