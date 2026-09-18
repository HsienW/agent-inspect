# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: post-6294-correctness-v6.29.5-to-v6.32
currentTrain: implement-6310
trainStatus: in-progress
currentChunk: "6.31.0 typed cross-kind step ordering"
nextAction: "PREPARE RELEASE 6.31.0 (Changeset Version Packages + Trusted Publish)"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.30.0** on npm. Schema **1.0**. Next: **6.31.0** (implementation landed; awaiting Version Packages).

## Chunk log

| ID | State | Notes |
| --- | --- | --- |
| 6.30.0-A | done | basic contract parser + evaluate |
| 6.30.0-B | done | rich fields |
| 6.30.0-C | done | Evidence binding + CLI docs |
| 6.30.0 | published | Trusted Publish |
| 6.31.0 | done | `steps.orderRelations` TOOL↔LLM ordering |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.30.0
ACTIVE: PREPARE RELEASE 6.31.0
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
