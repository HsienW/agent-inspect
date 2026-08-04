/**
 * Packed semantic loop E2E: check → gate → bundle → bundle verify
 * against the anonymized bridged-tool pilot fixture (N-1/N-2/N-3).
 *
 * Run from repo root after build:
 *   node scripts/packed-semantic-loop-e2e.mjs
 *
 * Uses a freshly packed agent-inspect tarball (same pattern as quickstart E2E).
 */
import { execSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
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
const expectedVersion = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
).version;
const fixtureRel = "fixtures/langgraph/pilot-shaped-bridged-tool.jsonl";

function fail(message, detail = "") {
  console.error(`[semantic-loop-e2e] ${message}`);
  if (detail) console.error(detail);
  process.exit(1);
}

function spawnBin(bin, args, opts = {}) {
  return spawnSync(bin, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    ...opts,
  });
}

const fixtureSrc = path.join(root, fixtureRel);
if (!existsSync(fixtureSrc)) fail(`missing fixture ${fixtureRel}`);

const tmpRoot = mkdtempSync(path.join(os.tmpdir(), "agent-inspect-semantic-"));
try {
  execSync("pnpm pack --pack-destination " + JSON.stringify(tmpRoot), {
    cwd: root,
    stdio: "pipe",
  });
  const tgz = readdirSync(tmpRoot).find((file) => file.endsWith(".tgz"));
  if (!tgz) fail("no tarball produced");

  const installDir = mkdtempSync(path.join(os.tmpdir(), "agent-inspect-semantic-install-"));
  writeFileSync(
    path.join(installDir, "package.json"),
    `${JSON.stringify({ name: "agent-inspect-semantic-smoke", private: true, type: "module" }, null, 2)}\n`,
  );
  execSync(`npm install ${JSON.stringify(path.join(tmpRoot, tgz))}`, {
    cwd: installDir,
    stdio: "pipe",
  });

  const bin = path.join(installDir, "node_modules", ".bin", "agent-inspect");
  if (!existsSync(bin)) fail("CLI binary missing after install");

  const traceDir = path.join(installDir, ".agent-inspect", "runs");
  mkdirSync(traceDir, { recursive: true });
  const runFile = path.join(traceDir, "pilot_anon_bridged_tool.jsonl");
  copyFileSync(fixtureSrc, runFile);

  const check = spawnBin(
    bin,
    [
      "check",
      "pilot_anon_bridged_tool",
      "--dir",
      ".agent-inspect",
      "--required-tool",
      "lookup_orders",
      "--json",
    ],
    { cwd: installDir },
  );
  if (check.status !== 0) {
    fail("check failed on bridged pilot fixture", check.stderr || check.stdout);
  }
  const checkJson = JSON.parse(check.stdout);
  if (checkJson.status !== "pass" && checkJson.ok !== true) {
    fail("check did not pass", check.stdout);
  }

  const gate = spawnBin(
    bin,
    ["gate", "--dir", ".agent-inspect", "--json"],
    { cwd: installDir },
  );
  if (gate.status !== 0) {
    fail("gate failed", gate.stderr || gate.stdout);
  }

  const bundle = spawnBin(
    bin,
    [
      "bundle",
      "pilot_anon_bridged_tool",
      "--dir",
      ".agent-inspect",
      "--profile",
      "share",
      "--allow-unsafe",
    ],
    { cwd: installDir },
  );
  if (bundle.status !== 0) {
    fail("bundle failed", bundle.stderr || bundle.stdout);
  }

  const bundlesRoot = path.join(installDir, ".agent-inspect", "bundles");
  const bundleDirs = existsSync(bundlesRoot)
    ? readdirSync(bundlesRoot).map((name) => path.join(bundlesRoot, name))
    : [];
  const bundleDir =
    bundleDirs.find((dir) => dir.includes("pilot_anon")) ?? bundleDirs[0];
  if (!bundleDir || !existsSync(bundleDir)) {
    fail("bundle directory missing", bundle.stdout);
  }

  const verify = spawnBin(bin, ["bundle", "verify", bundleDir], {
    cwd: installDir,
  });
  if (verify.status !== 0) {
    fail("bundle verify failed", verify.stderr || verify.stdout);
  }

  console.log(
    `[semantic-loop-e2e] OK: check → gate → bundle → verify (${expectedVersion}; ${fixtureRel})`,
  );
} finally {
  rmSync(tmpRoot, { recursive: true, force: true });
}
