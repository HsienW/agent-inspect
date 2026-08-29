import { spawnSync } from "node:child_process";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const sourceScript = path.join(repoRoot, "scripts/demo-verify.mjs");
const sampleIds = ["sample-a", "sample-b"];

describe("demo:verify prerequisites", () => {
  let tmpRoot: string;

  beforeEach(async () => {
    tmpRoot = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-demo-verify-"));
    await createFixtureRepo(tmpRoot);
  });

  afterEach(async () => {
    await rm(tmpRoot, { recursive: true, force: true });
  });

  it("fails closed when the CLI artifact is missing", () => {
    const result = runVerifier(tmpRoot);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("CLI artifact missing; run pnpm build first");
    expect(result.stdout).not.toContain("[demo:verify] OK");
  });

  it(
    "verifies every manifest sample when the CLI artifact is present",
    async () => {
      await writeFakeCli(tmpRoot);

      const result = runVerifier(tmpRoot);
      const calls = await readInvocations(tmpRoot);

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("[demo:verify] OK");
      expect(calls).toHaveLength(sampleIds.length);
      expect(calls.map((args) => args.slice(0, 2))).toEqual(
        sampleIds.map(() => ["bundle", "verify"]),
      );
      expect(calls.map((args) => path.basename(path.dirname(args[2])))).toEqual(
        sampleIds,
      );
    },
  );

  it("fails when verification fails for any manifest sample", async () => {
    await writeFakeCli(tmpRoot);

    const result = runVerifier(tmpRoot, "sample-b");
    const calls = await readInvocations(tmpRoot);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("bundle verify failed for sample-b");
    expect(result.stdout).not.toContain("[demo:verify] OK");
    expect(calls).toHaveLength(sampleIds.length);
  });
});

async function createFixtureRepo(root: string): Promise<void> {
  await mkdir(path.join(root, "scripts"), { recursive: true });
  await copyFile(sourceScript, path.join(root, "scripts/demo-verify.mjs"));
  await writeFixtureFile(
    root,
    "package.json",
    `${JSON.stringify({ version: "1.0.0", type: "module" }, null, 2)}\n`,
  );
  await writeFixtureFile(
    root,
    "examples/evidence/demo-manifest.json",
    `${JSON.stringify(
      {
        packageVersion: "1.0.0",
        samples: sampleIds.map((id) => ({
          id,
          files: ["evidence/evidence.json"],
        })),
      },
      null,
      2,
    )}\n`,
  );

  for (const id of sampleIds) {
    await writeFixtureFile(
      root,
      `examples/evidence/${id}/evidence/evidence.json`,
      "{}\n",
    );
  }

  await writeFixtureFile(
    root,
    "docs/assets/showcase/provenance.json",
    `${JSON.stringify(
      {
        packageVersion: "1.0.0",
        assets: ["debug-tree", "check-pass-fail", "evidence-bundle"].map((id) => ({
          id,
          caption: `${id} caption`,
          transcript: `${id} transcript`,
        })),
      },
      null,
      2,
    )}\n`,
  );
  for (const relativePath of [
    "docs/assets/showcase/gif/debug-tree.gif",
    "docs/assets/showcase/gif/check-pass-fail.gif",
    "docs/assets/showcase/gif/evidence-bundle.gif",
    "docs/assets/showcase/diagrams/value-loop.svg",
  ]) {
    await writeFixtureFile(root, relativePath, "fixture\n");
  }
}

async function writeFakeCli(root: string): Promise<void> {
  await writeFixtureFile(
    root,
    "packages/cli/dist/index.cjs",
    [
      'const { appendFileSync } = require("node:fs");',
      "const args = process.argv.slice(2);",
      'appendFileSync(process.env.DEMO_VERIFY_INVOCATIONS, `${JSON.stringify(args)}\\n`);',
      "if (process.env.DEMO_VERIFY_FAIL_SAMPLE &&",
      "    args.some((arg) => arg.includes(process.env.DEMO_VERIFY_FAIL_SAMPLE))) {",
      "  process.exit(1);",
      "}",
      'process.stdout.write("{\\"ok\\":true}\\n");',
      "",
    ].join("\n"),
  );
}

function runVerifier(root: string, failSample?: string) {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DEMO_VERIFY_INVOCATIONS: path.join(root, "invocations.jsonl"),
  };
  if (failSample) env.DEMO_VERIFY_FAIL_SAMPLE = failSample;

  return spawnSync(process.execPath, [path.join(root, "scripts/demo-verify.mjs")], {
    cwd: root,
    encoding: "utf-8",
    env,
  });
}

async function readInvocations(root: string): Promise<string[][]> {
  const text = await readFile(path.join(root, "invocations.jsonl"), "utf-8");
  return text
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line) as string[]);
}

async function writeFixtureFile(
  root: string,
  relativePath: string,
  contents: string,
): Promise<void> {
  const target = path.join(root, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, contents, "utf-8");
}
