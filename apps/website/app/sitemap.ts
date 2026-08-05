import type { MetadataRoute } from "next";

import { docPages } from "@/lib/docs";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = docPages.map((page) => ({
    url: page.slug ? `${site.url}/docs/${page.slug}` : `${site.url}/docs`,
    lastModified: new Date(),
  }));
  return [
    { url: site.url, lastModified: new Date() },
    { url: `${site.url}/llms.txt`, lastModified: new Date() },
    { url: `${site.url}/llms-full.txt`, lastModified: new Date() },
    { url: `${site.url}/ai/product.json`, lastModified: new Date() },
    ...docs,
  ];
}
