import { inspectRun, step } from "agent-inspect";

await inspectRun(
  "coding-agent-debug-broken",
  async () => {
    await step.tool("lookup_policy", async () => {
      throw new Error("Contract failure fixture: tool lookup_policy is not implemented");
    });
  },
  { traceDir: ".agent-inspect", silent: true },
);

console.log("Broken LangGraph-like trace written to .agent-inspect/");
console.log("Next:");
console.log("  pnpm run inspect-mcp");
console.log("  npx agent-inspect mcp configure --client cursor");
console.log("  pnpm run fixed");
