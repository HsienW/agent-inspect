import path from "node:path";

import { docsManifest, manifestSlugKey } from "@/content/docs-manifest";
import { site } from "@/lib/site";

const SOURCE_TO_DOCS_HREF = new Map<string, string>();

for (const entry of docsManifest) {
  const normalized = entry.source.replace(/\\/g, "/");
  // First wins for duplicate sources (e.g. langchain + langgraph → same md).
  if (!SOURCE_TO_DOCS_HREF.has(normalized)) {
    const href =
      entry.slug.length === 0 ? "/docs" : `/docs/${manifestSlugKey(entry.slug)}`;
    SOURCE_TO_DOCS_HREF.set(normalized, href);
  }
}

function splitHref(href: string): { pathPart: string; suffix: string } {
  const hashIndex = href.indexOf("#");
  const queryIndex = href.indexOf("?");
  let cut = href.length;
  if (hashIndex >= 0) cut = Math.min(cut, hashIndex);
  if (queryIndex >= 0) cut = Math.min(cut, queryIndex);
  return {
    pathPart: href.slice(0, cut),
    suffix: href.slice(cut),
  };
}

function githubBlobUrl(repoRelativePosix: string): string {
  const cleaned = repoRelativePosix.replace(/^\/+/, "");
  return `${site.github}/blob/main/${cleaned}`;
}

function githubTreeUrl(repoRelativePosix: string): string {
  const cleaned = repoRelativePosix.replace(/^\/+/, "");
  return `${site.github}/tree/main/${cleaned}`;
}

/**
 * Resolve a Markdown href for the website using the doc's repo source path.
 * Absolute site, external, mailto, and same-page anchors are unchanged.
 */
export function resolveDocHref(
  href: string | undefined,
  sourcePath: string,
): string | undefined {
  if (!href) return href;

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("//")
  ) {
    return href;
  }

  if (href.startsWith("#")) {
    return href;
  }

  // Site-absolute paths (including /docs/... and /assets/...).
  if (href.startsWith("/")) {
    return href;
  }

  const { pathPart, suffix } = splitHref(href);
  if (!pathPart) {
    return href;
  }

  const sourceDir = path.posix.dirname(sourcePath.replace(/\\/g, "/"));
  const resolved = path.posix.normalize(path.posix.join(sourceDir, pathPart));

  // Reject escape outside the repo via .. after normalize.
  if (resolved.startsWith("../") || resolved === "..") {
    return undefined;
  }

  const mapped = SOURCE_TO_DOCS_HREF.get(resolved);
  if (mapped) {
    return `${mapped}${suffix}`;
  }

  // Bare docs filename that maps via basename search when link is ./FOO.md
  // from docs/ and FOO is listed with docs/FOO.md.
  if (resolved.endsWith(".md")) {
    const asDocs = resolved.startsWith("docs/")
      ? resolved
      : `docs/${path.posix.basename(resolved)}`;
    const mappedDocs = SOURCE_TO_DOCS_HREF.get(asDocs);
    if (mappedDocs && resolved.startsWith("docs/")) {
      return `${mappedDocs}${suffix}`;
    }
    // Repo-root or other Markdown → GitHub blob (preserve fragment).
    if (
      resolved === "README.md" ||
      resolved.startsWith("docs/") ||
      resolved.startsWith("examples/") ||
      resolved.startsWith("packages/") ||
      resolved.startsWith("apps/")
    ) {
      return `${githubBlobUrl(resolved)}${suffix}`;
    }
    if (mappedDocs) {
      // Ambiguous basename-only hit from outside docs/ — prefer GitHub for non-docs paths.
      return `${githubBlobUrl(asDocs)}${suffix}`;
    }
    return `${githubBlobUrl(resolved.startsWith("docs/") ? resolved : asDocs)}${suffix}`;
  }

  if (
    resolved.startsWith("docs/") ||
    resolved.startsWith("examples/") ||
    resolved.startsWith("packages/") ||
    resolved.startsWith("assets/") ||
    resolved.startsWith("apps/")
  ) {
    // Directory-ish links without extension → tree; otherwise blob.
    if (!path.posix.extname(resolved) || resolved.endsWith("/")) {
      return `${githubTreeUrl(resolved.replace(/\/$/, ""))}${suffix}`;
    }
    return `${githubBlobUrl(resolved)}${suffix}`;
  }

  // Unresolved relative path — leave unchanged only if it looks like a pure fragment
  // path we already handled; otherwise point at GitHub under docs/.
  return `${githubBlobUrl(`docs/${path.posix.basename(pathPart)}`)}${suffix}`;
}

export function docsHrefForSource(sourcePath: string): string | undefined {
  return SOURCE_TO_DOCS_HREF.get(sourcePath.replace(/\\/g, "/"));
}
