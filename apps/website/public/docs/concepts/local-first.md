# ADR-0001-local-first — Local-first defaults

## Status

Accepted

## Context

Shipped design intent extracted from completed RFCs/proposals during `6.16.1` cleanup. Full historical RFCs remain in Git history.

## Decision

AgentInspect persists customer-owned local artifacts by default. No account, collector, or hosted SaaS is required for the core loop.

## Consequences

- Public docs and ADRs stay concise.
- Completed proposal markdown is removed from the active tree.
- Changes that conflict with this ADR require an explicit superseding ADR.
