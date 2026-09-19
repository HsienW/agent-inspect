# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: website-correctness-post-6310
currentTrain: website-p04-done
trainStatus: awaiting-preview-review
currentChunk: "P04 website repair complete — stop for preview"
nextAction: "Maintainer preview/deploy review; then 6.31.1 (P01–P03). No npm bump for website-only."
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review; Vercel preview deploy"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.31.0** on npm at `988b747`. Website P04 is local/reviewable; no npm release required.

## Patch targets after website review

- **6.31.1** — P01 status validation + P02 publish skip + P03 LangChain parentage
- **6.31.2** — P05 README / examples / Jest
- **6.31.3** — P07 OTLP
- **6.32.0** — still **BLOCKED_ON_EXTERNAL_EVIDENCE**
- **V7** — NO-GO

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.31.0
ACTIVE: website P04 awaiting preview review
NEXT_PATCH: 6.31.1 (after website merge/deploy)
RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
