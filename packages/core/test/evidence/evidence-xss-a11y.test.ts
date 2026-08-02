/**
 * v6.10-9 — Evidence HTML accessibility + XSS corpus regression.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  buildEvidenceCausalFailureViewHtml,
  buildEvidenceContractsViewHtml,
  buildEvidenceHtmlShell,
  buildEvidenceOutcomesViewHtml,
  buildEvidenceProvenanceViewHtml,
  buildEvidenceSafetyViewHtml,
  buildEvidenceTimelineViewHtml,
  buildEvidenceToolsLlmViewHtml,
  buildEvidenceTreeViewHtml,
  encodeEmbeddedEvidenceJson,
} from "../../src/evidence/index.js";
import type { InspectEvent, InspectRunTree } from "../../src/types/inspect-event.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const corpusPath = path.join(repoRoot, "fixtures/evidence/xss-corpus.json");

interface XssCorpus {
  payloads: string[];
}

function treeWithPayload(payload: string): InspectRunTree {
  const event: InspectEvent = {
    eventId: "e1",
    runId: `run_${payload.slice(0, 12)}`,
    name: payload,
    kind: "TOOL",
    status: "error",
    durationMs: 5,
    timestamp: 1,
    confidence: "explicit",
    source: { type: "manual" },
    attributes: { message: payload },
  };
  return {
    runId: event.runId,
    status: "error",
    startedAt: 1,
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

function assertNoRawPayload(html: string, payload: string): void {
  // Embedded application/json is not executed as script; check HTML surfaces only.
  const withoutJson = html.replace(
    /<script type="application\/json"[^>]*>[\s\S]*?<\/script>/i,
    "",
  );
  if (/[<>]/.test(payload)) {
    expect(withoutJson).not.toContain(payload);
    expect(withoutJson).toContain("&lt;");
  } else if (/["']/.test(payload)) {
    // Quotes must be entity-escaped when interpolated into HTML text/attrs.
    expect(withoutJson).not.toContain(payload);
  }
  // Unescaped event-handler attributes / risky tags must not appear as real HTML.
  expect(withoutJson).not.toMatch(/<[^>]+\son\w+\s*=/i);
  expect(withoutJson).not.toMatch(/<iframe\b/i);
  expect(withoutJson).not.toMatch(/<svg\b/i);
  expect(withoutJson).not.toMatch(/href\s*=\s*["']javascript:/i);
}

describe("evidence XSS corpus (6.10-9)", () => {
  const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8")) as XssCorpus;

  it("escapes every corpus payload across shell and views", () => {
    expect(corpus.payloads.length).toBeGreaterThan(5);

    for (const payload of corpus.payloads) {
      const trees = [treeWithPayload(payload)];
      const html = buildEvidenceHtmlShell({
        runIds: [payload],
        assessmentStatus: "SAFE",
        redactionProfile: "share",
        verificationPolicy: "share",
        generatorName: "agent-inspect",
        generatorVersion: "6.10.0",
        summaryText: payload,
        checkSummary: {
          aggregateStatus: "SAFE",
          runs: [
            {
              runId: payload,
              status: "SAFE",
              errors: 0,
              warnings: 0,
              findings: 0,
            },
          ],
        },
        viewBodies: {
          tree: buildEvidenceTreeViewHtml(trees),
          timeline: buildEvidenceTimelineViewHtml(trees),
          causal: buildEvidenceCausalFailureViewHtml(trees),
          "tools-llm": buildEvidenceToolsLlmViewHtml(trees),
          contracts: buildEvidenceContractsViewHtml({
            aggregateStatus: "SAFE",
            runs: [
              {
                runId: payload,
                status: "SAFE",
                errors: 0,
                warnings: 0,
                findings: 0,
              },
            ],
            findingSummaries: [
              {
                runId: payload,
                ruleId: "xss.test",
                severity: "warning",
                message: payload,
              },
            ],
          }),
          outcomes: buildEvidenceOutcomesViewHtml([{ runId: payload, events: [] }]),
          safety: buildEvidenceSafetyViewHtml({
            artifactStatus: "SAFE",
            redactionProfile: "share",
            verificationPolicy: "share",
            findingSummaries: [
              {
                runId: payload,
                ruleId: "xss.test",
                severity: "warning",
                message: payload,
              },
            ],
          }),
          provenance: buildEvidenceProvenanceViewHtml({
            generatorName: "agent-inspect",
            generatorVersion: "6.10.0",
            evidenceFormatVersion: "1.0",
            runIds: [payload],
            traceSchemaVersions: ["0.2"],
            sourceHashes: [
              {
                runId: payload,
                algorithm: "sha256",
                hash: "a".repeat(64),
              },
            ],
            packagedFiles: [{ path: "evidence.html", role: "report" }],
            note: payload,
          }),
        },
      });

      assertNoRawPayload(html, payload);
      expect(html).toContain("Content-Security-Policy");
      expect(html).toContain("default-src 'none'");
      expect(html).not.toMatch(/https?:\/\//i);
    }
  });

  it("encodes embedded JSON without raw script breakouts", () => {
    for (const payload of corpus.payloads) {
      const encoded = encodeEmbeddedEvidenceJson({ note: payload });
      expect(encoded.includes("<")).toBe(false);
      expect(encoded.includes(">")).toBe(false);
    }
  });
});

describe("evidence HTML accessibility (6.10-9)", () => {
  it("exposes landmarks, keyboard targets, and print styles", () => {
    const html = buildEvidenceHtmlShell({
      runIds: ["run_a11y"],
      assessmentStatus: "SAFE",
      redactionProfile: "share",
      verificationPolicy: "share",
      generatorName: "agent-inspect",
      generatorVersion: "6.10.0",
    });

    expect(html).toContain('lang="en"');
    expect(html).toContain("<nav aria-label=\"Evidence views\">");
    expect(html).toContain('id="main"');
    expect(html).toContain('href="#view-summary"');
    expect(html).toContain("tabindex=\"-1\"");
    expect(html).toContain("@media print");
    expect(html).toContain("aria-current");
    expect(html).toMatch(/<h1>/);
    expect(html).toMatch(/<h2>/);
  });
});
