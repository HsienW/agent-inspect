# MCP behavioral-session (dual-axis outcomes)

Synthetic recipe for AgentInspect **6.26.0** / issue **#362**.

## Lesson

MCP `isError: true` (graceful rejection) must remain TOOL `status: "error"`.
Score expected behavior with OUTCOME `outcomeStatus` (`passed` / `failed` / `unknown`).
Do not rewrite execution history to make a behavioral test pass.

## Run

```bash
pnpm --filter agent-inspect-recipe-mcp-behavioral-session start
```

Expected:

```text
healthy PASS
unexpected-accept FAIL
```

## CLI preset

```bash
npx agent-inspect check <run> --preset behavioral-session --json
```

Requires completed harness + outcome scoring (`--fail-on-observation failed` by default for this preset).

## External fixtures

Contributor gists are **not** committed here until sanitized. Closing #362 with external-fixture claims remains `BLOCKED_ON_EXTERNAL_FIXTURE` until a privacy-safe artifact is reviewed.
