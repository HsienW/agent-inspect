# AgentInspect VS Code extension

Read-only sidebar for local trace directories. The extension shells out to the published `agent-inspect` CLI (`list`, `view`, `timeline`, `report`, `check`, `doctor`, `verify-safe`).

**Support level:** Experimental (unpublished). Ignored by Changesets; not part of the fixed npm release group.

## Product scope decision (6.24.0)

**Disposition: close without Marketplace publish (Option A, confirmed).**

- Keep the in-repo extension unpublished.
- Do **not** publish to the VS Code Marketplace in this train (credentials + product priority).
- Open PR [#295](https://github.com/rajudandigam/agent-inspect/pull/295) (sample trace command) remains **out of the adoption train** — close or park as contributor-optional; do not merge solely to clear the queue while CI is red.
- Related issues (#66, #65) stay deferred until a later capacity window revisits VS Code.

Core, official adapters, CLI, Evidence, and TraceContract remain the adoption surface.

## Develop

```bash
pnpm install
pnpm --filter agent-inspect-vscode run build
```

Open `packages/vscode` in VS Code and press F5 (Extension Development Host).

## Requirements

- Node 20+
- `agent-inspect` available via `npx` in the workspace (devDependency or global)

## Manual gate

First VS Code Marketplace publish requires maintainer credentials. See [VSCODE-EXTENSION-RFC.md](./proposals/VSCODE-EXTENSION-RFC.md).
