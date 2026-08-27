function markdownSection(markdown, headingPrefix, level) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const heading = "#".repeat(level) + " ";
  const start = lines.findIndex(
    (line) =>
      line.startsWith(heading) &&
      line.slice(heading.length).trim().toLowerCase().startsWith(headingPrefix.toLowerCase()),
  );
  if (start < 0) return null;

  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const match = /^(#{1,6})\s+/.exec(lines[index]);
    if (match && match[1].length <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start, end).join("\n");
}

function semconvPinVersion(source) {
  const block =
    /\b(?:export\s+)?const\s+OTEL_GEN_AI_SEMCONV_PIN\s*=\s*\{([\s\S]*?)\n\}/.exec(source)?.[1];
  return block ? /\bversion\s*:\s*["']([^"']+)["']/.exec(block)?.[1] ?? null : null;
}

function explicitOtlpVersions(section) {
  const versions = [];
  const pattern =
    /\b(?:tested(?:\s+(?:OTLP|semantic-convention|semconv|mapping))?|semantic-convention(?:\s+(?:pin|version|mapping))?|semconv(?:\s+(?:pin|version))?|mapping(?:\s+version)?|pin(?:ned)?(?:\s+version)?)\b[^\n]{0,100}?\bv?(\d+\.\d+\.\d+)\b/gi;
  for (const match of section.matchAll(pattern)) versions.push(match[1]);
  return versions;
}

function otlpFixtureRevisions(fixture) {
  if (!fixture || typeof fixture !== "object" || !Array.isArray(fixture.resourceSpans)) {
    return [];
  }

  const revisions = [];
  for (const resourceSpan of fixture.resourceSpans) {
    if (
      !resourceSpan ||
      typeof resourceSpan !== "object" ||
      !Array.isArray(resourceSpan.scopeSpans)
    ) {
      continue;
    }
    for (const scopeSpan of resourceSpan.scopeSpans) {
      if (!scopeSpan || typeof scopeSpan !== "object") continue;
      const scope = scopeSpan.scope;
      if (!scope || typeof scope !== "object") continue;
      if (typeof scope.version === "string" && scope.version) {
        revisions.push(scope.version);
      }
    }
  }
  return [...new Set(revisions)];
}

/**
 * Validate standards documentation against repository-owned tested provenance.
 * The returned diagnostics are deterministic and safe to print from repository gates.
 */
