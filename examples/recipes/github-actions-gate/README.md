# Recipe: github-actions-gate

## What this demonstrates

A retained `broken -> fixed` CI pilot over synthetic traces:

1. `agent-inspect gate` runs a local suite against a broken refund-agent trace and exits 1.
2. The same gate runs against the fixed trace and exits 0.
3. Both runs write CI reports and local Evidence v2 directories that a user-owned GitHub Actions workflow retains separately.

The CLI `suite`/`gate` path is the copy-paste CI workflow. The optional programmatic path uses the existing experimental `TraceContract` API without changing its public surface.

## How to run

From the repository root:

```bash
pnpm build
pnpm --filter agent-inspect-recipe-github-actions-gate start
pnpm --filter agent-inspect-recipe-github-actions-gate check:contract
```

`start` treats exit 1 from the broken suite as expected, requires exit 0 from the fixed suite, and checks that both retained output trees contain gate reports and Evidence v2 files. See `expected-output.txt`.

The two suite configs use only published CLI fields and the script imports only the public `agent-inspect/checks` and `agent-inspect/readers` subpaths. In this monorepo the dependency resolves through the workspace package; `pnpm pack:smoke` separately verifies the packed public package path used by external consumers on AgentInspect 6.17.1 and later.

## Copy-paste gate commands

Run these from this recipe directory after `pnpm build` at the repository root. The first command is intentionally non-zero:

```bash
npx agent-inspect gate \
  --suite agent-inspect.broken.suite.json \
  --dir ../../../fixtures/traces \
  --output .agent-inspect/broken/gate-artifacts \
  --format github \
  --evidence-on fail \
  --evidence-dir .agent-inspect/broken/evidence \
  --evidence-profile share
```

After the trajectory is fixed, rerun the same policy against the fixed fixture:

```bash
npx agent-inspect gate \
  --suite agent-inspect.fixed.suite.json \
  --dir ../../../fixtures/traces \
  --output .agent-inspect/fixed/gate-artifacts \
  --format github \
  --evidence-on always \
  --evidence-dir .agent-inspect/fixed/evidence \
  --evidence-profile share
```

## What retained means

Keep these for a bounded CI retention window:

- `gate-artifacts/`: deterministic JSON, Markdown, HTML, JUnit, and GitHub step-summary reports.
- `evidence/`: the Evidence v2 manifest, check results, report, and share-redacted trace copy.
- Separate broken and fixed artifacts so reviewers can compare the failure with the repaired trajectory.

Do not commit generated `.agent-inspect/` output. Do not upload raw production traces, credentials, provider payloads, or unreviewed artifacts. This recipe uses repository-owned synthetic fixtures with no secrets or production data. For real traces, review the exact redacted output before upload; use `share` for controlled PR or issue attachments and `strict` for wider sharing. Redaction is a key-based safeguard, not compliance-grade DLP.

See [Evidence retention](../../../docs/EVIDENCE-RETENTION.md) and [Safe trace sharing](../../../docs/SAFE-TRACE-SHARING.md).

## GitHub Actions

`workflow-example.yml` is deliberately scoped to `workflow_dispatch`. Its broken job asserts that the gate really failed before uploading `agent-inspect-gate-broken`; the fixed job must pass before uploading `agent-inspect-gate-fixed`. Each artifact has an explicit 14-day retention window. AgentInspect writes local files only; `actions/upload-artifact` is the user-owned network step.

After downloading an Evidence v2 directory, verify it locally:

```bash
npx agent-inspect bundle verify ./path/to/evidence
```

## Boundaries

- Reads existing synthetic traces only; no agent replay, provider SDK, hosted runner, telemetry, or AgentInspect network I/O.
- Does not add CLI behavior or broaden the experimental TraceContract public API.
- Artifact upload and retention remain owned by the CI configuration.

## See also

- [CI artifacts](../../../docs/CI-ARTIFACTS.md)
- [Evidence format](../../../docs/EVIDENCE-FORMAT.md)
- [Evidence bundles](../../../docs/BUNDLES.md)
- [Safety policy](../../../docs/SAFETY-POLICY.md)
