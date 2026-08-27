import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const rulePath = new URL(
  "../../../../scripts/lib/standards-provenance-rule.mjs",
  import.meta.url,
).href;

const { validateStandardsProvenance } = (await import(rulePath)) as {
  validateStandardsProvenance(input: {
    standardsText: string;
    graduationText: string;
    openInferenceFixture: unknown;
    otlpFixture: unknown;
    semconvSource: string;
  }): string[];
};

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const baseline = {
  standardsText: readFileSync(path.join(repoRoot, "docs/STANDARDS.md"), "utf8"),
  graduationText: readFileSync(path.join(repoRoot, "docs/STANDARDS-GRADUATION.md"), "utf8"),
  openInferenceFixture: JSON.parse(
    readFileSync(path.join(repoRoot, "fixtures/standards/openinference-basic.json"), "utf8"),
  ) as unknown,
  otlpFixture: JSON.parse(
    readFileSync(path.join(repoRoot, "fixtures/standards/otlp-basic.json"), "utf8"),
  ) as unknown,
  semconvSource: readFileSync(
    path.join(repoRoot, "packages/core/src/exporters/semconv.ts"),
    "utf8",
  ),
};

function validate(overrides: Partial<typeof baseline> = {}): string[] {
  return validateStandardsProvenance({ ...baseline, ...overrides });
}

describe("standards provenance public-truth rule", () => {
  it("accepts current repository provenance and known-loss claims", () => {
    expect(validate()).toEqual([]);
  });

  it("rejects a missing OTLP pin reference", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replace(
        "GenAI attribute mapping follows `OTEL_GEN_AI_SEMCONV_PIN`",
        "GenAI attribute mapping follows the exporter mapping",
      ),
    });

    expect(failures).toContain(
      "docs/STANDARDS.md: OTLP tested provenance must reference OTEL_GEN_AI_SEMCONV_PIN from packages/core/src/exporters/semconv.ts",
    );
  });

  it("rejects an OTLP version that contradicts the repository pin", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replace(
        "No gRPC collector included.",
        "Tested mapping version: 9.9.9. No gRPC collector included.",
      ),
    });

    expect(failures).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^docs\/STANDARDS\.md: OTLP tested version 9\.9\.9 contradicts OTEL_GEN_AI_SEMCONV_PIN .+ in packages\/core\/src\/exporters\/semconv\.ts$/,
        ),
      ]),
    );
  });

  it("rejects missing OTLP fixture provenance", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replace(
        "Fixture: [fixtures/standards/otlp-basic.json](../fixtures/standards/otlp-basic.json)",
        "Fixture: an untracked local sample",
      ),
    });

    expect(failures).toContain(
      "docs/STANDARDS.md: OTLP tested provenance must reference fixtures/standards/otlp-basic.json",
    );
  });

  it("rejects an OTLP fixture without a test-scope revision", () => {
    const failures = validate({
      otlpFixture: {
        resourceSpans: [{ scopeSpans: [{ scope: { name: "agent-inspect-test-scope" } }] }],
      },
    });

    expect(failures).toContain(
      "fixtures/standards/otlp-basic.json: scopeSpans[].scope.version must declare an AgentInspect test-scope fixture revision",
    );
  });

  it("rejects a documented OTLP fixture revision that contradicts its scope", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replace(
        "The fixture's `scope.version`",
        "AgentInspect test-scope fixture revision `9.9-fixture`; its `scope.version`",
      ),
    });

    expect(failures).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^docs\/STANDARDS\.md: OTLP fixture revision 9\.9-fixture must match a scope\.version in fixtures\/standards\/otlp-basic\.json \(.+\)$/,
        ),
      ]),
    );
  });

  it("rejects missing OpenInference fixture provenance", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replaceAll(
        "fixtures/standards/openinference-basic.json",
        "fixtures/standards/other.json",
      ),
    });

    expect(failures).toContain(
      "docs/STANDARDS.md: OpenInference tested provenance must reference fixtures/standards/openinference-basic.json",
    );
  });

  it("rejects a documented fixture revision that contradicts the fixture", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replace(
        "The fixture's top-level `version`",
        "AgentInspect reference fixture revision `9.9-fixture`; its top-level `version`",
      ),
    });

    expect(failures).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /^docs\/STANDARDS\.md: OpenInference fixture revision 9\.9-fixture must match fixtures\/standards\/openinference-basic\.json .+$/,
        ),
      ]),
    );
  });

  it("rejects a fabricated upstream OpenInference version", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replace(
        "Shape validation is **compatible**;",
        "OpenInference version 1.6 is tested. Shape validation is **compatible**;",
      ),
    });

    expect(failures).toContain(
      "docs/STANDARDS.md: OpenInference tested provenance is fixture-backed; do not claim an upstream OpenInference version",
    );
  });

  it("rejects removal of a canonical known-loss mapping", () => {
    const failures = validate({
      graduationText: baseline.graduationText.replace(
        "- Kinds without an OpenInference equivalent degrade (`RUN`, `LOGIC`, `ERROR` map to `CHAIN`; `RESULT` to `UNKNOWN`) and every degradation is listed in the export's `warnings`",
        "- Kinds without an OpenInference equivalent degrade and are listed in warnings",
      ),
    });

    expect(failures).toContain(
      "docs/STANDARDS-GRADUATION.md: Known loss must retain RUN / LOGIC / ERROR -> CHAIN degradation",
    );
    expect(failures).toContain(
      "docs/STANDARDS-GRADUATION.md: Known loss must retain RESULT -> UNKNOWN degradation",
    );
  });

  it("rejects a lossless claim in the canonical known-loss section", () => {
    const failures = validate({
      graduationText: baseline.graduationText.replace(
        "### Known loss, stated up front",
        "### Known loss, stated up front\n\nThe standards exports are fully lossless.",
      ),
    });

    expect(failures).toContain(
      "docs/STANDARDS-GRADUATION.md: Known loss section must not claim lossless standards export",
    );
  });

  it("requires actionable provenance maintenance references", () => {
    const failures = validate({
      standardsText: baseline.standardsText.replace(
        "`pnpm public-truth:check`",
        "the repository validator",
      ),
    });

    expect(failures).toContain(
      "docs/STANDARDS.md: Maintaining tested provenance must reference pnpm public-truth:check",
    );
  });
});
