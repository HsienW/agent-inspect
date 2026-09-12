import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";

import {
  createOmittedPayloadCommitment,
  omittedPayloadByteLength,
  OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES,
} from "../../src/safety/omitted-payload.js";

describe("omitted-payload preflight (6.25.1)", () => {
  it("accepts the exact byte limit for strings", () => {
    const payload = "a".repeat(OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES);
    expect(omittedPayloadByteLength(payload)).toBe(OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES);
    const commitment = createOmittedPayloadCommitment(payload);
    expect(commitment.byteLength).toBe(OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES);
    expect(commitment.digest).toBe(createHash("sha256").update(payload, "utf8").digest("hex"));
  });

  it("rejects one byte over the limit for strings before hashing", () => {
    const payload = "a".repeat(OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES + 1);
    expect(() => createOmittedPayloadCommitment(payload)).toThrow(/digest bound/);
  });

  it("rejects oversized Uint8Array without requiring a string copy", () => {
    const payload = new Uint8Array(OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES + 1);
    expect(omittedPayloadByteLength(payload)).toBe(OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES + 1);
    expect(() => createOmittedPayloadCommitment(payload)).toThrow(/digest bound/);
  });

  it("preserves accepted digest compatibility for Uint8Array", () => {
    const payload = new Uint8Array([1, 2, 3, 4, 5]);
    const commitment = createOmittedPayloadCommitment(payload, { shape: "bytes" });
    expect(commitment.digest).toBe(createHash("sha256").update(payload).digest("hex"));
    expect(commitment.shape).toBe("bytes");
  });
});
