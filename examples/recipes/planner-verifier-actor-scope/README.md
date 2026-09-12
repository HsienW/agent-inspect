# Recipe: planner-verifier-actor-scope

## What this demonstrates

A planner/verifier multi-agent session where TraceContract `scope` selects the
verifier actor before requiring `run_tests`, plus structural observation
provenance for a named outcome.

## Why this matters

Session-wide tool rules cannot express “the verifier must call `run_tests`.”
Actor scope uses explicit metadata only (`subAgentId` / `workflowStep` / …) and
fails closed on zero or ambiguous matches. Provenance requirements prove
method/evidence linkage was recorded — not that the claim is semantically true.

## How to run

From the repository root:

```bash
pnpm build
cd examples/recipes/planner-verifier-actor-scope
pnpm install
pnpm start
```

## Expected output

See `expected-output.txt`.

## What to look for

- Verifier-scoped `run_tests` contract passes.
- The same tool on the planner does not satisfy the verifier-scoped rule.
- Missing actor metadata errors instead of falling back to the whole session.
- `requireProvenance` fails a fabricated passed outcome without method/evidence.

## Notes and limitations

- Synthetic in-memory traces (no network, no provider keys).
- Schema / version ownership: persisted writer path remains schema **1.0**.
- CLI `--config` still does not load TraceContract JSON; use the TypeScript API.
