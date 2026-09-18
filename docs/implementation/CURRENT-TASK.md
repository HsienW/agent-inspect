# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: post-6294-correctness-v6.29.5-to-v6.32
currentTrain: prepare-release-6300
trainStatus: in-progress
currentChunk: "PREPARE RELEASE 6.30.0"
nextAction: "Trusted Publish 6.30.0; then 6.31.0 typed cross-kind ordering"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.6** on npm. Schema **1.0**. Next: **6.30.0**.

## Chunk log

| ID | State | Notes |
| --- | --- | --- |
| 6.30.0-A | done | basic contract parser + evaluate |
| 6.30.0-B | done | rich fields |
| 6.30.0-C | done | Evidence binding + CLI docs |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.29.6
ACTIVE: PREPARE RELEASE 6.30.0
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
