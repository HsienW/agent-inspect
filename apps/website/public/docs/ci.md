# CI trace artifacts

**Docs site:** [https://agentinspect.vercel.app/docs/ci/](https://agentinspect.vercel.app/docs/ci/)

AgentInspect helps you **write and export traces locally** in CI. Uploading artifacts is done by **your CI platform** (e.g. GitHub Actions `upload-artifact`) — AgentInspect does not upload anywhere.

## Quick pattern

1. Install `agent-inspect` in CI.
2. Enable tracing with `AGENT_INSPECT=1` and `maybeInspectRun` (or `inspectRun` when always-on is intended).
3. Set `AGENT_INSPECT_TRACE_DIR` (default `.agent-inspect`).
4. Run your job/tests.
5. Create safe CI artifacts: `agent-inspect artifacts <run-id> --output-dir ./artifacts`.
6. For reporter manifests, create a local CI summary: `agent-inspect ci-summary <manifest...> --output ./artifacts/reporter-summary.md`.
7. Optional legacy exports: `agent-inspect export <run-id> --redaction-profile share`.
8. Optional inspection reports: `agent-inspect what <run-id>` and `agent-inspect report <run-id> --format html`.
9. Upload files with your CI artifact step.

## Environment variables

| Variable | Purpose |
| -------- | ------- |
| `AGENT_INSPECT=1` | Enables `maybeInspectRun` tracing |
| `AGENT_INSPECT_TRACE_DIR` | Trace output directory |
| `AGENT_INSPECT_SILENT=true` | Suppress live terminal tree in CI logs |

## Export before upload

Prefer **`--redaction-profile share`** for internal PR/issue attachments; use **`strict`** for wider sharing.

For a deterministic CI bundle with structural JSON, safe Markdown/HTML summaries, safety check output, optional baseline diff output, optional Evidence v2 package on failure, and optional GitHub step-summary output:

```bash
npx agent-inspect artifacts <run-id> --dir ./.agent-inspect \
  --output-dir ./artifacts --github-summary "$GITHUB_STEP_SUMMARY"
```

On check failure (default), this also writes Evidence v2 files matching `bundle`:

- `evidence.html`
- `evidence.json`
- `check-results.json`
- `trace.jsonl` (redacted)

Success stays quiet for evidence unless you pass `--always-evidence`. Disable with `--no-evidence`.

This command writes local files only. It does not call GitHub APIs or upload artifacts.

For Vitest/Jest reporter artifacts, summarize shared `schemaVersion: "0.1"` reporter manifests without reading trace contents:

```bash
npx agent-inspect ci-summary .agent-inspect/jest-artifacts/tests/**/report.json \
  --output ./artifacts/reporter-summary.md \
  --github-summary "$GITHUB_STEP_SUMMARY"
```

`ci-summary` writes local files only. It validates reporter artifact paths as relative paths and includes bounded structural metadata: package/framework, test status counts, trace filenames, artifact paths, redaction profile, and diagnostic counts.

```bash
npx agent-inspect export <run-id> --dir ./.agent-inspect \
  --format markdown --redaction-profile share -o ./artifacts/trace.md
```

Formats: `markdown`, `html`, `openinference`, `otlp-json` — all local files only.

## What and report (v1.5)

For quick human review in CI logs or local debugging:

```bash
npx agent-inspect what <run-id> --dir ./.agent-inspect
```

For a fuller inspection artifact (what + timeline + execution tree):

```bash
npx agent-inspect report <run-id> --dir ./.agent-inspect \
  --format html --redaction-profile share -o ./artifacts/report.html
```

Recipe: [examples/recipes/what-report-inspect](../examples/recipes/what-report-inspect/README.md)

## GitHub Actions example

Recipes:

- [examples/recipes/deterministic-ci-checks](../examples/recipes/deterministic-ci-checks/README.md) for v1.8 `check`, baseline, safe artifact, and step-summary workflows.
- [examples/recipes/github-actions-artifact](../examples/recipes/github-actions-artifact/README.md) for share-safe trace exports and reporter manifest summaries.
- [examples/recipes/github-actions-gate](../examples/recipes/github-actions-gate/README.md) for a retained broken-to-fixed suite/gate pilot with separate Evidence v2 artifacts.

Sample workflows: [deterministic checks workflow](../examples/recipes/deterministic-ci-checks/workflow-example.yml), [share-safe export workflow](../examples/recipes/github-actions-artifact/workflow-example.yml), [retained gate workflow](../examples/recipes/github-actions-gate/workflow-example.yml)

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: agent-inspect-traces
    path: |
      ./.agent-inspect
      ./artifacts
```

## Trajectory gate + Evidence on failure (recommended)

```bash
npx agent-inspect check --dir .agent-inspect --preset trajectory \
  --evidence-on fail --evidence-profile share --evidence-format directory
npx agent-inspect verify-safe . --dir .agent-inspect
```

`init --ci github` scaffolds this pattern. Evidence stays local; upload with your CI provider’s artifact action.

## GitLab CI / generic CI

Same local commands work outside GitHub. Example GitLab job fragment:

```yaml
trajectory_gate:
  image: node:22
  script:
    - npm ci
    - node examples/agent-inspect-demo.mjs
    - npx --yes agent-inspect check --dir .agent-inspect --preset trajectory --evidence-on fail
    - npx --yes agent-inspect verify-safe . --dir .agent-inspect
  artifacts:
    when: always
    paths:
      - .agent-inspect/
  # No provider API keys required for the deterministic fixture.
```

AgentInspect performs no network upload; CI platforms attach local paths only.

## Inspect artifacts locally after download

```bash
npx agent-inspect list --dir ./.agent-inspect
npx agent-inspect view <run-id> --dir ./.agent-inspect
npx agent-inspect what <run-id> --dir ./.agent-inspect
npx agent-inspect report <run-id> --dir ./.agent-inspect --format markdown
npx agent-inspect timeline <run-id> --dir ./.agent-inspect
npx agent-inspect stats --dir ./.agent-inspect
npx agent-inspect search --dir ./.agent-inspect --status error
```

## Safety checklist

- Review exports — redaction profiles are key-based, not compliance-grade DLP.
- Do not commit trace directories or artifacts with secrets.
- AgentInspect does not replace production observability platforms.

See [SAFE-TRACE-SHARING.md](./SAFE-TRACE-SHARING.md).
