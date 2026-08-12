import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export const metadata: Metadata = {
  title: "LangGraph case study — AgentInspect",
  description:
    "Anonymized hardening timeline from capture blockers to verified moderate and deep-swarm trajectory gates—with local Evidence v2.",
};

export default function LangGraphCaseStudyPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-muted">Case study</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          LangGraph trajectory hardening
        </h1>
        <p className="mt-4 text-lg text-muted">
          Public-safe technical narrative: four verification rounds, eleven
          findings closed by 6.16.0, moderate and deep-swarm gates green—no
          named partners, no private traces.
        </p>

        <ol className="mt-10 space-y-4 border-l border-border pl-6 text-ink">
          <li>
            <strong>6.7.3</strong> — capture blockers found
          </li>
          <li>
            <strong>6.12.1</strong> — capture fixed; check blockers found
          </li>
          <li>
            <strong>6.14.1</strong> — moderate gate passed; swarm self-cycle found
          </li>
          <li>
            <strong>6.16.0</strong> — moderate + swarm gates passed; zero open
            findings
          </li>
        </ol>

        <div className="mt-10 space-y-4 text-base leading-relaxed text-ink">
          <p>
            Additive env-gated integration beside existing observability. CI
            uses <code className="text-sm">check --preset trajectory</code> and
            local Evidence on failure—AgentInspect does not upload.
          </p>
          <p>
            Reproduce with in-repo fixtures and{" "}
            <code className="text-sm">pnpm demo:generate</code>.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm font-medium">
          <Link className="text-accent underline-offset-4 hover:underline" href="/docs/cli">
            CLI presets & Evidence-on
          </Link>
          <Link
            className="text-accent underline-offset-4 hover:underline"
            href="/use-cases/trajectory-gates"
          >
            Trajectory gates
          </Link>
          <Link
            className="text-accent underline-offset-4 hover:underline"
            href="/use-cases/portable-evidence"
          >
            Portable Evidence
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
