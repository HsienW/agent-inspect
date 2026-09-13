import { describe, expect, it } from "vitest";

import {
  canonicalStructuredEqual,
  encodeCanonicalStructured,
} from "../../src/checks/canonical-equality.js";

describe("canonical structured equality (6.29.2)", () => {
  it("ignores object key order", () => {
    expect(canonicalStructuredEqual({ a: 1, b: { c: 2 } }, { b: { c: 2 }, a: 1 })).toEqual({
      equal: true,
    });
  });

  it("fails closed on depth overflow", () => {
    let nested: unknown = { v: 1 };
    for (let i = 0; i < 20; i += 1) nested = { child: nested };
    const encoded = encodeCanonicalStructured(nested, { maxDepth: 4 });
    expect(encoded.ok).toBe(false);
    if (!encoded.ok) {
      expect(encoded.code).toBe("AI_CHECK_CANONICAL_DEPTH_EXCEEDED");
    }
  });

  it("fails closed on size overflow", () => {
    const big = { pad: "x".repeat(20_000) };
    const encoded = encodeCanonicalStructured(big, { maxBytes: 100 });
    expect(encoded.ok).toBe(false);
    if (!encoded.ok) {
      expect(encoded.code).toBe("AI_CHECK_CANONICAL_SIZE_EXCEEDED");
    }
  });
});
