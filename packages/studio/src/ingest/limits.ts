import {
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  rename,
  rm,
  type Stats,
} from "node:fs/promises";
import path from "node:path";

/** Default Studio ingest size bound (50 MiB), shared across HTTP / bundle / drop / GitHub. */
export const DEFAULT_MAX_INGEST_BYTES = 52_428_800;

export type IngestLimitCode =
  | "INGEST_SIZE_LIMIT"
  | "INGEST_SYMLINK_REJECTED"
  | "INGEST_NOT_A_FILE"
  | "INGEST_NOT_A_DIRECTORY";

export class IngestLimitError extends Error {
  readonly code: IngestLimitCode;

  constructor(code: IngestLimitCode, message: string) {
    super(message);
    this.name = "IngestLimitError";
    this.code = code;
  }
}

/**
 * Resolve a configured maxBytes or the shared default.
 * Invalid configured values throw so callers never silently widen the limit.
 */
export function resolveIngestMaxBytes(configured?: number): number {
  if (configured === undefined) return DEFAULT_MAX_INGEST_BYTES;
  if (!Number.isInteger(configured) || configured <= 0) {
    throw new IngestLimitError(
      "INGEST_SIZE_LIMIT",
      "maxBytes must be a positive integer",
    );
  }
  return configured;
}

/** lstat a path and reject symlinks and non-files. */
export async function lstatRegularFile(filePath: string): Promise<Stats> {
  const info = await lstat(filePath);
  if (info.isSymbolicLink()) {
    throw new IngestLimitError(
      "INGEST_SYMLINK_REJECTED",
      "symbolic links are not allowed for ingest",
    );
  }
  if (!info.isFile()) {
    throw new IngestLimitError("INGEST_NOT_A_FILE", "ingest path must be a regular file");
  }
  return info;
}

/** lstat a path and reject symlinks and non-directories. */
export async function lstatRegularDirectory(dirPath: string): Promise<Stats> {
  const info = await lstat(dirPath);
  if (info.isSymbolicLink()) {
    throw new IngestLimitError(
      "INGEST_SYMLINK_REJECTED",
      "symbolic links are not allowed for ingest",
    );
  }
  if (!info.isDirectory()) {
    throw new IngestLimitError(
      "INGEST_NOT_A_DIRECTORY",
      "ingest path must be a directory",
    );
  }
  return info;
}

/** Reject oversized regular files before they are read into memory. */
export async function assertFileWithinByteLimit(
  filePath: string,
  maxBytes: number,
): Promise<Stats> {
  const info = await lstatRegularFile(filePath);
  if (info.size > maxBytes) {
    throw new IngestLimitError("INGEST_SIZE_LIMIT", "file exceeds size limit");
  }
  return info;
}

/**
 * Walk a directory with lstat, reject symlinks, and fail early when the
 * cumulative regular-file size exceeds maxBytes.
 */
export async function measureDirectoryBytes(
  dirPath: string,
  maxBytes: number,
): Promise<number> {
  await lstatRegularDirectory(dirPath);
  let total = 0;

  const walk = async (current: string): Promise<void> => {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      const info = await lstat(abs);
      if (info.isSymbolicLink()) {
        throw new IngestLimitError(
          "INGEST_SYMLINK_REJECTED",
          "symbolic links are not allowed for ingest",
        );
      }
      if (info.isDirectory()) {
        await walk(abs);
        continue;
      }
      if (!info.isFile()) continue;
      total += info.size;
      if (total > maxBytes) {
        throw new IngestLimitError("INGEST_SIZE_LIMIT", "directory exceeds size limit");
      }
    }
  };

  await walk(dirPath);
  return total;
}

/**
 * Read a fetch Response body with a hard byte bound without requiring the
 * full payload to land in memory before the limit check.
 */
export async function readBoundedResponseBody(
  response: Response,
  maxBytes: number,
): Promise<Buffer> {
  const lengthHeader = response.headers.get("content-length");
  if (lengthHeader) {
    const length = Number(lengthHeader);
    if (Number.isFinite(length) && length > maxBytes) {
      throw new IngestLimitError("INGEST_SIZE_LIMIT", "response exceeds size limit");
    }
  }

  if (!response.body) {
    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > maxBytes) {
      throw new IngestLimitError("INGEST_SIZE_LIMIT", "response exceeds size limit");
    }
    return Buffer.from(arrayBuffer);
  }

  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value || value.byteLength === 0) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      try {
        await reader.cancel();
      } catch {
        // ignore cancel failures; the size rejection is authoritative
      }
      throw new IngestLimitError("INGEST_SIZE_LIMIT", "response exceeds size limit");
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks);
}

/** Create a staging directory under parentDir, run work, then remove staging. */
export async function withAtomicStagingDir<T>(
  parentDir: string,
  work: (stagingDir: string) => Promise<T>,
): Promise<T> {
  await mkdir(parentDir, { recursive: true });
  const stagingDir = await mkdtemp(path.join(parentDir, ".ingest-staging-"));
  try {
    return await work(stagingDir);
  } finally {
    await rm(stagingDir, { recursive: true, force: true });
  }
}

/** Atomically promote a staged path into its final destination. */
export async function promoteStagingPath(
  stagingPath: string,
  finalPath: string,
): Promise<void> {
  await mkdir(path.dirname(finalPath), { recursive: true });
  await rename(stagingPath, finalPath);
}
