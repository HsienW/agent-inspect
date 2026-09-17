---
"agent-inspect": patch
"@agent-inspect/mcp-server": patch
---

Trust and package integrity for 6.29.4:

- Advertise honest MCP `tools/list` annotations (readOnlyHint / openWorldHint / destructiveHint) without treating hints as authorization.
- Ship an exact LICENSE copy in every public fixed-group tarball and enforce it in pack-smoke / docs gates.
- Keep Evidence demo generator versions synced through `version:packages` (`demo:generate` + verify).
- Document run comparability and transport retry (429) evaluation guidance; AgentInspect evaluates retries, it does not execute them.
