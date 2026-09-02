# No-egress policy (AgentInspect surfaces)

**Scope:** AgentInspect configuration, CLI, MCP stdio server, Evidence packages, and reporters **only**. This is **not** an application-wide compliance or zero-trust certification.

## Policy intent

When operators run AgentInspect in a **no-egress** environment:

1. AgentInspect performs **no default network I/O**.
2. Local MCP uses **stdio** only (no remote MCP transport as a built-in default).
3. Exporters write **local files/strings** only — no automatic upload.
4. Evidence / bundle / verify-safe operate on **local paths**.
5. Framework adapters stay **metadata-first** where documented; raw prompt/output capture is not the default.

## Operator checklist

| Check | How |
|-------|-----|
| No registry publish from agent process | Do not call `npm publish` from agent hooks |
| MCP local | `agent-inspect mcp` / `@agent-inspect/mcp-server` stdio |
| Evidence offline | `bundle` / CI artifacts → user-owned `actions/upload-artifact` if needed |
| Redaction for share | `--profile share` / `strict` before external attachment |
| Doctor / network docs | See [NETWORK-BEHAVIOR.md](./NETWORK-BEHAVIOR.md) |

## CLI note

Treat this document + [NETWORK-BEHAVIOR.md](./NETWORK-BEHAVIOR.md) as the contract: **AgentInspect does not open outbound product telemetry sockets** by default. Dedicated `--policy no-egress` flags are optional future convenience — absence of the flag does not weaken the default no-egress product behavior.

## Non-claims

- Does not prove the host app has no egress
- Does not replace org network controls or DLP
- Does not certify compliance frameworks

## Trial ledger

Partial trials: [adoption-evidence/NO-EGRESS-EVIDENCE-TRIAL.md](./adoption-evidence/NO-EGRESS-EVIDENCE-TRIAL.md)

## Regression harness (#225)

Maintainer-owned default-workflow harness:

- Guard: [`scripts/lib/no-egress-guard.mjs`](../scripts/lib/no-egress-guard.mjs)
- Test: [`packages/core/test/no-egress-default-workflows.test.ts`](../packages/core/test/no-egress-default-workflows.test.ts)

```bash
pnpm exec vitest run packages/core/test/no-egress-default-workflows.test.ts
```

### Intentional exceptions (default workflows)

**None.** The harness denies `fetch`, `http(s).request/get`, and `net.connect/createConnection`. Any attempt fails the test.

Explicit opt-in surfaces (Studio GitHub import, Studio HTTP ingest, MCP client to operator-owned servers, standards collector export) are documented in [NETWORK-BEHAVIOR.md](./NETWORK-BEHAVIOR.md) and are **not** covered by this default-workflow harness.
