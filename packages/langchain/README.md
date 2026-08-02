# @agent-inspect/langchain

LangChain callback handler → local AgentInspect traces.


**Support level:** Supported — see [SUPPORT-LEVELS.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SUPPORT-LEVELS.md).

## When to use

- LangChain or LangGraph apps using `@langchain/core` callbacks
- You want `persist: true` local JSONL without a hosted backend

## When not to use

- Raw LangGraph without LangChain callbacks (wire callbacks at integration points)
- Hosted LangSmith as replacement

## Install

```bash
npm install agent-inspect @agent-inspect/langchain @langchain/core
```

**Peer:** `@langchain/core@^1.0.0`

## Example

```ts
import { AgentInspectCallback } from "@agent-inspect/langchain";

const handler = new AgentInspectCallback({
  traceDir: ".agent-inspect",
  runName: "my-chain",
  // persist omitted: enabled automatically when traceDir is set
});

// Pass handler to your chain / LangGraph invoke callbacks
await graph.invoke(input, { callbacks: [handler] });
await handler.flush(); // optional — awaitHandlers already drains persistence
await handler.close(); // serverless / unusual shapes — idempotent

const d = handler.getDiagnostics();
// counts only: lateEventCount, pendingRelationshipCount, finalized, …
```

## Privacy

- Local files only; metadata-only default
- No AgentInspect network activity

## API

| Export | Purpose |
| ------ | ------- |
| `AgentInspectCallback` | LangChain `BaseCallbackHandler` (`awaitHandlers`, `flush`/`finalize`/`close`, `getDiagnostics`) |
| `extractModelName`, `safePreview` | Metadata helpers |

## Fidelity

See [LANGGRAPH-FIDELITY.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/LANGGRAPH-FIDELITY.md) for the LangGraph/LangChain adapter contract (lifecycle, parents, tool identity, persist-by-intent).

## CLI

With `persist: true`, use the same directory configured in `traceDir`:

```bash
npx agent-inspect list --dir ./.agent-inspect
npx agent-inspect view <run-id> --dir ./.agent-inspect --summary
npx agent-inspect report <run-id> --dir ./.agent-inspect
```

Persisted traces remain local. Before sharing an export or report, follow the
[safe trace sharing checklist](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SAFE-TRACE-SHARING.md)
and review the generated artifact for sensitive metadata.

## Docs

- [Adapters](https://github.com/rajudandigam/agent-inspect/blob/main/docs/ADAPTERS.md)
- [Starter](https://github.com/rajudandigam/agent-inspect/tree/main/examples/starters/langchain)

## Troubleshooting

- **Empty trace:** Provide `traceDir` (persist-by-intent) or `persist: true`, and attach callbacks to invoke/stream
- **LangGraph:** Prefer `{ callbacks: [handler] }` on `invoke`/`stream`; tool nodes should forward runnable `config`
- **Incomplete run:** Call `await handler.finalize()` / `close()` on shutdown; check `getDiagnostics().lateEventCount`
- **Unresolved parents:** Expected for semantic labels like `LangGraph` / `__start__` when no unique match exists — visible in step metadata


## Version

Part of the fixed AgentInspect release line. See the npm badge / package manifest for the current version.

## License

MIT
