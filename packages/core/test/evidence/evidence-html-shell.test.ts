import { describe, expect, it } from "vitest";

import {
  EVIDENCE_HTML_FILENAME,
  EVIDENCE_VIEW_IDS,
  buildEvidenceHtmlShell,
  encodeEmbeddedEvidenceJson,
} from "../../src/evidence/index.js";

describe("evidence HTML shell (6.10-2)", () => {
  it("is self-contained with CSP and no external network refs", () => {
    const html = buildEvidenceHtmlShell({
      runIds: ["run_<script>alert(1)</script>"],
      assessmentStatus: "SAFE WITH WARNINGS",
      sourceStatus: "UNSAFE",
      redactionProfile: "share",
      verificationPolicy: "share",
      generatorName: "agent-inspect",
      generatorVersion: "6.10.0",
      createdAt: "2026-08-02T00:00:00.000Z",
      summaryText: 'hello <img src=x onerror=alert(1)> & "quotes"',
      checkSummary: {
        aggregateStatus: "SAFE WITH WARNINGS",
        runs: [
          {
            runId: "run_<script>alert(1)</script>",
            status: "SAFE WITH WARNINGS",
            sourceStatus: "UNSAFE",
            errors: 0,
            warnings: 1,
            findings: 1,
          },
        ],
      },
    });

    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('http-equiv="Content-Security-Policy"');
    expect(html).toContain("default-src 'none'");
    expect(html).not.toMatch(/https?:\/\//i);
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("run_&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
    expect(html).toContain('id="ai-evidence-data"');
    expect(html).toContain('aria-label="Evidence views"');
    for (const id of EVIDENCE_VIEW_IDS) {
      expect(html).toContain(`id="view-${id}"`);
    }
    expect(EVIDENCE_HTML_FILENAME).toBe("evidence.html");
  });

  it("encodes embedded JSON so script breakouts cannot appear", () => {
    const encoded = encodeEmbeddedEvidenceJson({
      note: "</script><script>alert(1)</script>",
    });
    expect(encoded.includes("<")).toBe(false);
    expect(encoded.includes(">")).toBe(false);
    expect(JSON.parse(encoded).note).toContain("</script>");
  });
});
