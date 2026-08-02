# Safety policy (local share checks)

**Status:** experimental contract for AgentInspect **6.9+**  
**Authority:** Stability and Focus roadmap §10 · [V6.9.0-EXECUTION-PLAN.md](./implementation/release-trains/V6.9.0-EXECUTION-PLAN.md)

AgentInspect provides a **best-effort share check** that verifies a local artifact against a **configured local policy**. It is **not** a compliance, privacy, security, or regulatory certification.

## Language

Use:

| Preferred | Avoid |
|-----------|--------|
| best-effort share check | certified safe |
| verified against the configured local policy | compliant / audit certified |
| redacted artifact | guaranteed PII-free |

## Two assessments

```text
source trace  →  sourceAssessment   (informational / debugging)
     ↓ redact
redacted artifact  →  artifactAssessment  (gates share-safe bundle output)
```

Only the **artifact** assessment controls whether a share-oriented bundle may be written. Source findings must not refuse a bundle when redaction successfully removes blocking content from the artifact.

## Profiles

**Redaction profiles** (data transform): `local` · `share` · `strict`

**Verification policies** (finding severity / gate): `development` · `share` · `strict`

Do not overload redaction and verification in docs or UX.

## Finding model (additive; 6.9-1+)

```ts
interface SafetyFinding {
  category:
    | "credential"
    | "personal-data"
    | "identifier"
    | "raw-content"
    | "path"
    | "size"
    | "structure";
  confidence: "high" | "medium" | "low";
  detector: string;
  path: string;
  action: string;
  severity: "error" | "warning" | "info";
}
```

Policy defaults (product decision for this train):

| Confidence × category | Default severity |
|----------------------|------------------|
| high credential | error |
| high personal-data (share/strict) | error |
| medium identifier | warning |
| low heuristic | info |
| oversized (by limit) | warning or error per policy |
| reader failure | status `UNKNOWN`, fail closed |

Never emit the matched secret/PII value in CLI/MCP/Studio output.

## Precision principles (6.9-2+)

- Prefer **semantic paths** over bare key names (e.g. `tokenUsage.input` is not a prompt).
- Credit-card candidates require digit length, Luhn, boundaries, and must not be UUID / trace IDs / counts / timestamps.
- Email detection must not treat `@` in paths, scoped packages, or source maps as addresses.
- UUIDs are **identifiers**, not financial data.
- Framework keys such as `currentTask`, `userInput`, `requestText` are raw-content / PII-risk, not generic metadata.

## False-positive corpus

Canonical synthetic cases live under [`fixtures/safety/`](../fixtures/safety/). Expected outcomes are per verification policy (`local`/`development`, `share`, `strict`). Corpus fixtures are synthetic only—no production customer data.

## Network and privacy

- No network I/O in scan / verify-safe / redact / bundle safety paths.
- Defaults must not weaken existing redaction.
- Overrides require explicit local configuration (documented in 6.9-8).

## Related

- Repair policy: [V6.9.X-SAFETY-REPAIR-POLICY.md](./implementation/release-trains/V6.9.X-SAFETY-REPAIR-POLICY.md)
- CLI: `agent-inspect scan` · `verify-safe` · `redact` · `bundle`
- Package: `@agent-inspect/redact`
