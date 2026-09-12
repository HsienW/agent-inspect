# ADR-0010 — Structured control contracts (6.23)

## Status

Accepted

## Context

After ordering modes (`6.20`), actor scope / provenance (`6.21`), and attempt identity (`6.22`), TraceContract needs bounded assertions over tool inputs, declared-versus-enforced controls, mixed per-rule ordering, and retry/side-effect safety—without arbitrary code execution or privacy leakage.

## Decision

1. **Tool-input checks** use RFC 6901 JSON Pointer plus operators `exists` | `type` | `equals` | `oneOf`, with occurrence `first` | `last` | `any` | `all`. Missing structured evidence fails closed (`AI_CHECK_TOOL_ARGUMENT_EVIDENCE_UNAVAILABLE`). Findings never embed full actual inputs. Preview-only strings are not structured evidence.

2. **Mixed ordering** adds additive `tools.orderRules` beside `requiredOrder` / `requiredOrderMode`. Endpoints imply presence unless `requireEndpoints: false`. Unique rule ids; duplicate pairs lint as warnings. No removal of legacy APIs in 6.x.

3. **Declared versus enforced** is a distinct `controls` section. Declared and enforced tool sets remain separate facts; stage observations default to `control.<stage>`.

4. **Retry / side-effect safety** is a distinct `retry` section that evaluates explicit attempt metadata (`operationId`, `attemptId`, `idempotencyKey`, …). AgentInspect never performs retries.

## Consequences

- Capture paths that only store previews/digests cannot pass structured argument checks.
- Metadata-only remains the default capture posture.
- See `docs/TRACE-CONTRACTS.md` for the capability matrix and API examples.
