# v7 readiness assessment (post-6.25)

**Mode:** assessment only — do **not** implement v7 from this document alone.

## Gates that must pass before any v7 implementation

| Gate | Status |
| --- | --- |
| `6.25.0` published; `6.25.x` maintenance posture clear | pending until Trusted Publish |
| Retained external-use evidence (maintainer pilots) | `BLOCKED_ON_EXTERNAL_EVIDENCE` |
| No open P0/P1 security or data-loss defects | verify at assessment time |
| Package portfolio evidence for any consolidation | review [PACKAGE-MAINTENANCE-AUDIT.md](../PACKAGE-MAINTENANCE-AUDIT.md) |
| Schema 1.1 / breaking API necessity proven | not assumed |
| Cross-platform matrix goals (#209) either completed or explicitly deferred | PARTIAL today |

## Non-goals for this assessment file

- No schema change proposal as a default.
- No package removals in 6.x.
- No fabricated adoption metrics.

When the maintainer authorizes `ASSESS V7`, update this file with dated evidence links and a go/no-go recommendation.
