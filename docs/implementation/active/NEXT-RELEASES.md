# Active execution plan — next releases (6.24 in progress)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.22.0` · schema `1.0` (6.23.0 Trusted Publish in flight)
**Program:** adoption-first `6.22.0 → 6.23.0 → 6.24.0 → 6.25.0`

## Adoption order (current)

1. **6.22.0** — published
2. **6.23.0** — Version Packages merged; Trusted Publish in flight
3. **6.24.0** — Production adoption/distribution on `feat/624-production-adoption`
4. **6.25.0** — Stability baseline

## Stop rules

- No schema 1.1; no root OTel dependency; no default network.
- Do not fabricate retained-use pilots for 6.24 — stop with `BLOCKED_ON_EXTERNAL_EVIDENCE`.
- One release at a time; Trusted Publish only via `publish.yml`.
- Do not publish 6.24 until `npm view agent-inspect version` reports `6.23.0`.
