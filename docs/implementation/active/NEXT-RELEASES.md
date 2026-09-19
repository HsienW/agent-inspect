# Active execution plan — website-first after 6.31.0

**Authority:** [../ROADMAP.md](../ROADMAP.md)
**Baseline:** **published** `agent-inspect@6.31.0` · commit `988b747` · schema `1.0`
**Named train:** `website-correctness-post-6310`
**Program status:** Published through **6.31.3**; **6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE**; **V7_DECISION: NO-GO**

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## Sequence

1. **Website hotfix** — Links, quickstart, TOC anchors, raw MD sync, badges, website CI — **done**
2. **6.31.1** — Strict `allowedStatuses` (P01); Trusted Publish skip runner (P02); LangChain callback parentage (P03) — **published**
3. **6.31.2** — README / AI SDK / Jest / observation-flag docs (P05) — **published**; private-app reruns (P06) remain unclaimed
4. **6.31.3** — OTLP BigInt timestamps — **published** (automated Collector suite still deferred)
5. **6.32.0** — Conditional external conformance + compact failure review — **BLOCKED_ON_EXTERNAL_EVIDENCE**
6. **6.33.0** — Runnable Promptfoo (+ backends after OTLP) only for genuine additive public capability
7. **v7** — assessment only; **V7_DECISION: NO-GO**

## Current chunk

**Stopped.** Do not invent **6.32.0** or mark `EVIDENCE GATE APPROVED`.

## Stop rules

- No schema 1.1; no root OTel dependency; no default network; no pricing engine; no replay; no retry execution
- Do not invent partner conformance success or mark `EVIDENCE GATE APPROVED` from private reports alone
- Do not invent or consume **6.32.0** for website/routine patches
- Trusted Publish only via `publish.yml` (no local `npm publish`)
- Ignore-only: `.redstamp/`, `redstamp-proposal-issue-body.md`

## External stop marker

```text
LAST_PUBLISHED_RELEASE: 6.31.3
ACTIVE: stopped
RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
