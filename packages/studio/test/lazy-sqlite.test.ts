import { readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

import { openStudioDb } from "../src/db.js";
import { loadBetterSqlite3, resetBetterSqlite3CacheForTests } from "../src/load-sqlite.js";

const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../src");

describe("studio lazy better-sqlite3 boundary", () => {
  afterEach(() => {
    resetBetterSqlite3CacheForTests();
  });

  it("db module keeps better-sqlite3 as a type-only import", () => {
    const src = readFileSync(path.join(srcRoot, "db.ts"), "utf8");
    expect(src).toMatch(/import type Database from ["']better-sqlite3["']/);
    expect(src).not.toMatch(/^\s*import Database from ["']better-sqlite3["']/m);
    expect(src).toContain("loadBetterSqlite3");
  });

  it("loads the native driver only when opening a studio database", () => {
    const Sqlite = loadBetterSqlite3();
    expect(typeof Sqlite).toBe("function");
  });

  it("openStudioDb works after lazy load", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "agent-inspect-studio-lazy-"));
    try {
      const db = openStudioDb(path.join(tmp, "studio.db"));
      const row = db.prepare("SELECT value FROM meta WHERE key = ?").get("driver") as {
        value: string;
      };
      expect(row.value).toBe("better-sqlite3");
      db.close();
    } finally {
      await rm(tmp, { recursive: true, force: true });
    }
  });
});
