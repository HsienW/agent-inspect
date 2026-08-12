import { describe, expect, it } from "vitest";

import { resolvePreset } from "../src/check.js";
import {
  parseEvidenceFormat,
  parseEvidenceProfile,
  shouldEmitEvidence,
} from "../src/evidence-on.js";

describe("resolvePreset", () => {
  it("returns undefined when preset is omitted", () => {
    expect(resolvePreset(undefined)).toBeUndefined();
    expect(resolvePreset("")).toBeUndefined();
    expect(resolvePreset("   ")).toBeUndefined();
  });

  it("resolves trajectory with completion, structure, and optional tool.usage", () => {
    const base = resolvePreset("trajectory");
    expect(base).toMatchObject({
      requireCompleted: true,
      enableSafetyRedaction: false,
      enableStructureRelationshipDefaults: true,
    });
    expect(base?.select).toEqual([
      "run.status",
      "run.requireCompleted",
      "structure.orphan",
      "structure.cycle",
      "structure.relationship",
    ]);
    expect(base?.select).not.toContain("tool.usage");
    expect(base?.select).not.toContain("safety.redaction");

    const withTools = resolvePreset("trajectory", { hasToolRules: true });
    expect(withTools?.select).toContain("tool.usage");
  });

  it("resolves safety with redaction flag and safety select", () => {
    const resolved = resolvePreset("safety");
    expect(resolved).toMatchObject({
      requireCompleted: false,
      enableSafetyRedaction: true,
      enableStructureRelationshipDefaults: false,
    });
    expect(resolved?.select).toEqual([
      "run.status",
      "safety.rawPrompt",
      "safety.secretPattern",
      "safety.redaction",
    ]);
  });

  it("resolves comprehensive as the union of trajectory and safety", () => {
    const resolved = resolvePreset("comprehensive", { hasToolRules: true });
    expect(resolved).toMatchObject({
      requireCompleted: true,
      enableSafetyRedaction: true,
      enableStructureRelationshipDefaults: true,
    });
    expect(resolved?.select).toEqual([
      "run.status",
      "run.requireCompleted",
      "structure.orphan",
      "structure.cycle",
      "structure.relationship",
      "tool.usage",
      "safety.rawPrompt",
      "safety.secretPattern",
      "safety.redaction",
    ]);
  });

  it("rejects unknown preset names", () => {
    expect(() => resolvePreset("mystery")).toThrow(/Unknown --preset/);
  });
});

describe("shouldEmitEvidence", () => {
  it("maps evidence-on modes without changing omitted behavior", () => {
    expect(shouldEmitEvidence(undefined, true)).toBe(false);
    expect(shouldEmitEvidence(undefined, false)).toBe(false);
    expect(shouldEmitEvidence("never", true)).toBe(false);
    expect(shouldEmitEvidence("never", false)).toBe(false);
    expect(shouldEmitEvidence("fail", true)).toBe(true);
    expect(shouldEmitEvidence("fail", false)).toBe(false);
    expect(shouldEmitEvidence("always", false)).toBe(true);
  });
});

describe("evidence option parsers", () => {
  it("defaults evidence profile to share and format to directory", () => {
    expect(parseEvidenceProfile(undefined)).toBe("share");
    expect(parseEvidenceFormat(undefined)).toBe("directory");
  });

  it("rejects unknown profile/format values", () => {
    expect(() => parseEvidenceProfile("paranoid")).toThrow(/evidence-profile/);
    expect(() => parseEvidenceFormat("tarball")).toThrow(/evidence-format/);
  });
});
