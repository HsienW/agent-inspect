# Decision guide

Choose the smallest AgentInspect path that matches your stack and goal.

## 1. Capture

| If you use… | Start with |
| ----------- | ---------- |
| Custom TypeScript agent | `inspectRun` / `step` / `observe` — [GETTING-STARTED.md](./GETTING-STARTED.md) |
| Vercel AI SDK | [`@agent-inspect/ai-sdk`](https://www.npmjs.com/package/@agent-inspect/ai-sdk) |
| OpenAI Agents JS | [`@agent-inspect/openai-agents`](https://www.npmjs.com/package/@agent-inspect/openai-agents) |
| LangChain / LangGraph | [`@agent-inspect/langchain`](https://www.npmjs.com/package/@agent-inspect/langchain) · [LANGGRAPH.md](./LANGGRAPH.md) · `npx agent-inspect init --framework langgraph` |
| Existing structured logs | [LOG-TO-TREE-QUICKSTART.md](./LOG-TO-TREE-QUICKSTART.md) |
| OpenInference / OTLP JSON files | [STANDARDS.md](./STANDARDS.md) |

## 2. Understand a run

```bash
npx agent-inspect list --dir .agent-inspect
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect what <run-id> --dir .agent-inspect
```

Programmatic TraceFacts: [TRACE-FACTS.md](./TRACE-FACTS.md).

## 3. Prevent a regression

| Need | Use |
| ---- | --- |
| One-off CLI checks | `npx agent-inspect check <run-id>` |
| Typed trajectory rules | TraceContract — [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md) |
| CI thresholds | Suites / gates — [SUITES-COHORTS-GATES.md](./SUITES-COHORTS-GATES.md) |
| Vitest / Jest | Reporters + experimental `toPassTraceContract` / `toHaveRequiredTool` |

## 4. Share evidence

```bash
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>
```

See [EVIDENCE-FORMAT.md](./EVIDENCE-FORMAT.md) and [SAFE-TRACE-SHARING.md](./SAFE-TRACE-SHARING.md).

## 5. Debug with a coding assistant

```bash
npx agent-inspect mcp configure --client cursor
npx @agent-inspect/mcp-server --dir .agent-inspect
```

Use `get_trace_facts` and related read-only tools. See [CODING-AGENT-LOOP.md](./CODING-AGENT-LOOP.md).

## 6. Stay local / no-egress

Follow [NO-EGRESS-POLICY.md](./NO-EGRESS-POLICY.md) and [NETWORK-BEHAVIOR.md](./NETWORK-BEHAVIOR.md). Core AgentInspect does not open outbound product telemetry sockets by default.
