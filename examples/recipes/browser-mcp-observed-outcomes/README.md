# Recipe: browser-mcp-observed-outcomes

## What this demonstrates

A synthetic Browser/MCP-style action can complete successfully without producing its expected effect. This recipe records the difference between execution evidence and an independently observed outcome:

1. Snapshot the page at `cart`.
2. Run a tool action that returns `status: "success"` but does not mutate the page.
3. Snapshot the page again independently.
4. Compare the observed `cart` page with the expected `checkout` page.
5. Record `checkoutTransition` as a failed observed outcome.

The recipe uses only in-memory state. It requires no browser, MCP server, network access, secrets, or screenshots.

## How to run

From the repository root:

```bash
pnpm build
pnpm --filter agent-inspect-recipe-browser-mcp-observed-outcomes start
```

Inspect the failed observed outcome:

```bash
npx agent-inspect report <run-id> --dir ./examples/recipes/browser-mcp-observed-outcomes/.agent-inspect --section observations
npx agent-inspect check <run-id> --dir ./examples/recipes/browser-mcp-observed-outcomes/.agent-inspect --fail-on-observation failed
npx agent-inspect search --dir ./examples/recipes/browser-mcp-observed-outcomes/.agent-inspect --observation failed
```

The `check` command exits nonzero because the failed observation is intentional.

## Expected output

The tool action passes and returns `success`, while the independently observed page remains `cart` and the observed outcome is `failed`. See `expected-output.txt`.
