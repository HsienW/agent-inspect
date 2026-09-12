/**
 * Optional omitted-payload digest commitment helpers (6.22).
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

const MAX_DIGEST_INPUT_BYTES = 1024 * 1024;

function toBytes(value: string | Uint8Array): Buffer {
  if (typeof value === "string") {
    return Buffer.from(value, "utf8");
  }
  return Buffer.from(value);
}

/**
 * Build a SHA-256 digest commitment for omitted payload bytes.
 * Throws if input exceeds the 1 MiB bound.
 */
export function createOmittedPayloadCommitment(
  payload: string | Uint8Array,
  options: {
    contentType?: string;
    shape?: string;
    capturePolicy?: OmittedPayloadCommitment["capturePolicy"];
  } = {},
): OmittedPayloadCommitment {
  const bytes = toBytes(payload);
  if (bytes.byteLength > MAX_DIGEST_INPUT_BYTES) {
    throw new RangeError(
      `Omitted payload exceeds ${MAX_DIGEST_INPUT_BYTES} byte digest bound.`,
    );
  }
  return {
    algorithm: "sha256",
    digest: createHash("sha256").update(bytes).digest("hex"),
    byteLength: bytes.byteLength,
    ...(options.contentType !== undefined ? { contentType: options.contentType } : {}),
    ...(options.shape !== undefined ? { shape: options.shape } : {}),
    capturePolicy: options.capturePolicy ?? "digest-only",
  };
}
