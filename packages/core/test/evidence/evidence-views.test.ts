import { describe, expect, it } from "vitest";

import {
  buildEvidenceCausalFailureViewHtml,
  buildEvidenceHtmlShell,
  buildEvidenceTimelineViewHtml,
  buildEvidenceTreeViewHtml,
} from "../../src/evidence/index.js";
import type { InspectEvent, InspectRunTree } from "../../src/types/inspect-event.js";

function event(partial: Partial<InspectEvent> & Pick<InspectEvent, "eventId" | "name" | "kind">): InspectEvent {
  return {
    runId: "run_views",
    timestamp: 1_000,
    confidence: "explicit",
    source: { type: "manual" },
    ...partial,
  };
}

function treeFixture(): InspectRunTree {
  return {
    runId: "run_views",
    name: "demo",
    status: "error",
    startedAt: 1_000,
    durationMs: 90,
    children: [
      {
        depth: 0,
        event: event({
          eventId: "step-ok",
          name: "plan",
          kind: "LOGIC",
          status: "ok",
          durationMs: 20,
          timestamp: 1_010,
        }),
        children: [],
      },
      {
        depth: 0,
        event: event({
          eventId: "step-tool",
          name: "call-api",
          kind: "TOOL",
          status: "error",
          durationMs: 40,
          timestamp: 1_040,
          parentId: "step-ok",
          attributes: { message: "upstream 500 <script>" },
        }),
        children: [],
      },
    ],
    metadata: {
      totalEvents: 2,
      confidenceBreakdown: { explicit: 2, correlated: 0, heuristic: 0, unknown: 0 },
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
        LOGIC: 1,
        LOG: 0,
        OUTCOME: 0,
      },
    },
  };
}

describe("evidence tree/timeline/causal views (6.10-3)", () => {
  it("renders tree, waterfall timeline, and causal chain with escaping", () => {
    const trees = [treeFixture()];
    const treeHtml = buildEvidenceTreeViewHtml(trees);
    expect(treeHtml).toContain("call-api");
    expect(treeHtml).toContain("[TOOL]");
    expect(treeHtml).toContain("is-error");

    const timelineHtml = buildEvidenceTimelineViewHtml(trees);
    expect(timelineHtml).toContain("waterfall");
    expect(timelineHtml).toContain("wf-bar");
    expect(timelineHtml).toContain("+40ms");

    const causalHtml = buildEvidenceCausalFailureViewHtml(trees);
    expect(causalHtml).toContain("causal-chain");
    expect(causalHtml).toContain("plan");
    expect(causalHtml).toContain("call-api");
    expect(causalHtml).toContain("upstream 500 &lt;script&gt;");
    expect(causalHtml).not.toContain("<script>");
  });

  it("fills shell panels for tree/timeline/causal", () => {
    const trees = [treeFixture()];
    const html = buildEvidenceHtmlShell({
      runIds: ["run_views"],
      assessmentStatus: "SAFE",
      redactionProfile: "share",
      verificationPolicy: "share",
      generatorName: "agent-inspect",
      generatorVersion: "6.10.0",
      viewBodies: {
        tree: buildEvidenceTreeViewHtml(trees),
        timeline: buildEvidenceTimelineViewHtml(trees),
        causal: buildEvidenceCausalFailureViewHtml(trees),
      },
    });
    expect(html).toContain('id="view-tree"');
    expect(html).toContain("waterfall");
    expect(html).toContain("causal-chain");
    expect(html).toMatch(/id="view-tree"[\s\S]*?call-api/);
    expect(html).toMatch(/id="view-diff"[\s\S]*later AgentInspect 6\.10 release/);
  });
});
