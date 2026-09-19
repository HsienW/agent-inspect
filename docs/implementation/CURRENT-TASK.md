# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: website-correctness-post-6310
currentTrain: patch-6311
trainStatus: releasing-6311
currentChunk: "P01–P03 + Changeset for 6.31.1 Trusted Publish"
nextAction: "Merge Version Packages PR; confirm publish.yml OIDC success; then P05 → 6.31.2"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.31.0** on npm. Website P04 landed on `main`. **6.31.1** Changeset in flight (P01 status + P02 skip + P03 LangChain parentage).

## Patch targets

- **6.31.1** — releasing now
- **6.31.2** — P05 README / examples / Jest
- **6.31.3** — P07 OTLP
- **6.32.0** — **BLOCKED_ON_EXTERNAL_EVIDENCE**
- **V7** — NO-GO

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.31.0
ACTIVE: 6.31.1 Trusted Publish in progress
NEXT_PATCH: 6.31.2 after 6.31.1
RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
