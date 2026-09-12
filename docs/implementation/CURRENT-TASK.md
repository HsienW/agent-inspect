# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-adoption-first-v6.19-to-v6.25
currentTrain: v6.24.0-production-adoption
trainStatus: in-progress
currentChunk: adoption-distribution-polish
nextAction: "Land feat/624 after 6.23.0 is on npm; Version Packages + Trusted Publish; stop at BLOCKED_ON_EXTERNAL_EVIDENCE for retained-use claims; then 6.25"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "6.23.0 Trusted Publish + green CI on 6.24 PR; external retained-use evidence for adoption claim"
```

## Published baseline

**6.22.0** published on npm (6.23.0 Trusted Publish in flight). Persisted schema **1.0**.

## Active focus — 6.24.0 Production adoption

| Chunk | Status |
| --- | --- |
| Lifecycle playbook | implemented |
| init/doctor CLI docs + observe/manual aliases | implemented |
| Gate json-compact + github-annotations | implemented |
| VS Code #295 close/defer record | implemented |
| Retained-use claim | BLOCKED_ON_EXTERNAL_EVIDENCE |

## Later

- **6.25.0** stability baseline
