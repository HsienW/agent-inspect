import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export const metadata: Metadata = {
  title: "Portable Evidence — AgentInspect",
  description: "Integrity-verifiable Evidence v2 packages that stay local until you choose to share.",
};

export default function PortableEvidencePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-muted">Use case</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          Portable Evidence
        </h1>
        <p className="mt-4 text-lg text-muted">
          Keep integrity-verifiable Evidence on disk, open it locally, and verify before handoff.
        </p>
        <div className="mt-10 space-y-4 text-base leading-relaxed text-ink">
          <p>
            Evidence v2 bundles include HTML, manifests, and hashes. Run{" "}
            <code className="text-sm">bundle verify</code> and{" "}
            <code className="text-sm">bundle open</code> without standing up a server.
          </p>
          <p>
            AgentInspect never uploads Evidence. Your CI platform attaches local paths only.
          </p>
        </div>
        <p className="mt-12 text-sm">
          <Link className="text-accent underline-offset-4 hover:underline" href="/docs/evidence-v2">
            Evidence v2 docs
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
