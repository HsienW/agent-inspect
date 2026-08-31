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

## `tools.requiredOrder` semantics

`requiredOrder` is expanded into **adjacent pair** ordering rules:

```text
[A, B, C]
→ A before B
→ B before C
```

Each pair compares the **first occurrence** of each tool name:

- unlisted intermediate tools are allowed;
- later repetitions do not invalidate an earlier valid first-occurrence order;
- a missing tool is **not** an ordering failure by itself — use `required` / `requiredTools` for presence;
- combine ordering with `maxCalls` or custom rules when repeated calls matter.

Examples for `requiredOrder: ["retrieve", "generate"]`:

| Trajectory | Ordering result |
| --- | --- |
| `retrieve → generate` | PASS |
| `retrieve → rerank → generate` | PASS |
| `retrieve → generate → retrieve` | PASS (first-occurrence) |
| `generate → retrieve` | FAIL |
| `cache_lookup → generate` | Ordering alone does **not** fail for missing `retrieve`; a separate required-tool rule fails if `retrieve` is required |

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
