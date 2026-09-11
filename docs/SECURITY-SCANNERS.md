# Security scanners — what they verify (and what they do not)

AgentInspect is local-first. CI and GitHub security features catch **supply-chain and dependency regressions**; they do **not** replace maintainer review of share profiles, Evidence packages, or human disclosure decisions.

For vulnerability reporting and data-handling expectations, see [SECURITY.md](../SECURITY.md).

## Synthetic fixtures

Committed fixtures under `fixtures/`, `test/consumer-fixtures/`, and related golden paths are **synthetic**. They use placeholder emails, fake tokens, and invented agent trajectories so redaction, Evidence, and reader tests stay reproducible without real customer data.

Scanners and humans should treat fixture “secrets” as intentional test material, not as leaked credentials — unless a fixture accidentally contains a real secret pattern that should not be in the repo.

## Dynamic-import boundaries

Optional integrations (LangChain, AI SDK, OpenAI Agents, viewers, MCP server, etc.) live in separate packages so the root `agent-inspect` install stays dependency-light. Runtime code often uses **dynamic `import()`** (or peer dependencies) so optional frameworks are not pulled into core.

Implications for scanners:

- Static dependency graphs of the root package may **omit** optional peer/framework trees until those packages are installed.
- A clean root `npm audit` / dependency review does **not** prove every optional adapter package is free of advisories — check the package you actually install.
- Dynamic import boundaries are intentional product design (ADR fixed-group / package tiers), not an attempt to hide dependencies from review.

## What CI / GitHub scanners verify

| Control | Where | Verifies | Does not verify |
| --- | --- | --- | --- |
| Dependency review | `.github/workflows/dependency-review.yml` | Newly introduced **high/critical** advisories on PRs | Historical debt already on `main`; runtime exploitability; Evidence share safety |
| Unit / typecheck / size CI | `.github/workflows/ci.yml` | Build, types, coverage gates, redaction/path/Evidence **unit** tests | Production agent behavior; third-party framework CVEs outside lockfile |
| Action pin check | `pnpm run actions:check` | Workflow `uses:` refs are full 40-char SHAs | Action correctness or upstream compromise of a pinned SHA |
| Dependabot | `.github/dependabot.yml` | Proposed npm and GitHub Actions updates | Automatic merge safety without human review |
| Publish gates | `.github/workflows/publish.yml` | Release-train scripts before `changeset publish` | npm Trusted Publisher configuration (manual per package) |
| Code scanning / Scorecard | GitHub Settings (see checklist) | Configured org/repo scanning products when enabled | Local-first product claims; absence of malicious intent in trace text |

## What scanners do not replace

- Reviewing **share / Evidence** packages before external disclosure
- Confirming **OIDC Trusted Publishers** on all 18 fixed-group packages
- Branch protection / rulesets that require green CI before merge
- Judging whether MCP or CLI output is **instruction-like** (trace text remains untrusted application data)

Maintainer settings for the immediate release-chain gate: [implementation/MAINTAINER-SETTINGS-CHECKLIST-6191.md](./implementation/MAINTAINER-SETTINGS-CHECKLIST-6191.md).
