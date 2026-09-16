# Active execution plan — adoption after 6.29.1

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.2` · schema `1.0`
**Named train:** `agentinspect-adoption-after-6291-v6.29.2-to-v6.32`
**Program status:** **6.29.2 published** (themes through planned 6.29.3); `6.30+` **BLOCKED_ON_EXTERNAL_EVIDENCE**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## Sequence

1. **Immediate gate** — done (issues opened; suite-init landed)
2. **6.29.2 / 6.29.3 themes** — MCP runtime, suite init, nested args, error codes, OpenAI cache shape, browser observer, Evidence regen, Glama, docs — **published as 6.29.2**
3. **6.29.4** — Reserved corrective patch only
4. **6.30.0** — only with `EVIDENCE GATE APPROVED` + retained fixtures; else blocked
5. **6.31.0** — conditional review UX
6. **6.32.0** — conditional external conformance
7. **v7** — assessment only; **V7_DECISION: NO-GO**

## Current chunk

Stop — external evidence gate.

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine
- Do not invent `6.30.0` without sanitized retained external fixtures
- Do not implement v7 from the assessment file alone
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Ignore-only (do not read/stage/commit): `.redstamp/`, `redstamp-proposal-issue-body.md`

## External stop marker

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.2
V7_DECISION: NO-GO
```
