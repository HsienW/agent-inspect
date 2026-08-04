import { describe, expect, it } from "vitest";

import { buildEvidenceCiPackage, verifyEvidenceDirectory } from "../../src/evidence/index.js";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

describe("evidence CI package (6.10-8)", () => {
  it("builds a verifiable evidence package for CI failure artifacts", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "ai-evidence-ci-"));
    try {
      const source = '{"schemaVersion":"0.2","runId":"run_ci","kind":"RUN","name":"ci"}\n';
      const redacted = source;
      const pkg = buildEvidenceCiPackage({
        generatorVersion: "6.10.0",
        runIds: ["run_ci"],
        sourceContents: { run_ci: source },
        redactedTraceJsonl: redacted,
        redactionProfile: "share",
        assessmentStatus: "UNSAFE",
        checkResultsJson: '{"aggregateStatus":"UNSAFE","runs":[]}\n',
        createdAt: "2026-08-02T00:00:00.000Z",
        semantics: {
          projectionVersion: "logical-lifecycle-0.1",
          finishedToolNames: ["lookup_orders"],
          contractStatus: "fail",
        },
      });
      await writeFile(path.join(tmp, "evidence.html"), pkg["evidence.html"], "utf-8");
      await writeFile(path.join(tmp, "evidence.json"), pkg["evidence.json"], "utf-8");
      await writeFile(path.join(tmp, "check-results.json"), pkg["check-results.json"], "utf-8");
      await writeFile(path.join(tmp, "trace.jsonl"), pkg["trace.jsonl"], "utf-8");

      const verified = await verifyEvidenceDirectory(tmp);
      expect(verified.ok).toBe(true);
      expect(pkg.manifest.semantics?.finishedToolNames).toEqual(["lookup_orders"]);
      expect(pkg.manifest.files.map((f) => f.path).sort()).toEqual([
        "check-results.json",
        "evidence.html",
        "trace.jsonl",
      ]);
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  });
});
