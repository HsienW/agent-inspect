# Active execution plan — next releases (6.23 in progress)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.21.0` · schema `1.0` (6.22.0 Trusted Publish in flight)
**Program:** adoption-first `6.22.0 → 6.23.0 → 6.24.0 → 6.25.0`

## Adoption order (current)

1. **6.22.0** — Cross-runtime causal fidelity — Version Packages merged; await Trusted Publish
2. **6.23.0** — Structured control contracts on `feat/623-structured-control-contracts`
3. **6.24.0** — Adoption/distribution (stop for `BLOCKED_ON_EXTERNAL_EVIDENCE` before claiming retained use)
4. **6.25.0** — Stability baseline

## Stop rules

- No schema 1.1; no root OTel dependency; no default network.
- Do not fabricate retained-use pilots for 6.24.
- One release at a time; Trusted Publish only via `publish.yml`.
- Do not publish 6.23 until `npm view agent-inspect version` reports `6.22.0`.
