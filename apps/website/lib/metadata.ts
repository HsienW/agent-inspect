import { product } from "./product";
import { site } from "./site";

export function createMetadata(overrides?: {
  title?: string;
  description?: string;
  path?: string;
}): import("next").Metadata {
  const title = overrides?.title ?? site.title;
  const description = overrides?.description ?? site.description;
  const path = overrides?.path ?? "/";
  const url = `${site.url}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    keywords: [...site.keywords],
    authors: [{ name: "AgentInspect contributors" }],
    metadataBase: new URL(site.url),
    icons: {
      icon: "/favicon.svg",
    },
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: site.name,
      images: [
        {
          url: "/og.svg",
          width: 1200,
          height: 630,
          alt: product.headline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.svg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.description,
    },
    {
      "@type": "SoftwareApplication",
      name: "agent-inspect",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Node.js",
      softwareVersion: product.version,
      license: "https://opensource.org/licenses/MIT",
      description: site.description,
      url: site.url,
      downloadUrl: site.npm,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "SoftwareSourceCode",
      name: "agent-inspect",
      codeRepository: site.github,
      programmingLanguage: "TypeScript",
      runtimePlatform: "Node.js >= 20",
      license: "https://opensource.org/licenses/MIT",
      url: site.github,
    },
  ],
};
