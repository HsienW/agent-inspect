import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  buildEvidenceManifest,
  serializeEvidenceManifest,
  sha256Hex,
  verifyEvidenceDirectory,
} from "../../src/evidence/index.js";

describe("verifyEvidenceDirectory (6.10-7)", () => {
  let tmp: string;

  beforeEach(async () => {
    tmp = await mkdtemp(path.join(os.tmpdir(), "ai-evidence-verify-"));
  });

  afterEach(async () => {
    await rm(tmp, { recursive: true, force: true });
  });

  it("passes for a matching directory and fails on tamper", async () => {
    const html = "<html>ok</html>\n";
    const trace = '{"schemaVersion":"0.2"}\n';
    await writeFile(path.join(tmp, "evidence.html"), html, "utf-8");
    await writeFile(path.join(tmp, "trace.jsonl"), trace, "utf-8");
    const manifest = buildEvidenceManifest({
      generatorVersion: "6.10.0",
      runIds: ["run_a"],
      traceSchemaVersions: ["0.2"],
      sourceHashes: [{ runId: "run_a", algorithm: "sha256", hash: sha256Hex("raw\n") }],
      redactionProfile: "share",
      assessmentStatus: "SAFE",
      files: [
        { path: "evidence.html", content: html },
        { path: "trace.jsonl", content: trace },
      ],
      createdAt: "2026-08-02T00:00:00.000Z",
    });
    await writeFile(path.join(tmp, "evidence.json"), serializeEvidenceManifest(manifest), "utf-8");

    const ok = await verifyEvidenceDirectory(tmp);
    expect(ok.ok).toBe(true);
    expect(ok.checkedFiles).toBe(2);

    await writeFile(path.join(tmp, "trace.jsonl"), "tampered\n", "utf-8");
    const bad = await verifyEvidenceDirectory(tmp);
    expect(bad.ok).toBe(false);
    expect(bad.issues.some((i) => i.code === "hash_mismatch")).toBe(true);
  });

  it("fails on unexpected files by default", async () => {
    const html = "<html></html>\n";
    await writeFile(path.join(tmp, "evidence.html"), html, "utf-8");
    const manifest = buildEvidenceManifest({
      generatorVersion: "6.10.0",
      runIds: ["run_a"],
      traceSchemaVersions: ["0.2"],
      sourceHashes: [{ runId: "run_a", algorithm: "sha256", hash: "a".repeat(64) }],
      redactionProfile: "share",
      assessmentStatus: "SAFE",
      files: [{ path: "evidence.html", content: html }],
    });
    await writeFile(path.join(tmp, "evidence.json"), serializeEvidenceManifest(manifest), "utf-8");
    await writeFile(path.join(tmp, "extra.txt"), "nope\n", "utf-8");

    const result = await verifyEvidenceDirectory(tmp);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === "file_unexpected")).toBe(true);
  });
});
