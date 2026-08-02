/**
 * Packed five-minute quickstart E2E from npm tarball.
 * Run from repo root after build: node scripts/packed-quickstart-e2e.mjs
 */
import { execSync, spawnSync } from "node:child_process";
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
const expectedVersion = JSON.parse(
  readFileSync(path.join(root, "package.json"), "utf8"),
).version;

function fail(message, detail = "") {
  console.error(`[quickstart-e2e] ${message}`);
  if (detail) console.error(detail);
  process.exit(1);
}

// .bin entries are cmd shims on Windows and can only be spawned through a
// shell; POSIX behavior is unchanged.
function spawnBin(bin, args, opts = {}) {
  return spawnSync(bin, args, {
    encoding: "utf8",
    shell: process.platform === "win32",
    ...opts,
  });
}

const tmpRoot = mkdtempSync(path.join(os.tmpdir(), "agent-inspect-quickstart-"));
try {
  execSync("pnpm pack --pack-destination " + JSON.stringify(tmpRoot), {
    cwd: root,
    stdio: "pipe",
  });
  const tgz = readdirSync(tmpRoot).find((file) => file.endsWith(".tgz"));
  if (!tgz) fail("no tarball produced");
  const installDir = mkdtempSync(path.join(os.tmpdir(), "agent-inspect-quickstart-install-"));
  // npm only links .bin shims for a real consumer project; without a
  // package.json newer npm versions install the tarball but skip the bins.
  writeFileSync(
    path.join(installDir, "package.json"),
    `${JSON.stringify({ name: "agent-inspect-quickstart-smoke", private: true, type: "module" }, null, 2)}\n`,
  );
  execSync(`npm install ${JSON.stringify(path.join(tmpRoot, tgz))}`, {
    cwd: installDir,
    stdio: "pipe",
  });

  const bin = path.join(installDir, "node_modules", ".bin", "agent-inspect");
  if (!existsSync(bin)) fail("CLI binary missing after install");

  const init = spawnBin(bin, ["init", "--yes"], { cwd: installDir });
  if (init.status !== 0) {
    fail("agent-inspect init --yes failed", init.stderr || init.stdout);
  }

  const demoPath = path.join(installDir, "examples", "agent-inspect-demo.mjs");
  if (!existsSync(demoPath)) fail("demo script missing after init");
  execSync(`node ${JSON.stringify(demoPath)}`, { cwd: installDir, stdio: "pipe" });

  const list = spawnBin(bin, ["list", "--dir", ".agent-inspect", "--json"], {
    cwd: installDir,
    encoding: "utf8",
  });
  if (list.status !== 0) fail("list failed", list.stderr);
  const runs = JSON.parse(list.stdout);
  const runId = Array.isArray(runs) && runs[0]?.runId ? runs[0].runId : runs.runs?.[0]?.runId;
  if (!runId) fail("no run id from list", list.stdout);

  const verify = spawnBin(bin, ["verify-safe", runId, "--dir", ".agent-inspect", "--json"], {
    cwd: installDir,
    encoding: "utf8",
  });
  if (verify.status !== 0) fail("verify-safe failed", verify.stderr || verify.stdout);

  const bundleDir = path.join(installDir, "evidence-bundle");
  const bundle = spawnBin(
    bin,
    ["bundle", runId, "--dir", ".agent-inspect", "--out", bundleDir, "--json"],
    { cwd: installDir, encoding: "utf8" },
  );
  if (bundle.status !== 0) fail("bundle failed", bundle.stderr || bundle.stdout);
  if (!existsSync(path.join(bundleDir, "evidence.html"))) {
    fail("bundle missing evidence.html");
  }
  if (!existsSync(path.join(bundleDir, "evidence.json"))) {
    fail("bundle missing evidence.json");
  }
  const evidenceHtml = readFileSync(path.join(bundleDir, "evidence.html"), "utf8");
  if (!evidenceHtml.includes("Content-Security-Policy")) {
    fail("evidence.html missing CSP");
  }
  if (/https?:\/\//i.test(evidenceHtml.replace(/Content-Security-Policy[^>]*>/, ""))) {
    // Allow CSP header text only; body must stay offline.
    const body = evidenceHtml.replace(/<meta[^>]*Content-Security-Policy[^>]*>/i, "");
    if (/https?:\/\//i.test(body)) fail("evidence.html contains external URL refs");
  }

  const bundleVerify = spawnBin(bin, ["bundle", "verify", bundleDir], {
    cwd: installDir,
    encoding: "utf8",
  });
  if (bundleVerify.status !== 0) {
    fail("bundle verify failed", bundleVerify.stderr || bundleVerify.stdout);
  }
  const verifyOut = `${bundleVerify.stdout || ""}\n${bundleVerify.stderr || ""}`;
  if (!/Evidence verify:\s*pass/i.test(verifyOut)) {
    fail("bundle verify did not report pass", verifyOut);
  }

  const htmlOut = path.join(installDir, "evidence-html");
  const htmlBundle = spawnBin(
    bin,
    ["bundle", runId, "--dir", ".agent-inspect", "--format", "html", "--out", htmlOut, "--json"],
    { cwd: installDir, encoding: "utf8" },
  );
  if (htmlBundle.status !== 0) fail("bundle --format html failed", htmlBundle.stderr || htmlBundle.stdout);
  if (!existsSync(path.join(htmlOut, "evidence.html")) || !existsSync(path.join(htmlOut, "evidence.json"))) {
    fail("html format missing evidence sidecar pair");
  }

  const zipOut = path.join(installDir, "evidence-bundle.zip");
  const zipBundle = spawnBin(
    bin,
    ["bundle", runId, "--dir", ".agent-inspect", "--format", "zip", "--out", zipOut, "--json"],
    { cwd: installDir, encoding: "utf8" },
  );
  if (zipBundle.status !== 0) fail("bundle --format zip failed", zipBundle.stderr || zipBundle.stdout);
  if (!existsSync(zipOut)) fail("zip format missing archive file");
  const zipMagic = readFileSync(zipOut).subarray(0, 2).toString("utf8");
  if (zipMagic !== "PK") fail(`zip magic mismatch: ${zipMagic}`);

  const version = spawnBin(bin, ["--version"], { cwd: installDir });
  if (version.stdout.trim() !== expectedVersion) {
    fail(`version mismatch: expected ${expectedVersion}, got ${version.stdout.trim()}`);
  }

  console.log(
    `[quickstart-e2e] OK: init → demo → list → verify-safe → bundle → bundle verify → html/zip (${expectedVersion}; ${process.platform})`,
  );
} finally {
  rmSync(tmpRoot, { recursive: true, force: true });
}
