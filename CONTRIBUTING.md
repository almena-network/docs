# Contributing to the documentation site

Thank you for your interest in contributing. This document guides work on the **Docusaurus** site in this directory; see the parent [Almena Network CONTRIBUTING](../CONTRIBUTING.md) for monorepo-wide conventions.

When this directory is **not** inside the full monorepo, ignore relative links to `../.cursor/rules/`; substitute your organization’s equivalent policies if needed.

## Community standards and license

- Participate according to our **[Code of Conduct](CODE_OF_CONDUCT.md)**.
- By contributing, you agree your contributions are licensed under the **same terms** as this project. See [LICENSE.md](LICENSE.md) when present.
- Report **security issues** privately; see [SECURITY.md](SECURITY.md).

## What to contribute

- **Documentation** under `docs/docs/` (English) with matching updates under `i18n/es/docusaurus-plugin-content-docs/current/` (Spanish), per project rules.
- **Fixes** for broken links, sidebars, and build failures.
- **Diagrams** (prefer **Mermaid** in markdown over one-off external tools unless a graphic is explicitly needed).
- **Theme / UX** improvements that stay accessible and readable.

For large structural changes, open an issue first so maintainers can align on information architecture.

## Bilingual workflow (en / es)

1. **Mirror** every English page you add or substantially change with a full **Spanish** translation in the matching path under `i18n/es/...`.
2. Keep **`sidebar_position`** and frontmatter **in sync** between EN and ES files.
3. The Docusaurus config may treat broken links strictly; verify **`pnpm run build`** after edits.

## Development setup

Prerequisites: **Node.js** 20+, **pnpm**. Optional: **[Task](https://taskfile.dev)**.

From **`docs/`**:

```bash
task install
task dev
```

From the monorepo root:

```bash
task -d docs install
task -d docs dev
```

See [README.md](README.md) for ports (`3001` by default), `build`, `serve`, and `clear`.

## Coding and writing expectations

- **Language:** English source pages; Spanish mirrors as above. Cursor rules at the monorepo root also apply when this tree lives there ([`.cursor/rules/documentation-and-rules-language.mdc`](../.cursor/rules/documentation-and-rules-language.mdc)).
- **Audience:** Match the section—`users/` vs `integrators/` vs `developers/`—and avoid unnecessary jargon in user-facing pages.
- **Identity / credentials:** When documenting DIDs or VCs, align with [`.cursor/rules/w3c-standards.mdc`](../.cursor/rules/w3c-standards.mdc).
- **Screenshot placeholders:** If you document UI without a real image, use the project’s agreed placeholder admonition pattern (see [CLAUDE.md](../CLAUDE.md) docs section when available).
- **Dependencies:** Prefer well-maintained open-source packages ([`.cursor/rules/opensource-free-dependencies.mdc`](../.cursor/rules/opensource-free-dependencies.mdc)).

Run before opening a PR:

```bash
pnpm run typecheck
pnpm run build
```

## Pull requests

1. **Branch** from the default branch unless maintainers specify otherwise.
2. Describe **what** changed, **which locales** you updated, and **how you verified** (`build`, link check).
3. Respond to review feedback; split very large doc drops when asked.

## Questions

Use the GitHub issue tracker for **this** repository or the channel maintainers prefer. See [README.md](README.md) for layout and tooling details.
