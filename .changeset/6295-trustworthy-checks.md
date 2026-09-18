---
"agent-inspect": patch
"@agent-inspect/circuit": patch
---

Trustworthy existing checks for 6.29.5:

- Validate `structure.minConfidence` against the canonical AttributionConfidence vocabulary (`unknown` | `heuristic` | `correlated` | `explicit`); reject obsolete values with exit 2.
- Fail closed on uncertain write completion: client idempotency keys / producer flags are not write-completion proof (ADR-0011).
- Circuit rules use logical-event projection, case-insensitive TOOL/LLM kind, and `--run` scoping so other runs cannot inflate counts.
- Selected `--circuit` / `--guardrails` rules appear in `ruleExecutions` / `rulesEvaluated`; unknown extension rule names fail closed instead of silent green.
