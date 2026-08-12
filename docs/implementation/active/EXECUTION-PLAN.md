# Active execution plan — v6.16.1 Repository Health

**Train:** `v6.16.1-repository-health-public-truth`  
**Named:** `agentinspect-repository-health-evidence-ux-v6.16-to-pre-v7`  
**Target:** patch `6.16.1`  
**Baseline:** published `6.16.0`  
**Authority:** [../ROADMAP.md](../ROADMAP.md) §7

## Goal

Make the current repository smaller, searchable, and factually aligned with `6.16.0`. Aggressive deletion (not re-archiving). Runtime behavior unchanged except metadata/diagnostic corrections required by public truth.

## Public-copy rule

Public surfaces present a mature, actively maintained product used in real TypeScript agent workflows. Never use “waiting for adoption,” “no adoption yet,” “test phase,” or similar soft-launch framing. Never fabricate partners, retention %, ROI, or private traces.

## Chunks

| ID | Scope | Commit theme |
|----|-------|--------------|
| 6.16.1-0 | Inventory + disposition + size baselines | `docs: inventory the repository cleanup disposition` |
| 6.16.1-1 | Public version/status truth | `docs: align public truth with the 6.16 product baseline` |
| 6.16.1-2 | Changelog + SUPPORT-LEVELS | `docs: clean Unreleased and support-level language` |
| 6.16.1-3 | Stable history/decisions/active paths | `docs: establish stable roadmap and history structure` |
| 6.16.1-4 | Summarize + delete completed trains/roadmaps | `docs: summarize history and remove completed trains` |
| 6.16.1-5 | Delete archive, ISSUE_DRAFTS, .DS_Store | `chore: remove archive, issue drafts, and OS artifacts` |
| 6.16.1-6 | ADRs + delete shipped proposals | `docs: extract ADRs and remove shipped proposals` |
| 6.16.1-7 | Consolidate agent instructions | `docs: consolidate maintainer agent instructions` |
| 6.16.1-8 | Stale API/comment language | `chore: remove stale release-era API language` |
| 6.16.1-9 | Examples/scripts/assets cleanup | `chore: consolidate examples scripts and assets` |
| 6.16.1-10 | npm package-docs manifest | `chore: add npm package-docs manifest` |
| 6.16.1-11 | `repo:health` + CI | `feat: add repo:health validator` |
| 6.16.1-12 | Link/import/AI/website repair | `fix: repair links after repository cleanup` |
| 6.16.1-13 | Measure cleanup + surface review | `docs: record cleanup metrics` |
| 6.16.1-14 | Readiness + Changeset + publish | `chore: prepare 6.16.1 release` |

## Deletion batches (after disposition)

1. Completed `docs/implementation/release-trains/**` (except nothing — all completed; only `active/` remains operational)
2. Superseded version-named roadmaps under `docs/implementation/`
3. `docs/archive/**`
4. `.github/ISSUE_DRAFTS/**`
5. Tracked `.DS_Store` and editor junk
6. Shipped `docs/proposals/**` after ADR extraction
7. Duplicate Codex/Cursor handoffs after consolidation
8. Obsolete examples/scripts/generated assets under size rules

## Forbidden

New package; schema break; default upload; local npm publish; force-push; history rewrite; inventing partners/metrics; creating a new in-repo archive folder.

## Release gate

See [../ROADMAP.md](../ROADMAP.md) §7.14 plus: all 18 packages publish as `6.16.1` via Trusted Publishing.
