---
sidebar_position: 3
title: Architecture
sidebar_label: Architecture
---

# Architecture

Almena Network follows a modular architecture where each component has a clear responsibility and communicates through well-defined interfaces.

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    User Devices                      │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Wallet   │  │   Desktop    │  │     CLI       │  │
│  │ (Holders) │  │ (Issuers/    │  │  (Terminal)   │  │
│  │          │  │  Requesters) │  │               │  │
│  └────┬─────┘  └──────┬───────┘  └───────┬───────┘  │
│       │               │                  │           │
│       │          ┌─────┴─────┐            │           │
│       │          │  Daemon   │◄───────────┘           │
│       │          │ (almenad) │                        │
│       │          │  gRPC +   │                        │
│       │          │  libp2p   │                        │
│       │          └─────┬─────┘                        │
└───────│────────────────│─────────────────────────────┘
        │                │
        │                │ P2P (mDNS, TCP+Noise+Yamux)
        │                │
        │           ┌────┴────┐
        │           │  Other  │
        │           │ Daemons │
        │           └─────────┘
        │
        │ (future: DIDComm v2)
        │
   ┌────┴────┐
   │Mediator │
   │(planned)│
   └─────────┘
```

## Components

### Daemon (`almenad`)

The daemon is the core background service that runs on every node. It is the **only component that participates in the P2P network**.

**Responsibilities:**
- Expose gRPC API for local clients (desktop, CLI)
- Manage P2P connections via libp2p
- Discover peers on the local network (mDNS)
- Provide geolocation data for network visualization

**Technology:** Rust, tonic 0.12, libp2p 0.56, tokio

**Current RPC endpoints:** Ping, GetVersion, GetSystemInfo, GetGeolocation, ListPeers

### Desktop

The desktop application is an admin console designed for **Issuers** (entities that issue credentials) and **Requesters** (entities that request credential presentations).

**Responsibilities:**
- Authenticate users via QR code
- Visualize the P2P network on an interactive world map
- Control the daemon lifecycle (start/stop)
- Provide organization management interface

**Technology:** Tauri v2, React 19, TypeScript, tonic (Rust gRPC client)

**Architecture:** The Tauri Rust backend acts as a bridge between the React frontend and the daemon's gRPC API. Frontend components call Tauri commands via `invoke()`, which in turn make gRPC calls to the daemon.

### Wallet

The wallet is a mobile-first application for **Holders** — individuals who own and manage their decentralized identity.

**Responsibilities:**
- Create and manage decentralized identities (DIDs)
- Store private keys securely in the OS keychain
- Display identity QR codes for authentication

**Technology:** Tauri v2, React 19, TypeScript

**Architecture:** Similar to Desktop but optimized for a 390×844 mobile viewport. Currently has minimal Rust backend (no gRPC client yet).

### CLI

The CLI provides a terminal interface for daemon management and monitoring.

**Responsibilities:**
- Start, stop, and ping the daemon
- Display daemon status in real time
- Provide a text-based alternative to the desktop app

**Technology:** Rust, ratatui 0.29, crossterm 0.28, tonic (gRPC client)

## Communication Patterns

### Local Communication (gRPC)

Desktop, wallet, and CLI communicate with the daemon via **gRPC** on the local machine:

```
Client (Desktop/CLI) ──gRPC──► Daemon ([::1]:50051)
```

The proto file at `daemon/proto/almena/daemon/v1/service.proto` is the **single source of truth**. Clients copy and generate code from this file.

### P2P Communication (libp2p)

Daemons discover and communicate with each other over the P2P network:

- **Transport:** TCP
- **Encryption:** Noise protocol
- **Multiplexing:** Yamux
- **Discovery:** mDNS (LAN only, currently)

Each daemon maintains a `PeerStore` — a thread-safe map of discovered peers with their connection status.

## Data Storage

### Platform Directories

Each module stores data in platform-specific locations:

| Module | macOS | Linux |
|--------|-------|-------|
| Daemon | `~/Library/Application Support/network.almena.daemon` | `~/.local/share/network.almena.daemon` |
| CLI | `~/Library/Application Support/network.almena.cli` | `~/.local/share/network.almena.cli` |

In development mode, all modules use a local `./workspace/` directory.

### Security Model

- **Private keys** are stored in the OS keychain (never in plaintext files)
- **Cryptography:** Ed25519 (signing), X25519 (key agreement), A256GCM (encryption)
- **Key derivation:** BIP39 mnemonic + BIP32 hierarchical derivation
- **Network encryption:** TLS 1.2+ for external traffic, Noise protocol for P2P

## Design System

All frontend applications (desktop and wallet) share a **glassmorphism** design system:

| Token | Value |
|-------|-------|
| Primary color | `#FB923C` (orange) |
| Secondary color | `#8B5CF6` (violet) |
| Background | `#0c0a09` (deep dark) |
| Glass effect | `rgba(255,255,255,0.05)` + `backdrop-filter: blur(12px)` |
| Border radius | 8–12px |
| Base spacing | 8px unit |
| Transitions | 200–250ms ease-out |
