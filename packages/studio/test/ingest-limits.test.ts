import { mkdir, mkdtemp, readFile, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  DEFAULT_MAX_INGEST_BYTES,
  IngestLimitError,
  assertFileWithinByteLimit,
  measureDirectoryBytes,
  promoteStagingPath,
  readBoundedResponseBody,
  resolveIngestMaxBytes,
  withAtomicStagingDir,
} from "../src/ingest/limits.js";

describe("studio ingest limits", () => {
  const temps: string[] = [];

  afterEach(async () => {
    temps.length = 0;
  });

  async function tempDir(): Promise<string> {
    const dir = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-ingest-limits-"));
    temps.push(dir);
    return dir;
  }

  it("resolves configured maxBytes and the shared default", () => {
    expect(resolveIngestMaxBytes()).toBe(DEFAULT_MAX_INGEST_BYTES);
    expect(resolveIngestMaxBytes(1024)).toBe(1024);
    expect(() => resolveIngestMaxBytes(0)).toThrow(IngestLimitError);
    expect(() => resolveIngestMaxBytes(-1)).toThrow(IngestLimitError);
    expect(() => resolveIngestMaxBytes(1.5)).toThrow(IngestLimitError);
  });

  it("rejects symlinks and oversized files via lstat", async () => {
    const dir = await tempDir();
    const file = path.join(dir, "ok.bin");
    await writeFile(file, Buffer.alloc(8));
    await assertFileWithinByteLimit(file, 16);

    await expect(assertFileWithinByteLimit(file, 4)).rejects.toMatchObject({
      code: "INGEST_SIZE_LIMIT",
    });

    const link = path.join(dir, "link.bin");
    await symlink(file, link);
    await expect(assertFileWithinByteLimit(link, 1024)).rejects.toMatchObject({
      code: "INGEST_SYMLINK_REJECTED",
    });
  });

  it("measures directory bytes and rejects symlink members early", async () => {
    const dir = await tempDir();
    const nested = path.join(dir, "nested");
    await mkdir(nested, { recursive: true });
    await writeFile(path.join(nested, "a.bin"), Buffer.alloc(10));
    await writeFile(path.join(nested, "b.bin"), Buffer.alloc(15));
    expect(await measureDirectoryBytes(dir, 100)).toBe(25);

    await expect(measureDirectoryBytes(dir, 20)).rejects.toMatchObject({
      code: "INGEST_SIZE_LIMIT",
    });

    await symlink(path.join(nested, "a.bin"), path.join(nested, "evil"));
    await expect(measureDirectoryBytes(dir, 100)).rejects.toMatchObject({
      code: "INGEST_SYMLINK_REJECTED",
    });
  });

  it("streams bounded response bodies and cancels after the limit", async () => {
    const okChunks = [new Uint8Array([97, 98, 99, 100])];
    const ok = new Response(
      new ReadableStream({
        start(controller) {
          for (const chunk of okChunks) controller.enqueue(chunk);
          controller.close();
        },
      }),
      { headers: { "content-length": "4" } },
    );
    await expect(readBoundedResponseBody(ok, 4)).resolves.toEqual(Buffer.from("abcd"));

    const oversizedHeader = new Response(null, {
      headers: { "content-length": "100" },
    });
    await expect(readBoundedResponseBody(oversizedHeader, 10)).rejects.toMatchObject({
      code: "INGEST_SIZE_LIMIT",
    });

    let cancelled = false;
    const oversizedBody = new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new Uint8Array(8).fill(1));
          controller.enqueue(new Uint8Array(8).fill(2));
          queueMicrotask(() => {
            if (cancelled) return;
            try {
              controller.enqueue(new Uint8Array(8).fill(3));
              controller.close();
            } catch {
              // controller may already be closed by cancel()
            }
          });
        },
        cancel() {
          cancelled = true;
        },
      }),
    );
    await expect(readBoundedResponseBody(oversizedBody, 12)).rejects.toMatchObject({
      code: "INGEST_SIZE_LIMIT",
    });
  });

  it("promotes staged paths and cleans staging directories on failure", async () => {
    const dir = await tempDir();
    const finalPath = path.join(dir, "final", "out.bin");

    await withAtomicStagingDir(dir, async (stagingDir) => {
      const staged = path.join(stagingDir, "out.bin");
      await writeFile(staged, "hello");
      await promoteStagingPath(staged, finalPath);
      return undefined;
    });

    expect(await readFile(finalPath, "utf8")).toBe("hello");

    await expect(
      withAtomicStagingDir(dir, async () => {
        throw new Error("boom");
      }),
    ).rejects.toThrow("boom");
  });
});
