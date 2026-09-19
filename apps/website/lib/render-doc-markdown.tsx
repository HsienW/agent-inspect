import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";
import { resolveDocHref } from "@/lib/resolve-doc-href";

function getTextContent(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return getTextContent(props?.children);
  }
  return "";
}

/**
 * Repo Markdown uses paths like `../assets/demos/foo.gif` (from docs/).
 * On the static site those resolve under /docs/… and 404 unless rewritten
 * to the build-copied public assets under /assets/demos.
 */
export function rewriteDocMediaSrc(src: string | undefined): string | undefined {
  if (!src) return src;
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("/")
  ) {
    return src;
  }

  const demos = /^(?:\.\.\/|\.\/)?assets\/demos\/(.+)$/.exec(src);
  if (demos?.[1]) {
    return `/assets/demos/${demos[1]}`;
  }

  const showcase = /^(?:\.\.\/|\.\/)?assets\/showcase\/(.+)$/.exec(src);
  if (showcase?.[1]) {
    return `/showcase/${showcase[1]}`;
  }

  return src;
}

function createComponents(sourcePath: string): Components {
  return {
    img({ src, alt, node: _node, ...rest }) {
      void _node;
      const resolved = rewriteDocMediaSrc(
        typeof src === "string" ? src : undefined,
      );
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={resolved} alt={typeof alt === "string" ? alt : ""} {...rest} />;
    },
    pre({ children }) {
      return <>{children}</>;
    },
    code({ className, children, node: _node, ...rest }) {
      void _node;
      const text = getTextContent(children).replace(/\n$/, "");
      const languageMatch = /language-([a-zA-Z0-9_-]+)/.exec(className ?? "");
      const language = languageMatch?.[1];
      const isBlock =
        Boolean(language) || text.includes("\n") || className?.includes("language-");

      if (isBlock) {
        return <DocsCodeBlock code={text} language={language ?? "text"} />;
      }

      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    },
    a({ href, children, node: _node, ...rest }) {
      void _node;
      const resolved =
        typeof href === "string" ? resolveDocHref(href, sourcePath) : href;
      if (resolved === undefined && typeof href === "string" && href.length > 0) {
        return <span {...rest}>{children}</span>;
      }
      const isExternal =
        typeof resolved === "string" &&
        (resolved.startsWith("http://") || resolved.startsWith("https://"));
      return (
        <a
          href={typeof resolved === "string" ? resolved : undefined}
          {...rest}
          {...(isExternal
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
        >
          {children}
        </a>
      );
    },
    table({ children }) {
      return (
        <div className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            {children}
          </table>
        </div>
      );
    },
    th({ children }) {
      return (
        <th className="border-b border-border px-3 py-2 font-semibold text-ink">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="border-b border-border px-3 py-2 align-top text-muted">
          {children}
        </td>
      );
    },
    blockquote({ children }) {
      return (
        <blockquote className="my-6 border-l-4 border-primary/40 pl-4 text-muted">
          {children}
        </blockquote>
      );
    },
    hr() {
      return <hr className="my-10 border-border" />;
    },
    ol({ children }) {
      return <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">{children}</ol>;
    },
    ul({ children }) {
      return <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">{children}</ul>;
    },
    li({ children }) {
      return <li className="leading-7">{children}</li>;
    },
  };
}

type RenderDocMarkdownProps = {
  markdown: string;
  /** Repo-relative Markdown source (e.g. docs/TRACE-CONTRACTS.md). */
  source: string;
};

export function RenderDocMarkdown({ markdown, source }: RenderDocMarkdownProps) {
  const components = createComponents(source);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "wrap",
            properties: {
              className: ["anchor-link"],
            },
          },
        ],
      ]}
      components={components}
    >
      {markdown}
    </ReactMarkdown>
  );
}
