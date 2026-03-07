# Internationalization (i18n)

This directory contains translations for the Almena Network documentation.

## Structure

```
i18n/
└── es/                                                      # Spanish translations
    ├── code.json                                            # UI strings (theme, components)
    ├── docusaurus-theme-classic/
    │   ├── navbar.json                                      # Navbar translations
    │   └── footer.json                                      # Footer translations
    ├── docusaurus-plugin-content-blog/
    │   └── options.json                                     # Blog plugin translations
    └── docusaurus-plugin-content-docs/
        └── current/                                         # Documentation translations
            ├── getting-started-user/
            │   └── overview.md                              # Spanish version of getting started
            ├── user-guide/
            │   └── ...                                      # Spanish user guides (to be added)
            ├── integrator-guide/
            │   └── ...                                      # Spanish integrator guides (to be added)
            └── ...                                          # Other documentation sections
```

## How Translations Work

### 1. UI Translations (JSON files)

These files translate the Docusaurus theme UI elements:

- **`code.json`**: General UI strings (buttons, labels, messages)
- **`navbar.json`**: Navigation bar items
- **`footer.json`**: Footer links and copyright
- **`current.json`**: Sidebar category labels

### 2. Documentation Translations (MD/MDX files)

Documentation content is translated by creating corresponding files in `current/`:

**English source**: `docs/user-guide/wallet/dashboard.md`  
**Spanish translation**: `i18n/es/docusaurus-plugin-content-docs/current/user-guide/wallet/dashboard.md`

## Adding a New Translation

### Step 1: Translate UI Elements

1. Edit `navbar.json`, `footer.json`, and `current.json`
2. Update the `message` field for each key
3. Keep the `description` field as documentation (can stay in English)

### Step 2: Translate Documentation

1. **Create directory structure**:
   ```bash
   mkdir -p i18n/es/docusaurus-plugin-content-docs/current/user-guide/wallet
   ```

2. **Copy English file**:
   ```bash
   cp docs/user-guide/wallet/dashboard.md \
      i18n/es/docusaurus-plugin-content-docs/current/user-guide/wallet/dashboard.md
   ```

3. **Translate content**:
   - Translate all text, titles, descriptions
   - Keep code examples in English (translate comments)
   - Keep technical terms like DID, API, SDK untranslated
   - Update internal links to point to Spanish versions when available

### Step 3: Test

```bash
# Build both languages
pnpm build

# Or start dev server in Spanish
pnpm start -- --locale es
```

## Translation Guidelines

### What to Translate

✅ **Do translate**:
- Page titles and headings
- Body text and descriptions
- UI labels and buttons
- Error messages
- Examples explanations
- Comments in code

❌ **Don't translate**:
- Code examples (code itself)
- Technical terms: DID, API, SDK, JSON, etc.
- Command names: `pnpm`, `docker`, etc.
- Package names: `@tauri-apps/api`, etc.
- URLs and domain names
- GitHub usernames and repository names

### Technical Terms

Keep these in English:
- DID (Decentralized Identifier)
- API (Application Programming Interface)
- SDK (Software Development Kit)
- JSON, XML, YAML
- HTTP, HTTPS
- JWT (JSON Web Token)
- Ed25519, BIP39, Argon2
- Docker, Kubernetes
- Git, GitHub

### Style Guide

1. **Formal vs Informal**: Use formal "usted" form in Spanish
2. **Consistency**: Use the same translation for repeated terms
3. **Clarity**: Prioritize clarity over literal translation
4. **Context**: Consider the target audience (users vs integrators)

## Translation Status

### Completed

- ✅ UI elements (navbar, footer, sidebar categories)
- ✅ Getting Started - User (overview) - Example file

### To Do

- ⏳ User Guide (all pages)
- ⏳ Integrator Guide (all pages)
- ⏳ API Reference (all pages)
- ⏳ Tutorials (all pages)
- ⏳ FAQ (all pages)

## Maintenance

### When Adding New Documentation

1. Write in English first (`docs/`)
2. Create Spanish translation immediately
3. Both versions must be kept in sync

### When Updating Existing Documentation

1. Update English version
2. Update Spanish version
3. Test both versions

## Tools & Commands

### Generate Translation Files

```bash
# Generate/update translation JSON files
pnpm docusaurus write-translations --locale es
```

### Development

```bash
# Start dev server in English (default)
pnpm start

# Start dev server in Spanish
pnpm start -- --locale es
```

### Build

```bash
# Build both languages
pnpm build
```

### Serve

```bash
# Serve production build
pnpm serve

# Access Spanish version at: http://localhost:3001/es/
```

## Adding More Languages

To add a new language (e.g., French):

1. **Update `docusaurus.config.ts`**:
   ```typescript
   i18n: {
     defaultLocale: 'en',
     locales: ['en', 'es', 'fr'],
     localeConfigs: {
       // ... existing configs
       fr: {
         label: 'Français',
         direction: 'ltr',
         htmlLang: 'fr-FR',
       },
     },
   },
   ```

2. **Generate translation files**:
   ```bash
   pnpm docusaurus write-translations --locale fr
   ```

3. **Translate UI elements** in generated JSON files

4. **Translate documentation** by creating `i18n/fr/docusaurus-plugin-content-docs/current/`

## Resources

- [Docusaurus i18n Tutorial](https://docusaurus.io/docs/i18n/tutorial)
- [Project Translation Guidelines](../README.md#internationalization-i18n)
