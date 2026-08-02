# Cursor — AgentInspect debug loop

1. Run `npx agent-inspect mcp configure --client cursor` (dry-run) and merge the `mcpServers.agent-inspect` block into `.cursor/mcp.json` (or use `--project-local --write --yes`).
2. Ask Cursor to use MCP tools only for **inspection**.
3. Follow the shared workflow in [README.md](./README.md).
4. Prefer flagship tools: `list_recent_failures`, `get_first_causal_failure`, `get_contract_failures`, `create_share_checked_evidence`.
5. Never request raw secrets or disable share redaction for sharing.
