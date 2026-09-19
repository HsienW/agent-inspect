# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: website-correctness-post-6310
currentTrain: patch-6312
trainStatus: releasing-6312
currentChunk: "P05 README / AI SDK / Jest docs → 6.31.2"
nextAction: "Push Changeset; merge Version Packages; Trusted Publish 6.31.2; then assess P07 OTLP"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.31.1** on npm (Trusted Publish run 35414919934). Website P04 + correctness P01–P03 landed.

## Patch targets

- **6.31.2** — releasing P05 docs now
- **6.31.3** — P07 OTLP (next)
- **6.32.0** — **BLOCKED_ON_EXTERNAL_EVIDENCE**
- **V7** — NO-GO

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.31.1
ACTIVE: 6.31.2 Trusted Publish in progress
NEXT_PATCH: 6.31.3
RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
