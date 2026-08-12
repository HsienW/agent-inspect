import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { DocsCodeBlock } from "@/components/docs/DocsCodeBlock";

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

const components: Components = {
  pre({ children }) {
    return <>{children}</>;
  },
  code({ className, children, ...props }) {
    const text = getTextContent(children).replace(/\n$/, "");
    const languageMatch = /language-([a-zA-Z0-9_-]+)/.exec(className ?? "");
    const language = languageMatch?.[1];
    const isBlock =
      Boolean(language) || text.includes("\n") || className?.includes("language-");

    if (isBlock) {
      return <DocsCodeBlock code={text} language={language ?? "text"} />;
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  a({ href, children, ...props }) {
    const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
    return (
      <a
        href={href}
        {...props}
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

type RenderDocMarkdownProps = {
  markdown: string;
};

export function RenderDocMarkdown({ markdown }: RenderDocMarkdownProps) {
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
