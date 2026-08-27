# Recipe: observed-outcome-basic

## What this demonstrates

Recording **observed outcomes** with `observeOutcome()` to distinguish tool success from real-world side effects.

## How to run

```bash
pnpm build
cd examples/recipes/observed-outcome-basic
pnpm install
pnpm start
```

Inspect outcomes:

```bash
npx agent-inspect report <run-id> --dir ./.agent-inspect --section observations
npx agent-inspect check <run-id> --dir ./.agent-inspect --fail-on-observation failed
npx agent-inspect search --dir ./.agent-inspect --observation failed
```

## Expected output

See `expected-output.txt`.

For a Browser/MCP-shaped example where a successful action does not produce its expected effect, see [browser-mcp-observed-outcomes](../browser-mcp-observed-outcomes/).
