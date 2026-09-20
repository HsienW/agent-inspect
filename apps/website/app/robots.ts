import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Next.js Flight payloads are not human documentation.
      disallow: ["/*/index.txt", "/index.txt", "/docs/index.txt"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
