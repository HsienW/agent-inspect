---
"agent-inspect": patch
"@agent-inspect/langchain": patch
"@agent-inspect/tui": patch
"@agent-inspect/ai-sdk": patch
"@agent-inspect/openai-agents": patch
"@agent-inspect/redact": patch
"@agent-inspect/guardrails": patch
"@agent-inspect/circuit": patch
"@agent-inspect/eval": patch
"@agent-inspect/vitest": patch
"@agent-inspect/jest": patch
"@agent-inspect/mcp": patch
"@agent-inspect/viewer": patch
"@agent-inspect/mcp-server": patch
"@agent-inspect/adapter-sdk": patch
"@agent-inspect/harness": patch
"@agent-inspect/index-sqlite": patch
"@agent-inspect/studio": patch
---

Fix retry fail-open on error→success (identity-based retry classification, chronological fallback/recovery rules) and preflight the omitted-payload 1 MiB bound before copying oversized inputs.
