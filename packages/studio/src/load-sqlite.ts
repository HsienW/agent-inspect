import { createRequire } from "node:module";

import type BetterSqlite3 from "better-sqlite3";

export type SqliteDatabase = BetterSqlite3.Database;
export type SqliteConstructor = typeof BetterSqlite3;

let cached: SqliteConstructor | undefined;

/**
 * Lazily load better-sqlite3 when Studio persistence starts.
 * Importing `@agent-inspect/studio` must not require the native driver.
 */
export function loadBetterSqlite3(): SqliteConstructor {
  if (cached !== undefined) return cached;
  try {
    const require = createRequire(import.meta.url);
    cached = require("better-sqlite3") as SqliteConstructor;
    return cached;
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `better-sqlite3 native driver is unavailable (${detail}). ` +
        `Install a prebuild for your Node/OS (see better-sqlite3 docs) or use filesystem-only AgentInspect paths without Studio persistence. ` +
        `Core agent-inspect remains usable without this optional package.`,
    );
  }
}

/** Test helper — clear the cached constructor between cases. */
export function resetBetterSqlite3CacheForTests(): void {
  cached = undefined;
}
