# LangGraph / LangChain adapter fidelity contract

**Status:** draft for v6.8.0  
**Package:** `@agent-inspect/langchain`  
**Authority:** [AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP](./implementation/AGENTINSPECT-STABILITY-AND-FOCUS-ROADMAP-V6.7.3-TO-V7.md) §9 · [V6.8.0-EXECUTION-PLAN](./implementation/release-trains/V6.8.0-EXECUTION-PLAN.md)

This document is the public contract for standalone LangGraph-shaped (and LangChain callback) traces written by `AgentInspectCallback`.

## Scope

Applies to **one standalone adapter invocation** (one logical agent/graph call that owns a single AgentInspect envelope run).

Does **not** require:

- hosted LangSmith / cloud tracing
- provider API keys
- inventing hierarchy from timestamps alone
- guaranteeing completeness when the framework never ends callbacks

## Contract (must hold per standalone invocation)

| # | Requirement |
|---|-------------|
| 1 | Exactly one envelope start (`run_started`) |
| 2 | Exactly one terminal envelope (`run_completed` or an explicit incomplete/terminal diagnostic policy) |
| 3 | Terminal status is correct for observed success/error |
| 4 | Every started callback run is terminal **or** explicitly incomplete |
| 5 | Tool identity is human-meaningful (`runName` / `metadata.toolName` before class names) |
| 6 | Model identity is preserved when supplied |
| 7 | Token metadata is preserved when supplied |
| 8 | Parent relationships are explicit, correlated, or visibly unresolved |
| 9 | No relationship is invented from timestamps alone |
| 10 | Callback handler reuse does not mix two invocations |
| 11 | Persistence is deterministic for the same accepted callback sequence |

## Confidence vocabulary

| Confidence | Meaning |
|------------|---------|
| `explicit` | Parent/id observed as a real callback `runId` |
| `correlated` | Linked via stable semantic metadata (node/task/tool-call ids) without inventing edges |
| `synthetic` | Grouping node added only under synthetic-group rules |
| `unresolved` | External/unobserved parent retained and visible |

## Relationship precedence

1. Exact parent run ID (observed callback)
2. Explicit LangGraph metadata relationship
3. Unique semantic-name correlation
4. Synthetic grouping node with `correlated`/`synthetic` confidence
5. Unresolved and visible

Timestamps are never the sole nesting signal.

## Synthetic group rules

A synthetic group node may be created only when:

- several events share the same stable semantic parent label
- no exact parent exists
- grouping improves fidelity
- the node is marked synthetic/correlated
- the raw semantic parent is preserved

## Finalization (additive APIs — v6.8)

`AgentInspectCallback` exposes idempotent:

- `flush()` — drain deferred completion work
- `finalize()` — complete the envelope when safe
- `close()` — finalize + release resources

Late ends after finalize produce diagnostics, not a second `run_completed`.

`getDiagnostics()` returns **counts only** (late events, pending/known relationships, synthetic groups, finalized flag). No absolute paths or payloads — suitable for CLI/MCP summaries.

## Persist-by-intent

Persistence defaults follow explicit options / environment intent:

| Options | Behavior |
|---------|----------|
| `traceDir` set, `persist` omitted | Persist on |
| no `traceDir`, `persist` omitted | In-memory only |
| `persist: false` | In-memory (even if `traceDir` set; construction warning) |
| `persist: true` | Persist to supplied or default trace directory |

Metadata-oriented capture remains the recommended default for shared traces.

## Validation corpus

| Corpus | Role |
|--------|------|
| `fixtures/langgraph/*.jsonl` | Synthetic shapes (local, no provider) |
| `packages/langchain/test/langgraph-no-provider-app.test.ts` | Real `@langchain/langgraph` StateGraph + tools |
| `packages/langchain/test/langgraph-fixture-matrix.test.ts` | Parallel / stream / subgraph / error |
| `examples/recipes/langgraph-callback-local` | Deterministic callback metadata recipe |
| `examples/recipes/nestjs-langgraph-local` | Env-gated Nest-style wiring |
| Real LangGraph apps / partner traces | **External gate** before publishing 6.8.0 |

## Publication gate

Before **6.8.0** npm publication:

> Two independent real or genuinely external/high-fidelity LangGraph integrations must pass this contract.

If evidence is missing, set train status `blocked-on-langgraph-validation` and stop. Do not fabricate.

## Non-goals

- New public packages
- Schema break / third persisted model
- Default network upload
- Full NestJS production interceptor package
