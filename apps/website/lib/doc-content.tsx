import type { ReactNode } from "react";

import { DocsCallout } from "@/components/docs/DocsCallout";
import { DocsCardGrid } from "@/components/docs/DocsCardGrid";
import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";
import { githubDoc, site } from "@/lib/site";

export function renderDocContent(slug: string): ReactNode {
  switch (slug) {
    case "":
      return <DocsHomeContent />;
    case "getting-started":
      return <GettingStartedContent />;
    case "concepts/local-first":
      return <LocalFirstContent />;
    case "concepts/trace-check-redact":
      return <TraceCheckRedactContent />;
    case "concepts/evidence-loop":
      return <EvidenceLoopContent />;
    case "contracts":
    case "trace-contracts":
      return <ContractsContent />;
    case "test-matchers":
      return <TestMatchersContent />;
    case "trace-facts":
      return <TraceFactsContent />;
    case "suites-and-gates":
      return <SuitesGatesContent />;
    case "evidence-v2":
      return <EvidenceV2Content />;
    case "coding-agent-loop":
      return <CodingAgentLoopContent />;
    case "no-egress":
      return <NoEgressContent />;
    case "decision-guide":
      return <DecisionGuideContent />;
    case "integrations/langgraph":
      return <LangGraphContent />;
    case "workspace":
      return <WorkspaceContent />;
    case "studio":
      return <StudioContent />;
    case "mcp":
      return <McpContent />;
    case "standards":
      return <StandardsContent />;
    case "support-levels":
      return <SupportLevelsContent />;
    case "network-behavior":
      return <NetworkBehaviorContent />;
    case "integrations":
      return <IntegrationsContent />;
    case "integrations/ai-sdk":
      return <AiSdkContent />;
    case "integrations/openai-agents":
      return <OpenAiAgentsContent />;
    case "integrations/langchain":
      return <LangChainContent />;
    case "cli":
      return <CliContent />;
    case "safe-sharing":
      return <SafeSharingContent />;
    case "ci":
      return <CiContent />;
    case "compare":
      return <CompareContent />;
    case "contributing":
      return <ContributingContent />;
    default:
      return null;
  }
}

function DocsHomeContent() {
  return (
    <>
      <h2 id="start-here">Start here</h2>
      <p>
        AgentInspect is local-first trajectory evidence for TypeScript AI agents:
        debug, regression-test, and safely share runs. Canonical deep reference
        lives in the repository docs on GitHub; these pages summarize the current product.
      </p>
      <DocsCardGrid
        cards={[
          {
            title: "First trace in 5 minutes",
            description: "Install, demo, inspect, check, and share-safe artifact.",
            href: "/docs/getting-started",
          },
          {
            title: "Concepts",
            description: "Local-first defaults and the trace/check/redact loop.",
            href: "/docs/concepts/local-first",
          },
        ]}
      />

      <h2 id="browse">Browse by topic</h2>
      <DocsCardGrid
        cards={[
          {
            title: "Integrations",
            description: "Manual, AI SDK, OpenAI Agents, LangChain, and more.",
            href: "/docs/integrations",
          },
          {
            title: "CLI",
            description: "High-level command groups for local workflows.",
            href: "/docs/cli",
          },
          {
            title: "Safe trace sharing",
            description: "Redact and verify before PRs and issues.",
            href: "/docs/safe-sharing",
          },
          {
            title: "CI",
            description: "Deterministic checks and redacted CI artifacts.",
            href: "/docs/ci",
          },
          {
            title: "Compare",
            description: "How AgentInspect relates to logs, hosted tools, and OTel.",
            href: "/docs/compare",
          },
          {
            title: "Contributing",
            description: "Good first contribution surfaces.",
            href: "/docs/contributing",
          },
        ]}
      />
    </>
  );
}

