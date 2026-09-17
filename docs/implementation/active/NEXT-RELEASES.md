# Active execution plan — post-6.29.3 trust and adoption

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.3` · schema `1.0`
**Named train:** `post-6293-trust-and-adoption-v6.29.4-to-v6.32`
**Program status:** P0 green-main restored; **6.29.4 in progress**; `6.30+` **BLOCKED_ON_EXTERNAL_EVIDENCE**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## Sequence

1. **P0 green-main** — Evidence regen via `pnpm demo:generate` — **done** (`ce4b4247`)
2. **6.29.4** — MCP annotations; LICENSE in all public tarballs; demo/version sync; RUN-COMPARABILITY + retry guidance — **active**
3. **6.29.5** — Reserved corrective patch only
4. **6.30.0** — Comparable Evidence + portable interop — only with `EVIDENCE GATE APPROVED`
5. **6.31.0** — Failure-first review — only with paired incident fixture
6. **6.32.0** — Conditional external conformance
7. **v7** — assessment only; **V7_DECISION: NO-GO**

## Current chunk

6.29.4 implementation **complete** — await `PREPARE RELEASE 6.29.4` (no Changeset until then).

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine; no replay; no retry execution
- Do not invent `6.30.0` without sanitized retained external fixtures
- Do not implement v7 from the assessment file alone
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Ignore-only: `.redstamp/`, `redstamp-proposal-issue-body.md`

## External stop marker

```text
BLOCKED_ON_EXTERNAL_EVIDENCE (for inventing 6.30.0+)
LAST_PUBLISHED_RELEASE: 6.29.3
V7_DECISION: NO-GO
```
