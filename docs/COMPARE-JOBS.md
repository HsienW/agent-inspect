# Job-based comparison

Compare tools by the job you need done—not by feature-count battles.

| Job | console.log | AgentInspect | Prompt/eval runner | Hosted observability | Raw OpenTelemetry |
| --- | --- | --- | --- | --- | --- |
| Local setup without an account | Instant | Fast (npm + local dir) | Project-dependent | Account + collector | Collector/SDK wiring |
| Framework execution tree (TS agents) | No | Yes (local JSONL trees) | Usually no | Often spans/logs | Spans if instrumented |
| Trajectory gates in CI | Manual | `check --preset trajectory` / `gate` | Eval scores ≠ path | Alerts ≠ path contracts | Custom pipelines |
| Portable Evidence artifact | Copy/paste | Evidence v2 + `bundle verify` | Reports vary | Links to hosted UI | Export depends on backend |
| Share-safety / redaction before handoff | Manual | `verify-safe` + profiles | Varies | Policy-dependent | Manual |
| Production fleet monitoring | No | Not the primary job | Not the primary job | Yes | Yes |
| Hosted collaboration | No | Optional Studio / attach CI artifacts | Often yes | Yes | Backend-dependent |

## When to choose AgentInspect

- You need a **faithful local tree** of what the agent did.
- You want CI to fail on **wrong path**, not only on wrong answers.
- You must keep traces **local by default** and redact before sharing.

## When something else is a better primary tool

- Fleet-wide production APM → hosted observability / OTel backends.
- Prompt quality scoring suites → eval runners.
- Quick printf debugging → console.log (then graduate to traces).

AgentInspect is designed to sit **beside** hosted platforms for the local/CI evidence loop—not replace every monitoring surface.
