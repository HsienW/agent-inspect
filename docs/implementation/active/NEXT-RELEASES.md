# Active execution plan — post-6.29 hardening program

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.1` · schema `1.0`
**Named train:** `agentinspect-post-629-hardening-v6.29.1-to-v6.30`
**Program status:** **6.29.1 published** (themes through 6.29.3); `6.30+` **BLOCKED_ON_EXTERNAL_EVIDENCE**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, and public-truth patches remain active.

## Sequence

1. **Immediate gate** — done
2. **6.29.1 themes** — redaction + OTLP + recovery + AI SDK + Evidence + DX — **published as 6.29.1**
3. **Verified maintenance** — done (website privacy/security/CSP)
4. **6.30.0** — only with `EVIDENCE GATE APPROVED` + retained fixtures; else blocked
5. **6.31.0** — conditional conformance review
6. **v7** — assessment only; **V7_DECISION: NO-GO**

## Current chunk

Stop — external evidence gate.

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine
- Do not invent `6.30.0` without sanitized retained external fixtures
- Do not implement v7 from the assessment file alone
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Ignore-only (do not read/stage/commit): `.redstamp/`, `Dockerfile`, `glama.json`, `redstamp-proposal-issue-body.md`

## External stop marker

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.1
V7_DECISION: NO-GO
```
