/**
 * Packed MCP consumer E2E — verifies published wrapper shares the application
 * AgentInspect runtime (no split inspectRun context).
 * Run from repo root after build: node scripts/packed-mcp-e2e.mjs
 */
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mcpDir = path.join(root, "packages", "mcp");
const traceDirName = ".agent-inspect-runs";
const RUN_NAME = "mcp-packed-shared-runtime";

function fail(message, detail = "") {
  throw new Error(
    `[packed-mcp-e2e] ${message}${detail ? `\n${detail}` : ""}`,
  );
}

function spawnCli(command, args, options = {}) {
  const useShell =
    process.platform === "win32" && !command.toLowerCase().endsWith(".exe");
  const safeArgs = useShell
    ? args.map((arg) => (/\s/.test(arg) ? `"${arg}"` : arg))
    : args;
  return spawnSync(command, safeArgs, {
    encoding: "utf8",
    shell: useShell,
    ...options,
  });
}

function run(label, command, args, options = {}) {
  const result = spawnCli(command, args, options);
  if (result.status !== 0) {
    fail(
      `${label} failed`,
      `${result.error?.message ?? ""}\n${result.stdout || ""}\n${result.stderr || ""}`.trim(),
    );
  }
  return result;
}

function packPackage(label, packageDir, tarballDir) {
  const before = new Set(readdirSync(tarballDir));
  run(
    label,
    "pnpm",
    ["--dir", packageDir, "pack", "--pack-destination", tarballDir],
    {
      env: {
        ...process.env,
        npm_config_json: "false",
        NPM_CONFIG_JSON: "false",
      },
    },
  );
  const created = readdirSync(tarballDir).filter(
    (file) => file.endsWith(".tgz") && !before.has(file),
  );
  if (created.length !== 1) {
    fail(`${label} did not produce exactly one new tarball`, created.join(", "));
  }
  return path.join(tarballDir, created[0]);
}

