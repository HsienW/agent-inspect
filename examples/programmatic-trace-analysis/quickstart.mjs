/**
 * ESM / NodeNext-style programmatic persisted-trace analysis (6.15.0).
 *
 * Run from repo root after `pnpm build`:
 *   node examples/programmatic-trace-analysis/quickstart.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

import { openTraceFile } from "agent-inspect/readers";
import {
  buildTraceFacts,
  defineTraceContract,
  evaluateTraceContractRead,
} from "agent-inspect/checks";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = path.join(root, "fixtures/langgraph/deep-swarm-nested-ok.jsonl");

const read = await openTraceFile(fixture);
const facts = buildTraceFacts(read);

const contract = defineTraceContract({
  run: { requireCompleted: true },
  tools: { required: ["get_navan_rewards"] },
});

const result = evaluateTraceContractRead(read, contract);

console.log(
  JSON.stringify(
    {
      runCount: read.runs.length,
      logicalEvents: facts.logicalEvents.length,
      tools: [...facts.toolsByName.keys()],
      status: result.status,
    },
    null,
    2,
  ),
);
