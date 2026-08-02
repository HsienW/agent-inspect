import { createHash } from "node:crypto";

const SHA256_RE = /^[a-f0-9]{64}$/i;

/**
 * SHA-256 hex digest of exact bytes (UTF-8 when `data` is a string).
 */
export function sha256Hex(data: string | Uint8Array): string {
  const hash = createHash("sha256");
  if (typeof data === "string") {
    hash.update(data, "utf8");
  } else {
    hash.update(data);
  }
  return hash.digest("hex");
}

export function isSha256Hex(value: string): boolean {
  return SHA256_RE.test(value);
}

/**
 * Constant-time-ish equality for hex digests (length-checked; not for secrets).
 */
export function sha256Equals(expected: string, actual: string): boolean {
  if (!isSha256Hex(expected) || !isSha256Hex(actual)) {
    return false;
  }
  const a = expected.toLowerCase();
  const b = actual.toLowerCase();
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
