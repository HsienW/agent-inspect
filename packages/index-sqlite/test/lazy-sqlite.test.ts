import { readFileSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it, vi } from "vitest";

import { buildIndex, indexStatus } from "../src/index.js";
import * as loadSqlite from "../src/load-sqlite.js";

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

describe("index-sqlite lazy better-sqlite3 boundary", () => {
  afterEach(() => {
    loadSqlite.resetBetterSqlite3CacheForTests();
    vi.restoreAllMocks();
  });

  it("builder and query keep better-sqlite3 as type-only imports", () => {
    for (const file of ["builder.ts", "query.ts"]) {
      const src = readFileSync(path.join(srcRoot, file), "utf8");
      expect(src, file).not.toMatch(/^\s*import Database from ["']better-sqlite3["']/m);
      expect(src, file).toContain("loadBetterSqlite3");
    }
  });

  it("indexStatus fails soft when the native driver cannot load", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-index-lazy-"));
    try {
      const dbPath = path.join(tmp, "index.db");
      await writeFile(dbPath, "not-a-sqlite-file");
      vi.spyOn(loadSqlite, "loadBetterSqlite3").mockImplementation(() => {
        throw new Error(
          "better-sqlite3 native driver is unavailable (simulated missing prebuild)",
        );
      });
      const status = indexStatus(dbPath);
      expect(status.healthy).toBe(false);
      expect(status.exists).toBe(true);
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  });

  it("buildIndex surfaces an actionable error when the driver is unavailable", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-index-lazy-build-"));
    try {
      vi.spyOn(loadSqlite, "loadBetterSqlite3").mockImplementation(() => {
        throw new Error(
          "better-sqlite3 native driver is unavailable (simulated missing prebuild). " +
            "Install a prebuild for your Node/OS or fall back to JSONL directory scans.",
        );
      });
      await expect(buildIndex({ traceDir: tmp })).rejects.toThrow(/native driver is unavailable/);
      await expect(buildIndex({ traceDir: tmp })).rejects.toThrow(/JSONL directory scans/);
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  });
});
