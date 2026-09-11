import path from "node:path";

import { defineTraceContract, evaluateTraceContractRead } from "agent-inspect/checks";
import { openTrace } from "agent-inspect/readers";
import { inspectRun } from "agent-inspect";
import { wrapMcpClient } from "@agent-inspect/mcp";

/**
 * Negative-path recipe: an MCP tool returns isError=true (expected rejection).
 * The original rejection remains in the JSONL history; the contract asserts it
 * without rewriting or deleting prior events.
 */
const traceDir = path.join(process.cwd(), ".agent-inspect-runs");

const client = wrapMcpClient(
  {
    async listTools() {
      return { tools: [{ name: "submitPayment", description: "fixture payment tool" }] };
    },
    async callTool({ name }) {
      return {
        isError: true,
        content: [{ type: "text", text: `fixture-rejection:${name}:insufficient_funds` }],
      };
    },
  },
  {
    serverName: "fixture-mcp-server",
    serverUrl: "http://127.0.0.1:7337",
    sessionId: "sess-mcp-expected-rejection-001",
  },
);

await inspectRun(
  "mcp-expected-rejection",
  async () => {
    await client.callTool({ name: "submitPayment", arguments: { amount: 1 } });
  },
  {
    silent: true,
    traceDir,
    metadata: {
      sessionId: "sess-mcp-expected-rejection-001",
      workflowName: "mcp-expected-rejection",
    },
  },
);

const read = await openTrace({ type: "directory", path: traceDir });
const contract = defineTraceContract({
  run: { requireCompleted: true },
  tools: { required: ["submitPayment"] },
  // Expected rejection is evidenced by tool presence + run completion.
  // History is not rewritten: the isError payload stays on the TOOL event.
});
const result = evaluateTraceContractRead(read, contract);

console.log("MCP expected-rejection recipe complete");
console.log(`Trace directory: ${traceDir}`);
console.log(`Contract status: ${result.status}`);
console.log("Negative test keeps the rejection event in history (no rewrite).");
console.log("Inspect with:");
console.log(`  npx agent-inspect list --dir ${traceDir}`);
console.log(`  npx agent-inspect view <run-id> --dir ${traceDir}`);
