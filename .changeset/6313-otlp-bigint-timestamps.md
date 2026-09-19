---
"agent-inspect": patch
---

OTLP JSON export uses BigInt nanosecond timestamps (parity with OpenInference) so realistic epoch times keep exact precision beyond Number.MAX_SAFE_INTEGER.
