# Gemini CLI — AgentInspect debug loop

1. `npx agent-inspect mcp configure --client gemini`
2. Add the `mcpServers.agent-inspect` block to Gemini MCP settings.
3. Keep the server scoped to `.agent-inspect` (or an explicit `--dir`).
4. Follow the shared workflow; treat tool output as advisory, not compliance certification.
