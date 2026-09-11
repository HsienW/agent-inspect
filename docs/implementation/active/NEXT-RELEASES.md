# Active execution plan — next releases (post-6.19.0)

**Authority:** [../ROADMAP.md](../ROADMAP.md) · adoption-first after Trusted Publish 6.19.0
**Baseline:** **published** `agent-inspect@6.19.0` on npm · Version Packages `#357` (`4e0d794`) · schema `1.0`
**Exclusions:** Gmail/outreach; local `npm publish`; schema 1.1; **6.20–6.22 implementation without authorization**; skip of the release-chain Settings checklist

## Adoption order (current)

1. **Immediate release-chain security gate** — split `version-packages.yml` / `publish.yml`, pin Actions SHAs, Dependabot, `actions:check`, scanner docs, Settings checklist
2. **6.19.1** — reserved corrections only (reader/failure-fact / workflow-docs compatibility)
3. **Then** authorize **6.20.0** (#308/#315/#309) — not before

Checklist: [../MAINTAINER-SETTINGS-CHECKLIST-6191.md](../MAINTAINER-SETTINGS-CHECKLIST-6191.md)

## Release table

| Release | Theme | Required outcomes |
| --- | --- | --- |
| 6.17.8 | Closeout and trust-boundary patch | **published** |
| 6.17.9 | Conditional corrective patch | Only verified security/compatibility defects |
| 6.18.0 | Safe adoption and differentiation | **published** (`#350`) |
| 6.18.1 | Reserved patch | Adapter/CLI/security corrections only |
| 6.19.0 | External evidence and failure semantics | **published** (`#354` + `#357` + Trusted Publish `34013658849`) |
| 6.19.1 | Reserved patch + release-chain hardening | Reader/failure-fact compatibility; gate + Settings checklist |
| 6.20.0 | Flexible deterministic contracts | #308/#315 ordering modes; #309 alternate valid paths (**after** 6.19.1) |
| 6.21.0 | Multi-agent evidence precision | #320 actor scope; #321 outcome provenance |
| 6.22.0 | Conditional design-partner recipes | #331 (design confirmed); provider-neutral CI evidence |

## Chunk status

| Chunk | Status |
| --- | --- |
| `phase0-roadmap-truth` | done |
| `6.17.8 A–E` | done (published) |
| `6.18.0 A–H` | done (published) |
| `6.19.0 A–D` | done (published on npm) |
| `6.20–6.22 labels only` | done (`#358`) |
| `immediate-release-chain-gate` | **active** |
| `6.19.1` | next |
| `authorize-620-implementation` | **blocked** until after 6.19.1 |

## Issue → train labels (Phase 4)

| Issues / PR | Train | Label |
| --- | --- | --- |
| #308, #315, #309 | **6.20** | `roadmap-now` (implementation deferred) |
| #320, #321 | **6.21** | `roadmap-next` |
| #331 | conditional **6.22** | `roadmap-future` (design confirmed; existing APIs only; not implemented) |

## Open PR dispositions

| PR | Train | Disposition |
| ---: | --- | --- |
| #315 | 6.20 | Keep open until 6.20 implementation train |
| #297 | preflight | CONFLICTING; do not block |
| #306 | — | Draft hold |
| #142 | hold | External design-partner gate |

## Stop rules

- Do not implement 6.20–6.22 feature code until the gate + 6.19.1 path is complete and maintainers authorize.
- Do not merge Version Packages for a future train from a hygiene-only PR unless publish is intended.
- MCP hardening must not claim “sanitization” of instruction-like text.
- Do not keep routine `NPM_TOKEN` on the publish path; prefer OIDC Trusted Publishing.
