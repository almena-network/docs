---
sidebar_position: 4
title: "Module: CLI"
sidebar_label: CLI
---

# Module: CLI

The CLI provides a terminal user interface (TUI) for managing and monitoring the Almena daemon.

## Overview

| Property | Value |
|----------|-------|
| Crate name | `almena-cli` |
| Language | Rust 2021 |
| Version | `2026.3.5` |
| License | Apache-2.0 OR MIT |
| Repository | `almena-network/cli` |

## Source Structure

```
cli/
├── src/
│   ├── main.rs              # Entry point, CLI args
│   ├── tui.rs               # Ratatui TUI main loop
│   ├── daemon.rs            # gRPC client to daemon
│   ├── daemon_process.rs    # Process spawning/management
│   ├── theme.rs             # Design system colors
│   └── path.rs              # Platform-specific data directories
├── proto/
│   └── almena/daemon/v1/
│       └── service.proto    # gRPC service definition (copied from daemon)
├── build.rs                 # tonic-build proto compilation
├── Cargo.toml               # Dependencies
└── Taskfile.yml             # Task orchestration
```

## Key Dependencies

| Dependency | Version | Purpose |
|-----------|---------|---------|
| ratatui | 0.29 | Terminal UI framework |
| crossterm | 0.28 | Terminal input/output |
| tonic | 0.12 | gRPC client |
| prost | 0.13 | Protocol Buffer serialization |
| tokio | 1 | Async runtime |
| clap | 4 | CLI argument parsing |
| anyhow | 1 | Error handling |

## Implemented Features

### TUI Interface

The TUI runs an async event loop with 100ms polling:

**Keyboard Commands:**

| Key | Action |
|-----|--------|
| `s` | Start the daemon |
| `x` | Stop the daemon |
| `p` | Ping the daemon |
| `q` / `Esc` | Quit the CLI |

**UI Layout:**
1. **Header** — Tagline and daemon status indicator
2. **Status Card** — Colored dot showing daemon state:
   - Red = Stopped
   - Green = Running
   - Yellow = Checking
3. **Main Area** — Available commands, daemon address, last command output
4. **Footer** — Key hints

### Daemon Status Monitoring

A background task checks daemon status every **2 seconds** by attempting a gRPC ping. The status indicator updates automatically.

### gRPC Client

The `daemon.rs` module provides:

```rust
pub async fn is_running(addr: &str) -> bool  // Ping check
pub async fn ping(addr: &str) -> String       // Ping with response message
```

### Daemon Process Management

Same dual-mode management as the desktop app:

| Mode | Start | Stop |
|------|-------|------|
| **Development** | Spawns binary from `ALMENAD_DIR` | Kills child process |
| **macOS** | `launchctl load ...plist` | `launchctl unload ...plist` |
| **Linux** | `systemctl --user start almenad` | `systemctl --user stop almenad` |
| **Windows** | `sc start AlmenaD` | `sc stop AlmenaD` |

### Theme

The CLI uses a color theme consistent with the platform design system:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#FB923C` | Active elements, highlights |
| Secondary | `#8B5CF6` | Accents |
| Text | `#fafafa` | Main text |
| Muted | `#a3a3a3` | Labels, hints |
| Success | Green | Running status |
| Error | Red | Stopped status |
| Warning | Yellow | Checking status |

## Development

```bash
# Install dependencies
task install

# Run in dev mode
task dev

# Build for release
task build

# Check compilation
task check
```

### CLI Arguments

| Flag | Default | Description |
|------|---------|-------------|
| `--daemon-addr` | `http://127.0.0.1:50051` | Daemon gRPC address |
| `--version` | — | Print version and exit |

### Proto Workflow

After daemon proto changes:

```bash
task proto:copy     # Copy proto from daemon
task proto:client   # Rebuild gRPC client (includes proto:copy)
```
