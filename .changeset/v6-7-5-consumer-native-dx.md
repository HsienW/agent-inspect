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

Consumer and DX reliability: doctor resolves packages via entry (not package.json exports); Studio/index bump better-sqlite3 to 12.11.1 with lazy native load; LangChain omits absolute traceDir from attrs; Jest diagnoses missing trace associations; CLI output/profile aliases; NestJS/LangGraph env-gated recipe.
