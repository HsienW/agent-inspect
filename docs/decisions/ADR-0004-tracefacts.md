# ADR-0004-tracefacts — TraceFacts and TraceContract

## Status

Accepted

## Context

Shipped design intent extracted from completed RFCs/proposals during `6.16.1` cleanup. Full historical RFCs remain in Git history.

## Decision

Deterministic trajectory facts and contracts gate CI without LLM-as-judge. Semantic consumers prefer TraceFacts over raw event assumptions.

## Consequences

- Public docs and ADRs stay concise.
- Completed proposal markdown is removed from the active tree.
- Changes that conflict with this ADR require an explicit superseding ADR.
