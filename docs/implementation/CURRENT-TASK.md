# Current task

```yaml
executionMode: maintainer-reviewed
namedTrain: agentinspect-adoption-after-6291-v6.29.2-to-v6.32
currentTrain: published-6293
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

**6.29.3** on npm (fixed group of 18 packages). Schema **1.0**. Root Node `>=20`.

Shipped through this publish:

- **6.29.2 themes:** MCP externalizes `agent-inspect` + packed ESM/CJS shared-runtime e2e (#413); suite init refuses overwrite (#411 / #412); nested `metadata.arguments` (#414); bounded safe error codes (#415); OpenAI Agents `input_tokens_details.cached_tokens` (#416); browser observed-outcome injected observer (#417); public Evidence regen + private-path reject (#418); Glama pin/non-root (#419); interop/transport docs
- **6.29.3 corrective:** MCP `wrapMcpClient` Proxy preserves prototype methods (#420); persisted usage round-trip keeps `cacheWrite` / `reasoning` (#423 / #424)

## Freeze language

Core boundary frozen; evidence-backed security, correctness, compatibility, interoperability, and adoption patches remain active.

## External stop

```text
BLOCKED_ON_EXTERNAL_EVIDENCE
LAST_PUBLISHED_RELEASE: 6.29.3
V7_DECISION: NO-GO
```
