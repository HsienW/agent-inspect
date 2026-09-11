import path from "node:path";

import {
  defineTraceContract,
  evaluateTraceContractRead,
  explainTraceContract,
  lintTraceContract,
} from "agent-inspect/checks";
import { openTrace } from "agent-inspect/readers";
import { inspectRun, step } from "agent-inspect";

/**
 * Local "use together with Promptfoo" pattern:
 * 1) capture an AgentInspect trajectory for a fixture agent turn
 * 2) evaluate a TraceContract (the same gate a Promptfoo assert can call)
 * 3) print lint/explain hints for brittle contracts
 *
 * No Promptfoo package import and no remote generation — keep CI offline.
 * See promptfooconfig.example.yaml for the companion config sketch.
 */
const traceDir = path.join(process.cwd(), ".agent-inspect-runs");

await inspectRun(
  "promptfoo-use-together",
  async () => {
    await step.tool("retrieve", async () => ({ docs: 2 }));
    await step.tool("generate", async () => ({ answer: "fixture" }));
  },
  { silent: true, traceDir },
);

const contract = defineTraceContract({
  run: { requireCompleted: true },
  tools: {
    requiredOrder: ["retrieve", "generate"],
    requiredOrderMode: "happens-before",
  },
  alternatives: {
    anyOf: [
      {
        id: "retrieve-path",
        description: "Fresh retrieval before generate",
        contract: {
          tools: { required: ["retrieve", "generate"] },
        },
      },
      {
        id: "cache-path",
        description: "Cache lookup without retrieve",
        contract: {
          tools: { required: ["cache_lookup", "generate"], forbidden: ["retrieve"] },
        },
      },
    ],
  },
});

const read = await openTrace({ type: "directory", path: traceDir });
const result = evaluateTraceContractRead(read, contract);
const lint = lintTraceContract(contract);
const explain = explainTraceContract(contract);

console.log("Promptfoo use-together recipe complete");
console.log(`Trace directory: ${traceDir}`);
console.log(`Contract status: ${result.status}`);
console.log(`Lint diagnostics: ${lint.length}`);
console.log("Explain:");
for (const line of explain) {
  console.log(`  - ${line}`);
}
console.log("Use the same evaluateTraceContractRead() call from a Promptfoo assert.");
console.log("See promptfooconfig.example.yaml (local mock provider; no remote).");
