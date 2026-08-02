/**
 * Generate MCP client config snippets for coding agents (dry-run by default).
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export type McpConfigureClient = "cursor" | "claude-code" | "codex" | "gemini";

export interface McpConfigureOptions {
  client: McpConfigureClient;
  dir?: string;
  projectLocal?: boolean;
  write?: boolean;
  yes?: boolean;
  json?: boolean;
}

export interface McpConfigureResult {
  client: McpConfigureClient;
  dryRun: boolean;
  wrote: boolean;
  targetPath: string | null;
  config: Record<string, unknown>;
  notes: string[];
}

const CLIENTS: readonly McpConfigureClient[] = [
  "cursor",
  "claude-code",
  "codex",
  "gemini",
];

export function isMcpConfigureClient(value: string): value is McpConfigureClient {
  return (CLIENTS as readonly string[]).includes(value);
}

function buildServerBlock(traceDir: string): Record<string, unknown> {
  return {
    command: "npx",
    args: ["-y", "@agent-inspect/mcp-server", "--dir", traceDir],
    env: {
      AGENT_INSPECT_TRACE_DIR: traceDir,
      AGENT_INSPECT_MCP_REDACTION_PROFILE: "share",
    },
  };
}

export function buildMcpClientConfig(
  client: McpConfigureClient,
  traceDir: string,
): Record<string, unknown> {
  const server = buildServerBlock(traceDir);
  switch (client) {
    case "cursor":
      return {
        mcpServers: {
          "agent-inspect": server,
        },
      };
    case "claude-code":
      return {
        mcpServers: {
          "agent-inspect": server,
        },
      };
    case "codex":
      return {
        mcp_servers: {
          "agent-inspect": {
            command: server.command,
            args: server.args,
            env: server.env,
          },
        },
      };
    case "gemini":
      return {
        mcpServers: {
          "agent-inspect": server,
        },
      };
    default: {
      const _exhaustive: never = client;
      return _exhaustive;
    }
  }
}

function resolveTargetPath(
  client: McpConfigureClient,
  projectLocal: boolean,
): string {
  if (projectLocal) {
    switch (client) {
      case "cursor":
        return path.join(".cursor", "mcp.json");
      case "claude-code":
        return path.join(".mcp.json");
      case "codex":
        return path.join(".codex", "config.toml.json");
      case "gemini":
        return path.join(".gemini", "settings.json");
    }
  }
  // User-level paths are reported but never written without --yes --write
  switch (client) {
    case "cursor":
      return path.join("~", ".cursor", "mcp.json");
    case "claude-code":
      return path.join("~", ".claude.json");
    case "codex":
      return path.join("~", ".codex", "config.toml");
    case "gemini":
      return path.join("~", ".gemini", "settings.json");
  }
}

export async function mcpConfigureCommand(
  options: McpConfigureOptions,
): Promise<McpConfigureResult> {
  if (!isMcpConfigureClient(options.client)) {
    throw new Error(
      `Unsupported client "${String(options.client)}". Use: ${CLIENTS.join(", ")}`,
    );
  }
  const traceDir = options.dir?.trim() || ".agent-inspect";
  const projectLocal = Boolean(options.projectLocal);
  const write = Boolean(options.write);
  const yes = Boolean(options.yes);
  const dryRun = !(write && yes && projectLocal);
  const config = buildMcpClientConfig(options.client, traceDir);
  const targetPath = resolveTargetPath(options.client, projectLocal);
  const notes = [
    "Read-only MCP server; no network upload; share redaction by default.",
    "Dry-run by default. Pass --project-local --write --yes to write a project file.",
    "User-level paths are never auto-written by this command.",
    "Remove the agent-inspect server block to uninstall.",
  ];

  let wrote = false;
  if (!dryRun && projectLocal) {
    const abs = path.resolve(targetPath);
    await mkdir(path.dirname(abs), { recursive: true });
    await writeFile(abs, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    wrote = true;
  }

  const result: McpConfigureResult = {
    client: options.client,
    dryRun,
    wrote,
    targetPath,
    config,
    notes,
  };

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } else {
    process.stdout.write(
      [
        `Client: ${result.client}`,
        `Mode: ${result.dryRun ? "dry-run" : "write"}`,
        `Target: ${result.targetPath}`,
        `Wrote: ${result.wrote}`,
        "",
        JSON.stringify(result.config, null, 2),
        "",
        ...result.notes.map((note) => `- ${note}`),
        "",
      ].join("\n"),
    );
  }
  return result;
}
