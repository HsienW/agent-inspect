# Recipe: bounded-read-recovery

## What this demonstrates

AgentInspect **6.27** TraceContract `retry.operations[]` for a **read-only**
`retrieve_policy` recovery oracle: same arguments (structured or digest),
retryable error codes, recovered-failure visibility, and an LLM that explicitly
references the successful tool result.

## Paths

| Path | Expected |
| --- | --- |
| `normal` | PASS — single success + LLM reference |
| `valid-recovery` | PASS — TRANSIENT error → success, same args, failure visible |
| `unsafe-same-output` | FAIL — retry after success (no prior failure) |
| `missing-evidence` | FAIL — recovery without structured/digest arguments |

## How to run

```bash
pnpm build
pnpm --filter agent-inspect-recipe-bounded-read-recovery start
```

## Notes

- Synthetic fixtures only; no network.
- Schema remains **1.0**.
- Write-tool timeout/unknown completion is unevaluable without idempotency evidence
  (covered in unit tests; this recipe focuses on read recovery).
- See [ADR-0011](../../../docs/decisions/ADR-0011-bounded-safe-recovery.md).
