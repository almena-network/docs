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

### Language

- **All documentation MUST be in English**
- No exceptions

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
