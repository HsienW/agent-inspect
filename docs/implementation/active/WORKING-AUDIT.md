# Working audit — 6.16.1 repository disposition

**Status:** placeholder created at program activation; filled by chunk `6.16.1-0`.

## Size baselines (to capture in 6.16.1-0)

```text
current tracked-tree bytes
docs/ examples/ assets bytes
.git size
git count-objects -vH
largest current files
```

## Disposition categories

| Category | Keep | Compact history/ADR | Delete |
|----------|------|---------------------|--------|
| Version-named roadmaps | permanent `ROADMAP.md` only | ROADMAP-HISTORY | all version-named seeds |
| release-trains/ | none (use `active/`) | RELEASE-HISTORY | completed plans/readiness |
| docs/archive/ | none | brief notes in history | entire tree |
| ISSUE_DRAFTS/ | none | — | entire tree |
| .DS_Store | none | — | all tracked |
| docs/proposals/ | none after ADR | ADRs + DECISION-HISTORY | shipped proposals |
| Agent handoffs | AGENTS.md + skills | — | duplicate guides/prompts |

## Inventory

_Filled in chunk 6.16.1-0._
