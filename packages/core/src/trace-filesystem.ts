import { appendFile, mkdir, writeFile } from "node:fs/promises";

/** POSIX mode requested for newly created built-in raw trace directories. */
export const TRACE_DIR_MODE = 0o700;

/** POSIX mode requested for newly created built-in raw trace JSONL files. */
export const TRACE_FILE_MODE = 0o600;

/**
 * Creates a trace directory recursively with {@link TRACE_DIR_MODE}.
 * Mode applies only to newly created path components; existing directories are not chmodded.
 */
export async function mkdirTraceDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true, mode: TRACE_DIR_MODE });
}

/**
 * Creates or truncates an empty UTF-8 trace file with {@link TRACE_FILE_MODE}.
 * Mode applies only when the file is created; existing files are not chmodded.
 */
export async function createEmptyTraceFile(filePath: string): Promise<void> {
  await writeFile(filePath, "", { encoding: "utf-8", mode: TRACE_FILE_MODE });
}

/**
 * Appends UTF-8 data to a trace file, creating it with {@link TRACE_FILE_MODE} when missing.
 * Mode applies only on create; existing files are not chmodded.
 */
export async function appendTraceFile(filePath: string, data: string): Promise<void> {
  await appendFile(filePath, data, { encoding: "utf-8", mode: TRACE_FILE_MODE });
}
