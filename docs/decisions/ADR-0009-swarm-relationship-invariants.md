# ADR-0009 — Swarm relationship invariants

## Status

Accepted

## Decision

Nested LangGraph/swarm relationships must not invent parents from timestamps alone; self-parent and cycle cases are normalized with conservative warnings. Capture-order fidelity is preferred over reconstructed trees.

## Consequences

Public fidelity contract: `docs/LANGGRAPH-FIDELITY.md`. Prior RFC text is in Git history.
