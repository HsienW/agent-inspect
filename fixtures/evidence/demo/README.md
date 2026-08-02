# Evidence demo fixtures (broken / fixed)

Deterministic pair for the Evidence v2 review workflow (6.10-11).

| Fixture | Intent |
|---------|--------|
| `broken.jsonl` | Share-unsafe raw `prompt` attribute (bundle refuses without `--allow-unsafe`) |
| `fixed.jsonl` | Same shape with prompt already redacted / absent — share-safe |

```bash
# Broken — expect refusal
npx agent-inspect bundle broken --dir fixtures/evidence/demo --out /tmp/ev-broken

# Fixed — expect evidence.html + evidence.json
npx agent-inspect bundle fixed --dir fixtures/evidence/demo --out /tmp/ev-fixed
npx agent-inspect bundle verify /tmp/ev-fixed
```

No real secrets. Synthetic strings only.
