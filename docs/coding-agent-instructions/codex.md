# Codex — AgentInspect debug loop

1. `npx agent-inspect mcp configure --client codex`
2. Merge `mcp_servers.agent-inspect` into the Codex MCP config (dry-run first).
3. Inspect with `get_first_causal_failure` and `compare_runs`; do not ask the server to modify code.
4. After a green rerun, call `create_share_checked_evidence`.
