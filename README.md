# Documentation - Almena ID

Docusaurus documentation site for Almena ID platform.

## Prerequisites

### Required

- **Node.js**: >= 20.0.0
- **yarn**: Latest version
- **Docker**: Optional (for containerized deployment)

### Installation

```bash
# Install Node.js (if not installed)
# macOS: brew install node@20
# Linux: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install yarn
npm install -g yarn

# Verify
node --version    # v20.0.0+
yarn --version    # Latest
```

## Setup

### Install Dependencies

```bash
yarn install
```

## Running the Documentation

### Option 1: With yarn (Development)

```bash
# Start development server
yarn start

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
yarn build

# Preview production build
yarn serve
```

## Development Commands

```bash
yarn start        # Start dev server (hot reload) on port 3001
yarn build        # Production build
yarn serve        # Serve production build on port 3001
yarn clear        # Clear cache
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
- **Package Manager**: yarn

## Troubleshooting

### Port 3001 in use

```bash
# Run on different port
yarn start --port 3002
```

### Build errors

```bash
# Clear cache and rebuild
yarn clear
yarn build
```

### Broken links warnings

All markdown links must reference existing files. Check console output for specific broken links.

## Support

For detailed information, see:
- [Main Project README](../README.md)
- [Docusaurus Documentation](https://docusaurus.io/)
