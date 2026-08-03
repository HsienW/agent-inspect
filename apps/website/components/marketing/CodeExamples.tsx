"use client";

import { useId, useState } from "react";

import { CodeBlock } from "@/components/shared/CodeBlock";

const examples = [
  {
    id: "manual",
    label: "Manual",
    language: "ts",
    code: `import { inspectRun, step } from "agent-inspect";

await inspectRun("support-agent", async () => {
  const intent = await step("classify intent", () =>
    classifyIntent(ticket)
  );

  const docs = await step.tool("search knowledge base", () =>
    searchKnowledgeBase(intent)
  );

  return step.llm("draft-model", () =>
    generateResponse(docs)
  );
});`,
  },
  {
    id: "ai-sdk",
    label: "AI SDK",
    language: "ts",
    code: `import { generateText } from "ai";
import { agentInspect } from "@agent-inspect/ai-sdk";

await generateText({
  model,
  prompt,
  experimental_telemetry: {
    isEnabled: true,
    recordInputs: false,
    recordOutputs: false,
    integrations: [
      agentInspect({
        traceDir: ".agent-inspect",
        runName: "support-agent",
        capture: "metadata-only"
      })
    ]
  }
});`,
  },
  {
    id: "cli",
    label: "CLI",
    language: "bash",
    code: `npx agent-inspect list --dir .agent-inspect
npx agent-inspect view <run-id> --dir .agent-inspect
npx agent-inspect report <run-id> --dir .agent-inspect
npx agent-inspect check <run-id> --dir .agent-inspect
npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>`,
  },
  {
    id: "mcp",
    label: "MCP",
    language: "bash",
    code: `# Dry-run client config (default — no write until you opt in)
npx agent-inspect mcp configure --client cursor

# Local read-only MCP server over your trace dir
npx @agent-inspect/mcp-server --dir .agent-inspect

# Ask your coding agent for flagship tools, e.g.:
#   get_first_causal_failure
#   get_execution_tree
#   create_share_checked_evidence`,
  },
  {
    id: "langgraph",
    label: "LangGraph kit",
    language: "bash",
    code: `# Local-debug kit (Tier A + LangChain adapter + MCP)
npm install -D agent-inspect @agent-inspect/langchain @agent-inspect/mcp-server

# Blessed starters (no API keys):
#   examples/starters/broken-agent-debugging
#   examples/starters/coding-agent-debug-loop
#   examples/starters/langchain`,
  },
] as const;

export function CodeExamples() {
  const [active, setActive] = useState<(typeof examples)[number]["id"]>("manual");
  const tablistId = useId();
  const current = examples.find((example) => example.id === active) ?? examples[0];

  return (
    <section id="code-examples" className="scroll-mt-24 border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Code
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Start from the path you already use
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            Real install lines and CLI targets—copy, run, then attach share-checked
            evidence. No collector account.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Code examples"
          id={tablistId}
          className="mt-8 flex flex-wrap gap-2"
        >
          {examples.map((example) => {
            const selected = example.id === active;
            return (
              <button
                key={example.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${example.id}-panel`}
                id={`${example.id}-tab`}
                onClick={() => setActive(example.id)}
                className={
                  selected
                    ? "rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                    : "rounded-lg border border-border bg-elevated px-3 py-2 text-sm font-medium text-muted hover:text-ink"
                }
              >
                {example.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${current.id}-panel`}
          aria-labelledby={`${current.id}-tab`}
          className="mt-4"
        >
          <CodeBlock code={current.code} language={current.language} />
        </div>
      </div>
    </section>
  );
}
