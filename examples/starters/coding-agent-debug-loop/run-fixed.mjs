import { inspectRun, step } from "agent-inspect";

await inspectRun(
  "coding-agent-debug-fixed",
  async () => {
    await step.tool("lookup_policy", async () => ({
      policy: "refunds within 30 days",
      source: "fixture",
    }));
  },
  { traceDir: ".agent-inspect", silent: true },
);

console.log("Fixed trace written to .agent-inspect/");
console.log("  pnpm run inspect-mcp");
console.log("  npx agent-inspect bundle <run-id> --dir .agent-inspect --format html");
