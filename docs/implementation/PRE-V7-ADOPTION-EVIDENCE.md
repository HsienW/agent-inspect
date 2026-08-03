# Pre-v7 Adoption Evidence

Ledger for the **v6.12 adoption checkpoint** (eight weeks). **Do not fabricate entries.**

**Checkpoint:** [release-trains/V6.12-ADOPTION-CHECKPOINT.md](./release-trains/V6.12-ADOPTION-CHECKPOINT.md)
**Published baseline:** `agent-inspect@6.12.0` (18 fixed packages)
**Calendar:** 2026-08-02 → 2026-09-27
**Pilot kit:** [../PRE-V7-PILOT-KIT.md](../PRE-V7-PILOT-KIT.md)

Empty / `_pending_` rows mean “not yet evidenced,” not product failure.

## Design-partner acceptance

| Field | Value |
|-------|-------|
| Partner name | _pending_ |
| Date | _pending_ |
| AgentInspect version | test against `6.12.0` |
| Workflow completed | _pending_ |
| Blockers | _pending_ |
| Sign-off | _pending_ |

**Seed:** v6.12 LangGraph trial remains fixture-only — see [reviews/V6.12.0-6-LANGGRAPH-TRIAL.md](./reviews/V6.12.0-6-LANGGRAPH-TRIAL.md).

## Pilot / retained-use evidence

| Team | Date | Scenario | CI retained | Evidence/MCP | Status |
|------|------|----------|-------------|--------------|--------|
| 1 | _pending_ | golden-path | _pending_ | _pending_ | _pending_ |
| 2 | _pending_ | golden-path | _pending_ | _pending_ | _pending_ |
| 3 | _pending_ | golden-path | _pending_ | _pending_ | _pending_ |

**Required for strong go:** three **external** teams with dated findings. Internal/repo runs do not count as external adoption.

## Roadmap §19 success indicators

| Indicator | Target | Status (arm date) |
|-----------|--------|-------------------|
| Design partners | 3–5 | 0 evidenced |
| Retained CI/evidence workflows | 2–3 | 0 external; tooling PASS in-repo |
| Repeated MCP debug loops | 2 | 0 external; starter + packed smoke PASS |
| Public integration / case study | 1 | none (not fabricated) |
| Organic usage beyond release spikes | qualitative | not measured |

## Consumer compatibility matrix

| Environment | Node | Module | Status | Date | Evidence |
|-------------|------|--------|--------|------|----------|
| Linux | 20 | ESM | _pending_ | | |
| Linux | 22 | ESM | partial | 2026-08-02 | Publish CI / packed smoke (Ubuntu Node 22) |
| macOS | 20 | CJS | _pending_ | | |
| macOS | 22 | ESM | _pending_ | | local host run in adoption-1 |
| Windows | 22 | ESM | _pending_ | | |
| Node 24 / 26 | — | — | UNTESTED in CI | | see packed matrix review |

**Executed:** `scripts/consumer-compat-matrix.mjs` / `pnpm pack:smoke` / packed quickstart in CI.
**Not complete:** Full cross-platform matrix. Do not mark complete without real runs.

## Portable evidence / MCP / CI seeds from v6.12

| Gate | Status | Notes |
|------|--------|-------|
| Portable Evidence v2 tooling | PASS (product) | External PR/incident attachment pending |
| MCP coding-agent loop tooling | PASS (product) | External repeated use pending |
| No-egress partner worksheet | PARTIAL | [V6.12.0-7](./reviews/V6.12.0-7-NO-EGRESS-TRIAL.md) |
| CI contract/gate retention | PARTIAL | [V6.12.0-8](./reviews/V6.12.0-8-CI-CONTRACT-TRIAL.md) |

## v7 readiness inputs

After the eight-week checkpoint and real rows above:

- Security posture retained
- Evidence / MCP / CI retained use (external)
- Design-partner continuation
- Fidelity vs setup issue mix
- Maintainer explicit authorization

Assessment surface: [release-trains/V7.0.0-READINESS-ASSESSMENT.md](./release-trains/V7.0.0-READINESS-ASSESSMENT.md).

## Maintainer actions (outreach — no fake partners)

When ready to solicit real evidence:

- [DESIGN-PARTNER-GUIDE.md](../../DESIGN-PARTNER-GUIDE.md)
- [DEMO-SCRIPT.md](../../DEMO-SCRIPT.md)
- `examples/starters/` (incl. `coding-agent-debug-loop`) and `scripts/packed-quickstart-e2e.mjs`

Record results only when partners return real data.
