---
"agent-inspect": patch
"@agent-inspect/adapter-sdk": patch
"@agent-inspect/ai-sdk": patch
"@agent-inspect/circuit": patch
"@agent-inspect/eval": patch
"@agent-inspect/guardrails": patch
"@agent-inspect/harness": patch
"@agent-inspect/index-sqlite": patch
"@agent-inspect/jest": patch
"@agent-inspect/langchain": patch
"@agent-inspect/mcp": patch
"@agent-inspect/mcp-server": patch
"@agent-inspect/openai-agents": patch
"@agent-inspect/redact": patch
"@agent-inspect/studio": patch
"@agent-inspect/tui": patch
"@agent-inspect/viewer": patch
"@agent-inspect/vitest": patch
---

Security containment: enforce Studio ingest byte limits, reject symlinks, stream and atomically stage imports (bundle / file-drop / GitHub / HTTP), remediate Vitest/nanoid and website/example advisories, add the default-workflow no-egress harness (#225), lock the published API surface snapshot (#211), correct Evidence format docs (no signing; required sourceHashes), and extend free-text redaction residual coverage.
