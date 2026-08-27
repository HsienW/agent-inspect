import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  defineTraceContract,
  evaluateTraceContractRead,
} from "agent-inspect/checks";
import { openTraceFile } from "agent-inspect/readers";

const recipeDir = path.dirname(fileURLToPath(import.meta.url));
const tracesDir = path.resolve(recipeDir, "../../../../fixtures/traces");

const contract = defineTraceContract({
  run: { requireCompleted: true, allowedStatuses: ["ok"] },
  tools: { required: ["refund_order"] },
});

const cases = [
  { file: "contract-broken.jsonl", expected: "fail" },
  { file: "contract-fixed.jsonl", expected: "pass" },
] as const;

const statuses: string[] = [];
for (const contractCase of cases) {
  const read = await openTraceFile(path.join(tracesDir, contractCase.file));
  const result = evaluateTraceContractRead(read, contract);
  statuses.push(`${contractCase.file}=${result.status}`);
  if (result.status !== contractCase.expected) {
    console.error(
      `Expected ${contractCase.file} to ${contractCase.expected}, received ${result.status}.`,
    );
    process.exitCode = 1;
  }
}

console.log(`TraceContract: ${statuses.join(", ")}`);
