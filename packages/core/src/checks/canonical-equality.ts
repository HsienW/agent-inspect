/**
 * Bounded canonical structured equality for TraceContract checks (6.29.2).
 *
 * Key-sorted JSON comparison with depth/size limits. Missing or unbounded
 * evidence must not become a silent pass.
 *
 * @experimental
 */

const DEFAULT_MAX_DEPTH = 8;
const DEFAULT_MAX_BYTES = 16_384;

export interface CanonicalEqualityLimits {
  maxDepth?: number;
  maxBytes?: number;
}

export type CanonicalEncodeResult =
  | { ok: true; value: string }
  | { ok: false; reason: string; code: string };

function sortKeysDeep(input: unknown, depth: number, maxDepth: number): unknown {
  if (depth > maxDepth) {
    throw new Error("AI_CHECK_CANONICAL_DEPTH_EXCEEDED");
  }
  if (input === null || typeof input !== "object") return input;
  if (Array.isArray(input)) {
    return input.map((item) => sortKeysDeep(item, depth + 1, maxDepth));
  }
  const record = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(record).sort()) {
    out[key] = sortKeysDeep(record[key], depth + 1, maxDepth);
  }
  return out;
}

/**
 * Encode a JSON-like value into a deterministic string for equality checks.
 */
export function encodeCanonicalStructured(
  value: unknown,
  limits?: CanonicalEqualityLimits,
): CanonicalEncodeResult {
  const maxDepth = limits?.maxDepth ?? DEFAULT_MAX_DEPTH;
  const maxBytes = limits?.maxBytes ?? DEFAULT_MAX_BYTES;
  try {
    const sorted = sortKeysDeep(value, 0, maxDepth);
    const encoded = JSON.stringify(sorted);
    if (encoded === undefined) {
      return {
        ok: false,
        reason: "Value is not JSON-serializable for canonical comparison.",
        code: "AI_CHECK_CANONICAL_UNSERIALIZABLE",
      };
    }
    if (Buffer.byteLength(encoded, "utf8") > maxBytes) {
      return {
        ok: false,
        reason: "Canonical structured value exceeds bounded size limit.",
        code: "AI_CHECK_CANONICAL_SIZE_EXCEEDED",
      };
    }
    return { ok: true, value: encoded };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message === "AI_CHECK_CANONICAL_DEPTH_EXCEEDED") {
      return {
        ok: false,
        reason: "Canonical structured value exceeds bounded depth limit.",
        code: "AI_CHECK_CANONICAL_DEPTH_EXCEEDED",
      };
    }
    return {
      ok: false,
      reason: "Canonical structured encoding failed.",
      code: "AI_CHECK_CANONICAL_UNSERIALIZABLE",
    };
  }
}

/**
 * Compare two JSON-like values with canonical key order.
 * Returns unavailable/fail codes rather than throwing.
 */
export function canonicalStructuredEqual(
  left: unknown,
  right: unknown,
  limits?: CanonicalEqualityLimits,
):
  | { equal: true }
  | { equal: false; reason: string; code: string } {
  const a = encodeCanonicalStructured(left, limits);
  if (!a.ok) return { equal: false, reason: a.reason, code: a.code };
  const b = encodeCanonicalStructured(right, limits);
  if (!b.ok) return { equal: false, reason: b.reason, code: b.code };
  if (a.value !== b.value) {
    return {
      equal: false,
      reason: "Canonical structured values differ.",
      code: "AI_CHECK_CANONICAL_NOT_EQUAL",
    };
  }
  return { equal: true };
}
