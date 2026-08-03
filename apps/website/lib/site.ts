export const site = {
  name: "agent-inspect",
  title: "agent-inspect — The local evidence debugger for TypeScript agents",
  description:
    "Faithful execution trees, first-causal-failure, deterministic TraceContract checks, share-checked Evidence v2, and a read-only coding-agent MCP loop—without a collector or account.",
  keywords: [
    "TypeScript AI agents",
    "AI agent trajectory testing",
    "TypeScript agent debugging",
    "first causal failure",
    "AI agent CI gates",
    "trace contracts",
    "share-checked evidence",
    "Evidence v2",
    "MCP coding-agent debug loop",
    "OpenInference TypeScript",
    "local-first observability",
  ],
  url: "https://agentinspect.vercel.app",
  github: "https://github.com/rajudandigam/agent-inspect",
  githubDocs: "https://github.com/rajudandigam/agent-inspect/blob/main/docs",
  npm: "https://www.npmjs.com/package/agent-inspect",
  license: "MIT",
  installCommand: "npm install agent-inspect",
  badges: {
    npmVersion: "https://img.shields.io/npm/v/agent-inspect",
    npmDownloads: "https://img.shields.io/npm/dm/agent-inspect",
    githubStars: "https://img.shields.io/github/stars/rajudandigam/agent-inspect",
    githubLicense: "https://img.shields.io/github/license/rajudandigam/agent-inspect",
  },
} as const;

export function githubDoc(path: string): string {
  return `${site.githubDocs}/${path}`;
}
