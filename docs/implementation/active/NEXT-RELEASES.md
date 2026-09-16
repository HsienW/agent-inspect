# Active execution plan — adoption after 6.29.1

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.29.1` · schema `1.0`
**Named train:** `agentinspect-adoption-after-6291-v6.29.2-to-v6.32`
**Program status:** train **active**; implementing **6.29.2**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## Sequence

1. **Immediate gate** — protect `main` (manual), open/track confirmed issues, review/land PR #412, drop stale Dockerfile/glama ignore-only
2. **6.29.2** — MCP split-runtime externalization + packed ESM/CJS tests; suite init no-overwrite; nested metadata arguments; bounded error codes
3. **6.29.3** — OpenAI Agents cached-token shape; browser independent observer; Evidence fixture regen + private-path reject; Glama pin/non-root; interop/transport docs
4. **6.29.4** — Reserved corrective patch only
5. **6.30.0** — Portable Evidence / interop contracts — only with real external inputs
6. **6.31.0** — Failure-first review UX — only with review fixtures
7. **6.32.0** — Conditional external conformance
8. **v7** — Assessment only; **V7_DECISION: NO-GO**

## Current chunk

`6.29.2` — published runtime and CLI integrity.

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine
- Do not invent `6.30.0+` without sanitized retained external fixtures
- Do not implement v7 from the assessment file alone
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Ignore-only (do not read/stage/commit): `.redstamp/`, `redstamp-proposal-issue-body.md`
- Dockerfile and `glama.json` are **tracked** and in-scope for 6.29.3 Glama hardening
- Stop at each SemVer boundary until CONTINUE / PREPARE RELEASE

## External stop marker (6.30+)

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.1
V7_DECISION: NO-GO
```
