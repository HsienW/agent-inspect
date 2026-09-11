# Maintainer settings checklist — immediate gate → 6.19.1

Operational checklist after landing the release-chain security gate. Complete these **GitHub / npm Settings** items before treating Trusted Publishing as routine again. Code workflows alone are not enough.

**Related:** [SECURITY-SCANNERS.md](../SECURITY-SCANNERS.md) · [community/MAINTAINER-GUIDE.md](../community/MAINTAINER-GUIDE.md) · workflows `version-packages.yml` + `publish.yml`

## 1. Branch ruleset on `main`

In **GitHub → Settings → Rules → Rulesets** (or classic branch protection):

- [ ] Ruleset applies to `main` (or `refs/heads/main`)
- [ ] Require a pull request before merging
- [ ] Require status checks to pass (at minimum the **CI** workflow jobs used on PRs)
- [ ] Do not allow bypass for routine contributor tokens (admins: document any emergency bypass)
- [ ] Block force pushes to `main`
- [ ] Prefer disallowing deletion of `main`

## 2. OIDC Trusted Publishers (18 fixed-group packages)

On **npmjs.com**, for **each** package below: **Package → Settings → Trusted Publisher → GitHub Actions**

| Field | Value |
| --- | --- |
| Organization or user | `rajudandigam` |
| Repository | `agent-inspect` |
| Workflow filename | `publish.yml` (must match `.github/workflows/publish.yml`) |

Packages (Changesets fixed group):

- [ ] `agent-inspect`
- [ ] `@agent-inspect/adapter-sdk`
- [ ] `@agent-inspect/ai-sdk`
- [ ] `@agent-inspect/circuit`
- [ ] `@agent-inspect/eval`
- [ ] `@agent-inspect/guardrails`
- [ ] `@agent-inspect/harness`
- [ ] `@agent-inspect/index-sqlite`
- [ ] `@agent-inspect/jest`
- [ ] `@agent-inspect/langchain`
- [ ] `@agent-inspect/mcp`
- [ ] `@agent-inspect/mcp-server`
- [ ] `@agent-inspect/openai-agents`
- [ ] `@agent-inspect/redact`
- [ ] `@agent-inspect/studio`
- [ ] `@agent-inspect/tui`
- [ ] `@agent-inspect/viewer`
- [ ] `@agent-inspect/vitest`

**Symptom of a missing publisher:** scoped package `E404` on `PUT` while others succeed.

## 3. Remove routine `NPM_TOKEN`

- [ ] Confirm `publish.yml` does **not** pass `NPM_TOKEN` on the normal OIDC path
- [ ] Delete or rotate the repo secret `NPM_TOKEN` if it exists and is unused
- [ ] Document break-glass only: temporarily set `NPM_TOKEN`, re-run **Publish**, then remove the secret (see comments in `publish.yml`)

Version Packages PRs use `version-packages.yml` with `GITHUB_TOKEN` only — **no** `id-token`, **no** `NPM_TOKEN`.

## 4. Code scanning / Scorecard verification

- [ ] Confirm **Code scanning** / CodeQL (or equivalent) is enabled if the org expects it; note last successful run
- [ ] Confirm **OpenSSF Scorecard** (or Dependency review + pin checks) is present and green enough for the adoption gate
- [ ] Confirm **Dependency review** workflow runs on PRs (`.github/workflows/dependency-review.yml`)
- [ ] Confirm `pnpm run actions:check` is wired into `docs:check` / `repo:health` consumers so mutable `uses: …@vN` cannot land unnoticed

## 5. Post-merge smoke

After the gate PR merges to `main`:

- [ ] Open a no-op or real changeset → `version-packages.yml` opens/updates Version Packages PR
- [ ] After Version Packages merge, `publish.yml` runs only on that merge (or `workflow_dispatch`)
- [ ] Ordinary docs/code pushes to `main` do **not** publish

## Adoption order

1. Land this checklist’s Settings items (or explicitly defer with owner sign-off)
2. Ship **6.19.1** reserved corrections / docs as needed
3. Only then authorize **6.20.0** feature implementation
