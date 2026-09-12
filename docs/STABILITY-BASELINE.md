# Stability baseline (6.25)

**Status:** Maintenance freeze for the adoption-first program through `6.25.x`.  
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
| v7 package consolidation / schema 1.1 | Assessment only after this freeze |

## Property-style coverage (additive)

Deterministic seeded property checks for TraceContract tool-argument JSON Pointer evaluation live under `packages/core/test/checks/tool-arguments-property.test.ts` (no new fuzz dependencies). Existing conformance corpora remain authoritative for readers/Evidence/redaction.

## After 6.25.x

Produce a **v7 readiness assessment only**. Do not implement v7 unless every external-use gate in the program prompt is met.
