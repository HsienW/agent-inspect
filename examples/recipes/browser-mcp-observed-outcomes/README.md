# Recipe: browser-mcp-observed-outcomes

## What this demonstrates

A synthetic Browser/MCP-style action can complete successfully without producing its expected effect. This recipe records the difference between **execution evidence** (tool return) and an **observed outcome** read through a separately injected observer boundary:

1. Construct an action surface and a separate observer with stable `resourceId`.
2. Observer snapshots the page at `cart`.
3. Run a tool action that returns `status: "success"` but does not mutate the page.
4. Observer snapshots again through the same injected boundary (not by reading the tool return).
5. Compare the observed `cart` page with the expected `checkout` page.
6. Record `checkoutTransition` as a failed observed outcome.

The recipe uses only in-memory fixture state. It requires no browser, MCP server, network access, secrets, or screenshots. It does **not** prove an external browser was consulted—only that tool success and observed effect are modeled as distinct evidence paths.

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

The tool action passes and returns `success`, while the observer still sees `cart` and the observed outcome is `failed`. See `expected-output.txt`.
