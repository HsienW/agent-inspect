---
"agent-inspect": patch
"@agent-inspect/mcp": patch
---

Corrective patch after 6.29.2:

- Preserve MCP client prototype methods and private state via Proxy in `wrapMcpClient` (#420).
- Preserve `cacheWrite` and `reasoning` when converting persisted token usage back to TraceEvent metadata (#423 / #424).
