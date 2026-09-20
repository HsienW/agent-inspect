import { clsx } from "clsx";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type HardLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Full-document navigation for the static export.
 *
 * Next.js App Router `<Link>` soft-nav fetches Flight `index.txt` via `connect`.
 * The site CSP uses `connect-src 'none'` (no third-party / no XHR), so soft-nav
 * fails and those Flight files are also easy to open as raw text. Prefer this
 * for in-site navigation so each click loads real HTML.
 */
export function HardLink({ href, className, children, ...rest }: HardLinkProps) {
  return (
    <a href={href} className={clsx(className)} {...rest}>
      {children}
    </a>
  );
}
