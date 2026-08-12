# ADR-0002-schema-1.0 — Persisted schema 1.0

## Status

Accepted

## Context

Shipped design intent extracted from completed RFCs/proposals during `6.16.1` cleanup. Full historical RFCs remain in Git history.

## Decision

Writer path uses schema 1.0. Legacy v0.1/v0.2 traces remain readable. No destructive migration or third persisted model before an explicit major.

## Consequences

- Public docs and ADRs stay concise.
- Completed proposal markdown is removed from the active tree.
- Changes that conflict with this ADR require an explicit superseding ADR.
