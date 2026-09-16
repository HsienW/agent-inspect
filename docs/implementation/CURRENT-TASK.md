# Current task

```yaml
executionMode: autonomous-release-train
namedTrain: agentinspect-adoption-after-6291-v6.29.2-to-v6.32
currentTrain: adoption-6293-complete
trainStatus: blocked-external
currentChunk: stop-6293
nextAction: "6.30.0+ requires EVIDENCE GATE APPROVED + retained fixtures; use PREPARE RELEASE 6.29.2 then 6.29.3 when ready to publish"
canonicalRoadmap: docs/implementation/ROADMAP.md
activePlan: docs/implementation/active/NEXT-RELEASES.md
pendingManualGate: "main branch protection (maintainer GitHub settings); gh merge PR #412 on remote when token restored"
worktreeIgnoreOnly:
  - .redstamp/
  - redstamp-proposal-issue-body.md
```

## Published baseline

**6.29.1** on npm. Implementation for **6.29.2** and **6.29.3** is complete locally; pending Changeset → Version Packages → Trusted Publish.

## Completed in this train (local)

- **6.29.2:** MCP external runtime + packed ESM/CJS e2e (#413); suite init no-overwrite (#411/#412); nested metadata tool-argument checks (#414); bounded error codes (#415)
- **6.29.3:** OpenAI Agents `input_tokens_details.cached_tokens` (#416); browser observer boundary (#417); Evidence regen + path/version verify (#418); Glama pin/non-root (#419); interop/transport docs

## Stop markers

```text
RELEASE_6.29.2_IMPLEMENTATION_COMPLETE
RELEASE_6.29.3_IMPLEMENTATION_COMPLETE
AWAITING: PREPARE RELEASE 6.29.2 / CONTINUE — EXECUTE NEXT RELEASE (for 6.30.0 only after EVIDENCE GATE APPROVED)
BLOCKED_ON_6_30_EXTERNAL_INPUTS
LAST_PUBLISHED_RELEASE: 6.29.1
V7_DECISION: NO-GO
```
