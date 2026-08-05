export type DocTocItem = {
  id: string;
  title: string;
};

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  section: string;
  toc?: DocTocItem[];
  previous?: string;
  next?: string;
};

export const docPages: DocPage[] = [
  {
    slug: "",
    title: "Documentation",
    description:
      "Local-first docs for tracing, checking, and redacting TypeScript AI agent runs.",
    section: "Start",
    toc: [
      { id: "start-here", title: "Start here" },
      { id: "browse", title: "Browse by topic" },
    ],
    next: "getting-started",
  },
  {
    slug: "getting-started",
    title: "Getting started",
    description:
      "Install AgentInspect, run the deterministic demo, inspect a trace, check it, and create a share-safe artifact.",
    section: "Start",
    toc: [
      { id: "install", title: "Install" },
      { id: "init", title: "Init" },
      { id: "demo", title: "Run demo" },
      { id: "inspect", title: "Inspect" },
      { id: "check", title: "Check" },
      { id: "share", title: "Redact and verify" },
      { id: "next-steps", title: "Next steps" },
    ],
    previous: "",
    next: "concepts/local-first",
  },
  {
    slug: "concepts/local-first",
    title: "Local-first",
    description:
      "Traces stay on disk by default. No account, no upload, and no hosted dashboard required.",
    section: "Concepts",
    toc: [
      { id: "what-local-first-means", title: "What local-first means" },
      { id: "jsonl-on-disk", title: "JSONL on disk" },
      { id: "where-it-fits", title: "Where it fits" },
    ],
    previous: "getting-started",
    next: "concepts/evidence-loop",
  },
  {
    slug: "concepts/evidence-loop",
    title: "Evidence loop",
    description:
      "Capture or import → understand → enforce → verify/bundle → review locally or in Studio.",
    section: "Concepts",
    toc: [{ id: "loop", title: "Evidence loop" }],
    previous: "concepts/local-first",
    next: "concepts/trace-check-redact",
  },
  {
    slug: "concepts/trace-check-redact",
    title: "Trace, check, redact",
    description:
      "The AgentInspect product loop: capture what happened, check expectations, and redact before sharing.",
    section: "Concepts",
    toc: [
      { id: "trace", title: "Trace" },
      { id: "check", title: "Check" },
      { id: "redact", title: "Redact" },
    ],
    previous: "concepts/evidence-loop",
    next: "contracts",
  },
  {
    slug: "contracts",
    title: "Trace contracts",
    description: "Typed TraceContract expectations (Beta) and experimental matchers.",
    section: "Prevent regressions",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "concepts/trace-check-redact",
    next: "trace-facts",
  },
  {
    slug: "trace-facts",
    title: "TraceFacts",
    description: "Experimental TraceFacts / logical projection for deterministic checks.",
    section: "Prevent regressions",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "contracts",
    next: "trace-contracts",
  },
  {
    slug: "trace-contracts",
    title: "Trace contracts (alias)",
    description: "Alias of Trace contracts.",
    section: "Prevent regressions",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "trace-facts",
    next: "test-matchers",
  },
  {
    slug: "test-matchers",
    title: "Test matchers",
    description: "Experimental Vitest/Jest TraceContract matchers.",
    section: "Prevent regressions",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "trace-contracts",
    next: "suites-and-gates",
  },
  {
    slug: "suites-and-gates",
    title: "Suites and gates",
    description: "Suites, cohorts, and CI gates over local traces (Beta).",
    section: "Prevent regressions",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "test-matchers",
    next: "evidence-v2",
  },
  {
    slug: "evidence-v2",
    title: "Evidence v2",
    description: "Offline integrity-verifiable Evidence packages for CI and handoff.",
    section: "Evidence and MCP",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "suites-and-gates",
    next: "coding-agent-loop",
  },
  {
    slug: "coding-agent-loop",
    title: "Coding-agent loop",
    description: "Read-only local MCP over TraceFacts (Preview).",
    section: "Evidence and MCP",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "evidence-v2",
    next: "no-egress",
  },
  {
    slug: "no-egress",
    title: "No-egress policy",
    description: "AgentInspect-surface no-default-network policy.",
    section: "Evidence and MCP",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "coding-agent-loop",
    next: "decision-guide",
  },
  {
    slug: "decision-guide",
    title: "Decision guide",
    description: "Choose capture, contracts, Evidence, and MCP paths.",
    section: "Start",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "no-egress",
    next: "integrations",
  },
  {
    slug: "integrations",
    title: "Integrations",
    description:
      "Manual instrumentation, framework adapters, logs, harness, CI reporters, and adapter SDK paths.",
    section: "Integrations",
    toc: [{ id: "paths", title: "Integration paths" }],
    previous: "decision-guide",
    next: "integrations/ai-sdk",
  },
  {
    slug: "integrations/ai-sdk",
    title: "AI SDK",
    description:
      "Use @agent-inspect/ai-sdk with Vercel AI SDK telemetry. Metadata-only by default.",
    section: "Integrations",
    toc: [
      { id: "install", title: "Install" },
      { id: "example", title: "Example" },
      { id: "privacy", title: "Privacy" },
    ],
    previous: "integrations",
    next: "integrations/openai-agents",
  },
  {
    slug: "integrations/openai-agents",
    title: "OpenAI Agents",
    description:
      "Local AgentInspect processor for OpenAI Agents JS. Prefer setTraceProcessors for local-only traces.",
    section: "Integrations",
    toc: [
      { id: "local-only", title: "Local-only mode" },
      { id: "example", title: "Example" },
      { id: "privacy", title: "Privacy notes" },
    ],
    previous: "integrations/ai-sdk",
    next: "integrations/langchain",
  },
  {
    slug: "integrations/langchain",
    title: "LangChain",
    description:
      "LangChain callback handler that writes local AgentInspect JSONL traces.",
    section: "Integrations",
    toc: [
      { id: "install", title: "Install" },
      { id: "example", title: "Example" },
      { id: "privacy", title: "Privacy" },
    ],
    previous: "integrations/openai-agents",
    next: "integrations/langgraph",
  },
  {
    slug: "integrations/langgraph",
    title: "LangGraph",
    description: "LangGraph onboarding with init --framework langgraph and Evidence gates.",
    section: "Integrations",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "integrations/langchain",
    next: "workspace",
  },
  {
    slug: "workspace",
    title: "Workspace",
    description: "Local workspaces, optional SQLite index, sessions, and bundles.",
    section: "Workspace and Studio",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "integrations/langgraph",
    next: "studio",
  },
  {
    slug: "studio",
    title: "Studio Beta",
    description:
      "Customer-owned Studio analyzer. Localhost by default. Ingest disabled by default.",
    section: "Workspace and Studio",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "workspace",
    next: "mcp",
  },
  {
    slug: "mcp",
    title: "MCP",
    description: "MCP client tracing and read-only MCP server (Preview).",
    section: "MCP and standards",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "studio",
    next: "standards",
  },
  {
    slug: "standards",
    title: "Standards",
    description: "OpenInference-compatible and OTLP GenAI-aligned bridge.",
    section: "MCP and standards",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "mcp",
    next: "cli",
  },
  {
    slug: "cli",
    title: "CLI",
    description:
      "High-level AgentInspect CLI command groups for local inspect, check, redact, and export workflows.",
    section: "Reference",
    toc: [
      { id: "overview", title: "Overview" },
      { id: "command-groups", title: "Command groups" },
    ],
    previous: "standards",
    next: "safe-sharing",
  },
  {
    slug: "safe-sharing",
    title: "Safe trace sharing",
    description:
      "Redact and verify traces before attaching them to PRs, issues, or design-partner threads.",
    section: "Guides",
    toc: [
      { id: "why", title: "Why it matters" },
      { id: "workflow", title: "Workflow" },
      { id: "limits", title: "Limits" },
    ],
    previous: "cli",
    next: "ci",
  },
  {
    slug: "ci",
    title: "CI artifacts",
    description:
      "Run deterministic checks in CI and upload redacted local artifacts with your CI platform.",
    section: "Guides",
    toc: [
      { id: "pattern", title: "CI pattern" },
      { id: "checks", title: "Checks" },
      { id: "artifacts", title: "Artifacts" },
    ],
    previous: "safe-sharing",
    next: "support-levels",
  },
  {
    slug: "support-levels",
    title: "Support levels",
    description: "Stable, Supported, Beta, Preview, and Experimental labels.",
    section: "Reference",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "ci",
    next: "network-behavior",
  },
  {
    slug: "network-behavior",
    title: "Network behavior",
    description: "Explicit network surfaces and defaults.",
    section: "Reference",
    toc: [{ id: "overview", title: "Overview" }],
    previous: "support-levels",
    next: "compare",
  },
  {
    slug: "compare",
    title: "Compare",
    description:
      "How AgentInspect relates to console.log, hosted observability platforms, and OpenTelemetry.",
    section: "Guides",
    toc: [
      { id: "positioning", title: "Positioning" },
      { id: "table", title: "Comparison" },
    ],
    previous: "network-behavior",
    next: "contributing",
  },
  {
    slug: "contributing",
    title: "Contributing",
    description:
      "Good first contribution surfaces for docs, examples, fixtures, adapters, and editor polish.",
    section: "Community",
    toc: [
      { id: "good-first", title: "Good first contributions" },
      { id: "boundaries", title: "Boundaries" },
    ],
    previous: "compare",
  },
];

