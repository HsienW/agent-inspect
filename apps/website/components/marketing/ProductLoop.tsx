import {
  Bot,
  FileCheck2,
  ScanSearch,
  ShieldCheck,
  TreePine,
} from "lucide-react";

const steps = [
  {
    title: "Capture one real run",
    body: "Manual steps, adapters, logs, harness, or standards files → local JSONL under `.agent-inspect/`.",
    icon: TreePine,
    example: "init → demo → list",
  },
  {
    title: "Find the causal failure",
    body: "Trees, reports, and a conservative first-causal-failure engine surface what failed first—not just the last error.",
    icon: ScanSearch,
    example: "report <run-id>",
  },
  {
    title: "Ask your coding agent",
    body: "Read-only MCP Preview tools (`get_first_causal_failure`, trees, evidence) over local traces—stdio only.",
    icon: Bot,
    example: "mcp configure --client cursor",
  },
  {
    title: "Lock the fix with a contract",
    body: "Deterministic `check`, TraceContract (Beta), suites, cohorts, and CI gates so the bug stays fixed.",
    icon: FileCheck2,
    example: "check <run-id>",
  },
  {
    title: "Attach share-checked evidence",
    body: "Redact → verify-safe → Evidence v2 bundle + `bundle verify`. Studio Beta stays optional (customer-owned).",
    icon: ShieldCheck,
    example: "bundle … --profile share",
  },
];

export function ProductLoop() {
  return (
    <section id="product-loop" className="scroll-mt-24 border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Hero flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            From one broken run to share-checked evidence
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted">
            The flagship loop is local evidence—not a hosted dashboard. Studio is
            optional Tier C, never the product story.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <step.icon className="h-5 w-5 text-primary" aria-hidden />
                <span className="font-mono text-xs text-muted">0{index + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              <p className="mt-3 font-mono text-xs text-primary/90">{step.example}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
