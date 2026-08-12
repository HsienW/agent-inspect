import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsLayout } from "@/components/docs/DocsLayout";
import { docHref, getAllDocSlugs, getDocPage } from "@/lib/docs";
import { loadDoc } from "@/lib/load-doc";
import { createMetadata } from "@/lib/metadata";
import { RenderDocMarkdown } from "@/lib/render-doc-markdown";

type DocsPageProps = {
  params: Promise<{
    slug?: string[];
  }>;
};

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) {
    return createMetadata({
      title: "Docs not found · agent-inspect",
      path: "/docs",
    });
  }

  const loaded = loadDoc(slug);
  const title = loaded?.title || page.title;
  const description = loaded?.description || page.description;

  return createMetadata({
    title: `${title} · agent-inspect docs`,
    description,
    path: docHref(page.slug),
  });
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = getDocPage(slug);
  if (!page) {
    notFound();
  }

  const loaded = loadDoc(slug);
  if (!loaded) {
    notFound();
  }

  const currentPath = docHref(page.slug);
  const layoutPage = {
    ...page,
    title: page.title,
    description: page.description || loaded.description,
    toc: loaded.toc,
  };

  return (
    <DocsLayout page={layoutPage} currentPath={currentPath}>
      <RenderDocMarkdown markdown={loaded.markdown} />
    </DocsLayout>
  );
}
