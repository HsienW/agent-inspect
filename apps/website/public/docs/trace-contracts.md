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

## Rule kinds (shipped vs planned)

TraceContract rules fall into distinct categories. Mixing them incorrectly is a common source of false failures (see GitHub #308 and #309).

### `tools.required` (shipped)

Unconditional path invariant: every named tool must appear **at least once** in the trace.

- Use when the tool is always part of a valid execution path.
- **Do not** use for steps that legitimate shortcuts may skip (for example cache hits that bypass `retrieve`).
- When a shortcut is valid but you still need evidence of the outcome, prefer `observations.required` until `alternatives.anyOf` ships (6.20.0).

### `tools.requiredOrder` (shipped — first-occurrence default)

Ordering among **present** tools only. The evaluator walks the trace in step order and checks that each listed tool's **first occurrence** appears after the previous tool's first occurrence.

- Missing tools are **not** ordering failures — use `required` / `requiredTools` for presence.
- Default mode is **first-occurrence** (unchanged algorithm since v6.17.5).
- **Planned (6.20.0, GitHub #308):** `requiredOrderMode: "all-occurrences"` — opt-in strict ordering where every listed tool must appear in sequence for all occurrences, not just first hits.

### `observations.required` (shipped)

Requires externally observed or effect evidence (for example HTTP status, file write, cache key) rather than a specific tool call. Prefer this when the invariant is about **outcome** rather than **which tool ran**.

### Planned (6.20.0 — not shipped)

Document only; **do not** use these fields in contracts today:

| Planned field | Purpose | GitHub |
|---------------|---------|--------|
| `alternatives.anyOf` | One of several deterministic valid paths (one level, no nested groups, no predicates) | #309 |
| `requiredOrderMode: "all-occurrences"` | Strict ordering across all tool occurrences | #308 |

API shape for both requires maintainer approval before external PR lands. @HsienW volunteered on #308 for `requiredOrderMode` implementation.

## Workaround until 6.20.0

When a legitimate shortcut skips a tool you would otherwise require:

1. **Remove** unconditional `tools.required` for that step.
2. **Express** the verified outcome via `observations.required` when possible.
3. **Document** the cache-hit or alternate path in contract comments for reviewers.

Example matching GitHub #309 (cache hit skips second `retrieve`):

```yaml
contract:
  tools:
    required: [generate] # not retrieve — cache may skip it
    requiredOrder: [generate] # ordering only among tools that ran
  observations:
    required: [cache_hit_or_retrieve_evidence]
```

With first-occurrence ordering, `retrieve → generate → retrieve` still **passes** when both retrieves are present (see worked example below).

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
