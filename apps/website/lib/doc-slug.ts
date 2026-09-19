import GithubSlugger from "github-slugger";

/**
 * Heading slug helper aligned with github-slugger / rehype-slug so TOC
 * fragment IDs match rendered heading IDs.
 */
export class DocSlugger {
  #slugger = new GithubSlugger();

  slug(value: string): string {
    return this.#slugger.slug(value);
  }

  reset(): void {
    this.#slugger.reset();
  }
}

/** Single-pass slug (no duplicate suffix). */
export function slugifyHeadingText(value: string): string {
  return new GithubSlugger().slug(value);
}
