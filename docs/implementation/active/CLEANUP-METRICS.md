# Cleanup metrics (6.16.1-13)

Measured after archive/train/proposal deletions on `ad15054`.

| Path | Size |
|------|------|
| docs/ | 2.3M |
| .git/ | 22M |
| examples/ | 1.5M |
| .github/ | 108K |

```text
count: 2949
size: 12.82 MiB
in-pack: 11922
packs: 5
size-pack: 5.33 MiB
prune-packable: 1
garbage: 0
size-garbage: 0 bytes
```

**Conclusion:** Current-tree docs noise is substantially reduced (archive/trains/proposals removed). `.git` remains ~same order of magnitude; history rewrite is **not** warranted. Prefer ongoing tree hygiene over `git filter-repo`.
