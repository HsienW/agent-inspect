# ADR-0011 — Bounded safe recovery contracts (6.27)

## Status

Accepted

## Context

After retry identity/chronology corrections (`6.25.1`) and behavioral sessions (`6.26`), teams still need a **bounded oracle** for “was this recovery path safe given the evidence we have?”—especially read-only tool retries such as `retrieve_policy`. Existing `retry` rules cover attempt identity and side-effect evidence, but not per-tool recovery shape: retryable error codes, same-arguments continuity, recovered-failure visibility, and successful-result consumption by a later LLM.

## Decision

1. **Additive API.** Extend TraceContract `retry` with optional `retry.operations[]` (see `packages/core/src/checks/recovery-operations.ts`). Each operation may declare `tool`, `maxAttempts`, `retryableErrors.codes`, `requireFailureBeforeRetry`, `requireSameArguments` (`structured-or-digest`), `requireTerminalSuccess`, `requireRecoveredFailureVisible`, and `successfulResultDependency` (`consumerKind: "LLM"` + `requireExplicitReference`). Schema remains **1.0**; no new packages.

2. **Read versus write.** Default `sideEffectClass` is `"read"`. Read recovery may pass with noSideEffect / digest-or-structured argument evidence. Write tools treat `running` / `unknown` / timeout-like completion as **unevaluable → fail** unless authoritative idempotency evidence (`idempotencyKey` or explicit no-side-effect markers) is present. Flagship recipe focuses on read-only `retrieve_policy`.

3. **Missing evidence fails closed.** Absent structured arguments and digests fails same-arguments checks. Missing explicit LLM references fails result-dependency checks when required. Findings never embed full tool payloads.

4. **Non-goals.** AgentInspect is **not** a retry engine: it does not schedule, remediates, or execute retries. Write-retry is **not** safe by default. A client `idempotencyKey` remains intent evidence, not proof of exactly-once mutation. No Temporal/workflow DSL, no schema 1.1, no network.

## Consequences

- Contracts can gate safe read recovery without claiming write exactly-once semantics.
- Capture modes without structured or digest argument evidence cannot pass `requireSameArguments`.
- See `docs/TRACE-CONTRACTS.md` and recipe `examples/recipes/bounded-read-recovery/`.
