/**
 * v6.9-0 — safety FP/TP corpus catalog contract.
 *
 * Locks fixture inventory and expectation shape. Detector precision against
 * mustFlag/mustNotFlag is asserted in later 6.9 chunks.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const corpusPath = path.join(repoRoot, "fixtures/safety/corpus.json");
const policies = ["development", "share", "strict"] as const;
const statuses = new Set(["SAFE", "SAFE WITH WARNINGS", "UNSAFE", "UNKNOWN"]);

interface CorpusCase {
  id: string;
  fixture: string;
  stimulus: string;
  expectations: Record<
    (typeof policies)[number],
    {
      mustNotFlag?: string[];
      mustFlag?: string[];
      mayFlag?: string[];
      status: string;
    }
  >;
}

interface Corpus {
  corpusVersion: string;
  cases: CorpusCase[];
}

describe("safety FP corpus (6.9-0)", () => {
  it("catalog exists and lists every policy for each case", () => {
    expect(fs.existsSync(corpusPath)).toBe(true);
    const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8")) as Corpus;
    expect(corpus.corpusVersion).toBe("0.1");
    expect(corpus.cases.length).toBeGreaterThanOrEqual(15);

    const ids = new Set<string>();
    for (const item of corpus.cases) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(ids.has(item.id), `duplicate id ${item.id}`).toBe(false);
      ids.add(item.id);
      expect(item.stimulus.length).toBeGreaterThan(0);
      expect(item.fixture.endsWith(".jsonl")).toBe(true);

      const abs = path.join(repoRoot, "fixtures/safety", item.fixture);
      expect(fs.existsSync(abs), item.fixture).toBe(true);

      for (const policy of policies) {
        const exp = item.expectations[policy];
        expect(exp, `${item.id}.${policy}`).toBeTruthy();
        expect(statuses.has(exp.status), `${item.id}.${policy} status`).toBe(true);
        for (const key of ["mustNotFlag", "mustFlag", "mayFlag"] as const) {
          const list = exp[key];
          if (list === undefined) continue;
          expect(Array.isArray(list)).toBe(true);
          expect(list.every((v) => typeof v === "string" && v.length > 0)).toBe(true);
        }
      }
    }
  });

  it("each fixture is non-empty schemaVersion 0.1 JSONL", () => {
    const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf8")) as Corpus;
    for (const item of corpus.cases) {
      const abs = path.join(repoRoot, "fixtures/safety", item.fixture);
      const lines = fs
        .readFileSync(abs, "utf8")
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "");
      expect(lines.length, item.fixture).toBeGreaterThan(0);
      for (const line of lines) {
        const row = JSON.parse(line) as { schemaVersion?: string; type?: string; runId?: string };
        expect(row.schemaVersion).toBe("0.1");
        expect(typeof row.type).toBe("string");
        expect(typeof row.runId).toBe("string");
      }
    }
  });
});
