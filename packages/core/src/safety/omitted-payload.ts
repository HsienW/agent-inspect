/**
 * Optional omitted-payload digest commitment helpers (6.22; preflight bound in 6.25.1).
 *
 * A digest proves bytes were observed/omitted; it is not redaction, authorization,
 * or a secret-management feature. AgentInspect does not hold HMAC keys.
 *
 * @experimental Available through `agent-inspect/advanced`.
 */

import { createHash } from "node:crypto";

export type OmittedPayloadAlgorithm = "sha256";

/**
 * Bounded commitment recorded when payload bytes are intentionally omitted.
 *
 * @experimental
 */
export interface OmittedPayloadCommitment {
  algorithm: OmittedPayloadAlgorithm;
  digest: string;
  byteLength: number;
  contentType?: string;
  shape?: string;
  capturePolicy: "omitted" | "preview-only" | "digest-only";
}

/** Maximum input size accepted for digest commitment (1 MiB). */
export const OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES = 1024 * 1024;

/**
 * Preflight byte length without allocating a full Buffer copy for oversized input.
 */
export function omittedPayloadByteLength(payload: string | Uint8Array): number {
  if (typeof payload === "string") {
    return Buffer.byteLength(payload, "utf8");
  }
  return payload.byteLength;
}

/**
 * Build a SHA-256 digest commitment for omitted payload bytes.
 * Throws if input exceeds the 1 MiB bound (checked before copying oversized strings).
 */
export function createOmittedPayloadCommitment(
  payload: string | Uint8Array,
  options: {
    contentType?: string;
    shape?: string;
    capturePolicy?: OmittedPayloadCommitment["capturePolicy"];
  } = {},
): OmittedPayloadCommitment {
  const byteLength = omittedPayloadByteLength(payload);
  if (byteLength > OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES) {
    throw new RangeError(
      `Omitted payload exceeds ${OMITTED_PAYLOAD_MAX_DIGEST_INPUT_BYTES} byte digest bound.`,
    );
  }
  // Strings: only allocate after preflight. Uint8Array: hash without Buffer.from copy.
  const digest =
    typeof payload === "string"
      ? createHash("sha256").update(Buffer.from(payload, "utf8")).digest("hex")
      : createHash("sha256").update(payload).digest("hex");
  return {
    algorithm: "sha256",
    digest,
    byteLength,
    ...(options.contentType !== undefined ? { contentType: options.contentType } : {}),
    ...(options.shape !== undefined ? { shape: options.shape } : {}),
    capturePolicy: options.capturePolicy ?? "digest-only",
  };
}