export function validateStandardsProvenance({
  standardsText,
  graduationText,
  openInferenceFixture,
  otlpFixture,
  semconvSource,
}) {
  const failures = [];
  const pinVersion = semconvPinVersion(semconvSource);
  const fixtureRevision =
    openInferenceFixture &&
    typeof openInferenceFixture === "object" &&
    typeof openInferenceFixture.version === "string"
      ? openInferenceFixture.version
      : null;
  const otlpRevisions = otlpFixtureRevisions(otlpFixture);

  if (!pinVersion) {
    failures.push(
      "packages/core/src/exporters/semconv.ts: OTEL_GEN_AI_SEMCONV_PIN must declare a string version",
    );
  }
  if (!fixtureRevision) {
    failures.push(
      "fixtures/standards/openinference-basic.json: top-level version must declare the AgentInspect reference fixture revision",
    );
  }
  if (otlpRevisions.length === 0) {
    failures.push(
      "fixtures/standards/otlp-basic.json: scopeSpans[].scope.version must declare an AgentInspect test-scope fixture revision",
    );
  }

  const openInference = markdownSection(standardsText, "OpenInference", 2);
  if (!openInference) {
    failures.push("docs/STANDARDS.md: OpenInference section is required");
  } else {
    if (!openInference.includes("fixtures/standards/openinference-basic.json")) {
      failures.push(
        "docs/STANDARDS.md: OpenInference tested provenance must reference fixtures/standards/openinference-basic.json",
      );
    }
    if (!/AgentInspect reference fixture revision/i.test(openInference)) {
      failures.push(
        "docs/STANDARDS.md: label the OpenInference fixture version as an AgentInspect reference fixture revision",
      );
    }
    if (!/not an upstream OpenInference version/i.test(openInference)) {
      failures.push(
        "docs/STANDARDS.md: clarify that the fixture revision is not an upstream OpenInference version",
      );
    }
    if (/\bOpenInference\s+(?:upstream\s+|spec(?:ification)?\s+|library\s+)?version\s+v?\d/i.test(openInference)) {
      failures.push(
        "docs/STANDARDS.md: OpenInference tested provenance is fixture-backed; do not claim an upstream OpenInference version",
      );
    }
    if (fixtureRevision) {
      for (const revision of openInference.match(/\b\d+\.\d+(?:\.\d+)?-fixture\b/g) ?? []) {
        if (revision !== fixtureRevision) {
          failures.push(
            `docs/STANDARDS.md: OpenInference fixture revision ${revision} must match fixtures/standards/openinference-basic.json ${fixtureRevision}`,
          );
        }
      }
    }
  }

  const otlp = markdownSection(standardsText, "OTLP JSON", 2);
  if (!otlp) {
    failures.push("docs/STANDARDS.md: OTLP JSON section is required");
  } else {
    if (!/GenAI attribute mapping follows\s+`OTEL_GEN_AI_SEMCONV_PIN`/i.test(otlp)) {
      failures.push(
        "docs/STANDARDS.md: OTLP tested provenance must reference OTEL_GEN_AI_SEMCONV_PIN from packages/core/src/exporters/semconv.ts",
      );
    }
    if (!otlp.includes("fixtures/standards/otlp-basic.json")) {
      failures.push(
        "docs/STANDARDS.md: OTLP tested provenance must reference fixtures/standards/otlp-basic.json",
      );
    }
    if (!/AgentInspect test-scope fixture revision/i.test(otlp)) {
      failures.push(
        "docs/STANDARDS.md: label OTLP scope.version as an AgentInspect test-scope fixture revision",
      );
    }
    if (!/not the [`]*OTEL_GEN_AI_SEMCONV_PIN[`]*/i.test(otlp)) {
      failures.push(
        "docs/STANDARDS.md: distinguish the OTLP fixture scope.version from OTEL_GEN_AI_SEMCONV_PIN",
      );
    }
    if (!/not an upstream OpenTelemetry version/i.test(otlp)) {
      failures.push(
        "docs/STANDARDS.md: clarify that the OTLP fixture revision is not an upstream OpenTelemetry version",
      );
    }
    if (pinVersion) {
      for (const claimedVersion of explicitOtlpVersions(otlp)) {
        if (claimedVersion !== pinVersion) {
          failures.push(
            `docs/STANDARDS.md: OTLP tested version ${claimedVersion} contradicts OTEL_GEN_AI_SEMCONV_PIN ${pinVersion} in packages/core/src/exporters/semconv.ts`,
          );
        }
      }
    }
    for (const revision of otlp.match(/\b\d+\.\d+(?:\.\d+)?-fixture\b/g) ?? []) {
      if (!otlpRevisions.includes(revision)) {
        failures.push(
          `docs/STANDARDS.md: OTLP fixture revision ${revision} must match a scope.version in fixtures/standards/otlp-basic.json (${otlpRevisions.join(", ") || "missing"})`,
        );
      }
    }
  }

  const maintenance = markdownSection(standardsText, "Maintaining tested provenance", 2);
  if (!maintenance) {
    failures.push("docs/STANDARDS.md: Maintaining tested provenance section is required");
  } else {
    for (const requiredReference of [
      "packages/core/src/exporters/semconv.ts",
      "fixtures/standards/openinference-basic.json",
      "fixtures/standards/otlp-basic.json",
      "STANDARDS-GRADUATION.md",
      "pnpm public-truth:check",
    ]) {
      if (!maintenance.includes(requiredReference)) {
        failures.push(
          `docs/STANDARDS.md: Maintaining tested provenance must reference ${requiredReference}`,
        );
      }
    }
  }

  if (!standardsText.includes("STANDARDS-GRADUATION.md")) {
    failures.push(
      "docs/STANDARDS.md: standards claims must link to canonical known-loss boundaries in docs/STANDARDS-GRADUATION.md",
    );
  }

  const knownLoss = markdownSection(graduationText, "Known loss", 3);
  if (!knownLoss) {
    failures.push("docs/STANDARDS-GRADUATION.md: Known loss section is required");
  } else {
    const requiredBoundaries = [
      {
        pattern: /\bRUN\b[\s\S]{0,100}\bLOGIC\b[\s\S]{0,100}\bERROR\b[\s\S]{0,100}\bCHAIN\b/,
        description: "RUN / LOGIC / ERROR -> CHAIN degradation",
      },
      {
        pattern: /\bRESULT\b[\s\S]{0,60}\bUNKNOWN\b/,
        description: "RESULT -> UNKNOWN degradation",
      },
      {
        pattern: /\bbounded\b[\s\S]{0,80}\bmetadata-only\b/i,
        description: "bounded metadata-only attributes",
      },
      {
        pattern: /\bChain-of-thought\b[\s\S]{0,80}\bnever captured\b/i,
        description: "no chain-of-thought capture",
      },
      {
        pattern: /\bsnapshot\b[\s\S]{0,80}\bnot a live pipeline\b/i,
        description: "snapshot/export limitation",
      },
      {
        pattern: /\bdegradation\b[\s\S]{0,100}\bwarnings\b/i,
        description: "degradation warnings",
      },
    ];
    for (const boundary of requiredBoundaries) {
      if (!boundary.pattern.test(knownLoss)) {
        failures.push(
          `docs/STANDARDS-GRADUATION.md: Known loss must retain ${boundary.description}`,
        );
      }
    }
    if (/\b(?:is|are)\s+(?:fully\s+)?lossless\b|\bno known losses?\b|\bwithout (?:data )?loss\b/i.test(knownLoss)) {
      failures.push(
        "docs/STANDARDS-GRADUATION.md: Known loss section must not claim lossless standards export",
      );
    }
  }

  return failures;
}