function assertMcpBundleExternalizesAgentInspect() {
  const esm = readFileSync(path.join(mcpDir, "dist", "index.mjs"), "utf8");
  const cjs = readFileSync(path.join(mcpDir, "dist", "index.cjs"), "utf8");
  if (
    !/from\s+["']agent-inspect["']/.test(esm) &&
    !/import\(["']agent-inspect["']\)/.test(esm)
  ) {
    fail("MCP ESM bundle does not externalize agent-inspect import");
  }
  if (
    !/require\(["']agent-inspect["']\)/.test(cjs) &&
    !/from\s+["']agent-inspect["']/.test(cjs)
  ) {
    fail("MCP CJS bundle does not externalize agent-inspect require/import");
  }
  if (/function\s+inspectRun\b/.test(esm) || /function\s+createInspector\b/.test(esm)) {
    fail("MCP ESM bundle appears to embed an AgentInspect runtime");
  }
  if (/function\s+inspectRun\b/.test(cjs) || /function\s+createInspector\b/.test(cjs)) {
    fail("MCP CJS bundle appears to embed an AgentInspect runtime");
  }
}

function consumerScript(kind) {
  const isEsm = kind === "esm";
  const runName = isEsm ? RUN_NAME : `${RUN_NAME}-cjs`;
  const serverName = isEsm ? "packed-fixture" : "packed-fixture-cjs";
  const importBlock = isEsm
    ? `import { inspectRun } from "agent-inspect";
import { wrapMcpClient } from "@agent-inspect/mcp";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";`
    : `const { inspectRun } = require("agent-inspect");
const { wrapMcpClient } = require("@agent-inspect/mcp");
const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");`;

  const body = `
${importBlock}

async function main() {
  process.env.AGENT_INSPECT_TRACE_DIR = ${JSON.stringify(traceDirName)};
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => {
    warnings.push(args.map(String).join(" "));
    originalWarn(...args);
  };

  const client = {
    async listTools() {
      return { tools: [{ name: "echo" }] };
    },
    async callTool({ name, arguments: args }) {
      if (name === "boom") {
        const err = new Error("mcp boom");
        err.code = "ETIMEDOUT";
        throw err;
      }
      return {
        content: [
          {
            type: "text",
            text: "ok:" + name + ":" + JSON.stringify(args ?? {}),
          },
        ],
      };
    },
  };
  const wrapped = wrapMcpClient(client, { serverName: ${JSON.stringify(serverName)} });

  const result = await inspectRun(${JSON.stringify(runName)}, async () => {
    const listed = await wrapped.listTools();
    const called = await wrapped.callTool({ name: "echo", arguments: { n: 1 } });
    return { listed, called };
  }, { traceDir: ${JSON.stringify(traceDirName)}, silent: true });

  if (!result.listed?.tools?.some((t) => t.name === "echo")) {
    throw new Error("listTools return value not preserved");
  }
  if (!JSON.stringify(result.called).includes("ok:echo")) {
    throw new Error("callTool return value not preserved");
  }

  let thrown;
  try {
    await inspectRun("mcp-packed-throw", async () => {
      await wrapped.callTool({ name: "boom", arguments: {} });
    }, { traceDir: ${JSON.stringify(traceDirName)}, silent: true });
  } catch (error) {
    thrown = error;
  }
  if (!(thrown instanceof Error) || thrown.message !== "mcp boom") {
    throw new Error("thrown application error was not preserved");
  }

  console.warn = originalWarn;
  const outside = warnings.filter((w) => /outside inspectRun/i.test(w));
  if (outside.length > 0) {
    throw new Error("outside-context warning emitted: " + outside.join(" | "));
  }

  const files = readdirSync(${JSON.stringify(traceDirName)}).filter((f) => f.endsWith(".jsonl"));
  if (files.length === 0) {
    throw new Error("no JSONL traces written under the application inspectRun");
  }
  const lines = files.flatMap((f) =>
    readFileSync(path.join(${JSON.stringify(traceDirName)}, f), "utf8")
      .split("\\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line)),
  );
  const runEvent = lines.find(
    (event) =>
      event &&
      event.name === ${JSON.stringify(runName)} &&
      typeof event.runId === "string",
  );
  if (!runEvent?.runId) {
    throw new Error("application run event missing from persisted trace");
  }
  const mcpUnderRun = lines.filter(
    (event) =>
      event &&
      event.runId === runEvent.runId &&
      typeof event.name === "string" &&
      (event.name === "mcp:tools/list" || event.name === "mcp:echo"),
  );
  if (mcpUnderRun.length < 2) {
    throw new Error(
      "MCP steps were not persisted under the application inspectRun (shared runtime failed)",
    );
  }
  console.log(${JSON.stringify(`[packed-mcp-e2e] ${kind.toUpperCase()} OK`)});
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;
  return body;
}

const tarballDir = mkdtempSync(path.join(os.tmpdir(), "ai-mcp-pack-"));
const consumerDir = mkdtempSync(path.join(os.tmpdir(), "ai-mcp-consumer-"));

try {
  assertMcpBundleExternalizesAgentInspect();

  const rootTarball = packPackage("root package pack", root, tarballDir);
  const mcpTarball = packPackage("mcp package pack", mcpDir, tarballDir);

  writeFileSync(
    path.join(consumerDir, "package.json"),
    JSON.stringify({ name: "packed-mcp-consumer", private: true, type: "module" }),
  );

  run(
    "packed consumer install",
    "npm",
    ["install", "--ignore-scripts", rootTarball, mcpTarball],
    { cwd: consumerDir },
  );

  const esmScript = path.join(consumerDir, "run-esm.mjs");
  const cjsScript = path.join(consumerDir, "run-cjs.cjs");
  writeFileSync(esmScript, consumerScript("esm"));
  writeFileSync(cjsScript, consumerScript("cjs"));

  run("ESM packed MCP shared runtime", process.execPath, [esmScript], {
    cwd: consumerDir,
  });
  run("CJS packed MCP shared runtime", process.execPath, [cjsScript], {
    cwd: consumerDir,
  });

  console.log(
    "[packed-mcp-e2e] OK: external agent-inspect + packed ESM/CJS share inspectRun context",
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  rmSync(tarballDir, { recursive: true, force: true });
  rmSync(consumerDir, { recursive: true, force: true });
}
