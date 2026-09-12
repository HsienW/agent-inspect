# Active execution plan — post-6.25 maintenance

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.25.0` · schema `1.0`
**Program:** adoption-first `6.19 → 6.25` — **complete**

## Completed (published)

1. **6.22.0** — Cross-runtime causal fidelity
2. **6.23.0** — Structured control contracts
3. **6.24.0** — Production adoption / distribution
4. **6.25.0** — Stability baseline

## Current posture

- **6.25.x** — maintenance / corrective patches only
- Retained-use public claims remain `BLOCKED_ON_EXTERNAL_EVIDENCE`
- **v7** — assessment only ([V7-READINESS-ASSESSMENT.md](./V7-READINESS-ASSESSMENT.md)); do not implement without explicit maintainer authorization

## Stop rules

- No schema 1.1; no root OTel dependency; no default network.
- Do not fabricate retained-use pilots.
- Do not implement v7 from the assessment file alone.
- Trusted Publish only via `publish.yml` (no local `npm publish`).
