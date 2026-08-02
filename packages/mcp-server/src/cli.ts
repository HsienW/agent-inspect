import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runReadOnlyMcpServer, type RunReadOnlyMcpServerOptions } from "./index.js";

export type McpServerCliArgs = {
  help: boolean;
  version: boolean;
  options: RunReadOnlyMcpServerOptions;
  error?: string;
};

const HELP = `Usage: agent-inspect-mcp-server [options]

Read-only MCP server over a local AgentInspect trace directory (stdio).

Options:
  --dir <path>                   Trace directory (default: .agent-inspect or AGENT_INSPECT_TRACE_DIR)
  --redaction-profile <profile>  local | share | strict (default: share)
  --max-events <n>               Max events per tool response (default: 500)
  -h, --help                     Show help
  -V, --version                  Show package version

Environment:
  AGENT_INSPECT_TRACE_DIR
  AGENT_INSPECT_MCP_REDACTION_PROFILE

No network. No code modification. Share redaction by default.
`;

function packageVersion(): string {
  return JSON.parse(
    readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "package.json"),
      "utf8",
    ),
  ).version as string;
}

function parseRedactionProfile(
  value: string,
): "local" | "share" | "strict" | undefined {
  if (value === "local" || value === "share" || value === "strict") return value;
  return undefined;
}

/** @internal exported for tests */
export function parseMcpServerCliArgs(argv: string[]): McpServerCliArgs {
  const options: RunReadOnlyMcpServerOptions = {};
  let help = false;
  let version = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (arg === "-h" || arg === "--help") {
      help = true;
      continue;
    }
    if (arg === "-V" || arg === "--version") {
      version = true;
      continue;
    }
    if (arg === "--dir") {
      const value = argv[++i];
      if (!value) return { help, version, options, error: "--dir requires a path" };
      options.traceDir = value;
      continue;
    }
    if (arg.startsWith("--dir=")) {
      options.traceDir = arg.slice("--dir=".length);
      continue;
    }
    if (arg === "--redaction-profile") {
      const value = argv[++i];
      if (!value) {
        return { help, version, options, error: "--redaction-profile requires a value" };
      }
      const profile = parseRedactionProfile(value);
      if (!profile) {
        return {
          help,
          version,
          options,
          error: `--redaction-profile must be local|share|strict (got ${value})`,
        };
      }
      options.redactionProfile = profile;
      continue;
    }
    if (arg.startsWith("--redaction-profile=")) {
      const profile = parseRedactionProfile(arg.slice("--redaction-profile=".length));
      if (!profile) {
        return {
          help,
          version,
          options,
          error: "--redaction-profile must be local|share|strict",
        };
      }
      options.redactionProfile = profile;
      continue;
    }
    if (arg === "--max-events") {
      const value = argv[++i];
      if (!value) return { help, version, options, error: "--max-events requires a number" };
      const n = Number(value);
      if (!Number.isFinite(n) || n < 1) {
        return { help, version, options, error: "--max-events must be a positive number" };
      }
      options.maxEvents = Math.floor(n);
      continue;
    }
    if (arg.startsWith("--max-events=")) {
      const n = Number(arg.slice("--max-events=".length));
      if (!Number.isFinite(n) || n < 1) {
        return { help, version, options, error: "--max-events must be a positive number" };
      }
      options.maxEvents = Math.floor(n);
      continue;
    }
    return { help, version, options, error: `Unknown argument: ${arg}` };
  }

  return { help, version, options };
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<number> {
  const parsed = parseMcpServerCliArgs(argv);
  if (parsed.error) {
    process.stderr.write(`${parsed.error}\n${HELP}`);
    return 2;
  }
  if (parsed.help) {
    process.stdout.write(HELP);
    return 0;
  }
  if (parsed.version) {
    process.stdout.write(`${packageVersion()}\n`);
    return 0;
  }
  await runReadOnlyMcpServer(parsed.options);
  return 0;
}
