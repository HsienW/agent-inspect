# Active execution plan — next releases (6.22 in progress)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.21.0` · schema `1.0`
**Program:** adoption-first `6.22.0 → 6.23.0 → 6.24.0 → 6.25.0`

## Adoption order (current)

1. **6.22.0** — Cross-runtime causal fidelity on `feat/622-cross-runtime-fidelity`
2. **6.23.0** — Structured control contracts
3. **6.24.0** — Adoption/distribution (stop for `BLOCKED_ON_EXTERNAL_EVIDENCE` before claiming retained use)
4. **6.25.0** — Stability baseline

## Material conflict resolved

In-repo 6.22 previously described only conditional #331 recipes. The attached adoption-first roadmap V2 + master program define **6.22 as Cross-Runtime Causal Fidelity**; #331 is folded as an existing-API recipe. This active plan follows the program.

## Stop rules

- No schema 1.1; no root OTel dependency; no default network.
- Do not fabricate retained-use pilots for 6.24.
- One release at a time; Trusted Publish only via `publish.yml`.
