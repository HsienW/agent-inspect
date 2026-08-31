/**
 * Deterministic digest of claim-bearing public ledger content.
 * Version numbers in claim strings are normalized so mechanical package
 * bumps do not invalidate a prior human claim attestation.
 */
import { createHash } from "node:crypto";

const VERSION_RE = /\b\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?\b/g;

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function normalizeVersions(value) {
  if (typeof value === "string") {
    return value.replace(VERSION_RE, "<VERSION>");
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeVersions(item));
  }
  if (value && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = normalizeVersions(/** @type {Record<string, unknown>} */ (value)[key]);
    }
    return out;
  }
  return value;
}

/**
 * @param {{ allowedClaims?: unknown; bannedPhrases?: unknown }} ledger
 * @returns {string}
 */
export function computeClaimContentDigest(ledger) {
  const payload = {
    allowedClaims: ledger.allowedClaims ?? [],
    bannedPhrases: ledger.bannedPhrases ?? [],
  };
  const canonical = JSON.stringify(normalizeVersions(payload));
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}
