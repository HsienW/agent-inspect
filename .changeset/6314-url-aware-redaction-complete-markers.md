---
"agent-inspect": patch
"@agent-inspect/redact": patch
---

URL-aware redaction keeps host/path while stripping http(s) userinfo and credential query/fragment params, residual-checks export after rewrite, and treats only *complete* `[REDACTED]` / `[HASH:…]` placeholders as safe (marker prefixes cannot hide residual secrets). Postgres and other non-http URI userinfo remain tracked separately.