function GettingStartedContent() {
  return (
    <>
      <h2 id="install">Install</h2>
      <DocsCodeBlock code="npm install agent-inspect" />

      <h2 id="init">Init</h2>
      <DocsCodeBlock code="npx agent-inspect init --yes" />
      <p>
        Creates `agent-inspect.config.ts`, `.agent-inspect/`, and
        `examples/agent-inspect-demo.mjs`.
      </p>

      <h2 id="demo">Run deterministic demo</h2>
      <DocsCodeBlock code="node examples/agent-inspect-demo.mjs" />
      <DocsCallout tone="info" title="No API keys">
        The init demo is deterministic and works without provider credentials.
      </DocsCallout>

      <h2 id="inspect">List and view traces</h2>
      <DocsCodeBlock
        code={`npx agent-inspect list --dir .agent-inspect
npx agent-inspect view <run-id> --dir .agent-inspect
npx agent-inspect report <run-id> --dir .agent-inspect`}
      />

      <h2 id="check">Check traces</h2>
      <DocsCodeBlock
        code="npx agent-inspect check <run-id> --dir .agent-inspect"
      />

      <h2 id="share">Bundle and verify safe</h2>
      <DocsCodeBlock
        code={`npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect`}
      />
      <p>
        <code>init</code> only scaffolds files; the demo writes the trace. Always
        pass a run id (or file path) to check, bundle, and verify-safe.
      </p>
      <h2 id="next-steps">Next steps</h2>
      <ul>
        <li>
          <a href={githubDoc("FIRST-TRACE-IN-5-MINUTES.md")}>
            Full reference in GitHub docs
          </a>
        </li>
        <li>
          <a href="/docs/integrations">Pick an integration path</a>
        </li>
        <li>
          <a href="/docs/safe-sharing">Read the safe sharing guide</a>
        </li>
      </ul>
    </>
  );
}

function LocalFirstContent() {
  return (
    <>
      <h2 id="what-local-first-means">What local-first means</h2>
      <ul>
        <li>Traces stay local by default</li>
        <li>No account required</li>
        <li>No upload by default</li>
        <li>No hosted dashboard required for the core loop</li>
      </ul>

      <h2 id="jsonl-on-disk">JSONL on disk</h2>
      <p>
        Runs are persisted as JSONL files you own, typically under
        `.agent-inspect/` or `AGENT_INSPECT_TRACE_DIR`. You can inspect, check,
        redact, and attach them like any other local artifact.
      </p>

      <h2 id="where-it-fits">Where it fits</h2>
      <p>
        Local debugging, CI artifacts, safe trace sharing, and adapter
        development. For production fleets and team dashboards, use hosted
        observability or OpenTelemetry — AgentInspect is complementary.
      </p>
      <p>
        <a href={githubDoc("ADOPTION.md")}>Full reference in GitHub docs</a>
      </p>
    </>
  );
}

function TraceCheckRedactContent() {
  return (
    <>
      <h2 id="trace">Trace what happened</h2>
      <p>
        Capture manual steps, framework adapters, logs, harness runs, and
        CI/test artifacts as an execution tree.
      </p>

      <h2 id="check">Check what should have happened</h2>
      <p>
        Run deterministic checks for completion, stalls, failures, and
        regressions in local or CI environments.
      </p>

      <h2 id="redact">Redact what must not leave your machine</h2>
      <p>
        Use redaction profiles and `verify-safe` before opening issues, reviewing
        PRs, or talking with design partners.
      </p>
      <DocsCallout tone="safety" title="Metadata-only by default">
        AgentInspect defaults to metadata-only capture. Do not assume prompts or
        outputs are present unless you opted into content capture.
      </DocsCallout>
      <p>
        <a href={githubDoc("TECHNICAL-GUIDE.md")}>
          Full reference in GitHub docs
        </a>
      </p>
    </>
  );
}

function IntegrationsContent() {
  return (
    <>
      <h2 id="paths">Integration paths</h2>
      <DocsCardGrid
        cards={[
          {
            title: "Manual instrumentation",
            description: "`inspectRun`, `step`, `step.tool`, `step.llm`, `observe`.",
            href: githubDoc("API.md"),
            external: true,
          },
          {
            title: "AI SDK",
            description: "Vercel AI SDK telemetry integration.",
            href: "/docs/integrations/ai-sdk",
          },
          {
            title: "OpenAI Agents",
            description: "Local processor for OpenAI Agents JS.",
            href: "/docs/integrations/openai-agents",
          },
          {
            title: "LangChain",
            description: "Callback handler with persisted local traces.",
            href: "/docs/integrations/langchain",
          },
          {
            title: "Logs",
            description: "Structured log ingest into local trees.",
            href: githubDoc("LOG-TO-TREE-QUICKSTART.md"),
            external: true,
          },
          {
            title: "Harness",
            description: "Fixture runner for real project integrations.",
            href: `${site.github}/tree/main/packages/harness`,
            external: true,
          },
          {
            title: "CI / tests",
            description: "Vitest/Jest reporters and CLI checks.",
            href: "/docs/ci",
          },
          {
            title: "Adapter SDK",
            description: "Build community adapters with conformance guidance.",
            href: `${site.github}/tree/main/packages/adapter-sdk`,
            external: true,
          },
        ]}
      />
    </>
  );
}

