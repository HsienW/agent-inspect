---
"agent-inspect": patch
"@agent-inspect/mcp": patch
"@agent-inspect/openai-agents": patch
---

Published runtime and fidelity patches for the post-6.29.1 adoption train:

- Externalize `agent-inspect` from `@agent-inspect/mcp` so packed ESM/CJS consumers share the application `inspectRun` context (#413).
- Refuse `suite init` overwrite of an existing suite config (#411 / #412).
- Recognize nested manual `attributes.metadata.arguments|input|toolArguments` in tool-argument checks (#414).
- Persist bounded safe thrown error codes from manual instrumentation (#415).
- Normalize OpenAI Agents cached tokens from `input_tokens_details.cached_tokens` (#416).
