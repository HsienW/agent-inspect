# Pre-v7 Pilot Kit

**Purpose:** External design-partner and three-team pilot evidence for the **6.12.0** stable launch candidate during the v6.12 adoption checkpoint.
**Do not fabricate results.** Record only real partner outcomes in [implementation/PRE-V7-ADOPTION-EVIDENCE.md](implementation/PRE-V7-ADOPTION-EVIDENCE.md).

## What is shipping for partners

| Item | Version / path |
|------|----------------|
| npm | `agent-inspect@6.12.0` (and fixed-group packages) |
| Quickstart | `npx agent-inspect init --yes` → demo → `list` → `verify-safe` |
| Packed E2E (maintainers) | `pnpm run pack:smoke` |
| Demo script | [DEMO-SCRIPT.md](DEMO-SCRIPT.md) |
| Design partner guide | [DESIGN-PARTNER-GUIDE.md](DESIGN-PARTNER-GUIDE.md) |
| Broken-agent starter | `examples/starters/broken-agent-debugging` |
| Studio (Beta) | `@agent-inspect/studio` — customer-owned, local |

## Partner trial checklist (copy per team)

1. Install `agent-inspect@6.12.0` on Node ≥ 20.
2. Complete five-minute quickstart (init → one run → verify-safe).
3. Run at least one framework path (AI SDK, OpenAI Agents, or LangChain) **or** observe/manual path.
4. Optionally run Studio against a local workspace.
5. Optionally retain a CI check/suite gate on a PR.
6. Return dated findings: blockers, what worked, whether they will keep using it.

## Evidence required for a strong v7 go input

From the adoption checkpoint / canonical roadmap §19:

- 3–5 design partners with dated findings
- 2–3 retained CI/evidence workflows (external)
- 2 repeated MCP debug loops (external)
- 1 public external integration / case study
- Organic usage that persists beyond release spikes

Empty / `_pending_` ledger rows mean “not yet evidenced,” not product failure.

## Maintainer stop condition

While the adoption checkpoint is active and external rows remain pending:

```text
trainStatus: in-progress (v6.12-adoption-checkpoint)
```

Do **not** schedule or implement v7 until adoption gates in [implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md](implementation/release-trains/V7.0.0-READINESS-ASSESSMENT.md) are met and a maintainer explicitly authorizes a v7 train.
