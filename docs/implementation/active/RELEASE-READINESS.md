# V6.16.1 — Release readiness

**Target:** `6.16.1` (fixed-group patch)  
**Baseline:** `6.16.0`  
**Train:** `agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7`  
**Date:** 2026-08-12

## Scope

Repository health, public truth, aggressive cleanup, ADRs, `repo:health`. No schema break. No new packages. No default network. No runtime behavior change beyond metadata/docs/validators.

## Gate checklist

```text
[x] One canonical roadmap (docs/implementation/ROADMAP.md)
[x] One active execution plan
[x] No docs/archive
[x] No .github/ISSUE_DRAFTS
[x] No tracked .DS_Store
[x] No completed release-trains tree
[x] ADRs present; shipped proposals removed
[x] docs:check + repo:health pass
[x] Public truth aligned to 6.16.0 maintenance line
[ ] Changeset → Version Packages → Trusted Publishing
[ ] npm 6.16.1 verified for all 18 packages
```

## Publication path

One patch Changeset → push main → Version Packages PR → Trusted Publishing → verify npm `6.16.1`.
