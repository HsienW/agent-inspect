import { mkdir, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { inspectRun } from "../src/inspect-run.js";
import {
  preparePersistedInspectEventForWrite,
  resolveTraceSafetyOptions,
} from "../src/trace-event-safety.js";
import type { TraceEvent } from "../src/types.js";
import {
  redactHighConfidenceCredentialsInString,
  stringContainsHighConfidenceCredential,
} from "../src/safety/credential-value-patterns.js";

const FIXTURE_SK = "sk-proj-abcdefghijklmnopqrstuvwxyz";
const FIXTURE_BEARER = "Bearer abcdefghijklmnop";

async function readStepCompleted(traceDir: string): Promise<TraceEvent | undefined> {
  const files = await readdir(traceDir);
  const jsonl = files.find((f) => f.endsWith(".jsonl"));
  if (!jsonl) return undefined;
  const raw = await readFile(path.join(traceDir, jsonl), "utf-8");
  const line = raw.split("\n").find((l) => l.includes("step_completed"));
  if (!line?.trim()) return undefined;
  return JSON.parse(line.trim()) as TraceEvent;
}

describe("pre-disk error message credential protection", () => {
  let traceDir: string;

  beforeEach(async () => {
    traceDir = path.join(os.tmpdir(), `agent-inspect-err-redact-${Date.now()}`);
    await mkdir(traceDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await rm(traceDir, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  });

  it("detects provider API keys and bearer tokens in free text", () => {
    expect(stringContainsHighConfidenceCredential(`failed: ${FIXTURE_SK}`)).toBe(true);
    expect(stringContainsHighConfidenceCredential(`auth ${FIXTURE_BEARER}`)).toBe(true);
    expect(stringContainsHighConfidenceCredential("tool timed out after 30s")).toBe(false);
    expect(redactHighConfidenceCredentialsInString(`failed: ${FIXTURE_SK}`)).toBe("[REDACTED]");
    expect(redactHighConfidenceCredentialsInString("tool timed out after 30s")).toBe(
      "tool timed out after 30s",
    );
  });

  it("preparePersistedInspectEventForWrite redacts free-text secrets in error.message", () => {
    const event = preparePersistedInspectEventForWrite(
      {
        schemaVersion: "1.0",
        eventId: "evt_1",
        runId: "run_1",
        kind: "LOGIC",
        name: "failing-step",
        timestamp: "2026-09-11T00:00:00.000Z",
        confidence: "explicit",
        status: "error",
        source: { type: "manual" },
        error: {
          message: `Upstream rejected request using ${FIXTURE_SK}`,
          name: "Error",
        },
      },
      resolveTraceSafetyOptions(),
    );
    expect(event?.error?.message).toBe("[REDACTED]");
    expect(JSON.stringify(event)).not.toContain(FIXTURE_SK);
  });

  it("preparePersistedInspectEventForWrite preserves ordinary error text", () => {
    const event = preparePersistedInspectEventForWrite(
      {
        schemaVersion: "1.0",
        eventId: "evt_2",
        runId: "run_2",
        kind: "LOGIC",
        name: "failing-step",
        timestamp: "2026-09-11T00:00:00.000Z",
        confidence: "explicit",
        status: "error",
        source: { type: "manual" },
        error: {
          message: "Connection refused on port 5432",
          name: "Error",
        },
      },
      resolveTraceSafetyOptions(),
    );
    expect(event?.error?.message).toBe("Connection refused on port 5432");
  });

  it("preparePersistedInspectEventForWrite respects redact:false opt-out", () => {
    const event = preparePersistedInspectEventForWrite(
      {
        schemaVersion: "1.0",
        eventId: "evt_3",
        runId: "run_3",
        kind: "LOGIC",
        name: "failing-step",
        timestamp: "2026-09-11T00:00:00.000Z",
        confidence: "explicit",
        status: "error",
        source: { type: "manual" },
        error: {
          message: `Upstream rejected request using ${FIXTURE_SK}`,
        },
      },
      resolveTraceSafetyOptions({ redact: false }),
    );
    expect(event?.error?.message).toContain(FIXTURE_SK);
  });

  it("inspectRun redacts free-text secrets in step error messages before disk", async () => {
    await expect(
      inspectRun(
        "err-secret-run",
        async () => {
          throw new Error(`LLM call failed with ${FIXTURE_SK}`);
        },
        { traceDir, silent: true },
      ),
    ).rejects.toThrow(/LLM call failed/);

    const completed = await readStepCompleted(traceDir);
    // run_completed may be the only completion; also check run file for any error message
    const files = await readdir(traceDir);
    const jsonl = files.find((f) => f.endsWith(".jsonl"));
    expect(jsonl).toBeDefined();
    const raw = await readFile(path.join(traceDir, jsonl!), "utf-8");
    expect(raw).not.toContain(FIXTURE_SK);
    expect(raw).toMatch(/\[REDACTED\]/);
    void completed;
  });

  it("inspectRun redact:false preserves free-text secrets in error messages", async () => {
    await expect(
      inspectRun(
        "err-opt-out",
        async () => {
          throw new Error(`LLM call failed with ${FIXTURE_SK}`);
        },
        { traceDir, silent: true, redact: false },
      ),
    ).rejects.toThrow(/LLM call failed/);

    const files = await readdir(traceDir);
    const jsonl = files.find((f) => f.endsWith(".jsonl"));
    const raw = await readFile(path.join(traceDir, jsonl!), "utf-8");
    expect(raw).toContain(FIXTURE_SK);
  });

  it("inspectRun redacts bearer tokens embedded in error messages", async () => {
    await expect(
      inspectRun(
        "err-bearer",
        async () => {
          throw new Error(`Authorization failed: ${FIXTURE_BEARER}`);
        },
        { traceDir, silent: true },
      ),
    ).rejects.toThrow(/Authorization failed/);

    const files = await readdir(traceDir);
    const jsonl = files.find((f) => f.endsWith(".jsonl"));
    const raw = await readFile(path.join(traceDir, jsonl!), "utf-8");
    expect(raw).not.toContain("abcdefghijklmnop");
    expect(raw).toMatch(/\[REDACTED\]/);
  });
});
