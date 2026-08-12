# ADR-0008-canonical-docs-source — Canonical docs source

## Status

Accepted

## Context

Shipped design intent extracted from completed RFCs/proposals during `6.16.1` cleanup. Full historical RFCs remain in Git history.

## Decision

Repository Markdown/MDX is the single prose source. Website pages, AI manifests, and package doc indexes should be generated from that source rather than duplicated.

## Consequences

- Public docs and ADRs stay concise.
- Completed proposal markdown is removed from the active tree.
- Changes that conflict with this ADR require an explicit superseding ADR.
