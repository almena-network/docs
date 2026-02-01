# Documentation - Almena ID

Docusaurus documentation site for Almena ID platform.

## Prerequisites

### Required

- **Node.js**: >= 20.0.0
- **pnpm**: Latest version
- **Docker**: Optional (for containerized deployment)

### Installation

```bash
# Install Node.js (if not installed)
# macOS: brew install node@24
# Linux: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install pnpm
npm install -g pnpm

# Verify
node --version    # v24.0.0+
pnpm --version    # Latest
```

## Setup

### Install Dependencies

```bash
pnpm install
```

## Running the Documentation

### Option 1: With pnpm (Development)

```bash
# Start development server
pnpm start

# Access at http://localhost:3001
```

### Option 2: With Docker

```bash
# Build and start
docker compose up -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

## Build

```bash
# Production build
pnpm build

# Preview production build
pnpm serve
```

## Task Runner

This module uses [Task](https://taskfile.dev/) for automation. Run `task --list` to see all available commands.

### Quick Reference

```bash
task install              # Install dependencies
task dev                  # Start Docusaurus dev server
task build                # Production build
task serve                # Serve production build locally
task clean                # Clean cache and build artifacts
```

### All Available Tasks

| Task | Description |
|------|-------------|
| `task install` | Install dependencies with pnpm |
| `task install:frozen` | Install with frozen lockfile |
| `task dev` | Start Docusaurus development server |
| `task start` | Start development server (alias) |
| `task build` | Build documentation for production |
| `task serve` | Serve production build locally |
| `task typecheck` | Run TypeScript type checking |
| `task swizzle` | Swizzle Docusaurus components |
| `task write-translations` | Generate translation files |
| `task write-heading-ids` | Generate heading IDs for MDX files |
| `task docker:build` | Build Docker image |
| `task docker:up` | Start with Docker Compose |
| `task docker:down` | Stop Docker Compose services |
| `task docker:logs` | View Docker Compose logs |
| `task clean` | Clean Docusaurus cache and build |
| `task clean:all` | Clean everything including node_modules |

## Development Commands (Manual)

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

- **User Documentation**: How to use Almena ID
- **Integrator Documentation**: How to integrate Almena ID into applications

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

## Environment Variables

None required. All documentation is static content.

## Docker

### Build Image

```bash
docker build -t almena-docs .
```

### Run Container

```bash
docker run -p 3001:3001 almena-docs
```

### With Docker Compose

```bash
docker compose up -d
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
