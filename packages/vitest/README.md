# @agent-inspect/vitest

Vitest reporter for local AgentInspect failure artifacts, plus **experimental** TraceContract matchers.


**Support level:** Supported (reporter) · Experimental (matchers) — see [SUPPORT-LEVELS.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/SUPPORT-LEVELS.md).

## When to use

- Vitest suites that run instrumented agents
- PR artifacts on failure without changing assertion libraries
- Experimental trajectory assertions via `toPassTraceContract` / `toHaveRequiredTool`

## When not to use

- Jest (use `@agent-inspect/jest`)
- Tests without AgentInspect traces

## Install

```bash
npm install agent-inspect @agent-inspect/vitest vitest
```

**Peer:** `vitest@^2.1.0 || ^3.2.6` (Vitest 2 remains supported for consumers; the monorepo test runner uses Vitest ≥3.2.6)

## Reporter example

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import agentInspectReporter from "@agent-inspect/vitest";

export default defineConfig({
  test: {
    reporters: ["default", agentInspectReporter({ traceDir: ".agent-inspect" })],
  },
});
```

## Experimental matchers

```ts
import { expect } from "vitest";
import { agentInspectVitestMatchers } from "@agent-inspect/vitest";

expect.extend(agentInspectVitestMatchers);

expect(read).toPassTraceContract(contract);
expect(read).toHaveRequiredTool("lookup_orders");
```

There is no `expectTrace(...).toSatisfyTraceContract` helper — use the matchers above.

## Privacy

- Writes traces locally on failure only (by default)
- No default upload to AgentInspect

## API

- Default export: Vitest reporter factory
- `agentInspectVitestMatchers` — Experimental

## CLI

After failure: `npx agent-inspect report <run-id>`

## Limitations

- Matchers are **Experimental** and may evolve in minors
- Prefer CLI / TraceContract APIs for deep CI gates when matchers are insufficient

## Docs

- [CI artifacts](https://github.com/rajudandigam/agent-inspect/blob/main/docs/CI-ARTIFACTS.md)
- [TRACE-CONTRACTS.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/TRACE-CONTRACTS.md)
- [TRACE-FACTS.md](https://github.com/rajudandigam/agent-inspect/blob/main/docs/TRACE-FACTS.md)

## Troubleshooting

- **No artifact:** Ensure trace was written during test and reporter `traceDir` matches
- **Original errors preserved:** Reporter does not swallow Vitest failures

## Version

Part of the fixed AgentInspect release line. See the npm badge / package manifest for the current version.

## License

MIT
