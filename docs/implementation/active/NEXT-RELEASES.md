# Active execution plan — next releases (6.21 in progress)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.20.0` on npm · schema `1.0`
**Exclusions:** Gmail/outreach; local `npm publish`; schema 1.1; merging 6.21 Version Packages before feature PR lands

## Adoption order (current)

1. **6.21.0** — Multi-agent evidence precision on `feat/621-actor-provenance` (#320/#321)
2. Then Version Packages for 6.21.0 only after the feature PR lands
3. **6.22.0** — Conditional design-partner recipes (#331) — roadmap-future

## Release table

| Release | Theme | Required outcomes |
| --- | --- | --- |
| 6.17.8 | Closeout and trust-boundary patch | **published** |
| 6.18.0 | Safe adoption and differentiation | **published** |
| 6.19.0 | External evidence and failure semantics | **published** |
| 6.19.1 | Trust restoration + release-chain hardening | **published** |
| 6.20.0 | Flexible deterministic contracts | **published** |
| 6.21.0 | Multi-agent evidence precision | #320 actor scope; #321 outcome provenance |
| 6.22.0 | Conditional design-partner recipes | #331 (design confirmed); provider-neutral CI evidence |

## Chunk status

| Chunk | Status |
| --- | --- |
| `6.20.0 flexible contracts` | **published** |
| `6.21.0 actor scope + provenance` | **in progress** on `feat/621-actor-provenance` |
| `6.22.0` | roadmap-future |

## Issue → train

| Issues / PR | Train | Status |
| --- | --- | --- |
| #320, #321 | **6.21** | implementing on feature branch |
| #331 | conditional **6.22** | `roadmap-future` |

## Stop rules

- Do not publish locally; use Trusted Publishing via `publish.yml`.
- Keep 6.21 scoped to #320 / #321; do not pull 6.22/#331 work forward.
- No nested query DSL, timestamp-only actor inference, or semantic-truth claims for provenance.
