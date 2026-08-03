# AgentInspect Website Copy

Source copy for the marketing site (aligned with **6.12.x**). Prefer `apps/website/lib/product.ts` for version/package count.

## Hero

**Eyebrow:** Local evidence debugger · MCP-ready

**Headline:** The local evidence debugger for TypeScript agents

**Subheadline:** Faithful execution trees, deterministic regression checks, share-checked evidence, and coding-agent access—without a collector or account.

**Trust:** No account · no default upload · metadata-only by default · optional customer-owned Studio

**Primary command:** `npm install agent-inspect`

**CTAs:** Run the five-minute path · Coding-agent MCP loop · View on GitHub

**Hero flow:**

```text
1. Capture one real run
2. Find the causal failure
3. Ask your coding agent to inspect it
4. Lock the fix with a contract
5. Attach the share-checked evidence
```

## Five-minute path

```bash
npm install agent-inspect
npx agent-inspect init --yes
node examples/agent-inspect-demo.mjs
npx agent-inspect list --dir .agent-inspect
# copy <run-id> from list, then:
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>
npx agent-inspect mcp configure --client cursor
```

**Note:** `init` scaffolds files; the demo writes the trace. No API keys required. MCP configure is dry-run by default.

## Comparison

- **Team dashboard:** No maintainer-hosted dashboard; optional customer-owned Studio Beta (Tier C)
- **Coding-agent inspect:** Read-only MCP Preview over local traces
- **Production monitoring:** Not the goal
- **Best for:** Local debugging, deterministic trajectory regression, share-checked evidence, coding-agent loops

## FAQ themes

- No default upload / explicit network surfaces
- Coding-agent MCP loop (Preview)
- Studio is customer-owned
- Not production APM
- Support levels Stable/Beta/Preview
- Metadata-only; no chain-of-thought
- v7 not scheduled pending adoption evidence