function AiSdkContent() {
  return (
    <>
      <h2 id="install">Install</h2>
      <DocsCodeBlock code="npm install agent-inspect @agent-inspect/ai-sdk ai" />

      <h2 id="example">Example</h2>
      <DocsCodeBlock
        language="ts"
        code={`import { generateText } from "ai";
import { agentInspect } from "@agent-inspect/ai-sdk";

await generateText({
  model: yourModel,
  prompt: "Hello",
  experimental_telemetry: {
    isEnabled: true,
    recordInputs: false,
    recordOutputs: false,
    integrations: [
      agentInspect({
        traceDir: ".agent-inspect",
        runName: "support-agent",
        capture: "metadata-only",
      }),
    ],
  },
});`}
      />

      <h2 id="privacy">Privacy</h2>
      <ul>
        <li>Keep `recordInputs: false` and `recordOutputs: false` unless you accept content capture risk</li>
        <li>Default capture is `metadata-only`</li>
        <li>Traces write locally to `traceDir`</li>
      </ul>
      <p>
        <a href={githubDoc("AI-SDK-ADOPTION.md")}>
          Full reference in GitHub docs
        </a>
      </p>
    </>
  );
}

function OpenAiAgentsContent() {
  return (
    <>
      <h2 id="local-only">Local-only mode</h2>
      <p>
        Prefer `setTraceProcessors([agentInspect(...)])` when you want AgentInspect
        traces without OpenAI&apos;s default export pipeline. Using
        `addTraceProcessor` may leave the default export enabled.
      </p>

      <h2 id="example">Example</h2>
      <DocsCodeBlock
        language="ts"
        code={`import { setTraceProcessors } from "@openai/agents";
import { agentInspect } from "@agent-inspect/openai-agents";

setTraceProcessors([
  agentInspect({
    traceDir: ".agent-inspect",
    capture: "metadata-only",
  }),
]);`}
      />

      <h2 id="privacy">Privacy notes</h2>
      <DocsCallout tone="warning" title="Processor replacement is not full network isolation">
        Replacing processors does not by itself redact OpenAI SDK network traffic.
        Review OpenAI SDK settings separately.
      </DocsCallout>
      <p>
        <a href={githubDoc("OPENAI-AGENTS-LOCAL.md")}>
          Full reference in GitHub docs
        </a>
      </p>
    </>
  );
}

function LangChainContent() {
  return (
    <>
      <h2 id="install">Install</h2>
      <DocsCodeBlock code="npm install agent-inspect @agent-inspect/langchain @langchain/core" />

      <h2 id="example">Example</h2>
      <DocsCodeBlock
        language="ts"
        code={`import { AgentInspectCallback } from "@agent-inspect/langchain";

const handler = new AgentInspectCallback({
  traceDir: ".agent-inspect",
  runName: "my-chain",
  persist: true,
});

// Pass handler to your chain / runnable callbacks`}
      />

      <h2 id="privacy">Privacy</h2>
      <p>
        Keep `capture: &quot;metadata-only&quot;` for shareable examples. Review
        `preview` traces carefully because previews can include prompt or output
        fragments.
      </p>
      <p>
        <a href={githubDoc("ADAPTERS.md")}>Full reference in GitHub docs</a>
      </p>
    </>
  );
}

function CliContent() {
  return (
    <>
      <h2 id="overview">Overview</h2>
      <p>
        The CLI is local-first and read-only by default where possible. Exports
        write local files only. There is no upload and no vendor sink.
      </p>

      <h2 id="command-groups">Command groups</h2>
      <ul>
        <li>`init`, `doctor` — scaffold and diagnose local setup</li>
        <li>`list`, `view`, `report`, `what`, `timeline`, `stats`, `search` — inspect</li>
        <li>`check`, `eval` — deterministic quality gates</li>
        <li>`redact`, `scan`, `verify-safe` — safe sharing</li>
        <li>`export`, `artifacts`, `ci-summary` — local artifacts</li>
        <li>`diff`, `sessions`, `session` — compare and multi-run workflows</li>
        <li>`logs`, `tail`, `open`, `migrate` — ingest and compatibility</li>
      </ul>
      <p>
        <a href={githubDoc("CLI.md")}>Full reference in GitHub docs</a>
      </p>
    </>
  );
}

