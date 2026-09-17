# M8ven Trust Index — post-6.29.4 rescan checklist (draft)

Prepare after `agent-inspect@6.29.4` (or later) Trusted Publish. Do **not** auto-submit telemetry or scanner callbacks from AgentInspect.

## Confirm before requesting a rescan

- [ ] Published version on npm matches the GitHub tag / release notes
- [ ] Publisher identity still matches the repository commit authors used for prior listing
- [ ] `@agent-inspect/mcp-server` `tools/list` returns annotations:
  - `readOnlyHint: true`
  - `destructiveHint: false`
  - `idempotentHint: true`
  - `openWorldHint: false`
- [ ] Every fixed-group public tarball contains `LICENSE` identical to the root MIT text
- [ ] No default upload / hidden network from core or MCP server
- [ ] MCP server remains local read-only (no target-tool execution)
- [ ] Document that annotations are **hints**, not authorization or attestation
- [ ] Note scanner limitations (hints are not enforcement)

## Out of scope

- Adding telemetry to satisfy a directory
- Claiming certification from a trust-index listing
