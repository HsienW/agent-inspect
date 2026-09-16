# Glama / directory-listing image for the Preview read-only MCP server.
# The product is local-first; this image only needs to answer initialize + tools/list.
# Glama's admin UI generates its own Dockerfile — if configuring that form, use:
#   Build steps: ["npm install -g @agent-inspect/mcp-server@6.29.1"]
#   CMD: ["agent-inspect-mcp-server", "--dir", "/traces"]
#
# Pin the Node base tag and the published package version. Rebuild after each
# AgentInspect release that should appear in the directory listing.
FROM node:20.19.5-alpine

RUN addgroup -S agentinspect && adduser -S agentinspect -G agentinspect \
  && mkdir -p /traces \
  && chown -R agentinspect:agentinspect /traces

ENV AGENT_INSPECT_TRACE_DIR=/traces

# Pin to the published fixed-group version (update with each intended release).
RUN npm install -g @agent-inspect/mcp-server@6.29.1

USER agentinspect
WORKDIR /traces

CMD ["agent-inspect-mcp-server", "--dir", "/traces"]
