/**
 * Public product metadata for the marketing site.
 * Keep in sync with root package.json + .changeset fixed group + docs/SUPPORT-LEVELS.md.
 */
export const product = {
  version: "6.12.2",
  publicPackageCount: 18,
  releaseStatus: "Technical launch candidate · external pilot evidence pending",
  v7Scheduled: false,
  trustLine:
    "No account · no default upload · metadata-only by default · optional customer-owned Studio",
  headline: "The local evidence debugger for TypeScript agents",
  subheadline:
    "Faithful execution trees, deterministic regression checks, share-checked evidence, and coding-agent access—without a collector or account.",
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
