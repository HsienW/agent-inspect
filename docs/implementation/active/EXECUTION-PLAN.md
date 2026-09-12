# Active execution plan — post-6.25 reliability program

**Train:** `agentinspect-reliability-evidence-v6.25.1-to-v6.30`  
**Authority:** [../ROADMAP.md](../ROADMAP.md) · [NEXT-RELEASES.md](./NEXT-RELEASES.md)  
**Baseline:** published `agent-inspect@6.25.0`

## Scope

1. Immediate repository/release-truth gate (docs + Settings instructions + Dependabot triage)
2. Publish `6.25.1` correctness patch (retry/omitted-payload)
3. Continue through eligible minors `6.26.0`–`6.29.0`
4. Conditional `6.30.0` only with external evidence
5. v7 assessment only — no implementation in this train

## Explicit non-goals

- Local `npm publish`
- Schema 1.1 / hosted SaaS / default network / CoT capture / pricing engine
- Merging grouped Dependabot majors (#372/#373) or Changesets Action v2 (#368) without dedicated migrations
- Fabricating retained-use or external conformance evidence
- Implementing v7

## Chunks

See [NEXT-RELEASES.md](./NEXT-RELEASES.md). Historical 6.17–6.25 adoption-first work is complete.

## Stop rule

Trusted Publish each release when Changesets/npm/tags agree. Stop at `BLOCKED_ON_EXTERNAL_EVIDENCE` before inventing 6.30.0.
