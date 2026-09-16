# @agent-inspect/mcp

MCP **client** tool-call tracing for AgentInspect (list/call lifecycle).


**Support level:** Supported — see [SUPPORT-LEVELS.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SUPPORT-LEVELS.md).

## When to use

- Your agent uses an MCP client and you need local tool-call steps

## When not to use

- Running an MCP server (use your server stack)
- Gateway/proxy products

## Install

```bash
npm install agent-inspect @agent-inspect/mcp
```

Install matching fixed-group versions (same `agent-inspect` and `@agent-inspect/mcp` release). The MCP package keeps `agent-inspect` external so `wrapMcpClient` shares the application `inspectRun` context. A version mismatch can still produce a second runtime and lose nested MCP steps.

## Example

```ts
import { inspectRun } from "agent-inspect";
import { wrapMcpClient } from "@agent-inspect/mcp";

const traced = wrapMcpClient(mcpClient, { serverName: "tools" });

await inspectRun("my-agent", async () => {
  await traced.listTools?.();
  await traced.callTool({ name: "search", arguments: {} });
});
```

Call wrapped MCP operations **inside** `inspectRun` (or an active inspector run). Outside an active run, `step()` executes without instrumentation.

## Privacy

- Local JSONL only; no MCP traffic sent to AgentInspect cloud (there is none)

## API

| Export | Purpose |
| ------ | ------- |
| `wrapMcpClient` | Trace list/call tool operations |

## CLI

`npx agent-inspect view` · `search --kind tool`

## Docs

- [Adapters](https://github.com/rajudandigam/agent-inspect/blob/main/docs/ADAPTERS.md)

## Troubleshooting

- **Missing list_tools steps:** Ensure client goes through wrapped instance


## Version

Part of the fixed AgentInspect release line. See the npm badge / package manifest for the current version.

## License

MIT
