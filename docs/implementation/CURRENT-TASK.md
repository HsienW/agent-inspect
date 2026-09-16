# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-adoption-after-6291-v6.29.2-to-v6.32
currentTrain: published-6292
trainStatus: blocked-external
currentChunk: stop
nextAction: "Do not invent 6.30.0 without EVIDENCE GATE APPROVED + retained fixtures"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "GitHub branch protection on main; Dependabot majors stay split"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.2** on npm (fixed group of 18 packages). Schema **1.0**. Root Node `>=20`.

Shipped in this publish (themes labeled 6.29.2 + 6.29.3 in the adoption plan):

- MCP externalizes `agent-inspect` + packed ESM/CJS shared-runtime e2e (#413)
- Suite init refuses overwrite (#411 / #412)
- Nested `metadata.arguments` for tool-argument checks (#414)
- Bounded safe error codes (#415)
- OpenAI Agents `input_tokens_details.cached_tokens` (#416)
- Browser observed-outcome injected observer (#417)
- Public Evidence regen + private-path reject (#418)
- Glama pin/non-root (#419)
- Interop pass wording + transport evidence docs

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## External stop

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.2
V7_DECISION: NO-GO
```
