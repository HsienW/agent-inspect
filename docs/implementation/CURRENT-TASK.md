# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-reliability-evidence-v6.25.1-to-v6.30
currentTrain: repository-and-release-truth-gate
trainStatus: in-progress
currentChunk: immediate-gate
nextAction: "Finish release-truth gate docs → EXECUTE 6.25.1 (retry/omitted-payload). Manual: protect main; triage Dependabot PRs."
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "GitHub branch protection on main + Dependabot close/split (#372/#373) + defer #368"
```

## Published baseline

**6.25.0** on npm. Persisted schema **1.0**.

## Program focus

| Release | Theme | Status |
| --- | --- | --- |
| Immediate gate | Release truth + Settings/Dependabot instructions | in progress |
| 6.25.1 | Retry + omitted-payload correctness | next |
| 6.26.0 | Behavioral sessions (#362) | planned |
| 6.27.0–6.29.0 | Recovery / Evidence / usage | planned |
| 6.30.0 | External conformance | conditional |
| v7 | Assessment only | NO-GO |

## Manual maintainer gates

- [BRANCH-PROTECTION-INSTRUCTIONS.md](./active/BRANCH-PROTECTION-INSTRUCTIONS.md)
- [DEPENDABOT-TRIAGE.md](./active/DEPENDABOT-TRIAGE.md)
- [ISSUE-PR-PARK-LIST.md](./active/ISSUE-PR-PARK-LIST.md)
