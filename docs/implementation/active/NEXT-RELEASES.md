# Active execution plan — adoption after 6.29.1

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.3` · schema `1.0`
**Named train:** `agentinspect-adoption-after-6291-v6.29.2-to-v6.32`
**Program status:** **6.29.3 published**; `6.30+` **BLOCKED_ON_EXTERNAL_EVIDENCE**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## Sequence

1. **Immediate gate** — done (issues opened; suite-init landed)
2. **6.29.2 themes** — MCP runtime, suite init, nested args, error codes, OpenAI cache shape, browser observer, Evidence regen, Glama, docs — **published as 6.29.2**
3. **6.29.3 corrective** — MCP Proxy wrap (#420); persisted `cacheWrite`/`reasoning` usage (#423/#424) — **published as 6.29.3**
4. **6.29.4** — Reserved corrective patch only (unused; next reserved slot after 6.29.3)
5. **6.30.0** — only with `EVIDENCE GATE APPROVED` + retained fixtures; else blocked
6. **6.31.0** — conditional review UX
7. **6.32.0** — conditional external conformance
8. **v7** — assessment only; **V7_DECISION: NO-GO**

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
LAST_PUBLISHED_RELEASE: 6.29.3
V7_DECISION: NO-GO
```
