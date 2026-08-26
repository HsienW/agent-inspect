/**
 * Packed OpenAI Agents no-key consumer E2E.
 * Run from repo root after build: node scripts/packed-openai-agents-e2e.mjs
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
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
const adapterDir = path.join(root, "packages", "openai-agents");
const adapterManifest = JSON.parse(
  readFileSync(path.join(adapterDir, "package.json"), "utf8"),
);
const peerRange = adapterManifest.peerDependencies?.["@openai/agents"];
const runId = "trace_openai_agents_packed";
const traceDirName = ".agent-inspect-runs";

function fail(message, detail = "") {
  throw new Error(
    `[packed-openai-agents-e2e] ${message}${detail ? `\n${detail}` : ""}`,
  );
}

// npm/pnpm and .bin entries are cmd shims on Windows.
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
  run(label, "pnpm", [
    "--dir",
    packageDir,
    "pack",
    "--pack-destination",
    tarballDir,
  ], {
    env: {
      ...process.env,
      npm_config_json: "false",
      NPM_CONFIG_JSON: "false",
    },
  });
  const created = readdirSync(tarballDir).filter(
    (file) => file.endsWith(".tgz") && !before.has(file),
  );
  if (created.length !== 1) {
    fail(`${label} did not produce exactly one new tarball`, created.join(", "));
  }
  return path.join(tarballDir, created[0]);
}

function parseJson(label, output) {
  try {
    return JSON.parse(output);
  } catch (error) {
    fail(`${label} did not emit valid JSON`, `${error}\n${output}`);
  }
}

function withoutOpenAiCredentials() {
  const env = { ...process.env, AGENT_INSPECT_SILENT: "true" };
  for (const name of [
    "OPENAI_API_KEY",
    "OPENAI_ORG_ID",
    "OPENAI_ORGANIZATION",
    "OPENAI_PROJECT",
    "OPENAI_PROJECT_ID",
  ]) {
    delete env[name];
  }
  return env;
}

if (typeof peerRange !== "string" || peerRange.trim() === "") {
  fail("@agent-inspect/openai-agents has no supported @openai/agents peer range");
}

const tarballDir = mkdtempSync(path.join(os.tmpdir(), "agent-inspect-openai-pack-"));
const consumerDir = mkdtempSync(
  path.join(os.tmpdir(), "agent-inspect-openai-consumer-"),
);

try {
  const rootTarball = packPackage("root package pack", root, tarballDir);
  const adapterTarball = packPackage("OpenAI Agents adapter pack", adapterDir, tarballDir);

  writeFileSync(
    path.join(consumerDir, "package.json"),
    `${JSON.stringify(
      {
        name: "agent-inspect-openai-agents-packed-smoke",
        private: true,
        type: "module",
      },
      null,
      2,
    )}\n`,
  );

  run(
    "packed consumer install",
    "npm",
    [
      "install",
      "--ignore-scripts",
      rootTarball,
      adapterTarball,
      `@openai/agents@${peerRange}`,
    ],
    { cwd: consumerDir },
  );

  const consumerScript = path.join(consumerDir, "capture.mjs");
  writeFileSync(
    consumerScript,
    `import { setTraceProcessors } from "@openai/agents";
import { agentInspectProcessor } from "@agent-inspect/openai-agents";

const processor = agentInspectProcessor({
  traceDir: ${JSON.stringify(traceDirName)},
  workflowName: "openai-agents-packed-fixture",
  capture: "metadata-only",
});
setTraceProcessors([processor]);

const trace = {
  type: "trace",
  traceId: ${JSON.stringify(runId)},
  name: "ignored-by-workflow-option",
  groupId: "packed-fixture-group",
  metadata: { fixture: true },
};

function span(spanId, spanData, parentId = null) {
  return {
    type: "trace.span",
    traceId: trace.traceId,
    spanId,
    parentId,
    spanData,
    traceMetadata: { fixture: true },
    startedAt: "2026-08-26T00:00:00.000Z",
    endedAt: "2026-08-26T00:00:00.010Z",
    error: null,
  };
}

const agentSpan = span("span_agent", {
  type: "agent",
  name: "PackedFixtureAgent",
  tools: ["lookupFixture"],
  handoffs: [],
  output_type: "text",
});
const functionSpan = span(
  "span_function",
  {
    type: "function",
    name: "lookupFixture",
    input: { fixture: "input" },
    output: { fixture: "output" },
  },
  "span_agent",
);

await processor.onTraceStart(trace);
await processor.onSpanStart(agentSpan);
await processor.onSpanStart(functionSpan);
await processor.onSpanEnd(functionSpan);
await processor.onSpanEnd(agentSpan);
await processor.onTraceEnd(trace);
await processor.forceFlush();
await processor.shutdown();

const diagnostics = processor.getDiagnostics();
if (diagnostics.writeFailures || diagnostics.flushFailures || diagnostics.shutdownFailures) {
  throw new Error(\`unexpected processor diagnostics: \${JSON.stringify(diagnostics)}\`);
}
`,
  );

  const runtimeEnv = withoutOpenAiCredentials();
  run("synthetic adapter capture", process.execPath, [consumerScript], {
    cwd: consumerDir,
    env: runtimeEnv,
  });

  const bin = path.join(consumerDir, "node_modules", ".bin", "agent-inspect");
  if (!existsSync(bin)) fail("packed CLI binary missing after install");

  const list = run(
    "packed CLI list --json",
    bin,
    ["list", "--dir", traceDirName, "--json"],
    { cwd: consumerDir, env: runtimeEnv },
  );
  const listJson = parseJson("packed CLI list --json", list.stdout);
  const runs = Array.isArray(listJson) ? listJson : listJson.runs;
  if (!Array.isArray(runs) || !runs.some((run) => run?.runId === runId)) {
    fail("packed CLI list --json did not find the fixture run", list.stdout);
  }

  const view = run(
    "packed CLI view --json",
    bin,
    ["view", runId, "--dir", traceDirName, "--json"],
    { cwd: consumerDir, env: runtimeEnv },
  );
  const viewJson = parseJson("packed CLI view --json", view.stdout);
  const inspected = JSON.stringify(viewJson);
  for (const expected of [
    runId,
    "openai-agents-packed-fixture",
    "PackedFixtureAgent",
    "lookupFixture",
  ]) {
    if (!inspected.includes(expected)) {
      fail(`packed CLI view --json is missing ${expected}`, view.stdout);
    }
  }

  console.log(
    "[packed-openai-agents-e2e] OK: pack -> install -> fixture capture -> list -> view",
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  rmSync(tarballDir, { recursive: true, force: true });
  rmSync(consumerDir, { recursive: true, force: true });
}
