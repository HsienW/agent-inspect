# Active execution plan — post-6.29.4 correctness

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.6` · schema `1.0`
**Named train:** `post-6294-correctness-v6.29.5-to-v6.32`
**Program status:** **6.30.0 in progress** (rich CLI TraceContracts); then 6.31; **6.32.0** remains gated; **V7_DECISION: NO-GO**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## Sequence

1. **6.29.4** — MCP annotations; LICENSE matrix; demo sync; comparability/retry — **published**
2. **6.29.5** — Confidence validation; uncertain-write fail-closed; circuit logical-event/kind/run-scope; extension accounting — **published**
3. **6.29.6** — Residual safe sharing; CI/outcome help; Jest association; capture investigation (library fix only with repro); recipe corrections as ready — **published**
4. **6.30.0** — Strict CLI access to existing rich TraceContract engine (**amends** prior comparable-Evidence allocation) — **active**
5. **6.31.0** — Scoped typed cross-kind ordering (**amends** prior failure-first review-UX allocation)
6. **6.32.0** — Conditional external conformance + compact failure review — only with accepted partner inputs
7. **v7** — assessment only; **V7_DECISION: NO-GO**

## Current chunk

**6.30.0-A** — strict top-level `contract` in `check --config` (basic run/tools/llm/observations) + evaluateTraceContract. Then B (rich fields/scope) / C (Evidence binding + docs). Then PREPARE RELEASE 6.30.0.

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine; no replay; no retry execution
- Do not invent partner conformance success or mark `EVIDENCE GATE APPROVED` from private reports alone
- Do not implement v7 from the assessment file alone
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Ignore-only: `.redstamp/`, `redstamp-proposal-issue-body.md`

## External stop marker

```text
LAST_PUBLISHED_RELEASE: 6.29.6
ACTIVE: 6.30.0 rich CLI TraceContracts
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
