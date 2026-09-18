# Recipe: comparable-cohort-runs

## What this demonstrates

**Pairwise / stagewise** run-comparability for cohort-style checks. Commitments are
full SHA-256 digests of the synthetic stage bytes actually used in the fixture
(tool output and next-model input). Shared cohort labels alone never imply
equivalent inputs.

## Why this matters

A deterministic checker can still read evidence from a nondeterministic agent.
Changed retrieval/tool output that feeds the next model stage is a different
boundary than a declared treatment variable.

| Class | Meaning |
| --- | --- |
| `equivalent_stage_inputs` | Same cohort/case and matching measured stage commitments |
| `changed_retrieval_boundary` | Same identity labels but tool or next-model input digest differs |
| `partial_unknown` | Missing identity or stage commitments |
| `incompatible_scope` | Different cohort/case |
| `sampling_or_model_changed` | Resolved model or sampling evidence differs |
| `declared_treatment_diff` | Stage inputs match; declared treatment differs (still comparable for that claim) |

See [RUN-COMPARABILITY.md](../../../docs/RUN-COMPARABILITY.md). Matching hashes do
**not** prove complete capture, anonymity, or deterministic model execution.
Adapters do not automatically emit these fields.

## How to run

```bash
pnpm build
cd examples/recipes/comparable-cohort-runs
pnpm install
pnpm start
```

## Expected output

See `expected-output.txt`.

## Notes and limitations

- Keyless and local only — fixture-supplied model/finish facts are synthetic.
- Ordinary `check` without this recipe is unchanged.
- Temperature zero is **not** treated as proof of determinism.
