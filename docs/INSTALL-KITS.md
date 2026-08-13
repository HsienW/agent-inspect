# Install kits

Task-oriented, copyable install paths for the AgentInspect fixed release line.  
Authority: [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md) · [POSITIONING-AND-PORTFOLIO.md](./POSITIONING-AND-PORTFOLIO.md).

Prefer these kits over listing all eighteen packages as equal install targets.

## Three public groups

| Group | Job | Typical packages |
| ----- | --- | ---------------- |
| **Core kit** | Local inspect + Evidence | `agent-inspect`, `@agent-inspect/redact` |
| **Framework kit** | Faithful capture for your stack | `agent-inspect` + one official adapter |
| **CI / Evidence kit** | Trajectory gates + reporters | `agent-inspect` + `@agent-inspect/vitest` or `@agent-inspect/jest` |

MCP (`@agent-inspect/mcp-server`) remains an optional coding-agent loop, not a required install for the core promise.

## LangGraph local-debug kit

Faithful LangGraph/LangChain capture + coding-agent MCP loop.

```bash
npm install -D agent-inspect @agent-inspect/langchain @agent-inspect/mcp-server
```

Next:

1. Wire `@agent-inspect/langchain` callbacks ([LANGGRAPH-FIDELITY.md](./LANGGRAPH-FIDELITY.md))
2. Capture a run under `.agent-inspect/`
3. `npx @agent-inspect/mcp-server --dir .agent-inspect` ([CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md))
4. Configure a client: `npx agent-inspect mcp configure --client cursor --dry-run`

Starter: [examples/starters/coding-agent-debug-loop](../examples/starters/coding-agent-debug-loop/) (no API keys).

## Core portable-evidence kit

Local inspect + share-checked evidence without a framework adapter.

```bash
npm install -D agent-inspect @agent-inspect/redact
```

Next:

```bash
npx agent-inspect init --yes
node examples/agent-inspect-demo.mjs
npx agent-inspect list --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
```

See [EVIDENCE-FORMAT.md](./EVIDENCE-FORMAT.md) · [SAFE-TRACE-SHARING.md](./SAFE-TRACE-SHARING.md).

## AI SDK kit

```bash
npm install -D agent-inspect @agent-inspect/ai-sdk
```

Guide: [AI-SDK-ADOPTION.md](./AI-SDK-ADOPTION.md) · starter: [examples/starters/ai-sdk](../examples/starters/ai-sdk/).

## OpenAI Agents kit

```bash
npm install -D agent-inspect @agent-inspect/openai-agents
```

Guide: [OPENAI-AGENTS-LOCAL.md](./OPENAI-AGENTS-LOCAL.md) · starter: [examples/starters/openai-agents](../examples/starters/openai-agents/).

## CI regression kit

```bash
npm install -D agent-inspect @agent-inspect/vitest
# or: npm install -D agent-inspect @agent-inspect/jest
```

See [CI-ARTIFACTS.md](./CI-ARTIFACTS.md) · [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md).

## Optional supporting surfaces

Install only when needed (Tier C):

| Need | Package |
|------|---------|
| Localhost viewer | `@agent-inspect/viewer` |
| Customer-owned Studio | `@agent-inspect/studio` |
| SQLite workspace index | `@agent-inspect/index-sqlite` |
| Third-party adapters | `@agent-inspect/adapter-sdk` |

Maturity: [SUPPORT-LEVELS.md](./SUPPORT-LEVELS.md).
