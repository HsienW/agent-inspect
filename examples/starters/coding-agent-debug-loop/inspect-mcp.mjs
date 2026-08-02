import {
  callReadOnlyTool,
  createMcpServerContext,
} from "@agent-inspect/mcp-server";

const context = createMcpServerContext({
  traceDir: ".agent-inspect",
  redactionProfile: "share",
});

const recent = await callReadOnlyTool(context, "list_recent_failures", {});
const failures = JSON.parse(recent.content[0].text);
const runId = failures[0]?.runId;

if (!runId) {
  const all = await callReadOnlyTool(context, "list_recent_runs", {});
  console.log("No failures listed. Recent runs:");
  console.log(all.content[0].text);
  process.exit(0);
}

const causal = await callReadOnlyTool(context, "get_first_causal_failure", { runId });
const contracts = await callReadOnlyTool(context, "get_contract_failures", { runId });
const evidence = await callReadOnlyTool(context, "create_share_checked_evidence", { runId });

console.log(
  JSON.stringify(
    {
      runId,
      causal: JSON.parse(causal.content[0].text),
      contracts: JSON.parse(contracts.content[0].text),
      evidenceOk: !evidence.isError,
      evidenceKeys: evidence.isError
        ? evidence.content[0].text
        : Object.keys(JSON.parse(evidence.content[0].text).files ?? {}),
    },
    null,
    2,
  ),
);
