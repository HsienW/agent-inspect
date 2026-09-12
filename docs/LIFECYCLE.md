# Lifecycle: flush and close

**Support level:** Stable guidance  

AgentInspect writers buffer locally. Call `flush()` / `close()` (or rely on
`inspectRun` completion) so traces land on disk before the process exits.

## Runtime matrix

| Runtime | When to flush/close | Notes |
| --- | --- | --- |
| Long-running Node service | After each request/job unit, or on idle | Prefer per-unit `inspectRun`; process-level `close` on shutdown |
| CLI / one-shot job | End of `main` before `process.exit` | `inspectRun` awaits flush on success/error paths |
| Vitest / Jest | In `afterEach` / `afterAll`, or wrap each test in `inspectRun` | Avoid open handles that keep workers alive |
| Next.js / Vercel route | End of request handler (await) | See `examples/recipes/ai-sdk-next-route/` |
| Serverless / edge | Await flush before returning the response | Edge may lack full filesystem; use supported Node runtimes |
| Signals (`SIGTERM` / `SIGINT`) | Register once; await idempotent `close()` | Bounded timeout; do not block forever |

## Rules

- `flush()` and `close()` are **idempotent** and must not throw into application control flow when instrumentation fails.
- Instrumentation errors are isolated; application return values and thrown errors stay authoritative.
- AgentInspect is **not** an event-sourced durability store: crash mid-write can lose buffered events. See [LIMITATIONS.md](./LIMITATIONS.md).
- No default network egress during flush/close.

## Minimal pattern

```ts
import { inspectRun, createInspector } from "agent-inspect";

await inspectRun("job", async () => {
  // work
});

// Or explicit inspector lifecycle:
const inspector = createInspector({ traceDir: ".agent-inspect" });
try {
  // work with inspector
} finally {
  await inspector.close();
}
```

## Related

- [ADOPTION.md](./ADOPTION.md) — framework-first setup order
- [INSTALL-KITS.md](./INSTALL-KITS.md) — Core / Framework / CI·Evidence kits
- [CLI.md](./CLI.md) — `init`, `doctor`, `gate`
- [API.md](./API.md) — writer surfaces
