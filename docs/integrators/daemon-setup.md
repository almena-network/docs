---
sidebar_position: 2
title: Daemon Setup
sidebar_label: Daemon Setup
---

# Daemon Setup

The Almena daemon (`almenad`) is the background service that powers the P2P network and exposes the gRPC API. This guide covers how to install and run it.

## Prerequisites

- **Rust** toolchain (2021 edition, install via [rustup](https://rustup.rs/))
- **Protocol Buffers** compiler (`protoc`)
  - macOS: `brew install protobuf`
  - Linux: `apt install protobuf-compiler`
  - Windows: `choco install protoc`
- **Task** runner ([taskfile.dev](https://taskfile.dev/))

## Installation from Source

```bash
git clone git@github.com:almena-network/daemon.git
cd daemon
task install
task build
```

The release binary is located at `target/release/almenad`.

## Running the Daemon

### Development Mode

```bash
task dev
```

This starts the daemon with:
- Debug logging enabled
- Data stored in `./workspace/` directory
- Hot reload via `cargo watch`
- gRPC server on `[::1]:50051` (IPv6 localhost)

### Production Mode

```bash
./almenad
```

Or with custom settings:

```bash
./almenad --grpc-addr "[::1]:50051"
```

#### CLI Options

| Flag | Default | Description |
|------|---------|-------------|
| `--grpc-addr` | `[::1]:50051` | gRPC listen address |
| `--dev` | `false` | Enable debug logging and use dev workspace |
| `--version` | — | Print version and exit |

### Environment Variables

| Variable | Description |
|----------|-------------|
| `RUST_LOG` | Log level override (`trace`, `debug`, `info`, `warn`, `error`) |
| `GRPC_ADDR` | Alternative to `--grpc-addr` flag |
| `ALMENAD_DATA_DIR` | Custom data directory (dev mode only) |

## Data Directories

The daemon stores its data in platform-specific locations:

| Platform | Path |
|----------|------|
| macOS | `~/Library/Application Support/network.almena.daemon` |
| Linux | `~/.local/share/network.almena.daemon` |
| Windows | `%APPDATA%\network.almena.daemon` |

In development mode (`--dev`), all data is stored in the local `./workspace/` directory.

## Platform Installers

Pre-built installers are available for each platform:

| Platform | Format | Build Command |
|----------|--------|---------------|
| macOS | `.pkg` (signed and notarized) | `task package:darwin` |
| Linux | `.deb` | `task package:linux` |
| Windows | `.msi` | `task package:windows` |

The macOS installer registers the daemon as a **LaunchAgent** (starts automatically on login). On Linux, a **systemd** user service is created. On Windows, it runs as a **Windows Service**.

## Verifying the Installation

Once the daemon is running, verify connectivity with any gRPC client:

```bash
# Using grpcurl
grpcurl -plaintext '[::1]:50051' almena.daemon.v1.DaemonService/Ping
```

Expected response:

```json
{
  "message": "pong"
}
```

The daemon also supports **gRPC Server Reflection**, so tools like Postman and grpcurl can discover all available methods automatically.

## P2P Networking

The daemon automatically discovers other Almena nodes on your local network using **mDNS** (multicast DNS). Discovered peers appear in the `ListPeers` response.

Current P2P capabilities:
- **Transport**: TCP
- **Encryption**: Noise protocol
- **Multiplexing**: Yamux
- **Discovery**: mDNS (LAN only)
- **Idle timeout**: 60 seconds

:::info Coming Soon
Internet peer discovery (beyond LAN) and relay-based connectivity are planned for future releases.
:::
