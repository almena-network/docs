---
sidebar_position: 1
title: "Module: Daemon"
sidebar_label: Daemon
---

# Module: Daemon (`almenad`)

The daemon is the core background service of Almena Network. It provides the gRPC API and manages P2P networking.

## Overview

| Property | Value |
|----------|-------|
| Crate name | `almenad` |
| Language | Rust 2021 |
| Version | `2026.1.1-develop` |
| License | Apache-2.0 OR MIT |
| Repository | `almena-network/daemon` |

## Source Structure

```
daemon/
├── src/
│   ├── main.rs          # gRPC server, CLI args, service handlers
│   ├── p2p.rs           # libp2p swarm, mDNS discovery, PeerStore
│   └── path.rs          # Platform-specific data directories
├── proto/
│   └── almena/daemon/v1/
│       └── service.proto  # gRPC service contract (source of truth)
├── scripts/
│   ├── dev.sh           # Dev mode launcher
│   └── package.sh       # Packaging script
├── assets/
│   ├── macos/           # LaunchAgent, postinstall, uninstall
│   ├── debian/          # systemd service, postinst/postrm
│   └── wix/             # Windows MSI config
├── build.rs             # tonic-build proto compilation
├── Cargo.toml           # Dependencies
└── Taskfile.yml         # Task orchestration
```

## Key Dependencies

| Dependency | Version | Purpose |
|-----------|---------|---------|
| tonic | 0.12 | gRPC server framework |
| prost | 0.13 | Protocol Buffer serialization |
| libp2p | 0.56 | Peer-to-peer networking |
| tokio | 1 | Async runtime |
| clap | 4 | CLI argument parsing |
| reqwest | 0.12 | HTTP client (geolocation API) |
| sysinfo | 0.31 | OS information |
| tracing | 0.1 | Structured logging |

## Architecture

### gRPC Server (`main.rs`)

The `DaemonServiceImpl` struct implements 5 RPC handlers:

1. **Ping** — Returns `"pong"` (health check)
2. **GetVersion** — Returns `CARGO_PKG_VERSION`
3. **GetSystemInfo** — Uses `sysinfo` crate for OS name/version
4. **GetGeolocation** — HTTP call to ipapi.co, returns IP/city/coordinates
5. **ListPeers** — Reads from the shared `PeerStore`

The server starts with gRPC reflection enabled, allowing tools like Postman and grpcurl to discover methods automatically.

### P2P Networking (`p2p.rs`)

The P2P layer uses libp2p with:

- **Transport:** TCP
- **Encryption:** Noise protocol
- **Multiplexing:** Yamux
- **Behaviours:** Ping + mDNS (LAN peer discovery)

The `PeerStore` is a thread-safe `Arc<RwLock<HashMap<PeerId, PeerEntry>>>` shared between the gRPC handlers and the swarm event loop.

**Event handling:**
- `NewListenAddr` — Registers the daemon's own addresses
- `ConnectionEstablished` — Adds peer, marks connected, detects LAN vs internet
- `ConnectionClosed` — Marks peer disconnected
- `Mdns::Discovered` — Adds new peers and attempts dial
- `Mdns::Expired` — Marks peers disconnected

### Data Directories (`path.rs`)

| Mode | macOS | Linux | Windows |
|------|-------|-------|---------|
| Production | `~/Library/Application Support/network.almena.daemon` | `~/.local/share/network.almena.daemon` | `%APPDATA%\network.almena.daemon` |
| Development | `./workspace` | `./workspace` | `./workspace` |

Subdirectories: `data/`, `config/`, `logs/`

## Development

```bash
# Install dependencies
task install

# Run with hot reload
task dev

# Run tests
task test

# Lint
task clippy

# Format
task fmt
```

## Packaging

The daemon can be packaged as a native installer for each platform:

```bash
task package          # Auto-detect platform
task package:darwin   # macOS .pkg (signed + notarized)
task package:linux    # Linux .deb
task package:windows  # Windows .msi
```

### Platform Integration

- **macOS**: LaunchAgent at `~/Library/LaunchAgents/network.almena.daemon.plist` (auto-start on login)
- **Linux**: systemd user service (`systemctl --user start almenad`)
- **Windows**: Windows Service (`sc start AlmenaD`)
