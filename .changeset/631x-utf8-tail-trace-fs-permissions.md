---
"agent-inspect": patch
---

Preserve multibyte UTF-8 across `tail --file` polling reads, and request restrictive POSIX creation modes (`0700` directories / `0600` JSONL) for new built-in raw traces with a `doctor` confidentiality warning. Existing paths are not rewritten.
