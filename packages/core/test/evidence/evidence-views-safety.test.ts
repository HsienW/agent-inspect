import { describe, expect, it } from "vitest";

import {
  buildEvidenceCircuitViewHtml,
  buildEvidenceHtmlShell,
  buildEvidenceProvenanceViewHtml,
  buildEvidenceSafetyViewHtml,
  buildEvidenceToolsLlmViewHtml,
} from "../../src/evidence/index.js";
import type { InspectEvent, InspectRunTree } from "../../src/types/inspect-event.js";

function treeWithTool(): InspectRunTree {
  const event: InspectEvent = {
    eventId: "t1",
    runId: "run_s",
    name: "search<script>",
    kind: "TOOL",
    status: "ok",
    durationMs: 12,
    timestamp: 1,
    confidence: "explicit",
    source: { type: "manual" },
  };
  return {
    runId: "run_s",
    status: "ok",
    children: [{ depth: 0, event, children: [] }],
    metadata: {
      totalEvents: 1,
      confidenceBreakdown: { explicit: 1, correlated: 0, heuristic: 0, unknown: 0 },
      kinds: {
        RUN: 0,
        AGENT: 0,
        LLM: 0,
        TOOL: 1,
        CHAIN: 0,
        RETRIEVER: 0,
        DECISION: 0,
        RESULT: 0,
        ERROR: 0,
        LOGIC: 0,
        LOG: 0,
        OUTCOME: 0,
      },
    },
  };
}

describe("evidence safety/provenance/tools views (6.10-5)", () => {
  it("renders safety, provenance, tools, and circuit panels", () => {
    const safety = buildEvidenceSafetyViewHtml({
      artifactStatus: "SAFE",
      sourceStatus: "UNSAFE",
      redactionProfile: "share",
      verificationPolicy: "share",
      redaction: {
        totalFindings: 1,
        runs: [{ runId: "run_s", findings: 1, detectors: ["apiKey"] }],
      },
      findingSummaries: [
        {
          runId: "run_s",
          ruleId: "safety.credential",
          severity: "error",
          category: "credential",
          detector: "apiKey",
          message: "secret <b>x</b>",
        },
      ],
    });
    expect(safety).toContain("Artifact status");
    expect(safety).toContain("apiKey");
    expect(safety).toContain("&lt;b&gt;");

    const provenance = buildEvidenceProvenanceViewHtml({
      generatorName: "agent-inspect",
      generatorVersion: "6.10.0",
      evidenceFormatVersion: "1.0",
      runIds: ["run_s"],
      traceSchemaVersions: ["0.2"],
      sourceHashes: [
        {
          runId: "run_s",
          algorithm: "sha256",
          hash: "a".repeat(64),
        },
      ],
      packagedFiles: [{ path: "evidence.html", role: "report" }],
    });
    expect(provenance).toContain("Source hashes");
    expect(provenance).toContain("evidence.html");

    const tools = buildEvidenceToolsLlmViewHtml([treeWithTool()]);
    expect(tools).toContain("TOOL");
    expect(tools).toContain("search&lt;script&gt;");

    const circuit = buildEvidenceCircuitViewHtml();
    expect(circuit).toContain("No circuit or guardrail findings");

    const shell = buildEvidenceHtmlShell({
      runIds: ["run_s"],
      assessmentStatus: "SAFE",
      redactionProfile: "share",
      verificationPolicy: "share",
      generatorName: "agent-inspect",
      generatorVersion: "6.10.0",
      viewBodies: {
        safety,
        provenance,
        "tools-llm": tools,
        circuit,
      },
    });
    expect(shell).toContain('id="view-safety"');
    expect(shell).toContain('id="view-provenance"');
    expect(shell).toContain('id="view-tools-llm"');
    expect(shell).toContain('id="view-circuit"');
  });
});
