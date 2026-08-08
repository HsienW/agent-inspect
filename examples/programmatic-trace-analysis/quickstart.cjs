/**
 * CommonJS / Node16-style programmatic persisted-trace analysis (6.15.0).
 *
 * Run from repo root after `pnpm build`:
 *   node examples/programmatic-trace-analysis/quickstart.cjs
 */
const path = require("node:path");

const { openTraceFile } = require("agent-inspect/readers");
const {
  buildTraceFacts,
  defineTraceContract,
  evaluateTraceContractRead,
} = require("agent-inspect/checks");

async function main() {
  const fixture = path.join(
    __dirname,
    "../../fixtures/langgraph/deep-swarm-nested-ok.jsonl",
  );

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
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
