# ADR-0005-no-default-network — No default network

## Status

Accepted

## Context

Shipped design intent extracted from completed RFCs/proposals during `6.16.1` cleanup. Full historical RFCs remain in Git history.

## Decision

Core persistence and CLI paths perform no network I/O by default. Optional surfaces that touch the network must be explicit opt-in and documented.

## Consequences

- Public docs and ADRs stay concise.
- Completed proposal markdown is removed from the active tree.
- Changes that conflict with this ADR require an explicit superseding ADR.
