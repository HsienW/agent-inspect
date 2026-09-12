# Trace contracts

**Support level:** Beta  

Typed trajectory expectations over local AgentInspect traces via `defineTraceContract` / `evaluateTraceContract` (`agent-inspect/checks`).

## What is shipped

Contracts compile to deterministic check rules for common cases:

- run status / completion / max duration
- tool required / forbidden / allowed / maxCalls / order (`requiredTools` / `forbiddenTools` aliases)
- selectable `requiredOrderMode` (`first-occurrence` | `happens-before` | `all-occurrences`)
- `alternatives.anyOf` for one level of legitimate alternate paths
- actor `scope` selectors (`runId`, `subAgentId`, `groupId`, `workflowStep`, `rootEventId`)
- observation `requireProvenance` (structural method / evidence / same-run event references)
- `lintTraceContract` / `explainTraceContract` for brittle-contract diagnostics
- LLM maxCalls / maxTotalTokens / allowedModels
- evidence-bearing findings on failures
- evaluation over **logical** TraceFacts (raw events remain available)

## `tools.requiredOrder` semantics

`requiredOrder` is expanded into **adjacent pair** ordering rules with unique ids:

```text
[A, B, C]
→ contract.tool.order.0: A before B
→ contract.tool.order.1: B before C
```

`requiredOrderMode` selects one ordering relation for every generated pair:

- unlisted intermediate tools are allowed;
- TraceContract `requiredOrder` **implies presence** — every listed name is added to the effective required-tool set;
- `first-occurrence` (default when omitted) compares first occurrences in start/encounter order; later repetitions do not invalidate an earlier valid order, and interval overlap emits a non-failing `tool.order.overlap` warning;
- `happens-before` requires the first `before` occurrence to finish before the first `after` occurrence starts;
- `all-occurrences` requires every `before` occurrence to finish before every `after` occurrence starts (`max(before.end) <= min(after.start)`);
- causal modes fail when a required interval boundary cannot be resolved instead of falling back to encounter order.

Examples for `requiredOrder: ["retrieve", "generate"]`:

| Trajectory | Result |
| --- | --- |
| `retrieve → generate` | PASS |
| `retrieve → rerank → generate` | PASS |
| `retrieve → generate → retrieve` | PASS under omitted / `first-occurrence`; FAIL under `all-occurrences` |
| `generate → retrieve` | FAIL (order) |
| `cache_lookup → generate` | FAIL (missing `retrieve` via implied presence) |

Low-level `createToolOrderingRule({ before, after })` alone may still pass when an endpoint is missing (compositional). TraceContract `requiredOrder` does not.

For overlapping first calls, omitted / `first-occurrence` warns while `happens-before` fails.

Immediate or positional `all-pairs` matching is not implemented.

### Experimental Vitest / Jest matchers (shipped)

| Package | Export | Matchers |
| ------- | ------ | -------- |
| `@agent-inspect/vitest` | `agentInspectVitestMatchers` | `toPassTraceContract`, `toHaveRequiredTool` |
| `@agent-inspect/jest` | `agentInspectJestMatchers` | `toPassTraceContract`, `toHaveRequiredTool` |

These are **Experimental** — API names may evolve. There is no `expectTrace(...).toSatisfyTraceContract` helper.

See [API.md](./API.md), [TRACE-FACTS.md](./TRACE-FACTS.md), and `packages/core/src/checks/contract.ts`.

## Rule kinds

TraceContract rules fall into distinct categories. Mixing them incorrectly is a common source of false failures (see GitHub #308 and #309).

### `tools.required` (shipped)

Unconditional path invariant: every named tool must appear **at least once** in the trace.

- Use when the tool is always part of a valid execution path.
- **Do not** use for steps that legitimate shortcuts may skip (for example cache hits that bypass `retrieve`).
- Prefer `alternatives.anyOf` or `observations.required` when a shortcut is valid.

### `tools.requiredOrder` (shipped — selectable ordering modes)

The evaluator expands each list into adjacent pairs and applies one `requiredOrderMode` to every pair.

- TraceContract `requiredOrder` **implies presence** of every listed tool (unioned into `tools.required`).
- `requiredOrderMode: "first-occurrence"` is the default first-occurrence start/encounter relation; overlapping intervals emit a non-failing warning.
- `requiredOrderMode: "happens-before"` requires the first before to **end** before the first after **starts**; overlap fails.
- `requiredOrderMode: "all-occurrences"` requires every before to end before every after starts; any cross-boundary overlap or later before fails.
- Missing interval boundaries fail closed in the two causal modes.

### `alternatives.anyOf` (shipped)

One level of named deterministic branches. Base rules always apply. At least one complete branch must pass.

```ts
defineTraceContract({
  run: { requireCompleted: true },
  tools: { required: ["generate"] },
  alternatives: {
    anyOf: [
      {
        id: "cache-hit",
        contract: {
          tools: { required: ["cache_lookup"], forbidden: ["retrieve"] },
          observations: { required: ["cache-hit-valid"] },
        },
      },
      {
        id: "retrieve",
        contract: {
          tools: { required: ["retrieve"], requiredOrder: ["retrieve", "generate"] },
          observations: { required: ["retrieval-context-valid"] },
        },
      },
    ],
  },
});
```

Constraints:

- unique branch ids
- no nested `alternatives`
- no predicates / runtime DSL
- unused failed branches do not fail the contract when another branch passes
- if none pass → `contract.alternatives.none-satisfied`

### `observations.required` (shipped)

Requires externally observed or effect evidence (for example HTTP status, file write, cache key) rather than a specific tool call. Prefer this when the invariant is about **outcome** rather than **which tool ran**.

### `scope` (shipped — experimental)

Select one actor before evaluation using **explicit** metadata only:

```ts
defineTraceContract({
  scope: { subAgentId: "verifier-agent" },
  tools: { required: ["run_tests"] },
});
```

Supported selectors: `runId`, `subAgentId`, `groupId`, `workflowStep`, `rootEventId` (subtree projection).

- zero matches → error (no whole-session fallback)
- singular selector matching multiple runs → error
- no timestamp, prose, or display-name inference
- successful selection reports the actor and evidence event count

### `observations.requireProvenance` (shipped — experimental)

Structural provenance for named outcomes. These checks prove method/evidence linkage was recorded; they do **not** prove the claim is semantically true, authorized, complete, or externally trusted.

```ts
defineTraceContract({
  observations: {
    required: ["refund-confirmed"],
    requireProvenance: {
      method: true,
      evidence: true,
      sameRunEventReference: true,
    },
  },
});
```

Bounded evidence shapes: string event id, `{ eventId }`, or `{ eventIds }` (max 16). Method must be in the `ObservedOutcomeMethod` vocabulary. Omitting `requireProvenance` leaves prior observation behavior unchanged.

### Lint and explain (shipped)

```ts
import { lintTraceContract, explainTraceContract } from "agent-inspect/checks";

lintTraceContract(contract);   // brittle / invalid shape diagnostics
explainTraceContract(contract); // human-readable intent lines
```

## CLI relationship

```bash
npx agent-inspect check <run-id> --dir .agent-inspect
```

Suites and gates can consume check results; see [SUITES-COHORTS-GATES.md](./SUITES-COHORTS-GATES.md).

## Limitations

- Experimental/Beta API — may evolve in minors
- Contract tests are smoke-level; prefer check-engine tests for deep rule coverage
- Always review findings before treating a green check as product proof
- No nested alternatives, all-pairs matching, or general temporal DSL
