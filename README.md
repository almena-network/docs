# Documentation - Almena Network

Docusaurus documentation site for Almena Network platform.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [**Task**](https://taskfile.dev/) | 3.x | Task runner |
| [**Node.js**](https://nodejs.org/) | 20+ | Docusaurus, build |
| [**pnpm**](https://pnpm.io/) | Latest | Package manager |

## Setup

### Install Dependencies

```bash
pnpm install
```

## Running the Documentation

```bash
# Start development server
pnpm start

# Access at http://localhost:3001
```

## Build

```bash
# Production build
pnpm build

# Preview production build
pnpm serve
```

## Development Commands

```bash
pnpm start        # Start dev server (hot reload) on port 3001
pnpm build        # Production build
pnpm serve        # Serve production build on port 3001
pnpm clear        # Clear cache
```

## Project Structure

```
docs/
├── docs/                      # Markdown documentation
│   ├── user-guide/           # End-user documentation
│   ├── integrator-guide/     # Integration documentation
│   ├── api-reference/        # API documentation
│   └── getting-started-*/    # Getting started guides
├── src/                      # React components
├── static/                   # Static assets
├── docusaurus.config.ts      # Docusaurus configuration
└── sidebars.ts              # Navigation structure
```

## Documentation Structure

See [DOCUMENTATION_STRUCTURE.md](./DOCUMENTATION_STRUCTURE.md) for complete structure overview.

### Audience Separation

- **User Documentation**: How to use Almena Network
- **Integrator Documentation**: How to integrate Almena Network into applications

## Important Rules

### ⚠️ Only Document What Exists

- **NEVER** document features that aren't implemented
- Mark future features clearly as "Coming Soon"
- Documentation must reflect current codebase state

### Languages

- **All documentation MUST be available in English AND Spanish**
- English is the default/source language (`docs/`)
- Spanish translations live in `i18n/es/docusaurus-plugin-content-docs/current/`
- Both versions must be kept in sync

## Internationalization (i18n)

### Supported Languages

- **English** (default): `docs/`
- **Spanish**: `i18n/es/docusaurus-plugin-content-docs/current/`

### Working with Translations

#### 1. Write Content in English First

Always create or update content in English first in the `docs/` directory.

#### 2. Translate to Spanish

Copy the file structure to the Spanish directory and translate:

```bash
# Example: Translating a user guide file
# English source: docs/user-guide/wallet/dashboard.md
# Spanish target: i18n/es/docusaurus-plugin-content-docs/current/user-guide/wallet/dashboard.md

# Create the directory structure
mkdir -p i18n/es/docusaurus-plugin-content-docs/current/user-guide/wallet/

# Copy and translate
cp docs/user-guide/wallet/dashboard.md \
   i18n/es/docusaurus-plugin-content-docs/current/user-guide/wallet/dashboard.md

# Edit the Spanish file with translations
```

#### 3. Update JSON Translation Files

When adding new navbar items, footer links, or sidebar categories, update:
- `i18n/es/docusaurus-theme-classic/navbar.json`
- `i18n/es/docusaurus-theme-classic/footer.json`
- `i18n/es/docusaurus-plugin-content-docs/current.json`

#### 4. Regenerate Translation Files (if needed)

If structure changes significantly:

```bash
pnpm docusaurus write-translations --locale es
```

### Development with Translations

#### Start dev server in Spanish

```bash
pnpm start -- --locale es
```

#### Build both languages

```bash
pnpm build
```

This builds both English and Spanish versions.

### Translation Guidelines

1. **Maintain structure**: Keep the same file structure in both languages
2. **Code examples**: Keep code in English, translate comments
3. **Technical terms**: Some terms like "DID", "API", "SDK" remain in English
4. **URLs and links**: Update internal links to point to Spanish versions when applicable
5. **Keep in sync**: When updating English docs, update Spanish immediately

### Checking Translations

```bash
# Build and check for broken links in both languages
pnpm build

# Serve and check Spanish version
pnpm serve
# Then navigate to /es/ in your browser
```

## Technology Stack

- **Framework**: Docusaurus 3
- **Language**: TypeScript, MDX
- **Build Tool**: Webpack
- **Package Manager**: pnpm

## Troubleshooting

### Port 3001 in use

```bash
# Run on different port
pnpm start --port 3002
```

### Build errors

```bash
# Clear cache and rebuild
pnpm clear
pnpm build
```

### Broken links warnings

All markdown links must reference existing files. Check console output for specific broken links.

## Support

For detailed information, see:
- [Main Project README](../README.md)
- [Docusaurus Documentation](https://docusaurus.io/)
