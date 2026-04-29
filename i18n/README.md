# i18n

- **Spanish UI strings:** `es/code.json`, `es/docusaurus-theme-classic/*.json`
- **Spanish docs:** mirror English paths under `es/docusaurus-plugin-content-docs/current/`

When you add English Markdown under `docs/docs/`, add the translated files under `current/` with the same path. Regenerate theme strings if needed: `pnpm write-translations -- --locale es`.
