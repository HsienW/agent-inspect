# Active execution plan — v6.17.5 feedback integrity + check integrity

**Train:** `v6.17.5-feedback-integrity`
**Named:** `agentinspect-feedback-integrity-v6.17.5-to-v6.22`
**Target:** patch `6.17.5` (implementation only in this plan; publication is a later gate)
**Baseline:** published `6.17.4`
**Authority:** [../ROADMAP.md](../ROADMAP.md)

## Scope (this train only)

### Prior (done)

1. Public-truth synchronization (`pnpm public-truth:sync`) + claim-content digest separation
2. Changesets Version Packages path runs sync before public-truth check
3. `demo:verify` fail-closed when CLI dist is missing (`AI_DEMO_VERIFY_CLI_MISSING`)
4. `agent-inspect tail` truncation recovery
5. Visible `AI_ADAPTER_PREVIEW_NOT_AVAILABLE` warning for AI SDK + OpenAI Agents (no preview capture)
6. Document TraceContract `requiredOrder` first-occurrence semantics
7. Remove stale current-code support wording (`v1.x` experimental period phrases)
8. Issue reconciliation for #308–#311

### Adversarial check-integrity extension

9. Roadmap / train state for check integrity + 6.21/6.22
10. Strict CLI check config validation (reject unknown keys / effectless config)
11. Rule-execution evidence + zero-rule failure
12. Ordering integrity (unique IDs, requiredOrder implies presence, overlap warning)
13. Tool invocation semantics (include running for policy rules)
14. Observation presence for explicit CLI `--fail-on-observation`
15. Durability / product-boundary documentation
16. Adversarial regression corpus
17. Full validation gate

## Explicit non-goals

- AI SDK / OpenAI Agents bounded preview capture (6.18.0)
- Shared adapter capability APIs (6.18.0)
- TrueForge reader / adapter-SDK reader helpers (6.19.0)
- TraceContract `alternatives.anyOf` (6.20.0)
- `requiredOrderMode` / happens-before failure mode (6.20.0)
- Actor/sub-agent scope selectors (6.21.0)
- Outcome provenance enforcement (6.21.0)
- Handoff digests / MCP retry fixture / CI envelope (6.22.0)
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
| `6.17.5-9-adversarial-check-audit` | done |
| `6.17.5-10-strict-config` | done |
| `6.17.5-11-rule-execution-evidence` | done |
| `6.17.5-12-ordering-integrity` | done |
| `6.17.5-13-tool-invocation-semantics` | done |
| `6.17.5-14-observation-presence` | done |
| `6.17.5-15-durability-boundary` | done |
| `6.17.5-16-adversarial-regression-corpus` | done |
| `6.17.5-17-validation` | done |

## Adversarial check-integrity disposition

Fail-closed integrity extension landed in unpublished 6.17.5 train. Confirmed:

- no `requiredOrderMode` / `alternatives.anyOf` / preview capture implementation
- no version bump / Changeset / publish

## Stop rule

Do not open a Changeset or mark `6.17.5` published until a separate release-readiness pass completes after maintainer review.
