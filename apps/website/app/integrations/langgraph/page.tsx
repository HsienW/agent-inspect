import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export const metadata: Metadata = {
  title: "LangGraph integration — AgentInspect",
  description: "Local execution trees and trajectory gates for LangGraph JS agents.",
};

export default function LangGraphIntegrationPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-muted">Integration</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          LangGraph JS
        </h1>
        <p className="mt-4 text-lg text-muted">
          Capture production-shaped LangGraph runs locally, gate trajectories in CI, and keep
          Evidence offline.
        </p>
        <div className="mt-10 space-y-4 text-base leading-relaxed text-ink">
          <p>
            Start with the adapter docs, then run fixture-backed checks with{" "}
            <code className="text-sm">--preset trajectory</code>.
          </p>
          <p>
            See the anonymized hardening case study for the moderate and deep-swarm verification
            timeline.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4 text-sm font-medium">
          <Link
            className="text-accent underline-offset-4 hover:underline"
            href="/docs/integrations/langgraph"
          >
            LangGraph docs
          </Link>
          <Link
            className="text-accent underline-offset-4 hover:underline"
            href="/case-study/langgraph"
          >
            Case study
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
