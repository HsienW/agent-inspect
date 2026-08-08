# Programmatic persisted-trace analysis

**Status:** In progress for `6.15.0` (N-5) — file helpers + `buildTraceFacts(TraceReadResult)` landed
**Authority:** [implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md) §9.5–9.8

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

## Remaining (6.15.5+)

```ts
import {
  buildTraceFacts,
  defineTraceContract,
  evaluateTraceContractRead,
} from "agent-inspect/checks";

const read = await openTraceFile("./.agent-inspect/run.jsonl");
const facts = buildTraceFacts(read);

const contract = defineTraceContract({
  run: { requireCompleted: true },
  tools: { required: ["get_navan_rewards"] },
});

const result = evaluateTraceContractRead(read, contract);
```

Existing `openTrace` / `readTrace` / events-based `buildTraceFacts` remain. New diagnostics must be additive; published lowercase reader codes stay.
