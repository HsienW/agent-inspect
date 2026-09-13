# Active execution plan — post-6.29 hardening program

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.0` · schema `1.0`
**Named train:** `agentinspect-post-629-hardening-v6.29.1-to-v6.30`
**Program status:** **6.29.1–6.29.3 code complete** on branch; publish pending; `6.30+` **BLOCKED_ON_EXTERNAL_EVIDENCE**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, and public-truth patches remain active.

## Sequence

1. **Immediate gate** — done
2. **6.29.1** — regex-free redaction + OTLP truth — **done (code)**
3. **6.29.2** — recovery fail-closed — **done (code)**
4. **6.29.3** — AI SDK overlap + Evidence safety/HTML + DX — **done (code)**
5. **Verified maintenance** — audit recorded; website privacy/security/CSP added; **no auto npm**
6. **PREPARE RELEASE** — changeset → Version Packages → `publish.yml` (maintainer)
7. **6.30.0** — only with `EVIDENCE GATE APPROVED` + retained fixtures; else blocked
8. **6.31.0** — conditional conformance review
9. **v7** — assessment only; **V7_DECISION: NO-GO**

## Current chunk

Verified maintenance complete → release prep / external block.

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine
- Do not invent `6.30.0` without sanitized retained external fixtures
- Do not implement v7 from the assessment file alone
- Unknown recovery evidence must not become a pass
- Unsafe TraceContracts must not be silently sanitized and still marked complete
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Do not merge PR #352 wholesale; 6.29.1-A is the security path
- Ignore-only (do not read/stage/commit): `.redstamp/`, `Dockerfile`, `glama.json`, `redstamp-proposal-issue-body.md`

## External stop marker

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.0
LAST_IMPLEMENTED_CODE: 6.29.3 themes
V7_DECISION: NO-GO
```
