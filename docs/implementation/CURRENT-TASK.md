# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: post-6294-correctness-v6.29.5-to-v6.32
currentTrain: prepare-release-6296
trainStatus: in-progress
currentChunk: "PREPARE RELEASE 6.29.6"
nextAction: "Add Changeset + release gates for 6.29.6; Trusted Publish; then 6.30.0"
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
| 05 sharing | done | N-8 fully redacted raw-content path |
| 06 CI/outcome | done | trajectory vs outcome; TOOL-only order docs |
| 07 Jest/N-9 | done (bounded) | Jest association covered by package tests; N-9 unverified (no private apps) |
| 08 comparability | done | pairwise stage SHA-256 recipe |
| 09 browser | done | identity/precondition/postcondition matrix |
| 10 fault/claim | deferred | optional E1 fixture; not blocking 6.29.6 |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.29.5
ACTIVE: PREPARE RELEASE 6.29.6
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
