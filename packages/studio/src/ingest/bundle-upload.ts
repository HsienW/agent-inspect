import { createHash } from "node:crypto";
import { access, copyFile, mkdir, readFile, readdir, rm, lstat } from "node:fs/promises";
import path from "node:path";

import type Database from "better-sqlite3";

import {
  findIngestFileBySourceKey,
  insertIngestFile,
  openStudioDb,
  resolveStudioDbPath,
} from "../db.js";
import { importStudioRegistry } from "../import.js";
import { assertPathUnderRoot } from "../path-guards.js";
import { readStudioRegistryFile } from "../registry.js";
import { resolveStudioRegistryPath } from "../registry-path.js";
import { resolveImportDirs, uniqueDestPath } from "./common.js";
import {
  IngestLimitError,
  lstatRegularDirectory,
  measureDirectoryBytes,
  promoteStagingPath,
  resolveIngestMaxBytes,
  withAtomicStagingDir,
} from "./limits.js";

export interface BundleUploadImportOptions {
  db: Database.Database;
  registryPath: string;
  registry: import("../registry.js").StudioRegistry;
  bundlePath: string;
  enabled: boolean;
  /** Override registry ingest.bundleUpload.maxBytes for tests. */
  maxBytes?: number;
}

export interface BundleUploadImportResult {
  skipped: boolean;
  reason?: string;
  imported: boolean;
  destPath?: string;
  sourceKey?: string;
  errors: string[];
  registryImportWarnings: string[];
}

interface BundleMetadataShape {
  agentInspectVersion?: string;
  redactionProfile?: string;
  runIds?: string[];
  files?: string[];
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function validateBundleDirectory(bundleDir: string): Promise<string[]> {
  const errors: string[] = [];
  const metadataPath = path.join(bundleDir, "metadata.json");
  if (!(await pathExists(metadataPath))) {
    errors.push("bundle missing metadata.json");
    return errors;
  }
  try {
    const raw = await readFile(metadataPath, "utf8");
    const parsed = JSON.parse(raw) as BundleMetadataShape;
    if (typeof parsed.agentInspectVersion !== "string") {
      errors.push("bundle metadata.json missing agentInspectVersion");
    }
    if (!Array.isArray(parsed.runIds) || parsed.runIds.length === 0) {
      errors.push("bundle metadata.json missing runIds");
    }
  } catch {
    errors.push("bundle metadata.json is invalid JSON");
  }
  return errors;
}

/**
 * Deterministic hash over the full bundle contents (sorted relative paths and
 * file bytes). Hashing only metadata.json let edited trace files slip past
 * dedup, so a re-imported bundle kept serving the stale copy.
 */
async function hashBundleContents(bundleDir: string): Promise<string> {
  const hash = createHash("sha256");
  const walk = async (dir: string, relPrefix: string): Promise<void> => {
    const entries = (await readdir(dir, { withFileTypes: true })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      const rel = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;
      const info = await lstat(abs);
      if (info.isSymbolicLink()) {
        throw new IngestLimitError(
          "INGEST_SYMLINK_REJECTED",
          "symbolic links are not allowed for ingest",
        );
      }
      if (info.isDirectory()) {
        await walk(abs, rel);
      } else if (info.isFile()) {
        hash.update(rel);
        hash.update("\0");
        hash.update(await readFile(abs));
        hash.update("\0");
      }
    }
  };
  await walk(bundleDir, "");
  return hash.digest("hex");
}

async function copyDirectoryRecursive(sourceDir: string, destDir: string): Promise<void> {
  await mkdir(destDir, { recursive: true });
  const entries = await readdir(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const from = path.join(sourceDir, entry.name);
    const to = path.join(destDir, entry.name);
    const info = await lstat(from);
    if (info.isSymbolicLink()) {
      throw new IngestLimitError(
        "INGEST_SYMLINK_REJECTED",
        "symbolic links are not allowed for ingest",
      );
    }
    if (info.isDirectory()) {
      await copyDirectoryRecursive(from, to);
    } else if (info.isFile()) {
      await copyFile(from, to);
    }
  }
}

export async function importBundleUpload(
  options: BundleUploadImportOptions,
): Promise<BundleUploadImportResult> {
  const registryImportWarnings: string[] = [];
  const errors: string[] = [];

  if (!options.enabled) {
    return {
      skipped: true,
      reason: "bundle upload ingest is disabled; use studio import bundle explicitly",
      imported: false,
      errors,
      registryImportWarnings,
    };
  }

  const bundlePath = path.resolve(options.bundlePath);
  try {
    await lstatRegularDirectory(bundlePath);
  } catch (error) {
    if (error instanceof IngestLimitError) {
      return {
        skipped: false,
        imported: false,
        errors: [error.message],
        registryImportWarnings,
      };
    }
    return {
      skipped: false,
      imported: false,
      errors: ["bundle path does not exist"],
      registryImportWarnings,
    };
  }

  const validationErrors = await validateBundleDirectory(bundlePath);
  if (validationErrors.length > 0) {
    return {
      skipped: false,
      imported: false,
      errors: validationErrors,
      registryImportWarnings,
    };
  }

  let maxBytes: number;
  try {
    maxBytes = resolveIngestMaxBytes(
      options.maxBytes ?? options.registry.ingest?.bundleUpload?.maxBytes,
    );
    await measureDirectoryBytes(bundlePath, maxBytes);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      skipped: false,
      imported: false,
      errors: [message],
      registryImportWarnings,
    };
  }

