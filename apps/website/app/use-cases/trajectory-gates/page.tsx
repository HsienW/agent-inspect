import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export const metadata: Metadata = {
  title: "Trajectory gates — AgentInspect",
  description: "Fail CI when the agent follows the wrong path and attach local Evidence.",
};

export default function TrajectoryGatesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-muted">Use case</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          Trajectory gates
        </h1>
        <p className="mt-4 text-lg text-muted">
          Fail CI when the agent follows the wrong path and attach the evidence.
        </p>
        <div className="mt-10 space-y-4 text-base leading-relaxed text-ink">
          <p>
            Use <code className="text-sm">agent-inspect check --preset trajectory</code>{" "}
            so path/structure failures stay separate from share-safety findings.
          </p>
          <p>
            On failure, <code className="text-sm">--evidence-on fail</code> writes a local
            Evidence v2 package your CI provider can upload as an ordinary artifact.
          </p>
        </div>
        <p className="mt-12 text-sm">
          <Link className="text-accent underline-offset-4 hover:underline" href="/case-study/langgraph">
            LangGraph case study
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
