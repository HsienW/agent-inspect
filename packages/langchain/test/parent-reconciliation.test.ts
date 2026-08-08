import { describe, expect, it } from "vitest";
import {
  applyParentResolutionMetadata,
  isSemanticParentLabel,
  rejectSelfParentResolution,
  resolveParentRelationship,
} from "../src/parent-reconciliation.js";

describe("parent reconciliation", () => {
  it("prefers exact observed callback parents", () => {
    const resolution = resolveParentRelationship(
      { parentLcRunId: "parent-lc" },
      {
        exactStepByLcRunId: (id) => (id === "parent-lc" ? "step-parent" : undefined),
        uniqueStepByLangGraphKey: () => "should-not-use",
        uniqueStepBySemanticLabel: () => "should-not-use",
      },
    );
    expect(resolution).toEqual({
      parentStepId: "step-parent",
      confidence: "explicit",
      parentMapping: "exact",
    });
  });

  it("correlates via unique LangGraph handoffFrom → taskId", () => {
    const resolution = resolveParentRelationship(
      {
        parentLcRunId: "missing",
        attributes: { langGraph: { handoffFrom: "task-a" } },
      },
      {
        exactStepByLcRunId: () => undefined,
        uniqueStepByLangGraphKey: (key, value) =>
          key === "taskId" && value === "task-a" ? "step-a" : undefined,
        uniqueStepBySemanticLabel: () => undefined,
      },
    );
    expect(resolution.parentStepId).toBe("step-a");
    expect(resolution.parentMapping).toBe("langgraph-metadata");
    expect(resolution.confidence).toBe("correlated");
    expect(resolution.correlatedVia).toBe("handoffFrom");
  });

  it("correlates unique semantic labels such as __start__", () => {
    expect(isSemanticParentLabel("__start__")).toBe(true);
    expect(isSemanticParentLabel("LangGraph")).toBe(true);
    expect(isSemanticParentLabel("uuid-looking-parent")).toBe(false);

    const resolution = resolveParentRelationship(
      { parentLcRunId: "__start__" },
      {
        exactStepByLcRunId: () => undefined,
        uniqueStepByLangGraphKey: () => undefined,
        uniqueStepBySemanticLabel: (label) =>
          label === "__start__" ? "step-start" : undefined,
      },
    );
    expect(resolution.parentStepId).toBe("step-start");
    expect(resolution.parentMapping).toBe("semantic-name");
    expect(resolution.semanticParentLabel).toBe("__start__");
  });

  it("leaves ambiguous or missing semantic parents unresolved and visible", () => {
    const resolution = resolveParentRelationship(
      { parentLcRunId: "LangGraph" },
      {
        exactStepByLcRunId: () => undefined,
        uniqueStepByLangGraphKey: () => undefined,
        uniqueStepBySemanticLabel: () => undefined,
      },
    );
    expect(resolution.parentStepId).toBeUndefined();
    expect(resolution.parentMapping).toBe("unresolved");
    expect(resolution.semanticParentLabel).toBe("LangGraph");
    expect(resolution.unresolvedParentRunId).toBe("LangGraph");
  });

  it("does not invent parents when LangGraph keys are ambiguous", () => {
    const resolution = resolveParentRelationship(
      {
        attributes: { langGraph: { handoffFrom: "shared" } },
      },
      {
        exactStepByLcRunId: () => undefined,
        uniqueStepByLangGraphKey: () => undefined,
        uniqueStepBySemanticLabel: () => undefined,
      },
    );
    expect(resolution.parentStepId).toBeUndefined();
  });

  it("marks unobserved non-semantic parents unresolved", () => {
    const resolution = resolveParentRelationship(
      { parentLcRunId: "missing-parent" },
      {
        exactStepByLcRunId: () => undefined,
        uniqueStepByLangGraphKey: () => undefined,
        uniqueStepBySemanticLabel: () => undefined,
      },
    );
    expect(resolution).toEqual({
      confidence: "unresolved",
      parentMapping: "unresolved",
      unresolvedParentRunId: "missing-parent",
    });
  });

  it("applies resolution metadata without fabricating edges", () => {
    const metadata: Record<string, unknown> = {};
    applyParentResolutionMetadata(metadata, {
      confidence: "unresolved",
      parentMapping: "unresolved",
      semanticParentLabel: "__start__",
      unresolvedParentRunId: "__start__",
    });
    expect(metadata).toMatchObject({
      parentMapping: "unresolved",
      parentConfidence: "unresolved",
      semanticParentLabel: "__start__",
      unresolvedParentRunId: "__start__",
    });
  });

  it("excludes the child stepId from parent lookups (N-4)", () => {
    const resolution = resolveParentRelationship(
      { parentLcRunId: "LangGraph" },
      {
        exactStepByLcRunId: () => undefined,
        uniqueStepByLangGraphKey: () => undefined,
        uniqueStepBySemanticLabel: () => "step-child",
      },
      { excludeStepId: "step-child" },
    );
    expect(resolution.parentStepId).toBeUndefined();
    expect(resolution.parentMapping).toBe("unresolved");
  });

  it("rejects a resolved self-parent edge", () => {
    const rejected = rejectSelfParentResolution(
      {
        parentStepId: "step-self",
        confidence: "explicit",
        parentMapping: "exact",
      },
      "step-self",
      "parent-lc",
    );
    expect(rejected.parentStepId).toBeUndefined();
    expect(rejected.parentMapping).toBe("unresolved");
    expect(rejected.unresolvedParentRunId).toBe("parent-lc");
  });
});
