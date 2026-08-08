# Programmatic persisted-trace analysis

**Status:** In progress for `6.15.0` (N-5) — file helpers, TraceFacts/Contract conveniences, and stable `AI_*` diagnostics landed
**Authority:** [implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md) §9.5–9.9

## Current

### ESM

```ts
import { openTraceFile } from "agent-inspect/readers";
import {
  buildTraceFacts,
  defineTraceContract,
  evaluateTraceContractRead,
} from "agent-inspect/checks";

const read = await openTraceFile("./.agent-inspect/run.jsonl");
const facts = buildTraceFacts(read);
const result = evaluateTraceContractRead(
  read,
  defineTraceContract({
    run: { requireCompleted: true },
    tools: { required: ["get_navan_rewards"] },
  }),
);
```

### CommonJS

```js
const { openTraceFile } = require("agent-inspect/readers");
const {
  buildTraceFacts,
  defineTraceContract,
  evaluateTraceContractRead,
} = require("agent-inspect/checks");
```

Runnable copies: `examples/programmatic-trace-analysis/quickstart.mjs` and `quickstart.cjs`.

## Remaining (6.15.8+)

Consumer module examples (ESM/CJS/NodeNext), cross-surface semantic parity, external pilots, docs, publish readiness.

Stable codes live in `PROGRAMMATIC_DIAGNOSTIC_SPECS` / `formatProgrammaticDiagnostic` from `agent-inspect/readers` and `agent-inspect/checks`. Lowercase `TraceReadError.code` values are unchanged.
