# Active execution plan — v6.17.5 feedback integrity

**Train:** `v6.17.5-feedback-integrity`
**Named:** `agentinspect-feedback-integrity-v6.17.5-to-v6.21`
**Target:** patch `6.17.5` (implementation only in this plan; publication is a later gate)
**Baseline:** published `6.17.4`
**Authority:** [../ROADMAP.md](../ROADMAP.md) · attached feedback-driven roadmap (merged into permanent roadmap)

## Scope (this train only)

1. Public-truth synchronization (`pnpm public-truth:sync`) + claim-content digest separation
2. Changesets Version Packages path runs sync before public-truth check
3. `demo:verify` fail-closed when CLI dist is missing (`AI_DEMO_VERIFY_CLI_MISSING`)
4. `agent-inspect tail` truncation recovery
5. Visible `AI_ADAPTER_PREVIEW_NOT_AVAILABLE` warning for AI SDK + OpenAI Agents (no preview capture)
6. Document TraceContract `requiredOrder` first-occurrence semantics
7. Remove stale current-code support wording (`v1.x` experimental period phrases)

## Explicit non-goals

- AI SDK / OpenAI Agents bounded preview capture (6.18.0)
- Shared adapter capability APIs (6.18.0)
- TrueForge reader / adapter-SDK reader helpers (6.19.0)
- TraceContract `alternatives.anyOf` (6.20.0)
- Control-enforcement evidence APIs (6.21.0)
- Version bump, Changeset, commit, push, tag, or npm publish

## Chunks

| Chunk | Status |
| --- | --- |
| `6.17.5-0-audit` | done |
| `6.17.5-1-roadmap-state` | done |
| `6.17.5-2-public-truth-sync` | done |
| `6.17.5-3-demo-verify` | done |
| `6.17.5-4-tail-truncation` | done |
| `6.17.5-5-preview-warning` | done |
| `6.17.5-6-contract-docs` | done |
| `6.17.5-7-validation` | done |
| `6.17.5-8-issue-reconciliation` | done |

## Issue disposition (6.17.5-8)

| Issue | Release | Recommendation |
| --- | --- | --- |
| [#310](https://github.com/rajudandigam/agent-inspect/issues/310) | 6.17.5 | Close when visible-warning acceptance passes |
| [#308](https://github.com/rajudandigam/agent-inspect/issues/308) | 6.17.5 docs + 6.20.0 impl | Stay open until `requiredOrderMode: "all-occurrences"` ships |
| [#311](https://github.com/rajudandigam/agent-inspect/issues/311) | 6.18.0 | Stay open |
| [#309](https://github.com/rajudandigam/agent-inspect/issues/309) | 6.20.0 | Stay open |

Confirmed: no `requiredOrderMode`, `alternatives.anyOf`, or bounded preview capture landed in 6.17.5-8.

## Stop rule

Do not open a Changeset or mark `6.17.5` published until a separate release-readiness pass completes after maintainer review.
