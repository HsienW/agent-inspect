import { createHash } from "node:crypto";
import path from "node:path";

import { inspectRun, step } from "agent-inspect";

const silent = process.env.AGENT_INSPECT_SILENT === "true";
const traceDir = path.join(process.cwd(), ".agent-inspect-runs");

function commitment(label: string, value: string): string {
  return `${label}:${createHash("sha256").update(value).digest("hex").slice(0, 16)}`;
}

type ComparabilityClass =
  | "comparable"
  | "partially_comparable"
  | "not_comparable"
  | "unknown";

function classify(meta: Record<string, unknown> | undefined): ComparabilityClass {
  if (!meta || typeof meta !== "object") return "unknown";
  const cohortId = meta.cohortId;
  const testCaseId = meta.testCaseId;
  const promptTemplateVersion = meta.promptTemplateVersion;
  const availableToolsCommitment = meta.availableToolsCommitment;
  if (!cohortId && !testCaseId) return "unknown";
  if (!cohortId || !testCaseId) return "not_comparable";
  if (promptTemplateVersion && availableToolsCommitment) return "comparable";
  return "partially_comparable";
}

const shared = {
  cohortId: "support-refund-cohort",
  testCaseId: "refund-happy-path",
  promptTemplateVersion: "refund-v3",
  availableToolsCommitment: commitment("tools", "lookupOrder,issueRefund"),
  sampling: { temperature: 0 },
};

const runs: Array<{ name: string; meta: Record<string, unknown> }> = [
  {
    name: "comparable-a",
    meta: {
      ...shared,
      attempt: 1,
      llmInputCommitment: commitment("llm-in", "fixture-input-a"),
      toolOutputCommitment: commitment("tool-out", "fixture-tool-a"),
    },
  },
  {
    name: "comparable-b",
    meta: {
      ...shared,
      attempt: 2,
      llmInputCommitment: commitment("llm-in", "fixture-input-b"),
      toolOutputCommitment: commitment("tool-out", "fixture-tool-b"),
    },
  },
  {
    name: "partial-only",
    meta: {
      cohortId: shared.cohortId,
      testCaseId: shared.testCaseId,
      // missing prompt/template + tools commitments
    },
  },
  {
    name: "unknown-run",
    meta: { note: "no comparability fields" },
  },
];

const results: Array<{ name: string; class: ComparabilityClass }> = [];

for (const run of runs) {
  await inspectRun(
    run.name,
    async () => {
      await step.tool("lookupOrder", async () => ({ orderId: "ord-1" }));
      await step.llm("fixture-model", async () => "ok");
      return { ok: true };
    },
    { silent, traceDir, metadata: run.meta },
  );
  results.push({ name: run.name, class: classify(run.meta) });
}

console.log("comparability:");
for (const row of results) {
  console.log(`  ${row.name}: ${row.class}`);
}
console.log(
  "classes:",
  results.map((r) => r.class).join(","),
);
