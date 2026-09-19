# Active execution plan — post-6.29.4 correctness

**Train:** `post-6294-correctness-v6.29.5-to-v6.32`
**Authority:** [../ROADMAP.md](../ROADMAP.md) · [NEXT-RELEASES.md](./NEXT-RELEASES.md)
**Baseline:** published `agent-inspect@6.31.0` (`988b747`) · website P04 → **6.31.1+** · **6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE** · **V7_DECISION: NO-GO**

## Scope

1. Repo hygiene for stale operational docs (complete before feature chunks)
2. Implement **6.29.5**: confidence vocabulary; uncertain-write fail-closed; circuit count/kind/scope; extension accounting
3. Continue **6.29.6** after 6.29.5 review/publish authorization
4. **6.30.0** / **6.31.0** only with explicit scope and fixtures (amended allocations recorded in ROADMAP)
5. Conditional **6.32.0** only with accepted external inputs
6. v7 assessment only — no implementation

## Explicit non-goals

- Local `npm publish`
- Schema 1.1 / hosted SaaS / default network / CoT capture / pricing engine / replay / retry execution
- Merging grouped Dependabot majors without dedicated migrations
- Fabricating retained-use or external conformance evidence
- Implementing v7

## Chunks

See [NEXT-RELEASES.md](./NEXT-RELEASES.md). Historical 6.17–6.29.4 trains are complete.

## Stop rule

Trusted Publish each release when Changesets/npm/tags agree. Do not mark `EVIDENCE GATE APPROVED` from private case studies alone. **V7_DECISION: NO-GO**.