function SafeSharingContent() {
  return (
    <>
      <h2 id="why">Why it matters</h2>
      <p>
        Traces are local files, but they may still contain sensitive metadata you
        attached, collected from logs, or included through optional preview
        settings. Do not share raw traces by default.
      </p>

      <h2 id="workflow">Workflow</h2>
      <DocsCodeBlock
        code={`npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect verify-safe <run-id> --dir .agent-inspect`}
      />
      <ul>
        <li>Use `--profile share` for PR/issue attachments</li>
        <li>Use `--profile strict` for wider or public sharing</li>
        <li>Review the output file before attaching it</li>
      </ul>

      <h2 id="limits">Limits</h2>
      <DocsCallout tone="safety" title="Best-effort, not certification">
        Redaction profiles are key-based safeguards, not compliance-grade DLP or
        regulatory certifications.
      </DocsCallout>
      <p>
        <a href={githubDoc("SAFE-TRACE-SHARING.md")}>
          Full reference in GitHub docs
        </a>
      </p>
    </>
  );
}

function CiContent() {
  return (
    <>
      <h2 id="pattern">CI pattern</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">
        <li>Install `agent-inspect` in CI</li>
        <li>Write traces locally during tests or fixtures</li>
        <li>Run deterministic checks</li>
        <li>Create redacted artifacts</li>
        <li>Upload with your CI platform (AgentInspect does not upload)</li>
      </ol>

      <h2 id="checks">Checks</h2>
      <DocsCodeBlock
        code="npx agent-inspect check .agent-inspect/*.jsonl --require-completed --detect-stalls"
      />

      <h2 id="artifacts">Artifacts</h2>
      <DocsCodeBlock
        code={`npx agent-inspect artifacts <run-id> --dir ./.agent-inspect \\
  --output-dir ./artifacts --github-summary "$GITHUB_STEP_SUMMARY"`}
      />
      <p>
        Prefer deterministic fixtures and redacted outputs for PR review.
      </p>
      <p>
        <a href={githubDoc("CI-ARTIFACTS.md")}>Full reference in GitHub docs</a>
      </p>
    </>
  );
}

function CompareContent() {
  return (
    <>
      <h2 id="positioning">Positioning</h2>
      <p>
        AgentInspect is for the local developer loop. Hosted observability
        platforms are for production fleets, team dashboards, and longer-lived
        eval workflows. OpenTelemetry is a platform observability foundation.
        They can complement each other.
      </p>

      <h2 id="table">Comparison</h2>
      <ul>
        <li>
          <strong>agent-inspect:</strong> local-first, no account, no upload by
          default, execution trees, CLI checks, safe redaction
        </li>
        <li>
          <strong>console.log:</strong> local and simple, but flat and manual
        </li>
        <li>
          <strong>Hosted observability:</strong> great for production monitoring
          and team collaboration; usually requires account/ingestion
        </li>
        <li>
          <strong>Raw OpenTelemetry:</strong> vendor-neutral and powerful;
          requires collector/backend/viewer decisions
        </li>
      </ul>
      <p>
        <a href={githubDoc("COMPARE.md")}>Full reference in GitHub docs</a>
      </p>
    </>
  );
}

function ContributingContent() {
  return (
    <>
      <h2 id="good-first">Good first contributions</h2>
      <ul>
        <li>Docs and examples</li>
        <li>Fixtures and recipes</li>
        <li>Community adapters</li>
        <li>VS Code / viewer polish</li>
        <li>Safe-sharing and CI guidance improvements</li>
      </ul>

      <h2 id="boundaries">Boundaries</h2>
      <p>
        Avoid core schema changes, new root/core dependencies, or network
        behavior changes unless a maintainer explicitly approves them.
      </p>
      <p>
        <a href={`${site.github}/issues`}>Browse GitHub issues</a>
        {" · "}
        <a href={githubDoc("community/CONTRIBUTING.md")}>
          Full reference in GitHub docs
        </a>
      </p>
    </>
  );
}

