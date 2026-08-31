# Trace contracts

**Support level:** Beta  

Typed trajectory expectations over local AgentInspect traces via `defineTraceContract` / `evaluateTraceContract` (`agent-inspect/checks`).

## What is shipped

Contracts compile to deterministic check rules for common cases:

- run status / completion / max duration
- tool required / forbidden / allowed / maxCalls / order (`requiredTools` / `forbiddenTools` aliases)
- LLM maxCalls / maxTotalTokens / allowedModels
- evidence-bearing findings on failures
- evaluation over **logical** TraceFacts (raw events remain available)

### Tool ordering semantics

`tools.requiredOrder` remains a string chain. Each adjacent pair becomes an
ordering rule, so `["retrieve", "rerank", "generate"]` checks `retrieve` before
`rerank` and `rerank` before `generate`.

`tools.requiredOrderMode` selects one whole-chain ordering policy:

- `"first"` (default) compares the first occurrence of each adjacent tool.
- `"strict"` requires every occurrence of the earlier tool to precede every
  occurrence of the next tool.

For `requiredOrder: ["retrieve", "generate"]`, the trace `retrieve → generate →
retrieve` passes with the default `"first"` mode and fails with `"strict"`.
Ordering does not imply presence: if either side is absent, use `required` or
`requiredTools` separately when the tool must exist.

`all-pairs` is intentionally deferred because it adds occurrence pairing and
cardinality questions (including unmatched or one-to-many calls), not ordering
semantics alone.

### Experimental Vitest / Jest matchers (shipped)

| Package | Export | Matchers |
| ------- | ------ | -------- |
| `@agent-inspect/vitest` | `agentInspectVitestMatchers` | `toPassTraceContract`, `toHaveRequiredTool` |
| `@agent-inspect/jest` | `agentInspectJestMatchers` | `toPassTraceContract`, `toHaveRequiredTool` |

These are **Experimental** — API names may evolve. There is no `expectTrace(...).toSatisfyTraceContract` helper.

See [API.md](./API.md), [TRACE-FACTS.md](./TRACE-FACTS.md), and `packages/core/src/checks/contract.ts`.

## What is not shipped (yet)

Do **not** document these as available:

- `expectTrace(...).toSatisfyTraceContract` (different API shape than the shipped matchers)
- Full workflow handoff / approval / MCP protocol contract rules
- Per-tool argument schema / regex validators on the contract surface
- Every structure rule (orphan/cycle/depth) exposed on the contract API (many exist as standalone check rules)

## CLI relationship

```bash
npx agent-inspect check <run-id> --dir .agent-inspect
```

Suites and gates can consume check results; see [SUITES-COHORTS-GATES.md](./SUITES-COHORTS-GATES.md).

## Limitations

- Experimental/Beta API — may evolve in minors
- Contract tests are smoke-level; prefer check-engine tests for deep rule coverage
- Always review findings before treating a green check as product proof
