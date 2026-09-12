# Active execution plan — next releases (6.25 in progress)

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.23.0` · schema `1.0` (6.24.0 Version Packages in flight)
**Program:** adoption-first `6.22.0 → 6.23.0 → 6.24.0 → 6.25.0`

## Adoption order (current)

1. **6.22.0** — published
2. **6.23.0** — published
3. **6.24.0** — feature merged (#384); Version Packages #385 pending publish
4. **6.25.0** — Stability baseline on `feat/625-stability-baseline`

## Stop rules

- No schema 1.1; no root OTel dependency; no default network.
- Do not fabricate retained-use pilots.
- Do not implement v7 — assessment only after 6.25.
- One release at a time; Trusted Publish only via `publish.yml`.
- Do not publish 6.25 until `npm view agent-inspect version` reports `6.24.0`.
