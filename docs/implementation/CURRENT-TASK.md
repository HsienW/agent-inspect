# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: post-6294-correctness-v6.29.5-to-v6.32
currentTrain: release-6295
trainStatus: prepare-release
currentChunk: "R-6.29.5"
nextAction: "PREPARE RELEASE 6.29.5 then Trusted Publish via Version Packages + publish.yml; continue 6.29.6→6.31.0; stop 6.32.0 if EXTERNAL EVIDENCE missing"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.32.0 partner evidence; PR #422 factual review; Dependabot majors stay split"
maintainerAuthorization: "2026-09-18 — release through 6.32.0 train; Trusted Publish allowed; no local npm publish; do not invent EVIDENCE GATE APPROVED"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.4** on npm (Trusted Publish). Schema **1.0**. Next publish target: **6.29.5**.

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## Chunk log

| ID | State | Notes |
| --- | --- | --- |
| C0–04 | local-complete | Ready for R |
| R 6.29.5 | in-progress | Changeset + gates + Trusted Publish path |

## Stop marker

```text
LAST_PUBLISHED_RELEASE: 6.29.4
ACTIVE: PREPARE RELEASE 6.29.5
V7_DECISION: NO-GO
EVIDENCE_GATE: not approved
```