function EvidenceLoopContent() {
  return (
    <>
      <h2 id="loop">Evidence loop</h2>
      <p>
        Capture or import → understand causality → enforce expectations → verify
        and bundle → review locally or in customer-owned Studio Beta.
      </p>
      <p>
        <a href={githubDoc("GOLDEN-PATH.md")}>Golden path (GitHub)</a>
      </p>
    </>
  );
}

function ContractsContent() {
  return (
    <>
      <h2 id="overview">TraceContract (Beta)</h2>
      <p>
        Typed trajectory expectations via <code>defineTraceContract</code> /
        <code>evaluateTraceContract</code>, evaluated over logical TraceFacts.
      </p>
      <p>
        Experimental Vitest/Jest matchers are shipped:{" "}
        <code>toPassTraceContract</code> and <code>toHaveRequiredTool</code> via{" "}
        <code>agentInspectVitestMatchers</code> / <code>agentInspectJestMatchers</code>.
      </p>
      <p>
        <a href={githubDoc("TRACE-CONTRACTS.md")}>Full guide on GitHub</a> ·{" "}
        <a href="/docs/test-matchers">Test matchers</a> ·{" "}
        <a href="/docs/trace-facts">TraceFacts</a>
      </p>
    </>
  );
}

function TestMatchersContent() {
  return (
    <>
      <h2 id="overview">Experimental test matchers</h2>
      <p>
        <code>@agent-inspect/vitest</code> and <code>@agent-inspect/jest</code> export
        experimental matchers <code>toPassTraceContract</code> and{" "}
        <code>toHaveRequiredTool</code>. Reporters remain the primary failure-artifact path.
      </p>
      <DocsCodeBlock
        language="ts"
        code={`import { expect } from "vitest";
import { agentInspectVitestMatchers } from "@agent-inspect/vitest";

expect.extend(agentInspectVitestMatchers);
expect(read).toPassTraceContract(contract);
expect(read).toHaveRequiredTool("lookup_orders");`}
      />
      <p>
        <a href={githubDoc("TRACE-CONTRACTS.md")}>Trace contracts on GitHub</a>
      </p>
    </>
  );
}

function TraceFactsContent() {
  return (
    <>
      <h2 id="overview">TraceFacts (experimental)</h2>
      <p>
        <code>buildTraceFacts</code> and <code>summarizeSemanticParity</code> provide a
        local semantic foundation over the logical lifecycle projection while preserving
        raw JSONL events.
      </p>
      <p>
        <a href={githubDoc("TRACE-FACTS.md")}>Full guide on GitHub</a>
      </p>
    </>
  );
}

function EvidenceV2Content() {
  return (
    <>
      <h2 id="overview">Evidence v2</h2>
      <p>
        Offline HTML/JSON/ZIP evidence packages with SHA-256 integrity verification and
        optional TraceFacts semantics summaries for CI.
      </p>
      <DocsCodeBlock
        language="bash"
        code={`npx agent-inspect bundle <run-id> --dir .agent-inspect --profile share
npx agent-inspect bundle verify .agent-inspect/bundles/<run-id>`}
      />
      <p>
        <a href={githubDoc("EVIDENCE-FORMAT.md")}>Evidence format</a> ·{" "}
        <a href={githubDoc("EVIDENCE-FIRST-ACCEPTANCE.md")}>Acceptance contract</a>
      </p>
    </>
  );
}

function CodingAgentLoopContent() {
  return (
    <>
      <h2 id="overview">Coding-agent MCP loop (Preview)</h2>
      <p>
        Read-only local MCP over the same TraceFacts used by CLI checks. Includes{" "}
        <code>get_trace_facts</code>, first-causal-failure, and share-checked evidence tools.
      </p>
      <DocsCodeBlock
        language="bash"
        code={`npx agent-inspect mcp configure --client cursor
npx @agent-inspect/mcp-server --dir .agent-inspect`}
      />
      <p>
        <a href={githubDoc("CODING-AGENT-LOOP.md")}>Full guide on GitHub</a>
      </p>
    </>
  );
}

function NoEgressContent() {
  return (
    <>
      <h2 id="overview">No-egress policy</h2>
      <p>
        AgentInspect surfaces perform no default network I/O. Local MCP uses stdio; Evidence
        and verify-safe operate on local paths. This is not an application-wide compliance
        certification.
      </p>
      <p>
        <a href={githubDoc("NO-EGRESS-POLICY.md")}>Policy on GitHub</a> ·{" "}
        <a href="/docs/network-behavior">Network behavior</a>
      </p>
    </>
  );
}

