import { describe, expect, it } from "vitest";

import type { TraceEvent } from "../../src/types.js";

import { exportOtlpJson } from "../../src/exporters/otlp-json-exporter.js";
import { manualTraceEventsToRunTree } from "../../src/exporters/manual-trace-adapter.js";
import { OTEL_GEN_AI_SEMCONV_PIN } from "../../src/exporters/semconv.js";

function richTreeEvents(): TraceEvent[] {
  return [
    {
      schemaVersion: "0.1",
      event: "run_started",
      timestamp: 1,
      runId: "run_inv",
      name: "inv",
      startTime: 1,
    },
    {
      schemaVersion: "0.1",
      event: "step_started",
      timestamp: 10,
      runId: "run_inv",
      stepId: "llm1",
      name: "gen",
      type: "llm",
      startTime: 10,
      metadata: {
        model: "m",
        tokens: { input: 3, output: 4 },
        customPreview: "x",
      },
    },
    {
      schemaVersion: "0.1",
      event: "step_completed",
      timestamp: 20,
      runId: "run_inv",
      stepId: "llm1",
      status: "success",
      endTime: 20,
      durationMs: 10,
    },
    {
      schemaVersion: "0.1",
      event: "step_started",
      timestamp: 30,
      runId: "run_inv",
      stepId: "tool1",
      name: "t",
      type: "tool",
      startTime: 30,
    },
    {
      schemaVersion: "0.1",
      event: "step_completed",
      timestamp: 40,
      runId: "run_inv",
      stepId: "tool1",
      status: "success",
      endTime: 40,
      durationMs: 10,
    },
    {
      schemaVersion: "0.1",
      event: "run_completed",
      timestamp: 50,
      runId: "run_inv",
      status: "success",
      endTime: 50,
      durationMs: 49,
    },
  ];
}

type Attr = { key: string };

function collectAttributeKeys(content: string): string[] {
  const parsed = JSON.parse(content) as {
    resourceSpans: {
      scopeSpans: { spans: { attributes?: Attr[] }[] }[];
    }[];
  };
  const keys = new Set<string>();
  for (const rs of parsed.resourceSpans) {
    for (const ss of rs.scopeSpans) {
      for (const span of ss.spans) {
        for (const a of span.attributes ?? []) {
          keys.add(a.key);
        }
      }
    }
  }
  return [...keys].sort();
}

describe("OTLP declared-vs-emitted inventory", () => {
  it("emits every declared GenAI attribute and never emits prompt/completion", () => {
    const tree = manualTraceEventsToRunTree(richTreeEvents());
    const withAttrs = exportOtlpJson(tree, { includeAttributes: true });
    const withoutAttrs = exportOtlpJson(tree, { includeAttributes: false });
    const keys = new Set([
      ...collectAttributeKeys(withAttrs.content),
      ...collectAttributeKeys(withoutAttrs.content),
    ]);

    for (const declared of OTEL_GEN_AI_SEMCONV_PIN.attributes) {
      expect(keys.has(declared), `declared but never emitted: ${declared}`).toBe(true);
    }

    for (const forbidden of OTEL_GEN_AI_SEMCONV_PIN.neverEmitted) {
      expect(keys.has(forbidden), `must never emit: ${forbidden}`).toBe(false);
    }

    const genAiKeys = [...keys].filter((k) => k.startsWith("gen_ai."));
    for (const key of genAiKeys) {
      expect(
        (OTEL_GEN_AI_SEMCONV_PIN.attributes as readonly string[]).includes(key),
        `undocumented gen_ai extension: ${key}`,
      ).toBe(true);
    }

    for (const key of keys) {
      if (key.startsWith("gen_ai.")) continue;
      const allowed = OTEL_GEN_AI_SEMCONV_PIN.documentedExtensionPrefixes.some((p) =>
        key.startsWith(p),
      );
      expect(allowed, `undocumented non-GenAI extension: ${key}`).toBe(true);
    }
  });

  it("does not declare prompt or completion in the pin list", () => {
    expect(OTEL_GEN_AI_SEMCONV_PIN.attributes).not.toContain("gen_ai.prompt");
    expect(OTEL_GEN_AI_SEMCONV_PIN.attributes).not.toContain("gen_ai.completion");
  });
});
