# V6.17.6 — Release readiness

**Target:** `6.17.6`  
**Baseline:** `6.17.5`  
**Date:** 2026-09-02

## Scope

Security containment: Studio ingest bounds/atomic staging, dependency remediation (Vitest 3 / website / examples), no-egress default-workflow harness (#225), published API surface snapshot (#211), Evidence format doc truth, redaction residual tests.

## Gate

```text
[x] pnpm build / typecheck / test / test:coverage / size / fixtures:check
[x] pnpm pack:smoke
[x] git diff --check
[x] 6.17.6-0 … 6.17.6-12 implementation + validation on main
[x] Changeset (.changeset/v6176-security-containment.md)
[x] Version Packages PR merge (#318)
[x] Trusted Publishing → npm 6.17.6
[x] npm 6.17.6 verified
```
