# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-feedback-integrity-v6.17.5-to-v6.22
currentTrain: v6.19.1-release-chain-gate
trainStatus: in-progress
currentChunk: immediate-release-chain-gate
nextAction: "Land immediate release-chain security gate → complete MAINTAINER-SETTINGS-CHECKLIST-6191 → start 6.19.1 reserved corrections; do not authorize 6.20 yet"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "GitHub/npm Settings checklist (docs/implementation/MAINTAINER-SETTINGS-CHECKLIST-6191.md)"
```

## Published baseline

**6.19.0** published on npm (`agent-inspect@6.19.0`, Trusted Publish run `34013658849`). Version Packages `#357` (`4e0d794`). Prior published: **6.17.8**, **6.18.0**. Persisted schema **1.0**.

## Active focus — adoption-first

| Chunk | Status |
| --- | --- |
| Immediate release-chain security gate (split version/publish, pin actions, Dependabot, scanner docs) | in progress |
| Maintainer Settings checklist (OIDC × 18, ruleset, remove routine NPM_TOKEN) | pending after gate merge |
| **6.19.1** reserved patch (reader/failure-fact / workflow-docs corrections only) | next after Settings |
| **6.20.0** flexible contracts (#308/#315/#309) | deferred — do not authorize until 6.19.1 path is clear |

## Later

- **6.21.0** — #320 actor scope; #321 outcome provenance (roadmap-next)
- **6.22.0** — #331 design confirmed; conditional; existing APIs only; not implemented (roadmap-future)

## Issue design state

- **#308 / #315 / #309** — scheduled **6.20**; stay open; **no implementation** until authorized after 6.19.1
- **#320 / #321** — scheduled **6.21**; labels → `roadmap-next`
- **#331** — design confirmed; conditional **6.22**; existing APIs only; not implemented; stays `roadmap-future`
- **#355** — closed (6.19.0 derived failure roles shipped in `#354`, published on npm)
