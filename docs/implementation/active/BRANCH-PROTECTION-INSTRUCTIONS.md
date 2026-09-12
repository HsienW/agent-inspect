# Branch protection instructions (`main`)

**Status:** Manual maintainer action required. Cursor must not change GitHub Settings without explicit authorization.

**Observed (2026-09-12):** `GET /repos/rajudandigam/agent-inspect/branches/main/protection` → **404 Branch not protected**.

## Recommended settings (one-maintainer-safe)

In GitHub → Settings → Branches → Add/Edit rule for `main`:

1. **Require a pull request before merging**
   - Require approvals: **0** (or 1 if a second reviewer exists); do **not** require an impossible second human approval for a solo maintainer.
   - Require conversation resolution before merging: **on**
2. **Require status checks to pass before merging**
   - Require branches to be up to date: preferred **on** when CI is stable
   - Required checks (match current workflow job names): at least CI `typecheck`, `unit`, `size`, and `dependency-review` when present
3. **Do not allow bypassing the above settings** — or retain a **bounded** admin bypass with audit (org/enterprise policy)
4. **Restrict who can push to matching branches** — maintainers only
5. **Block force pushes**
6. **Block deletions**
7. Do **not** enable merge queue unless workflows are already queue-aware

## After enabling

Record the date and screenshot/settings export under private maintainer notes (not customer traces). Update [RELEASE-TRAIN-STATE.md](../RELEASE-TRAIN-STATE.md) `pendingManualGate` when protection is confirmed.
