import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/marketing/Footer";
import { SiteHeader } from "@/components/marketing/SiteHeader";

export const metadata: Metadata = {
  title: "No-egress debugging — AgentInspect",
  description: "Keep traces local, redact before sharing, and review customer-owned evidence.",
};

export default function NoEgressPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm font-medium text-muted">Use case</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
          No-egress agent debugging
        </h1>
        <p className="mt-4 text-lg text-muted">
          Keep traces local, redact before sharing, and review customer-owned evidence.
        </p>
        <div className="mt-10 space-y-4 text-base leading-relaxed text-ink">
          <p>
            Default behavior performs no network I/O. Use redaction profiles and{" "}
            <code className="text-sm">verify-safe</code> before any external handoff.
          </p>
          <p>
            This is an engineering control, not a compliance certification claim.
          </p>
        </div>
        <p className="mt-12 text-sm">
          <Link className="text-accent underline-offset-4 hover:underline" href="/docs/no-egress">
            No-egress docs
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
