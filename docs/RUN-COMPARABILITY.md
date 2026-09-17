# Run comparability (guidance)

AgentInspect trajectory checks are deterministic **given the evidence they receive**. That does not mean two agent runs are automatically comparable. A changed path may reflect nondeterministic tools, sampling, prompt drift, or missing capture—not only an application regression.

Ordinary `check` / TraceContract evaluation does **not** fail when comparability provenance is absent.

## Classification

| Class | Meaning |
| --- | --- |
| `comparable` | Enough shared identity and commitments to interpret path differences as meaningful |
| `partially comparable` | Shared cohort/test case, but missing prompt/tools/model commitments |
| `not comparable` | Identity conflicts or insufficient linkage |
| `unknown` | No comparability metadata |

## Optional provenance fields

Attach as run or step metadata when you need honest before/after interpretation:

- `cohortId`, `testCaseId`, `attempt`
- `promptTemplateVersion` (or a content hash commitment)
- per-LLM-step **input commitment** (hash; prefer not to store raw prompts)
- upstream **tool-output commitment** (hash)
- `availableToolsCommitment`
- `requestedModel` / `resolvedModel`
- SDK/framework version
- sampling parameters (temperature, top_p, …)
- system fingerprint / finish reason when the provider exposes them
- contract digest
- outcome evaluator method/version

## Privacy

- Hashes show equality, not content.
- Low-entropy values may still be guessed.
- Caller-owned HMAC is allowed; AgentInspect does not manage keys.
- Cohort labels alone are insufficient.
- Temperature `0` is not proof of determinism.
- A digest does not prove complete capture.

## Retry and transport identity

Do not infer retries by matching tool names across steps. Prefer explicit:

- `operationId`, `attemptId`, `attemptNumber`, `retryOf`
- HTTP status, server-advertised delay, selected delay, delay source

The MCP client wrapper records each call as a separate operation unless the application supplies that identity. AgentInspect **evaluates** retry evidence; it does not execute retries.

See recipe `examples/recipes/comparable-cohort-runs/` and `examples/recipes/mcp-transport-retry-429/`.

## Future profile

A machine-readable comparable-run profile remains gated for `6.30.0` and requires external validation before it can become a default gate.
