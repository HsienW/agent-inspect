# Programmatic persisted-trace analysis

**Status:** In progress for `6.15.0` (N-5) — file helpers, TraceFacts/Contract conveniences, and stable `AI_*` diagnostics landed
**Authority:** [implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md) §9.5–9.9

## Current

```ts
import {
  openTrace,
  openTraceFile,
  openTraceDirectory,
  openTraceText,
  readTrace,
} from "agent-inspect/readers";
import { buildTraceFacts } from "agent-inspect/checks";

const read = await openTraceFile("./.agent-inspect/run.jsonl");
const facts = buildTraceFacts(read);
```

Bare path strings passed to `openTrace` / `readTrace` throw `TraceReadError` with code `invalid_input` and message prefix `AI_TRACE_INPUT_INVALID` (no WeakMap key errors).

## Remaining (6.15.8+)

Consumer module examples (ESM/CJS/NodeNext), cross-surface semantic parity, external pilots, docs, publish readiness.

Stable codes live in `PROGRAMMATIC_DIAGNOSTIC_SPECS` / `formatProgrammaticDiagnostic` from `agent-inspect/readers` and `agent-inspect/checks`. Lowercase `TraceReadError.code` values are unchanged.
