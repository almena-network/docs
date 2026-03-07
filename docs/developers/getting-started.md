---
sidebar_position: 2
title: Getting Started
sidebar_label: Getting Started
---

# Getting Started

This guide walks you through setting up the Almena Network development environment.

## Prerequisites

### Required Tools

| Tool | Version | Install |
|------|---------|---------|
| **Rust** | 2021 edition | [rustup.rs](https://rustup.rs/) |
| **Node.js** | >= 24 | [nodejs.org](https://nodejs.org/) |
| **pnpm** | >= 10 | `npm install -g pnpm` |
| **protoc** | Latest | See below |
| **Task** | >= 3 | [taskfile.dev](https://taskfile.dev/) |

### Installing protoc

The Protocol Buffers compiler is required to build the daemon and any gRPC client:

```bash
# macOS
brew install protobuf

# Linux (Debian/Ubuntu)
sudo apt install protobuf-compiler

# Windows
choco install protoc
```

### Tauri v2 Prerequisites

For desktop and wallet development, you need the Tauri v2 system dependencies:

- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: See [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)
- **Windows**: Visual Studio Build Tools with C++ workload

## Clone the Repository

```bash
git clone --recurse-submodules git@github.com:almena-network/almena-network.git
cd almena-network
```

If you already cloned without `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

All submodules track the `develop` branch.

## Install Dependencies

```bash
task install
```

This runs `task install` in each submodule (daemon, desktop, wallet, cli).

## Running in Development

Each module has its own dev command:

```bash
# Start the daemon (required by desktop and CLI)
task daemon:dev

# In a separate terminal, start the desktop app
task desktop:dev

# Or start the wallet
task wallet:dev

# Or start the CLI
task cli:dev
```

:::tip
Always start the daemon first. The desktop app and CLI connect to it via gRPC on `[::1]:50051`.
:::

## Common Tasks

```bash
# Type-check / compile-check all modules
task check

# Build all modules (release)
task build

# Clean all build artifacts
task clean
```

### Daemon-specific

```bash
task daemon:test       # Run tests
task daemon:clippy     # Lint with Clippy
task daemon:fmt        # Format code
task daemon:fmt:check  # Check formatting
```

### Proto Workflow

After editing `daemon/proto/almena/daemon/v1/service.proto`:

```bash
# Update desktop client
task desktop:proto:copy && task desktop:proto:client

# Update CLI client
task cli:proto:copy && task cli:proto:client
```

## Project Structure

```
almena-network/
├── daemon/          # Rust gRPC server + P2P networking
├── desktop/         # Tauri v2 + React 19 admin console
├── wallet/          # Tauri v2 + React 19 identity wallet
├── cli/             # Rust TUI client
├── docs/            # Docusaurus documentation
├── Taskfile.yml     # Root orchestration
├── CLAUDE.md        # AI assistant instructions
└── LICENSE          # Apache-2.0 OR MIT
```

Each submodule has its own `Taskfile.yml`, `README.md`, and independent CI/CD configuration.
