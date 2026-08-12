# Case study: LangGraph trajectory hardening (anonymized)

**Product:** AgentInspect  
**Public-safe technical narrative** — no organization names, no private traces, no fabricated partners.  
**Baseline:** verified through `agent-inspect@6.16.0` moderate + deep-swarm gates; Evidence UX shipped in `6.17.0`.

## Context

Two production-shaped NestJS / LangGraph TypeScript agent systems needed a **local** way to:

1. see whether the agent followed the intended path;
2. fail CI when the trajectory drifted;
3. keep shareable Evidence local (no default egress).

Existing hosted observability stayed in place. AgentInspect was added as an additive, env-gated local loop.

## Integration pattern

```text
framework events → local JSONL traces → check --preset trajectory → Evidence on failure → verify-safe before share
```

No monkey-patching of production defaults. No upload by AgentInspect.

## Four verification rounds (hardening timeline)

```text
6.7.3
capture blockers found
    ↓
6.12.1
capture fixed; check blockers found
    ↓
6.14.1
moderate gate passed; swarm self-cycle found
    ↓
6.16.0
moderate + swarm gates passed; zero open findings
```

## Eleven findings → closed by 6.16.0

Across four rounds, eleven concrete integration/check issues were identified (capture fidelity, parent/relationship edge cases, swarm self-cycles, safety classification mismatches, and CI gate wiring). **All eleven were resolved by 6.16.0.** At the 6.16.0 gate: zero open pilot findings on the moderate and deep-swarm fixtures used for verification.

## Results that are public-safe to state

| Claim | Evidence |
|-------|----------|
| Moderate production-shaped trajectory gate passes | `fixtures/langgraph/pilot-shaped-bridged-tool.jsonl` + packed semantic-loop E2E |
| Deep-swarm nested trajectory gate passes | `fixtures/langgraph/deep-swarm-nested-ok.jsonl` + packed swarm-loop E2E |
| Evidence v2 integrity is verifiable locally | `pnpm demo:generate` → `pnpm demo:verify` samples under `examples/evidence/` |
| No default network upload | product boundary + CI artifacts docs |

## What remains unclaimed

- No named customer logos or retention/ROI metrics.
- No claim that every LangGraph app is covered without fixture-backed checks.
- Share safety is intentionally separate from trajectory: a trajectory pass does **not** mean an artifact is share-safe — run `verify-safe` before sharing.

## Reproduce locally

```bash
pnpm build
npx agent-inspect check fixtures/langgraph/pilot-shaped-bridged-tool.jsonl --preset trajectory
npx agent-inspect check fixtures/langgraph/deep-swarm-nested-ok.jsonl --preset trajectory
pnpm demo:generate && pnpm demo:verify
```

## Related

- [CLI check presets & Evidence-on](../CLI.md)
- [CI artifacts](../CI-ARTIFACTS.md)
- [Evidence v2 format](../EVIDENCE-FORMAT.md)
- Demo samples: `examples/evidence/moderate-agent/`, `examples/evidence/langgraph-swarm/`
