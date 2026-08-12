import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import matter from "gray-matter";

import {
  getManifestEntry,
  type DocsManifestEntry,
} from "@/content/docs-manifest";

import type { DocTocItem } from "@/lib/docs";

export type LoadedDoc = {
  title: string;
  description: string;
  markdown: string;
  toc: DocTocItem[];
  source: string;
};

/**
 * Resolve the monorepo root. Prefer apps/website cwd → ../../docs;
 * fall back when Next inlines this module (import.meta.url points at the bundle).
 */
function resolveRepoRoot(): string {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(process.cwd(), "../.."),
    path.resolve(process.cwd()),
    path.resolve(here, "../.."),
    path.resolve(here, "../../.."),
    path.resolve(here, "../../../.."),
  ];

  for (const root of candidates) {
    if (existsSync(path.join(root, "docs", "GETTING-STARTED.md"))) {
      return root;
    }
  }

  throw new Error(
    `Unable to locate repo docs/ from cwd=${process.cwd()} module=${here}`,
  );
}

const REPO_ROOT = resolveRepoRoot();

/** Canonical docs directory (apps/website → ../../docs). */
export const DOCS_ROOT = path.join(REPO_ROOT, "docs");

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractFirstH1(markdown: string): string | undefined {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim();
}

function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^#\s+[^\n]+\n+/, "").trimStart();
}

function extractDescription(
  frontmatterDescription: unknown,
  body: string,
): string {
  if (typeof frontmatterDescription === "string" && frontmatterDescription.trim()) {
    return frontmatterDescription.trim();
  }

  const withoutH1 = stripLeadingH1(body);
  const paragraph = withoutH1
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find(
      (block) =>
        block.length > 0 &&
        !block.startsWith("#") &&
        !block.startsWith("```") &&
        !block.startsWith("|") &&
        !block.startsWith(">") &&
        !block.startsWith("- ") &&
        !block.startsWith("* "),
    );

  if (!paragraph) {
    return "";
  }

  return paragraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function buildToc(markdown: string): DocTocItem[] {
  const toc: DocTocItem[] = [];
  const seen = new Map<string, number>();

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;

    const rawTitle = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .trim();
    if (!rawTitle) continue;

    let id = slugifyHeading(rawTitle);
    if (!id) continue;

    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) {
      id = `${id}-${count}`;
    }

    toc.push({ id, title: rawTitle });
  }

  return toc;
}

function resolveSourcePath(source: string): string {
  const normalized = source.replace(/\\/g, "/");
  if (normalized.startsWith("docs/")) {
    return path.join(REPO_ROOT, normalized);
  }
  return path.join(DOCS_ROOT, normalized);
}

export function loadDocFromEntry(entry: DocsManifestEntry): LoadedDoc {
  const absolute = resolveSourcePath(entry.source);
  const raw = readFileSync(absolute, "utf8");
  const { data, content } = matter(raw);

  const titleFromFm =
    typeof data.title === "string" ? data.title.trim() : undefined;
  const title = titleFromFm || extractFirstH1(content) || entry.source;

  const description = extractDescription(data.description, content);
  const markdown = stripLeadingH1(content);
  const toc = buildToc(markdown);

  return {
    title,
    description,
    markdown,
    toc,
    source: entry.source,
  };
}

export function loadDoc(slugParts: string[] | undefined): LoadedDoc | undefined {
  const entry = getManifestEntry(slugParts);
  if (!entry) return undefined;
  return loadDocFromEntry(entry);
}
