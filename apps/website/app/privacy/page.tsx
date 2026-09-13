import Link from "next/link";

import { SiteHeader } from "@/components/marketing/SiteHeader";
import { Footer } from "@/components/marketing/Footer";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = createMetadata({
  title: "Privacy",
  description:
    "AgentInspect is local-first: no default telemetry upload, no hosted SaaS account, and share-checked evidence you control.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
        <p className="mt-4 text-muted leading-7">
          AgentInspect is a local evidence debugger. It does not create a
          maintainer-hosted account for your traces, and core packages do not
          upload telemetry by default.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-muted leading-7">
          <li>Traces stay on disk under your chosen local directory.</li>
          <li>
            Share-safe exports and Evidence packages require an explicit local
            command; review redacted artifacts before sharing.
          </li>
          <li>
            Optional adapters may inherit richer data from upstream SDKs when
            you enable their input/output recording — that is caller-owned.
          </li>
          <li>
            This website is a static marketing/docs surface; it does not ingest
            your agent runs.
          </li>
        </ul>
        <p className="mt-8 text-sm text-muted">
          Security reporting: see{" "}
          <Link href="/security" className="text-ink underline">
            Security
          </Link>{" "}
          and the repository{" "}
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
      </main>
      <Footer />
    </>
  );
}
