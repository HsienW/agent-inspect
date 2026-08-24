# Safe support reproduction

Use this workflow when a maintainer or support responder asks for a reproduction that preserves enough local evidence to investigate an AgentInspect issue.

The `share` profile and bundle checks reduce disclosure risk. They do not certify that a bundle is safe to publish. Review the exact bundle you intend to attach.

## When to use this

Use a support reproduction when the issue depends on a trace, execution tree, check result, or generated Evidence artifact that cannot be explained with minimal steps alone.

Do not use a public GitHub issue to share production or customer data. If the issue cannot be reproduced without that data, stop and use an approved private support or security channel.

## Prefer a synthetic or minimized reproduction

Use these sources in order of preference:

1. Synthetic data that demonstrates the same behavior.
2. A minimized reproduction containing only the failing steps.
3. A local development reproduction instead of production data.
4. A reviewed Evidence bundle instead of raw trace directories or terminal output.

Remove unrelated runs, prompts, tool calls, and metadata before creating the bundle. The existing [shareable bundle recipe](../examples/recipes/shareable-bundle-basic/README.md) demonstrates the same Evidence v2 workflow; no separate support script is required.

## Create the reproduction bundle

List local runs and identify the minimized reproduction:

```bash
npx agent-inspect list --dir .agent-inspect
```

Create a bundle with the explicit `share` profile, then verify its Evidence v2 structure and file hashes:

```bash
npx agent-inspect bundle <run-id> \
  --dir .agent-inspect \
  --profile share

npx agent-inspect bundle verify \
  .agent-inspect/bundles/<run-id>
```

Bundle creation writes a redacted derived copy and runs safety checks against that copy. It does not modify the source trace or upload the bundle. A successful `bundle verify` confirms integrity, not that every sensitive value was detected.

## Review before attaching

Manually open the generated bundle and inspect the exact files you will share. Review at least:

- `evidence.html` for rendered trace content and copied snippets.
- `summary.md` for identifiers, paths, and failure details.
- `check-results.json` for safety-check findings and unresolved results.
- `redaction-report.json` for what detectors changed or reported.

Search all included files for sensitive strings and values, not only familiar metadata keys. Remove the sensitive content, reproduce again with synthetic placeholders, rebuild the bundle, and rerun `bundle verify` after any change.

## Redaction checklist

Review for and remove:

- API keys, bearer tokens, cookies, JWTs, passwords, and private keys.
- Database URLs, internal hostnames, and private service URLs.
- Email addresses, phone numbers, and customer identifiers.
- Ticket, order, tenant, and account identifiers.
- Proprietary prompts and system instructions.
- Raw model outputs containing sensitive content.
- Retrieved private documents.
- Tool request or response payloads containing sensitive values.
- Private filesystem paths.

See [Safe trace sharing](./SAFE-TRACE-SHARING.md) for the repository's complete review guidance and limitations. Do not treat this checklist as a new privacy or security policy.

## What to attach

Attach only the reviewed reproduction bundle and the minimum environment context needed to reproduce the issue:

- AgentInspect version.
- Node.js version.
- Operating system.
- Minimal reproduction steps.
- Expected behavior.
- Actual behavior.

## What not to attach

Do not attach:

- `.env` files, API keys, or credentials.
- Raw production traces, customer logs, or unredacted original traces.
- Proprietary prompts or full sensitive tool request and response payloads.
- Database dumps or terminal history.
- Screenshots containing account, credential, or session information.
- An entire `.agent-inspect` directory that has not been reviewed.

## Retention and production-observability boundary

AgentInspect is a local, inner-loop evidence and debugging tool. It is not a hosted long-term retention or fleet-observability platform. Use dedicated observability systems alongside AgentInspect for production retention, monitoring, dashboards, and organization-wide telemetry. See [Compare AgentInspect](./COMPARE.md) for the current product boundary.

## Related guidance

- [Shareable trace bundles](./BUNDLES.md)
- [Safe trace sharing checklist](./SAFE-TRACE-SHARING.md)
- [Security policy](../SECURITY.md)
- [Evidence v2 format](./EVIDENCE-FORMAT.md)
