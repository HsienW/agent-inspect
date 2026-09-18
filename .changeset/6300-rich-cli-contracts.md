---
"agent-inspect": minor
---

Strict CLI TraceContract JSON for `agent-inspect check --config`:

- Top-level `contract` evaluates through `defineTraceContract` / `evaluateTraceContract`.
- Strict nested validation for run/tools/llm/observations/scope/alternatives/controls/retry (unknown keys fail closed).
- Mutually exclusive with an effective top-level `checks` block.
- `--evidence-on` binds the resolved contract (`contract.resolved.json` + check-results digests).
