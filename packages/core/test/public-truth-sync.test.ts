import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const syncScript = path.join(repoRoot, "scripts/sync-public-truth.mjs");
const digestLib = path.join(repoRoot, "scripts/lib/claim-content-digest.mjs");
const demoVerify = path.join(repoRoot, "scripts/demo-verify.mjs");

describe("public-truth sync and claim digest", () => {
  it("computes a stable claim digest that ignores mechanical version numbers", async () => {
    const { computeClaimContentDigest } = await import(digestLib);
    const a = computeClaimContentDigest({
      allowedClaims: ["Current published baseline 6.17.3, schema 1.0, Node.js >=20, MIT"],
      bannedPhrases: ["waiting for adoption"],
    });
    const b = computeClaimContentDigest({
      allowedClaims: ["Current published baseline 6.17.4, schema 1.0, Node.js >=20, MIT"],
      bannedPhrases: ["waiting for adoption"],
    });
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);

    const c = computeClaimContentDigest({
      allowedClaims: ["Different claim"],
      bannedPhrases: ["waiting for adoption"],
    });
    expect(c).not.toBe(a);
  });

  it("synchronizes mechanical surfaces to the root package version and is idempotent", () => {
    const first = spawnSync(process.execPath, [syncScript], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(first.status, first.stderr || first.stdout).toBe(0);

    const pkgVersion = JSON.parse(
      readFileSync(path.join(repoRoot, "package.json"), "utf8"),
    ).version as string;
    const facts = JSON.parse(
      readFileSync(path.join(repoRoot, "docs/product/PUBLIC-PRODUCT-FACTS.json"), "utf8"),
    ) as { version: string; statusLine: string };
    expect(facts.version).toBe(pkgVersion);
    expect(facts.statusLine).toContain(pkgVersion);

    const ledger = JSON.parse(
      readFileSync(path.join(repoRoot, "docs/product/PUBLIC-CLAIM-LEDGER.json"), "utf8"),
    ) as { claimContentDigest: string; lastReviewedCommit: string };
    expect(ledger.claimContentDigest).toMatch(/^[a-f0-9]{64}$/);
    expect(ledger.lastReviewedCommit.length).toBeGreaterThan(0);

    const second = spawnSync(process.execPath, [syncScript, "--check"], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    expect(second.status, second.stderr || second.stdout).toBe(0);

    const check = spawnSync("pnpm", ["public-truth:check"], {
      cwd: repoRoot,
      encoding: "utf8",
      shell: true,
    });
    expect(check.status, check.stderr || check.stdout).toBe(0);
  });
});

describe("demo-verify fail-closed", () => {
  it("fails with AI_DEMO_VERIFY_CLI_MISSING when CLI dist is absent", () => {
    const cli = path.join(repoRoot, "packages/cli/dist/index.cjs");
    const backup = `${cli}.bak-demo-verify-test`;
    let moved = false;
    try {
      if (existsSync(cli)) {
        spawnSync("mv", [cli, backup], { cwd: repoRoot });
        moved = true;
      }
      const result = spawnSync(process.execPath, [demoVerify], {
        cwd: repoRoot,
        encoding: "utf8",
      });
      expect(result.status).not.toBe(0);
      expect(`${result.stdout}\n${result.stderr}`).toContain("AI_DEMO_VERIFY_CLI_MISSING");
    } finally {
      if (moved && existsSync(backup)) {
        spawnSync("mv", [backup, cli], { cwd: repoRoot });
      }
    }
  });
});
