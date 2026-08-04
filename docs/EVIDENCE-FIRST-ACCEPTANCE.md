# Evidence-first acceptance contract (v6.14)

**Status:** Engineering contract for the flagship loop. External retention gates may still block **npm 6.14.0** publication — see [implementation/reviews/V6.14.0-EXTERNAL-EVIDENCE-STOP-GATE.md](./implementation/reviews/V6.14.0-EXTERNAL-EVIDENCE-STOP-GATE.md).

## Flagship loop

```text
framework-native capture
→ faithful local tree (logicalEvents / TraceFacts)
→ TraceContract failure (deterministic)
→ Evidence v2 package in CI (evidence.html + evidence.json)
→ coding assistant reads TraceFacts over local MCP
→ fix
→ contract passes
→ broken/fixed Evidence on the PR (user-owned upload)
```

## Must be true

| Requirement | Meaning |
|-------------|---------|
| Local-first | No default network upload from AgentInspect |
| Share-safe by default for share profiles | Redaction + verify-safe before share Evidence |
| Deterministic contracts | Same TraceFacts/check engine as CLI |
| Offline Evidence | Self-contained HTML/JSON; XSS-safe escaping |
| Honest status | Assessment note is best-effort, not compliance certification |

## Explicit non-claims

- Not a compliance certification (SOC2/HIPAA/etc.)
- Not hosted APM / SaaS telemetry
- Not a guarantee that every framework graph is complete without adapters
- Anonymized fixtures ≠ design-partner attestation

## Related

- [EVIDENCE-FORMAT.md](./EVIDENCE-FORMAT.md)
- [TRACE-FACTS.md](./TRACE-FACTS.md)
- [NO-EGRESS-POLICY.md](./NO-EGRESS-POLICY.md)
- [NETWORK-BEHAVIOR.md](./NETWORK-BEHAVIOR.md)
