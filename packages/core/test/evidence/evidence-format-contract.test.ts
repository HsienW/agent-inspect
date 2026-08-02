/**
 * v6.10-0 — Evidence format contract (manifest shape lock).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const examplePath = path.join(repoRoot, "fixtures/evidence/evidence.v1.example.json");
const docPath = path.join(repoRoot, "docs/EVIDENCE-FORMAT.md");

const STATUSES = new Set(["SAFE", "SAFE WITH WARNINGS", "UNSAFE", "UNKNOWN"]);
const SHA256_RE = /^[a-f0-9]{64}$/i;

interface EvidenceFile {
  path: string;
  sha256: string;
  role?: string;
}

interface EvidenceManifest {
  evidenceFormatVersion: string;
  generator: { name: string; version: string };
  createdAt?: string;
  source: {
    runIds: string[];
    traceSchemaVersions: string[];
    sourceHashes: { runId: string; algorithm: string; hash: string }[];
  };
  policy: { redactionProfile: string; verificationPolicy: string };
  assessment: { status: string; sourceStatus?: string; note?: string };
  files: EvidenceFile[];
}

describe("evidence format contract (6.10-0)", () => {
  it("public contract doc exists", () => {
    expect(fs.existsSync(docPath)).toBe(true);
    const text = fs.readFileSync(docPath, "utf8");
    expect(text).toContain("evidenceFormatVersion");
    expect(text).toContain("bundle verify");
  });

  it("example manifest matches Evidence v1.0 required shape", () => {
    expect(fs.existsSync(examplePath)).toBe(true);
    const manifest = JSON.parse(fs.readFileSync(examplePath, "utf8")) as EvidenceManifest;

    expect(manifest.evidenceFormatVersion).toBe("1.0");
    expect(manifest.generator.name).toBe("agent-inspect");
    expect(manifest.generator.version.length).toBeGreaterThan(0);
    expect(Array.isArray(manifest.source.runIds)).toBe(true);
    expect(manifest.source.runIds.length).toBeGreaterThan(0);
    expect(manifest.source.traceSchemaVersions.length).toBeGreaterThan(0);
    expect(manifest.source.sourceHashes.length).toBeGreaterThan(0);
    for (const item of manifest.source.sourceHashes) {
      expect(item.algorithm).toBe("sha256");
      expect(SHA256_RE.test(item.hash)).toBe(true);
      expect(manifest.source.runIds).toContain(item.runId);
    }

    expect(["local", "share", "strict"]).toContain(manifest.policy.redactionProfile);
    expect(["development", "share", "strict", "local"]).toContain(
      manifest.policy.verificationPolicy,
    );
    expect(STATUSES.has(manifest.assessment.status)).toBe(true);
    if (manifest.assessment.sourceStatus !== undefined) {
      expect(STATUSES.has(manifest.assessment.sourceStatus)).toBe(true);
    }

    expect(manifest.files.length).toBeGreaterThan(0);
    const paths = new Set<string>();
    for (const file of manifest.files) {
      expect(file.path.includes("..")).toBe(false);
      expect(path.isAbsolute(file.path)).toBe(false);
      expect(SHA256_RE.test(file.sha256)).toBe(true);
      expect(paths.has(file.path)).toBe(false);
      paths.add(file.path);
    }
    expect(paths.has("evidence.html") || [...paths].some((p) => p.endsWith(".html"))).toBe(true);
  });
});
