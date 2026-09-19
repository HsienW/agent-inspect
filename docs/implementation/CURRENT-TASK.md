# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: website-correctness-post-6310
currentTrain: complete-through-6313
trainStatus: stopped
currentChunk: "Train complete through 6.31.3; stop before 6.32"
nextAction: "Await 6.32.0 partner evidence; do not invent EVIDENCE GATE APPROVED; P06 private reruns not claimed"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.31.3** on npm (Trusted Publish). Website P04 + 6.31.1–6.31.3 patches landed.

## Sequenced status

| Item | Status |
| --- | --- |
| P04 website | done |
| 6.31.1 P01–P03 | published |
| 6.31.2 P05 docs | published |
| 6.31.3 OTLP BigInt timestamps | published (Collector automated suite still deferred) |
| P06 private apps | evidence only — not claimed |
| 6.32.0 | BLOCKED_ON_EXTERNAL_EVIDENCE |
| V7 | NO-GO |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.31.3
ACTIVE: stopped — next is 6.32.0 partner evidence only
RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
