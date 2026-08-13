# 6.18.0 external acceptance gate

**Train:** `v6.18.0-niche-launch`
**Date:** 2026-08-12
**Rule:** Do not open a Changeset for `6.18.0` unless this gate is satisfied. Technical consolidation may land without a release.

## Required evidence (must be real; do not fabricate)

| Gate | Status | Notes |
|------|--------|-------|
| External / pilot acceptance rerun after 6.17.x | **Missing** | No retained partner attestation worksheet filed under `docs/adoption-evidence/` for a post-6.17 rerun |
| Compatibility/provenance check across the 18-package fixed group | Present in CI (`linked-versions`, pack smoke, provenance via Trusted Publishing) | Does not substitute for external acceptance |
| Public copy remains free of soft-launch / waiting language | Present | Enforced by `repo:health` |

## Decision

**Stop before Changeset.** Ship any 6.18.0 documentation/consolidation commits on `main`, keep packages at published `6.17.1`, and enter `6.18.x` planning / maintenance without publishing `6.18.0` until an external acceptance worksheet exists.

## What would unblock publication

A public-safe worksheet under `docs/adoption-evidence/` with:

- anonymous-or-named partner class (NestJS/LangGraph or equivalent);
- AgentInspect version under test (≥ 6.17.0);
- pass/fail for trajectory gate + Evidence verify;
- redacted artifact paths (no private traces committed).
