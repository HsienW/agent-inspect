# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: post-6294-correctness-v6.29.5-to-v6.32
currentTrain: implement-6296
trainStatus: in-progress
currentChunk: "6.29.6-05-sharing"
nextAction: "Implement 6.29.6 prompts 05–10; then PREPARE RELEASE 6.29.6"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.5** on npm (Trusted Publish; fixed group including unscoped `agent-inspect`). Schema **1.0**.

## Chunk log

| ID | State | Notes |
| --- | --- | --- |
| 6.29.5 C0–04 + R | published | `3e8750f1` → Version Packages #426 → npm 6.29.5 |
| 05 sharing | in-progress | N-8 fully redacted raw-content path |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.29.5
ACTIVE: 6.29.6 implementation
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
