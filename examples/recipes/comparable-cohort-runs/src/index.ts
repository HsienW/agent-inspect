import { createHash } from "node:crypto";
import path from "node:path";

import { inspectRun, step } from "agent-inspect";

const silent = process.env.AGENT_INSPECT_SILENT === "true";
const traceDir = path.join(process.cwd(), ".agent-inspect-runs");

/** Full SHA-256 of measured stage bytes (label is provenance only, not part of the digest). */
function sha256(bytes: string): string {
  return createHash("sha256").update(bytes, "utf8").digest("hex");
}

type PairClass =
  | "equivalent_stage_inputs"
  | "changed_retrieval_boundary"
  | "partial_unknown"
  | "incompatible_scope"
  | "sampling_or_model_changed"
  | "declared_treatment_diff";

interface StageCommitments {
  cohortId?: string;
  testCaseId?: string;
  promptTemplateVersion?: string;
  /** Declared treatment variable (may differ without voiding all comparison). */
  treatment?: string;
  resolvedModel?: string;
  samplingJson?: string;
  /** Bytes actually fed to the model stage for this fixture. */
  llmStageInput: string;
  /** Tool output bytes passed into the next model stage. */
  toolStageOutput: string;
  llmInputCommitment: string;
  toolOutputCommitment: string;
}

function stageCommitments(input: {
  cohortId?: string;
  testCaseId?: string;
  promptTemplateVersion?: string;
  treatment?: string;
  resolvedModel?: string;
  sampling?: Record<string, unknown>;
  llmStageInput: string;
  toolStageOutput: string;
}): StageCommitments {
  const samplingJson =
    input.sampling !== undefined ? JSON.stringify(input.sampling) : undefined;
  return {
    ...(input.cohortId !== undefined ? { cohortId: input.cohortId } : {}),
    ...(input.testCaseId !== undefined ? { testCaseId: input.testCaseId } : {}),
    ...(input.promptTemplateVersion !== undefined
      ? { promptTemplateVersion: input.promptTemplateVersion }
      : {}),
    ...(input.treatment !== undefined ? { treatment: input.treatment } : {}),
    ...(input.resolvedModel !== undefined ? { resolvedModel: input.resolvedModel } : {}),
    ...(samplingJson !== undefined ? { samplingJson } : {}),
    llmStageInput: input.llmStageInput,
    toolStageOutput: input.toolStageOutput,
    llmInputCommitment: sha256(input.llmStageInput),
    toolOutputCommitment: sha256(input.toolStageOutput),
  };
}

/**
 * Pairwise / stagewise comparison. Labels alone never yield equivalent_stage_inputs.
 */
export function comparePair(a: StageCommitments, b: StageCommitments): {
  class: PairClass;
  note: string;
} {
  if (!a.cohortId || !a.testCaseId || !b.cohortId || !b.testCaseId) {
    return { class: "partial_unknown", note: "missing cohortId/testCaseId identity" };
  }
  if (a.cohortId !== b.cohortId || a.testCaseId !== b.testCaseId) {
    return {
      class: "incompatible_scope",
      note: "mismatched cohort or testCase — comparison scope incompatible",
    };
  }
  if (!a.llmInputCommitment || !a.toolOutputCommitment || !b.llmInputCommitment || !b.toolOutputCommitment) {
    return { class: "partial_unknown", note: "missing stage input/tool commitment" };
  }
  if (
    (a.resolvedModel !== undefined || b.resolvedModel !== undefined) &&
    a.resolvedModel !== b.resolvedModel
  ) {
    return {
      class: "sampling_or_model_changed",
      note: `resolvedModel differs (${a.resolvedModel ?? "?"} vs ${b.resolvedModel ?? "?"})`,
    };
  }
  if (
    (a.samplingJson !== undefined || b.samplingJson !== undefined) &&
    a.samplingJson !== b.samplingJson
  ) {
    return {
      class: "sampling_or_model_changed",
      note: "sampling evidence differs",
    };
  }
  if (a.toolOutputCommitment !== b.toolOutputCommitment) {
    return {
      class: "changed_retrieval_boundary",
      note: "tool/retrieval stage output commitment differs — not equivalent-input evidence",
    };
  }
  if (a.llmInputCommitment !== b.llmInputCommitment) {
    return {
      class: "changed_retrieval_boundary",
      note: "next-model stage input commitment differs after tool boundary",
    };
  }
  if (a.treatment !== b.treatment) {
    return {
      class: "declared_treatment_diff",
      note: `treatment differs (${a.treatment ?? "none"} vs ${b.treatment ?? "none"}); stage inputs still match`,
    };
  }
  return {
    class: "equivalent_stage_inputs",
    note: "matching identities and measured stage commitments (synthetic fixture bytes)",
  };
}

