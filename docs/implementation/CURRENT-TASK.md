# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-reliability-evidence-v6.25.1-to-v6.30
currentTrain: v6.25.1-critical-correctness
trainStatus: in-progress
currentChunk: retry-omitted-payload-fix
nextAction: "Land 6.25.1 PR → Version Packages → Trusted Publish; then 6.26.0. Manual: protect main; Dependabot triage."
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "GitHub branch protection on main + Dependabot close/split (#372/#373) + defer #368"
```

## Published baseline

**6.25.0** on npm. Persisted schema **1.0**. Gate docs + 6.25.1 correctness in flight.

## Manual maintainer gates

- [BRANCH-PROTECTION-INSTRUCTIONS.md](./active/BRANCH-PROTECTION-INSTRUCTIONS.md)
- [DEPENDABOT-TRIAGE.md](./active/DEPENDABOT-TRIAGE.md)
- [ISSUE-PR-PARK-LIST.md](./active/ISSUE-PR-PARK-LIST.md)
