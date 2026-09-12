# Stability baseline (6.25)

**Status:** Core boundary frozen at `6.25.0`. Evidence-backed **patches and minors** remain active for correctness, recovery contracts, Evidence reviewability, and compatibility.  
**Schema:** persisted writer path remains **1.0**.

## What this release freezes

- Support-level matrix in [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md) (no promotions without evidence).
- Soft performance expectations in [PERFORMANCE.md](./PERFORMANCE.md) / `pnpm perf:baseline` (not marketing SLAs).
- Packed-consumer honesty in [COMPATIBILITY-PACKED-MATRIX.md](./COMPATIBILITY-PACKED-MATRIX.md) (ubuntu/Node 22 CI primary; other cells DECLARED/PARTIAL/UNTESTED as labeled).
- Package portfolio posture in [POSITIONING-AND-PORTFOLIO.md](./POSITIONING-AND-PORTFOLIO.md) and [PACKAGE-MAINTENANCE-AUDIT.md](./PACKAGE-MAINTENANCE-AUDIT.md) — fixed group stays through 6.x; no removals.

## Explicit non-claims

| Claim | Status |
| --- | --- |
| Retained 21-day production pilots / “adoption release” metrics | `BLOCKED_ON_EXTERNAL_EVIDENCE` |
| Full OS × Node GitHub Actions matrix (#209 complete) | Not claimed; PARTIAL manual evidence only |
| VS Code Marketplace publish | Deferred — [VSCODE.md](./VSCODE.md) |
| v7 package consolidation / schema 1.1 | Assessment only; **NO-GO** until all gates pass |

## Property-style coverage (additive)

Deterministic seeded property checks for TraceContract tool-argument JSON Pointer evaluation live under `packages/core/test/checks/tool-arguments-property.test.ts` (no new fuzz dependencies). Existing conformance corpora remain authoritative for readers/Evidence/redaction. Retry/attempt identity coverage expands in `6.25.1+`.

## After 6.25.0

Continue the post-6.25 reliability program (`6.25.1` → conditional `6.30.0`) per [../ROADMAP.md](../ROADMAP.md) and [implementation/active/NEXT-RELEASES.md](./implementation/active/NEXT-RELEASES.md). Produce a **v7 readiness assessment only** when asked; do not implement v7 automatically.
