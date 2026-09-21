# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: website-correctness-post-6310
currentTrain: maintenance-after-6313
trainStatus: open-pr-pending-review
currentChunk: "codex/trace-filesystem-permissions — restrictive create modes + UTF-8 release note"
nextAction: "Review/merge permissions PR; do not publish until Changeset Version Packages; do not consume 6.32.0"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.31.3** on npm (Trusted Publish). Main includes UTF-8 `tail --file` fix (#434). Open PR hardens new-path POSIX modes for the next **6.31.x** patch Changeset (not 6.32.0).

## Sequenced status

| Item | Status |
| --- | --- |
| P04 website | done |
| 6.31.1 P01–P03 | published |
| 6.31.2 P05 docs | published |
| 6.31.3 OTLP BigInt timestamps | published (Collector automated suite still deferred) |
| #434 UTF-8 tail | merged on main |
| Trace FS permissions | open PR (closes #435); stop after open — no merge/publish in that chunk |
| P06 private apps | evidence only — not claimed |
| 6.32.0 | BLOCKED_ON_EXTERNAL_EVIDENCE |
| V7 | NO-GO |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.31.3
ACTIVE: maintenance PR open — next published version is a 6.31.x patch if merged
RESERVED: 6.32.0 BLOCKED_ON_EXTERNAL_EVIDENCE
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
