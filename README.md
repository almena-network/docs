# Almena Network — documentation site (shell)

Docusaurus 3 project: **navbar, sidebars, i18n (en/es), and placeholder docs only**. Replace stubs under `docs/docs/` and `i18n/es/docusaurus-plugin-content-docs/current/` when you add real content.

## Prerequisites

| Tool | Version |
|------|---------|
| [Node.js](https://nodejs.org/) | 20+ (see `package.json` engines if stricter) |
| [pnpm](https://pnpm.io/) | As in `package.json` `packageManager` |
| [Task](https://taskfile.dev/) | Optional; wrappers for common work live in `Taskfile.yml` |

## Taskfile

Run tasks from the **`docs/`** directory, or from the monorepo root with **`task -d docs <task>`**.

| Task | Description |
|------|-------------|
| **`default`** | Lists available tasks (same as `task --list`). |
| **`install`** | Installs dependencies (`pnpm install --frozen-lockfile`, falls back to `pnpm install` if the lockfile is not satisfied). |
| **`dev`** | Dev server with hot reload on port **3001** (`pnpm run start`). |
| **`build`** | Production build (`pnpm run build`). |
| **`serve`** | Serves the built site locally on port **3001** (`pnpm run serve`). Run **`build`** first. |
| **`clean`** | Clears the Docusaurus cache when `node_modules` exists (`pnpm run clear`), then removes **`node_modules`**. |
| **`clean:all`** | Runs **`clean`**, then deletes a local **`.env`** file if present. |

Examples:

```bash
cd docs
task install
task dev
task build
task serve
```

```bash
# From the monorepo root
task -d docs install
task -d docs dev
task -d docs build
task -d docs serve
```

## Commands (pnpm)

Useful scripts from `package.json` when not using Task:

```bash
pnpm install
pnpm start          # http://localhost:3001 — dev server
pnpm build
pnpm serve          # preview production build (port 3001)
pnpm clear          # Docusaurus cache
pnpm typecheck
pnpm run write-translations
pnpm run write-heading-ids
```

## Layout

- **Docs (English):** `docs/docs/{users,integrators,developers}/`
- **Docs (Spanish):** `i18n/es/docusaurus-plugin-content-docs/current/{users,integrators,developers}/`
- **Homepage:** `src/pages/index.tsx`
- **Theme / config:** `docusaurus.config.ts`, `sidebars.ts`, `src/css/custom.css`

After production build, `scripts/postbuild.js` may reorganize output (see script header).