function DecisionGuideContent() {
  return (
    <>
      <h2 id="overview">Decision guide</h2>
      <p>
        Choose capture path, TraceContract/gates, Evidence packaging, and MCP review with the
        smallest surface that matches your stack.
      </p>
      <p>
        <a href={githubDoc("DECISION-GUIDE.md")}>Full decision guide on GitHub</a> ·{" "}
        <a href={githubDoc("WHY-AGENTINSPECT.md")}>Why AgentInspect</a>
      </p>
    </>
  );
}

function LangGraphContent() {
  return (
    <>
      <h2 id="overview">LangGraph</h2>
      <p>
        Use <code>@agent-inspect/langchain</code> callbacks and{" "}
        <code>npx agent-inspect init --framework langgraph</code> for local capture, then
        TraceContract / Evidence / MCP.
      </p>
      <p>
        <a href={githubDoc("LANGGRAPH.md")}>LangGraph guide</a> ·{" "}
        <a href="/docs/integrations/langchain">LangChain integration</a>
      </p>
    </>
  );
}

function SuitesGatesContent() {
  return (
    <>
      <h2 id="overview">Suites, cohorts, and gates (Beta)</h2>
      <p>
        Deterministic regression tooling over local traces. All-skipped suites
        must not pass; cohort tolerances and sample diagnostics matter.
      </p>
      <p>
        <a href={githubDoc("SUITES-COHORTS-GATES.md")}>Full guide on GitHub</a>
      </p>
    </>
  );
}

function WorkspaceContent() {
  return (
    <>
      <h2 id="overview">Workspace</h2>
      <p>
        Organize project-local runs, reports, bundles, sessions, and an optional
        disposable SQLite index. JSONL remains the source of truth.
      </p>
      <p>
        <a href={githubDoc("WORKSPACE.md")}>Workspace</a>
        {" · "}
        <a href={githubDoc("INDEX.md")}>Index</a>
      </p>
    </>
  );
}

function StudioContent() {
  return (
    <>
      <h2 id="overview">Studio Beta</h2>
      <p>
        Customer-owned, read-only analyzer over registered workspaces. Localhost
        by default. Explicit ingest is disabled by default. No AgentInspect-hosted
        cloud.
      </p>
      <p>
        <a href={githubDoc("SELF-HOSTING.md")}>Self-hosting</a>
        {" · "}
        <a href={`${site.github}/tree/main/packages/studio`}>Package README</a>
      </p>
    </>
  );
}

function McpContent() {
  return (
    <>
      <h2 id="overview">MCP</h2>
      <p>
        Client tracing via <code>@agent-inspect/mcp</code>. Read-only MCP server
        (Preview) exposes local evidence to a connected client through a
        share-profile boundary.
      </p>
      <p>
        <a href={`${site.github}/tree/main/packages/mcp`}>MCP client</a>
        {" · "}
        <a href={`${site.github}/tree/main/packages/mcp-server`}>MCP server</a>
      </p>
    </>
  );
}

function StandardsContent() {
  return (
    <>
      <h2 id="overview">Standards bridge</h2>
      <p>
        OpenInference-compatible and OTLP GenAI-aligned mappings with fixture
        validation and known-loss reporting. External Collector/Phoenix proof may
        still be pending — do not claim universal compliance.
      </p>
      <p>
        <a href={githubDoc("STANDARDS.md")}>STANDARDS.md</a>
      </p>
    </>
  );
}

function SupportLevelsContent() {
  return (
    <>
      <h2 id="overview">Support levels</h2>
      <p>
        Stable, Supported, Beta, Preview, and Experimental labels for packages and
        surfaces.
      </p>
      <p>
        <a href={githubDoc("SUPPORT-LEVELS.md")}>SUPPORT-LEVELS.md</a>
      </p>
    </>
  );
}

function NetworkBehaviorContent() {
  return (
    <>
      <h2 id="overview">Network behavior</h2>
      <p>
        Core writes local files. No default upload. Optional Studio ingest, MCP,
        and standards export are explicit when enabled.
      </p>
      <p>
        <a href={githubDoc("NETWORK-BEHAVIOR.md")}>NETWORK-BEHAVIOR.md</a>
      </p>
    </>
  );
}
