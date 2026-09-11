# Active execution plan — next releases (6.20 in progress)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.19.0` on npm · **6.19.1** Version Packages `#374` open (awaiting publish) · schema `1.0`
**Exclusions:** Gmail/outreach; local `npm publish`; schema 1.1; merging 6.20 to main before npm `6.19.1`

## Adoption order (current)

1. **6.19.1** — merge/publish Version Packages `#374` (trust restoration)
2. **6.20.0** — Flexible Deterministic Contracts on `feat/620-flexible-contracts` (#308/#315/#309) — **do not merge to main until npm shows 6.19.1**
3. Then Version Packages for 6.20.0 only after the feature PR lands

## Release table

| Release | Theme | Required outcomes |
| --- | --- | --- |
| 6.17.8 | Closeout and trust-boundary patch | **published** |
| 6.18.0 | Safe adoption and differentiation | **published** |
| 6.19.0 | External evidence and failure semantics | **published** |
| 6.19.1 | Trust restoration + release-chain hardening | Version Packages `#374` → Trusted Publish |
| 6.20.0 | Flexible deterministic contracts | #308/#315 ordering modes; #309 `alternatives.anyOf`; lint/explain; recipes |
| 6.21.0 | Multi-agent evidence precision | #320 actor scope; #321 outcome provenance |
| 6.22.0 | Conditional design-partner recipes | #331 (design confirmed); provider-neutral CI evidence |

## Chunk status

| Chunk | Status |
| --- | --- |
| `immediate-release-chain-gate` | done on main |
| `6.19.1` | code on main; **publish pending** (`#374`) |
| `6.20.0 flexible contracts` | **in progress** on `feat/620-flexible-contracts` |
| `authorize-620-merge` | **blocked** until npm `agent-inspect@6.19.1` |

## Issue → train

| Issues / PR | Train | Status |
| --- | --- | --- |
| #308, #315, #309 | **6.20** | implementing on feature branch |
| #320, #321 | **6.21** | `roadmap-next` |
| #331 | conditional **6.22** | `roadmap-future` |

## Open PR dispositions

| PR | Train | Disposition |
| ---: | --- | --- |
| #315 | 6.20 | Commits cherry-picked with HsienW authorship onto `feat/620-flexible-contracts`; close after 6.20 merges |
| #374 | 6.19.1 | Version Packages — merge/publish before merging 6.20 |

## Stop rules

- Do **not** merge 6.20 into `main` until `npm view agent-inspect version` is **6.19.1** (avoids mixing 6.20 changesets into a late 6.19.1 Version Packages PR).
- Do not publish locally; use Trusted Publishing via `publish.yml`.
- No nested `alternatives`, predicates, or general temporal DSL in 6.20.
