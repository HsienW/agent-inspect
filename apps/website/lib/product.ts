/**
 * Public product metadata for the marketing site.
 * Keep in sync with docs/product/PUBLIC-PRODUCT-FACTS.json and root package.json.
 */
export const product = {
  version: "6.16.1",
  publicPackageCount: 18,
  releaseStatus: "Actively maintained · schema 1.0 · Node.js 20+ · MIT",
  v7Scheduled: false,
  trustLine:
    "No account · no collector · no default upload · metadata-only by default",
  headline: "Debug and regression-test TypeScript AI agents from local evidence",
  subheadline:
    "AgentInspect captures framework-faithful execution trees, evaluates them with deterministic TraceFacts and TraceContract rules, creates integrity-verifiable Evidence v2, and lets coding assistants inspect the same local facts over read-only MCP—without a collector, account, or default upload.",
  outcome: "See what your agent did. Prove the fix. Keep the evidence.",
  category: "The local evidence debugger and trajectory-test toolkit for TypeScript AI agents",
  proof: [
    "Validated against production-shaped NestJS/LangGraph integrations.",
    "Fixture-backed across official adapters and packed consumer workflows.",
  ] as const,
  pillars: [
    {
      id: "capture",
      title: "Capture faithfully",
      summary: "Framework-aware execution trees and local JSONL you own.",
    },
    {
      id: "test",
      title: "Test behavior deterministically",
      summary:
        "TraceFacts, TraceContract, checks, suites, cohorts, CI gates, and test matchers.",
    },
    {
      id: "evidence",
      title: "Produce portable evidence",
      summary:
        "Offline Evidence v2 with integrity verification and share-policy disclosure.",
    },
    {
      id: "mcp",
      title: "Debug with coding assistants locally",
      summary:
        "Read-only MCP over the same TraceFacts, without a collector or hosted trace database.",
    },
  ] as const,
  heroFlow: `1. Capture one real run
2. Find the causal failure
3. Ask your coding agent to inspect it
4. Lock the fix with a contract
5. Attach the share-checked evidence`,
  fiveMinuteCommands: `npm install agent-inspect
npx agent-inspect init --yes
node examples/agent-inspect-demo.mjs
npx agent-inspect list --dir .agent-inspect
# copy <run-id> from list, then:
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
# Evidence v2 integrity (path from bundle output):
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>
# Optional coding-agent loop (dry-run by default):
npx agent-inspect mcp configure --client cursor`,
} as const;
