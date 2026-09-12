# Active execution plan — next releases (6.20 published; 6.21 ready)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.20.0` on npm (all 18 fixed-group packages) · schema `1.0`
**Exclusions:** Gmail/outreach; local `npm publish`; schema 1.1; starting 6.21 without maintainer authorization

## Adoption order (current)

1. **6.20.0** — Flexible Deterministic Contracts — **published** (#375 + #376)
2. **6.21.0** — Multi-agent evidence precision (#320 / #321) — **next when authorized**
3. **6.22.0** — Conditional design-partner recipes (#331) — roadmap-future

## Release table

| Release | Theme | Required outcomes |
| --- | --- | --- |
| 6.17.8 | Closeout and trust-boundary patch | **published** |
| 6.18.0 | Safe adoption and differentiation | **published** |
| 6.19.0 | External evidence and failure semantics | **published** |
| 6.19.1 | Trust restoration + release-chain hardening | **published** |
| 6.20.0 | Flexible deterministic contracts | **published** — #308/#315 ordering modes; #309 `alternatives.anyOf`; lint/explain; recipes |
| 6.21.0 | Multi-agent evidence precision | #320 actor scope; #321 outcome provenance |
| 6.22.0 | Conditional design-partner recipes | #331 (design confirmed); provider-neutral CI evidence |

## Chunk status

| Chunk | Status |
| --- | --- |
| `immediate-release-chain-gate` | done on main |
| `6.19.1` | **published** |
| `6.20.0 flexible contracts` | **published** (#375 + #376 + Trusted Publish) |
| `6.21.0` | ready when authorized |

## Issue → train

| Issues / PR | Train | Status |
| --- | --- | --- |
| #308, #315, #309 | **6.20** | closed — published in 6.20.0 |
| #320, #321 | **6.21** | `roadmap-next` |
| #331 | conditional **6.22** | `roadmap-future` |

## Open PR dispositions

| PR | Train | Disposition |
| ---: | --- | --- |
| #315 | 6.20 | Closed — commits landed via #375 |
| #375 | 6.20 | Merged |
| #376 | 6.20 | Merged — Trusted Publish succeeded |

## Stop rules

- Do not start 6.21 implementation until the maintainer authorizes the next train.
- Do not publish locally; use Trusted Publishing via `publish.yml`.
- Keep 6.21 scoped to #320 / #321; do not pull 6.22/#331 work forward.
