import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";
import { SiteHeader } from "@/components/marketing/SiteHeader";

type PageProps = {
  title: string;
  description: string;
  body: string[];
};

function UseCasePage({ title, description, body }: PageProps) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-muted">Use case</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-4 text-lg text-muted">{description}</p>
        <div className="mt-10 space-y-4 text-base leading-relaxed text-ink">
          {body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-12 text-sm">
          <Link className="text-accent underline-offset-4 hover:underline" href="/case-study/langgraph">
            Read the LangGraph hardening case study
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Local agent debugging — AgentInspect",
  description: "Get a faithful local execution tree without an account or collector.",
};

export default function LocalAgentDebuggingPage() {
  return (
    <UseCasePage
      title="Local agent debugging"
      description="Get the first faithful trace without an account or collector."
      body={[
        "Instrument or import TypeScript agent runs into local JSONL, then inspect the execution tree from the CLI.",
        "No hosted dashboard is required for the core loop. Keep traces on disk, open Evidence locally, and share only after redaction.",
      ]}
    />
  );
}