const baseToolOut = JSON.stringify({ orderId: "ord-1", policy: "refund-ok" });
const baseLlmIn = `template=refund-v3\ntools=lookupOrder,issueRefund\ntoolOut=${baseToolOut}`;

const cases: Array<{
  name: string;
  left: ReturnType<typeof stageCommitments>;
  right: ReturnType<typeof stageCommitments>;
}> = [
  {
    name: "matching-stages",
    left: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      promptTemplateVersion: "refund-v3",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0 },
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
    right: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      promptTemplateVersion: "refund-v3",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0 },
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
  },
  {
    name: "changed-retrieval",
    left: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      promptTemplateVersion: "refund-v3",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0 },
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
    right: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      promptTemplateVersion: "refund-v3",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0 },
      // Same headline template label, different tool bytes → different next-model input
      toolStageOutput: JSON.stringify({ orderId: "ord-1", policy: "refund-denied" }),
      llmStageInput: `template=refund-v3\ntools=lookupOrder,issueRefund\ntoolOut=${JSON.stringify({ orderId: "ord-1", policy: "refund-denied" })}`,
    }),
  },
  {
    name: "missing-commitment",
    left: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
    right: {
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      llmStageInput: "",
      toolStageOutput: "",
      llmInputCommitment: "",
      toolOutputCommitment: "",
    },
  },
  {
    name: "mismatched-cohort",
    left: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
    right: stageCommitments({
      cohortId: "other-cohort",
      testCaseId: "refund-happy-path",
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
  },
  {
    name: "sampling-changed",
    left: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0 },
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
    right: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0.7 },
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
  },
  {
    name: "treatment-diff",
    left: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      treatment: "control",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0 },
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
    right: stageCommitments({
      cohortId: "support-refund-cohort",
      testCaseId: "refund-happy-path",
      treatment: "variant-b",
      resolvedModel: "fixture-model",
      sampling: { temperature: 0 },
      llmStageInput: baseLlmIn,
      toolStageOutput: baseToolOut,
    }),
  },
];

const pairResults: Array<{ name: string; class: PairClass; note: string }> = [];

for (const pair of cases) {
  await inspectRun(
    pair.name,
    async () => {
      await step.tool("lookupOrder", async () => ({ orderId: "ord-1" }));
      await step.llm("fixture-model", async () => "ok");
      return { ok: true };
    },
    {
      silent,
      traceDir,
      metadata: {
        cohortId: pair.left.cohortId,
        testCaseId: pair.left.testCaseId,
        promptTemplateVersion: pair.left.promptTemplateVersion,
        llmInputCommitment: pair.left.llmInputCommitment,
        toolOutputCommitment: pair.left.toolOutputCommitment,
        pairClass: comparePair(pair.left, pair.right).class,
        synthetic: true,
      },
    },
  );
  const compared = comparePair(pair.left, pair.right);
  pairResults.push({ name: pair.name, class: compared.class, note: compared.note });
}

console.log("pairwise-comparability:");
for (const row of pairResults) {
  console.log(`  ${row.name}: ${row.class}`);
  console.log(`    note: ${row.note}`);
}
console.log("classes:", pairResults.map((r) => r.class).join(","));
