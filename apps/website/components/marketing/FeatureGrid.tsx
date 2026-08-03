import {
  Bot,
  FileJson2,
  GitCompare,
  ScanSearch,
  Shield,
  ShieldCheck,
  TerminalSquare,
  Workflow,
} from "lucide-react";

const features = [
  {
    title: "First causal failure",
    body: "Conservative ordered engine points at what failed first—not just the last stack frame.",
    icon: ScanSearch,
  },
  {
    title: "Coding-agent MCP loop",
    body: "Read-only Preview MCP tools over local traces (`mcp configure`, stdio server).",
    icon: Bot,
  },
  {
    title: "Share-checked Evidence v2",
    body: "`bundle` + `bundle verify` produce offline share-profile artifacts you can attach to a PR.",
    icon: ShieldCheck,
  },
  {
    title: "Deterministic contracts & CI",
    body: "`check`, TraceContract (Beta), suites/cohorts, and Vitest/Jest reporters for PR gates.",
    icon: TerminalSquare,
  },
  {
    title: "Local JSONL as source of truth",
    body: "Own runs as files under `.agent-inspect/`. No account, no default upload.",
    icon: FileJson2,
  },
  {
    title: "Execution trees",
    body: "Nested steps, tool/LLM types, durations, and status in a readable tree and timeline.",
    icon: Workflow,
  },
  {
    title: "Metadata-only by default",
    body: "Safe defaults keep prompts and outputs out of traces unless you opt in.",
    icon: Shield,
  },
  {
    title: "Redaction profiles",
    body: "`local`, `share`, and `strict` before issues, PRs, or partner threads—then `verify-safe`.",
    icon: GitCompare,
  },
];

export function FeatureGrid() {
  return (
    <section
      id="features"
      className="scroll-mt-24 border-b border-border bg-surface/50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Proven mechanisms
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Built for the TypeScript agent inner loop
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-border bg-bg p-5"
            >
              <feature.icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-4 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
