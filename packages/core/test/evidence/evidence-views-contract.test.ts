import { describe, expect, it } from "vitest";

import {
  buildEvidenceContractsViewHtml,
  buildEvidenceDiffViewHtml,
  buildEvidenceHtmlShell,
  buildEvidenceOutcomesViewHtml,
} from "../../src/evidence/index.js";
import type { PersistedInspectEvent } from "../../src/types/persisted-inspect-event.js";

describe("evidence contract/diff/outcome views (6.10-4)", () => {
  it("renders contracts with bounded escaped finding messages", () => {
    const html = buildEvidenceContractsViewHtml({
      aggregateStatus: "SAFE WITH WARNINGS",
      runs: [
        {
          runId: "run_a",
          status: "SAFE WITH WARNINGS",
          sourceStatus: "UNSAFE",
          errors: 0,
          warnings: 1,
          findings: 1,
        },
      ],
      findingSummaries: [
        {
          runId: "run_a",
          ruleId: "safety.raw-content",
          severity: "warning",
          category: "raw-content",
          detector: "prompt",
          message: 'possible prompt <script>alert(1)</script> ' + "x".repeat(250),
        },
      ],
    });
    expect(html).toContain("SAFE WITH WARNINGS");
    expect(html).toContain("safety.raw-content");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("…");
  });

  it("renders outcomes empty state and diff empty state", () => {
    const outcomes = buildEvidenceOutcomesViewHtml([
      { runId: "run_a", events: [] as PersistedInspectEvent[] },
    ]);
    expect(outcomes).toContain("No observed outcomes");

    const diff = buildEvidenceDiffViewHtml();
    expect(diff).toContain("No baseline/candidate pair");

    const shell = buildEvidenceHtmlShell({
      runIds: ["run_a"],
      assessmentStatus: "SAFE",
      redactionProfile: "share",
      verificationPolicy: "share",
      generatorName: "agent-inspect",
      generatorVersion: "6.10.0",
      viewBodies: {
        contracts: buildEvidenceContractsViewHtml({
          aggregateStatus: "SAFE",
          runs: [
            {
              runId: "run_a",
              status: "SAFE",
              errors: 0,
              warnings: 0,
              findings: 0,
            },
          ],
        }),
        outcomes,
        diff,
      },
    });
    expect(shell).toContain('id="view-contracts"');
    expect(shell).toContain('id="view-outcomes"');
    expect(shell).toContain('id="view-diff"');
    expect(shell).toContain("No baseline/candidate pair");
  });
});
