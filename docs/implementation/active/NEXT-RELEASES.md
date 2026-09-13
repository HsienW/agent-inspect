# Active execution plan — post-6.29 hardening program

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.0` · schema `1.0`
**Named train:** `agentinspect-post-629-hardening-v6.29.1-to-v6.30`
**Program status:** **in progress** — evidence-backed `6.29.x` patches; `6.30+` still external-gated

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, and public-truth patches remain active.

## Sequence

1. **Immediate gate** — operational docs + manual Settings checklist (instructions only)
2. **6.29.1** — regex-free redaction policy + OTLP declared-vs-emitted truth
3. **6.29.2** — recovery identity, chronology, write completion, canonical equality
4. **6.29.3** — AI SDK overlap honesty + contract Evidence safety + HTML binding + DX recipe
5. **6.29.4** — optional; only if published package artifacts change after maintenance
6. **Verified maintenance** — fresh audits; no automatic npm release for site/settings-only work
7. **6.30.0** — only with `EVIDENCE GATE APPROVED` + retained fixtures; else blocked
8. **6.31.0** — conditional conformance review
9. **v7** — assessment only; **V7_DECISION: NO-GO**

## Current chunk

Immediate gate → **6.29.1-A** (redaction security).

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine
- Do not invent `6.30.0` without sanitized retained external fixtures
- Do not implement v7 from the assessment file alone
- Unknown recovery evidence must not become a pass
- Unsafe TraceContracts must not be silently sanitized and still marked complete
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Do not merge PR #352 wholesale; 6.29.1-A is the security path
- Ignore-only (do not read/stage/commit): `.redstamp/`, `Dockerfile`, `glama.json`, `redstamp-proposal-issue-body.md`

## External stop marker (minors)

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.0
V7_DECISION: NO-GO
```
