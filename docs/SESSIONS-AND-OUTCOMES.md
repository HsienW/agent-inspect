# Sessions and observed outcomes

## Sessions

Workflow sessions group related runs (retries, handoffs, multi-agent activity) using **explicit metadata** — AgentInspect does not invent causal links from timestamps alone.

Useful CLI entry points: `sessions`, `search`, activity views (see [CLI.md](./CLI.md)).

Attempt identity for contracts (6.22+): `operationId`, `attemptId`, `attemptNumber`, `retryOf`, `fallbackOf`, `idempotencyKey`. Retry safety evaluation prefers this identity over “saw a prior ok” (see [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md), corrected in 6.25.1).

## Observed outcomes (dual-axis)

Outcomes record what the agent produced or decided at a high level for later review and gates. They remain local JSONL-derived evidence.

| Axis | Where | Values | Meaning |
| --- | --- | --- | --- |
| Execution | TOOL / RUN `status` | `ok` / `error` / … | What happened at runtime (MCP `isError` stays `error`) |
| Behavior | OUTCOME `outcomeStatus` | `passed` / `failed` / `unknown` / `skipped` | Whether the result matched the test expectation |

A graceful tool rejection can be TOOL `status: "error"` while the expected behavioral OUTCOME is `passed`. Do **not** rewrite tool errors to `ok` to make a gate green.

### CLI (6.26)

```bash
npx agent-inspect check <run> --preset behavioral-session --json
```

Preset selects harness completion + `outcome.status` and defaults `--fail-on-observation failed`. Recipe: [examples/recipes/mcp-behavioral-session](../examples/recipes/mcp-behavioral-session/).

Issue **#362**: external sanitized fixtures remain `BLOCKED_ON_EXTERNAL_FIXTURE` until reviewed; the synthetic recipe ships first.

## Limitations

- Session indexing is not a full workflow contract engine
- Handoff / approval TraceContract rules are not fully wired — see [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md)
- Studio session pages may still be thinner than APIs — Studio is Beta
- AgentInspect does not execute retries or mutate source sessions

Related: [WORKSPACE.md](./WORKSPACE.md) · [USE-CASES.md](./USE-CASES.md) · [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md)
