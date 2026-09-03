import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  EVIDENCE_MANIFEST_FILENAME,
  buildEvidenceManifest,
  parseEvidenceManifestJson,
  serializeEvidenceManifest,
  sha256Hex,
  verifyEvidenceDirectory,
} from "agent-inspect/advanced";

const runId = "repair-example-run";
const createdAt = "2025-01-01T00:00:00.000Z";
const revisionB = "89abcdef0123456789abcdef0123456789abcdef";
const boundArtifactPaths = [
  "check-output.txt",
  "failed-trace.jsonl",
  "repair.patch",
  "reproduction.json",
] as const;

const sourceDir = path.dirname(fileURLToPath(import.meta.url));
const recipeDir = path.resolve(sourceDir, "..");
const fixturesDir = path.join(recipeDir, "fixtures");
const evidenceDir = path.join(recipeDir, ".generated-evidence");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const files = await Promise.all(
  boundArtifactPaths.map(async (relativePath) => ({
    path: relativePath,
    content: await readFile(path.join(fixturesDir, relativePath)),
  })),
);

function requireFile(relativePath: (typeof boundArtifactPaths)[number]) {
  const file = files.find((candidate) => candidate.path === relativePath);
  if (!file) throw new Error(`Missing ${relativePath} fixture.`);
  return file;
}

const failedTrace = requireFile("failed-trace.jsonl");
const reproduction = requireFile("reproduction.json");

function buildManifest(packagedFiles: typeof files) {
  return buildEvidenceManifest({
    generatorName: "reproducible-repair-evidence-recipe",
    generatorVersion: "1.0.0",
    runIds: [runId],
    traceSchemaVersions: ["0.1"],
    sourceHashes: [{ runId, algorithm: "sha256", hash: sha256Hex(failedTrace.content) }],
    redactionProfile: "share",
    assessmentStatus: "SAFE WITH WARNINGS",
    files: packagedFiles,
    createdAt,
  });
}

await rm(evidenceDir, { recursive: true, force: true });
await mkdir(evidenceDir, { recursive: true });
await Promise.all(
  files.map((file) => writeFile(path.join(evidenceDir, file.path), file.content)),
);

const manifestA = buildManifest(files);
const serializedManifestA = serializeEvidenceManifest(manifestA);
await writeFile(
  path.join(evidenceDir, EVIDENCE_MANIFEST_FILENAME),
  serializedManifestA,
  "utf8",
);

const parsedManifest = parseEvidenceManifestJson(
  await readFile(path.join(evidenceDir, EVIDENCE_MANIFEST_FILENAME), "utf8"),
);
const actualPaths = parsedManifest.files.map((file) => file.path).sort();
assert(
  JSON.stringify(actualPaths) === JSON.stringify(boundArtifactPaths),
  `Unexpected bound artifacts: ${actualPaths.join(", ")}`,
);

type ReproductionEnvelope = {
  repository: { commit: string };
  environment: { allowlist: string[]; values: Record<string, string> };
};

const reproductionA = JSON.parse(reproduction.content.toString("utf8")) as ReproductionEnvelope;
assert(
  reproductionA.environment.allowlist.length === 0 &&
    Object.keys(reproductionA.environment.values).length === 0,
  "The synthetic reproduction must use an explicit empty environment allowlist.",
);

const reproductionForRevisionB = structuredClone(reproductionA);
reproductionForRevisionB.repository.commit = revisionB;
const reproductionB = `${JSON.stringify(reproductionForRevisionB, null, 2)}\n`;
const filesB = files.map((file) =>
  file.path === "reproduction.json" ? { ...file, content: Buffer.from(reproductionB) } : file,
);
const manifestB = buildManifest(filesB);

const hashFor = (
  manifest: typeof manifestA,
  relativePath: (typeof boundArtifactPaths)[number],
) => manifest.files.find((file) => file.path === relativePath)?.sha256;

assert(
  hashFor(manifestA, "failed-trace.jsonl") === hashFor(manifestB, "failed-trace.jsonl"),
  "The same failed trace must retain the same hash across revisions.",
);
assert(
  hashFor(manifestA, "reproduction.json") !== hashFor(manifestB, "reproduction.json"),
  "Changing the repository revision must change the reproduction artifact hash.",
);
assert(
  serializedManifestA !== serializeEvidenceManifest(manifestB),
  "Changing the repository revision must change the Evidence manifest.",
);

const verification = await verifyEvidenceDirectory(evidenceDir);
if (!verification.ok) {
  for (const issue of verification.issues) {
    console.error(`${issue.code}: ${issue.message}`);
  }
  throw new Error("Generated Evidence directory failed integrity verification.");
}

console.log("Reproducible repair evidence: pass");
console.log(`Run: ${runId}`);
console.log(`Files checked: ${verification.checkedFiles}`);
console.log(`Bound artifacts: ${actualPaths.join(", ")}`);
console.log("Revision binding: pass");
console.log(`Environment allowlist: ${reproductionA.environment.allowlist.length} variables`);
console.log("Replay executed: no");
console.log("Evidence directory: .generated-evidence");
