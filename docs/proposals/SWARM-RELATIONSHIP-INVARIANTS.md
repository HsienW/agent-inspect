# Proposal: Swarm relationship invariants

**Status:** Draft for `6.14.2` / `6.15.0`  
**Authority:** [../implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](../implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md) §7 · §9

## Invariants

1. **No self-parent at capture:** never persist `parentId === stepId`.
2. **Parent resolve before index registration:** child must not be eligible as its own parent lookup.
3. **Completion-only synth starts** follow the same order and invariant.
4. **Logical projection defense:** raw events preserved; derived logical events drop self-edges and emit `AI_LOGICAL_SELF_PARENT_REMOVED`.
5. **Visibility-first trees:** cycles break deterministically; all nodes remain visible; no unbounded recursion.
6. **No timestamp-invented parents.**

## Diagnostics

| Code | Layer |
|------|-------|
| `AI_LANGGRAPH_SELF_PARENT_REJECTED` | capture (`@agent-inspect/langchain`) |
| `AI_LOGICAL_SELF_PARENT_REMOVED` | logical projection |

## Out of scope for this note

Reader convenience APIs (N-5) — see [../PROGRAMMATIC-TRACE-ANALYSIS.md](../PROGRAMMATIC-TRACE-ANALYSIS.md).
