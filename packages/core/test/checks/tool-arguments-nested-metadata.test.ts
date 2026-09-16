import { describe, expect, it } from "vitest";

import { extractToolArgumentPayload } from "../../src/checks/tool-arguments.js";

describe("extractToolArgumentPayload nested metadata", () => {
  it("reads nested metadata.arguments for manual instrumentation", () => {
    const result = extractToolArgumentPayload({
      attributes: {
        metadata: { arguments: { orderId: "o-1", amount: 10 } },
      },
    });
    expect(result.present).toBe(true);
    expect(result.value).toEqual({ orderId: "o-1", amount: 10 });
  });

  it("reads nested metadata.input and metadata.toolArguments", () => {
    expect(
      extractToolArgumentPayload({
        attributes: { metadata: { input: { q: "search" } } },
      }).value,
    ).toEqual({ q: "search" });
    expect(
      extractToolArgumentPayload({
        attributes: { metadata: { toolArguments: { path: "/tmp" } } },
      }).value,
    ).toEqual({ path: "/tmp" });
  });

  it("prefers top-level attributes over nested metadata", () => {
    const result = extractToolArgumentPayload({
      attributes: {
        arguments: { winner: "top" },
        metadata: { arguments: { winner: "nested" } },
      },
    });
    expect(result.value).toEqual({ winner: "top" });
  });

  it("treats nested primitives and preview strings as unavailable", () => {
    expect(
      extractToolArgumentPayload({
        attributes: { metadata: { arguments: "not-json" } },
      }).present,
    ).toBe(false);
    expect(
      extractToolArgumentPayload({
        attributes: { metadata: { arguments: 42 } },
      }).present,
    ).toBe(false);
    expect(
      extractToolArgumentPayload({
        inputSummary: "preview only",
      }).present,
    ).toBe(false);
  });

  it("accepts structured arrays at nested metadata.arguments", () => {
    const result = extractToolArgumentPayload({
      attributes: { metadata: { arguments: [{ id: 1 }] } },
    });
    expect(result.present).toBe(true);
    expect(result.value).toEqual([{ id: 1 }]);
  });
});
