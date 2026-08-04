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

A dedicated `verify-safe --policy no-egress` / `doctor --policy no-egress` flag may land as an additive convenience. Until then, treat this document + NETWORK-BEHAVIOR as the contract: **AgentInspect does not open outbound product telemetry sockets**.

## Non-claims

- Does not prove the host app has no egress
- Does not replace org network controls or DLP
- Does not certify compliance frameworks

## Trial ledger

Partial trials: [adoption-evidence/NO-EGRESS-EVIDENCE-TRIAL.md](./adoption-evidence/NO-EGRESS-EVIDENCE-TRIAL.md)
