import { describe, expect, it } from "vitest";

import {
  evaluateToolArgumentValue,
  resolveJsonPointer,
} from "../../src/checks/tool-arguments.js";

/** Deterministic xorshift32 for property-style cases without new deps. */
function makeRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
}

function randomKey(rng: () => number): string {
  const alphabet = "abcdefghij";
  return alphabet[Math.floor(rng() * alphabet.length)]!;
}

describe("6.25 property-style tool-argument safety", () => {
  it("never crashes and never embeds secrets for random pointer checks", () => {
    const rng = makeRng(0x625_00);
    for (let i = 0; i < 200; i += 1) {
      const secret = `secret-${i}-${Math.floor(rng() * 1e9)}`;
      const key = randomKey(rng);
      const document = { [key]: { nested: true, token: secret } };
      const pointer = `/${key}/nested`;
      const resolved = resolveJsonPointer(document, pointer);
      expect(resolved.found).toBe(true);

      const pass = evaluateToolArgumentValue(
        document,
        {
          tool: "charge",
          path: pointer,
          operator: "equals",
          expected: true,
        },
        true,
      );
      expect(pass.status).toBe("pass");

      const fail = evaluateToolArgumentValue(
        document,
        {
          tool: "charge",
          path: pointer,
          operator: "equals",
          expected: false,
        },
        true,
      );
      expect(fail.status).toBe("fail");
      if (fail.status === "fail") {
        expect(fail.message).not.toContain(secret);
        expect(JSON.stringify(fail)).not.toContain(secret);
      }

      const missing = evaluateToolArgumentValue(
        document,
        {
          tool: "charge",
          path: "/missing/path",
          operator: "equals",
          expected: true,
        },
        true,
      );
      expect(missing.status).toBe("unavailable");

      const unavailable = evaluateToolArgumentValue(
        undefined,
        {
          tool: "charge",
          path: "/x",
          operator: "exists",
        },
        false,
      );
      expect(unavailable.status).toBe("unavailable");
    }
  });

  it("rejects path escape / invalid pointer shapes without throwing", () => {
    const cases = ["no-slash", "//", "/0/~/bad", "relative", "\0"];
    for (const pointer of cases) {
      expect(() => resolveJsonPointer({ a: 1 }, pointer)).not.toThrow();
      const result = evaluateToolArgumentValue(
        { a: 1 },
        { tool: "t", path: pointer, operator: "exists" },
        true,
      );
      expect(["pass", "fail", "unavailable"]).toContain(result.status);
    }
  });
});
