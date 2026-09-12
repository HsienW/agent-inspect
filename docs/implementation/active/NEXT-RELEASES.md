# Active execution plan — next releases (6.21 published; 6.22 conditional)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.21.0` on npm (all 18 fixed-group packages) · schema `1.0`
**Exclusions:** Gmail/outreach; local `npm publish`; schema 1.1; starting 6.22 without external acceptance + maintainer authorization

## Adoption order (current)

1. **6.21.0** — Multi-agent evidence precision — **published** (#377 + #378)
2. **6.22.0** — Conditional design-partner recipes (#331) — **next only when authorized**

## Release table

| Release | Theme | Required outcomes |
| --- | --- | --- |
| 6.17.8 | Closeout and trust-boundary patch | **published** |
| 6.18.0 | Safe adoption and differentiation | **published** |
| 6.19.0 | External evidence and failure semantics | **published** |
| 6.19.1 | Trust restoration + release-chain hardening | **published** |
| 6.20.0 | Flexible deterministic contracts | **published** |
| 6.21.0 | Multi-agent evidence precision | **published** — #320 actor scope; #321 outcome provenance |
| 6.22.0 | Conditional design-partner recipes | #331 (design confirmed); provider-neutral CI evidence |

## Chunk status

| Chunk | Status |
| --- | --- |
| `6.20.0 flexible contracts` | **published** |
| `6.21.0 actor scope + provenance` | **published** (#377 + #378 + Trusted Publish) |
| `6.22.0` | roadmap-future / conditional |

## Issue → train

| Issues / PR | Train | Status |
| --- | --- | --- |
| #320, #321 | **6.21** | closed — published in 6.21.0 |
| #331 | conditional **6.22** | `roadmap-future` |

## Stop rules

- Do not start 6.22 without maintainer authorization and validated external need.
- Do not publish locally; use Trusted Publishing via `publish.yml`.
- Keep 6.22 scoped to existing APIs / design-partner recipes only.
