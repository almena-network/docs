# Almena Network — documentation site (shell)

Docusaurus 3 project: **navbar, sidebars, i18n (en/es), and placeholder docs only**. Replace stubs under `docs/docs/` and `i18n/es/docusaurus-plugin-content-docs/current/` when you add real content.

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | 20+ (see `package.json` engines if stricter) |
| [pnpm](https://pnpm.io/) | As in `package.json` `packageManager` |

## Commands

```bash
pnpm install
pnpm start          # http://localhost:3001
pnpm build
pnpm serve          # preview production build
```

Optional: [Taskfile](https://taskfile.dev/) — `task -d docs install`, `task -d docs build`, etc.

## Layout

- **Docs (English):** `docs/docs/{users,integrators,developers}/`
- **Docs (Spanish):** `i18n/es/docusaurus-plugin-content-docs/current/{users,integrators,developers}/`
- **Homepage:** `src/pages/index.tsx`
- **Theme / config:** `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`

After production build, `scripts/postbuild.js` may reorganize output (see script header).
