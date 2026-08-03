import {
  Bot,
  Bug,
  GitPullRequest,
  LineChart,
  SquareTerminal,
  TimerOff,
} from "lucide-react";

const cases = [
  {
    title: "Debug a broken run with your coding agent",
    body: "Configure MCP (dry-run), ask for get_first_causal_failure, fix in the app, re-inspect, then create share-checked evidence.",
    icon: Bot,
  },
  {
    title: "Debug a wrong tool call locally",
    body: "See the tool step, siblings, and parent run without leaving your terminal or uploading traces.",
    icon: Bug,
  },
  {
    title: "Attach share-checked evidence to a PR",
    body: "Redact with the share profile, verify-safe, bundle, then bundle verify before you attach the artifact.",
    icon: GitPullRequest,
  },
  {
    title: "Catch stalled agent runs in CI",
    body: "Use deterministic checks for completion and stalls on fixture traces—no LLM judge required.",
    icon: TimerOff,
  },
  {
    title: "Compare before/after agent behavior",
    body: "Diff two local runs when a prompt, tool, or model change lands.",
    icon: LineChart,
  },
  {
    title: "Review traces without a hosted dashboard",
    body: "CLI, TUI, localhost viewer, or the in-repo VS Code extension—files stay on disk.",
    icon: SquareTerminal,
  },
];

export function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-24 border-b border-border bg-surface/50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Real needs
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Where the local evidence loop wins
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border bg-bg p-5"
            >
              <item.icon className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
