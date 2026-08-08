# Programmatic persisted-trace analysis

**Status:** Planned for `6.15.0` (N-5)  
**Authority:** [implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md](./implementation/AGENTINSPECT-CANONICAL-ROADMAP-V6.14.1-TO-PRE-V7.md) §9.5–9.8

## Current (6.14.1)

```ts
import { openTrace, readTrace } from "agent-inspect/readers";
import { buildTraceFacts } from "agent-inspect/checks";

// Requires structured TraceInput — not a bare path string.
const read = await openTrace(/* TraceInput */);
const facts = buildTraceFacts(read.events);
```

There are no `openTraceFile` / `openTraceDirectory` / `openTraceText` helpers. `buildTraceFacts` accepts events only.

## Target (6.15.0, additive)

```ts
import {
  openTraceFile,
  openTraceDirectory,
  openTraceText,
} from "agent-inspect/readers";

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