  let contentHash: string;
  try {
    contentHash = await hashBundleContents(bundlePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      skipped: false,
      imported: false,
      errors: [message],
      registryImportWarnings,
    };
  }
  const sourceKey = `bundle:${bundlePath}`;
  const existing = findIngestFileBySourceKey(options.db, sourceKey);
  if (existing && existing.contentHash === contentHash) {
    return {
      skipped: false,
      imported: false,
      destPath: existing.destPath,
      sourceKey,
      errors,
      registryImportWarnings,
    };
  }

  const dirs = resolveImportDirs(options.registryPath, options.registry);
  const folderName = path.basename(bundlePath);
  const destPath = uniqueDestPath(dirs.bundlesDir, folderName, contentHash);
  assertPathUnderRoot(destPath, dirs.registryDir);

  try {
    await withAtomicStagingDir(dirs.bundlesDir, async (stagingDir) => {
      const stagedDest = path.join(stagingDir, folderName);
      await copyDirectoryRecursive(bundlePath, stagedDest);
      await promoteStagingPath(stagedDest, destPath);
    });
    insertIngestFile(options.db, {
      sourceKey,
      sourceName: folderName,
      destPath,
      kind: "bundle",
      contentHash,
      importedAt: new Date().toISOString(),
    });
    const registryImport = await importStudioRegistry({
      db: options.db,
      registry: options.registry,
      registryPath: options.registryPath,
    });
    registryImportWarnings.push(...registryImport.warnings);
    return {
      skipped: false,
      imported: true,
      destPath,
      sourceKey,
      errors,
      registryImportWarnings,
    };
  } catch (error) {
    await rm(destPath, { recursive: true, force: true }).catch(() => undefined);
    const message = error instanceof Error ? error.message : String(error);
    return {
      skipped: false,
      imported: false,
      errors: [message],
      registryImportWarnings,
    };
  }
}

export async function runStudioBundleUploadImport(options: {
  workspacePath?: string;
  dbPath?: string;
  cwd?: string;
  bundlePath: string;
}): Promise<BundleUploadImportResult> {
  const cwd = options.cwd ?? process.cwd();
  const registryPath = await resolveStudioRegistryPath({
    ...(options.workspacePath !== undefined ? { workspacePath: options.workspacePath } : {}),
    cwd,
  });
  const registryRead = await readStudioRegistryFile(registryPath);
  if (!registryRead.ok || registryRead.registry === undefined) {
    throw new Error(registryRead.errors.join("; ") || "invalid studio registry");
  }
  const dbPath = resolveStudioDbPath({
    ...(options.dbPath !== undefined ? { dbPath: options.dbPath } : {}),
    cwd,
  });
  const db = openStudioDb(dbPath);
  return importBundleUpload({
    db,
    registryPath,
    registry: registryRead.registry,
    bundlePath: options.bundlePath,
    enabled: true,
  });
}
