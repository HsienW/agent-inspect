# Sessions and observed outcomes

## Sessions

Workflow sessions group related runs (retries, handoffs, multi-agent activity) using **explicit metadata** — AgentInspect does not invent causal links from timestamps alone.

Useful CLI entry points: `sessions`, `search`, activity views (see [CLI.md](./CLI.md)).

Attempt identity for contracts (6.22+): `operationId`, `attemptId`, `attemptNumber`, `retryOf`, `fallbackOf`, `idempotencyKey`. Retry safety evaluation prefers this identity over “saw a prior ok” (see [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md), corrected in 6.25.1).

## Observed outcomes

Outcomes record what the agent produced or decided at a high level for later review and gates. They remain local JSONL-derived evidence.

**Dual-axis reminder:** tool/run **execution status** (`ok` / `error`) is independent of behavioral **outcome** (`passed` / `failed` / `unknown`). A graceful tool rejection can be `status: "error"` while the expected behavioral outcome is `passed`. Expanding this for MCP behavioral sessions is the focus of **6.26.0** (#362).

## Limitations

- Session indexing is not a full workflow contract engine
- Handoff / approval TraceContract rules are not fully wired — see [TRACE-CONTRACTS.md](./TRACE-CONTRACTS.md)
- Studio session pages may still be thinner than APIs — Studio is Beta
- AgentInspect does not execute retries or mutate source sessions

Related: [WORKSPACE.md](./WORKSPACE.md) · [USE-CASES.md](./USE-CASES.md)
