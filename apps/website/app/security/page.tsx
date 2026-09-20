import { HardLink } from "@/components/shared/HardLink";

import { SiteHeader } from "@/components/marketing/SiteHeader";
import { Footer } from "@/components/marketing/Footer";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Security",
  description:
    "How AgentInspect approaches local-first security, vulnerability reporting, and share-safe evidence.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Security</h1>
        <p className="mt-4 text-muted leading-7">
          AgentInspect prioritizes local evidence, bounded redaction, and
          fail-closed contracts. It is not a compliance certification product.
        </p>
        <h2 className="mt-10 text-xl font-semibold">Reporting</h2>
        <p className="mt-3 text-muted leading-7">
          Prefer a private GitHub Security Advisory when available. Do not
          attach real API keys, production traces, or customer PII. Use
          synthetic placeholders.
        </p>
        <p className="mt-4 text-sm text-muted">
          Full policy:{" "}
          <a
            href={`${site.github}/blob/main/SECURITY.md`}
            className="text-ink underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            SECURITY.md
          </a>
          .
        </p>
        <h2 className="mt-10 text-xl font-semibold">Privacy</h2>
        <p className="mt-3 text-muted leading-7">
          See the{" "}
          <HardLink href="/privacy" className="text-ink underline">
            Privacy
          </HardLink>{" "}
          page for the local-first data boundary.
        </p>
      </main>
      <Footer />
    </>
  );
}
