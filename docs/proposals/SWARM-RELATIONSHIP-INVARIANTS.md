# Proposal: Swarm relationship invariants

**Status:** Active for `6.14.2+` / conformance corpus in `6.15.1`
**Authority:** [../implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](../implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md) §7 · §9

## Invariants

1. **No self-parent at capture:** never persist `parentId === stepId`.
2. **Parent resolve before index registration:** child must not be eligible as its own parent lookup.
3. **Completion-only synth starts** follow the same order and invariant.
4. **Logical projection defense:** raw events preserved; derived logical events drop self-edges and emit `AI_LOGICAL_SELF_PARENT_REMOVED`.
5. **Visibility-first trees:** cycles break deterministically; all nodes remain visible; no unbounded recursion.
6. **No timestamp-invented parents.**
7. **Unresolved external parents stay visible** (root-like) with `parentMapping: unresolved`.
8. **Multiple valid roots are allowed** — do not force cosmetic single-root scaffolding.

## Conformance fixtures (`fixtures/langgraph/`)

| Shape | Fixture |
|-------|---------|
| self-parent | `conformance-self-parent.jsonl`, `deep-swarm-self-parent.jsonl` |
| two-node cycle | `conformance-two-node-cycle.jsonl` |
| unresolved external | `conformance-unresolved-external.jsonl` |
| multiple valid roots | `conformance-multiple-roots.jsonl` |
| synthetic group | `conformance-synthetic-group.jsonl` |
| nested subgraph | `conformance-nested-subgraph.jsonl` |
| concurrent branches | `parallel-children.jsonl` |

Tests: `packages/core/test/adapter-relationship-invariants.test.ts`

## Diagnostics

| Code | Layer |
|------|-------|
| `AI_LANGGRAPH_SELF_PARENT_REJECTED` | capture (`@agent-inspect/langchain`) |
| `AI_LOGICAL_SELF_PARENT_REMOVED` | logical projection |

## Out of scope for this note

Reader convenience APIs (N-5) — see [../PROGRAMMATIC-TRACE-ANALYSIS.md](../PROGRAMMATIC-TRACE-ANALYSIS.md).