export type DocsNavSection = {
  title: string;
  items: Array<{ title: string; href: string }>;
};

export const docsNav: DocsNavSection[] = [
  {
    title: "Start",
    items: [
      { title: "Overview", href: "/docs" },
      { title: "Getting started", href: "/docs/getting-started" },
      { title: "Decision guide", href: "/docs/decision-guide" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { title: "Local-first", href: "/docs/concepts/local-first" },
      { title: "Evidence loop", href: "/docs/concepts/evidence-loop" },
      {
        title: "Trace, check, redact",
        href: "/docs/concepts/trace-check-redact",
      },
    ],
  },
  {
    title: "Prevent regressions",
    items: [
      { title: "Trace contracts", href: "/docs/contracts" },
      { title: "TraceFacts", href: "/docs/trace-facts" },
      { title: "Test matchers", href: "/docs/test-matchers" },
      { title: "Suites and gates", href: "/docs/suites-and-gates" },
    ],
  },
  {
    title: "Evidence and MCP",
    items: [
      { title: "Evidence v2", href: "/docs/evidence-v2" },
      { title: "Coding-agent loop", href: "/docs/coding-agent-loop" },
      { title: "No-egress", href: "/docs/no-egress" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "Overview", href: "/docs/integrations" },
      { title: "AI SDK", href: "/docs/integrations/ai-sdk" },
      { title: "OpenAI Agents", href: "/docs/integrations/openai-agents" },
      { title: "LangChain", href: "/docs/integrations/langchain" },
      { title: "LangGraph", href: "/docs/integrations/langgraph" },
    ],
  },
  {
    title: "Workspace and Studio",
    items: [
      { title: "Workspace", href: "/docs/workspace" },
      { title: "Studio Beta", href: "/docs/studio" },
    ],
  },
  {
    title: "MCP and standards",
    items: [
      { title: "MCP", href: "/docs/mcp" },
      { title: "Standards", href: "/docs/standards" },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "CLI", href: "/docs/cli" },
      { title: "Safe sharing", href: "/docs/safe-sharing" },
      { title: "CI artifacts", href: "/docs/ci" },
      { title: "Support levels", href: "/docs/support-levels" },
      { title: "Network behavior", href: "/docs/network-behavior" },
      { title: "Compare", href: "/docs/compare" },
    ],
  },
  {
    title: "Community",
    items: [{ title: "Contributing", href: "/docs/contributing" }],
  },
];

export function docHref(slug: string): string {
  return slug ? `/docs/${slug}` : "/docs";
}

export function getDocPage(slugParts: string[] | undefined): DocPage | undefined {
  const slug = (slugParts ?? []).join("/");
  return docPages.find((page) => page.slug === slug);
}

export function getAllDocSlugs(): string[][] {
  return docPages.map((page) => (page.slug ? page.slug.split("/") : []));
}
