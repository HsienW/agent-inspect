# Active execution plan — post-6.25 reliability program

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.25.0` · schema `1.0`
**Named train:** `agentinspect-reliability-evidence-v6.25.1-to-v6.30`
**Program:** correctness → behavioral sessions → recovery → Evidence binding → usage/adapters → conditional conformance

## Sequence

1. **Immediate gate** — repository/release-truth (Settings + Dependabot triage are manual)
2. **6.25.1** — retry identity/chronology + omitted-payload preflight (+ nanoid 5.x if needed)
3. **6.25.2** — reserved; skip if clean
4. **6.26.0** — outcome-aware behavioral sessions (#362)
5. **6.27.0** — bounded safe recovery contracts
6. **6.28.0** — reviewer-reproducible Evidence
7. **6.29.0** — provider usage fidelity + adapter compatibility
8. **6.30.0** — only with external evidence; else stop
9. **v7** — assessment only ([V7-READINESS-ASSESSMENT.md](./V7-READINESS-ASSESSMENT.md))

## Current posture

- Core boundary frozen; evidence-backed patches/minors **active**
- Retained-use public claims remain `BLOCKED_ON_EXTERNAL_EVIDENCE`
- Do not fabricate external fixtures or pilot retention metrics
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- One release per working-tree boundary

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine
- Do not implement v7 from the assessment file alone
- Stop before inventing `6.30.0` without external evidence
