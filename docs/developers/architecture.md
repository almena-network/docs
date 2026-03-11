---
sidebar_position: 3
title: Architecture
sidebar_label: Architecture
---

# Architecture

Almena Network follows a modular architecture where each component has a clear responsibility and communicates through well-defined interfaces.

## System Overview

```mermaid
graph TB
    subgraph "User Devices"
        subgraph "Holders"
            Wallet[Wallet<br/>Tauri + React]
        end
        subgraph "Issuers / Requesters"
            Desktop[Desktop<br/>Tauri + React]
        end
        subgraph "Administrators"
            CLI[CLI<br/>Rust TUI]
        end
    end

    subgraph "Local Services"
        Daemon[Daemon<br/>gRPC + REST]
    end

    subgraph "P2P Network"
        Other1[Remote Daemon]
        Other2[Remote Daemon]
    end

    Wallet -.->|future: DIDComm v2| Mediator[Mediator<br/>planned]
    Desktop -->|gRPC| Daemon
    CLI -->|gRPC| Daemon
    Daemon <-->|libp2p<br/>TCP + Noise + Yamux| Other1
    Daemon <-->|libp2p| Other2
    Other1 <-->|libp2p| Other2

    style Wallet fill:#FB923C,color:#fff
    style Desktop fill:#FB923C,color:#fff
    style CLI fill:#8B5CF6,color:#fff
    style Daemon fill:#8B5CF6,color:#fff
```

## Components

### Daemon (`almenad`)

The daemon is the core background service that runs on every node. It is the **only component that participates in the P2P network**.

**Responsibilities:**
- Expose gRPC API for local clients (desktop, CLI)
- Expose REST API with Swagger UI for status checks
- Manage P2P connections via libp2p
- Discover peers on the local network (mDNS)
- Exchange geolocation data with peers via custom protocol (`/almena/geo/1.0`)
- Provide geolocation data for network visualization

**Technology:** Rust, tonic 0.12, libp2p 0.56, axum 0.8, tokio

**Source structure:**

| File | Purpose |
|------|---------|
| `main.rs` | gRPC server, service implementation |
| `p2p.rs` | libp2p swarm, peer discovery, geo exchange |
| `rest.rs` | Axum REST router, Swagger UI |
| `geolocation.rs` | Geo cache serialization |
| `path.rs` | Platform-specific data directories |

### Desktop

The desktop application is an admin console designed for **Issuers** (entities that issue credentials) and **Requesters** (entities that request credential presentations).

**Responsibilities:**
- Visualize the P2P network on an interactive world map
- Control the daemon lifecycle (start/stop)
- Display node dashboard with real-time status
- View and filter application logs
- Provide organization management interface

**Technology:** Tauri v2, React 19, TypeScript, tonic (Rust gRPC client)

**Architecture:**

```mermaid
graph LR
    subgraph "React Frontend"
        UI[Pages & Components]
    end
    subgraph "Tauri Bridge"
        Commands[Tauri Commands]
    end
    subgraph "Rust Backend"
        GRPC[gRPC Client]
        DaemonMgr[Daemon Manager]
    end
    subgraph "External"
        Daemon[almenad]
    end

    UI -->|invoke| Commands
    Commands --> GRPC
    Commands --> DaemonMgr
    GRPC -->|tonic| Daemon
    DaemonMgr -->|spawn/kill| Daemon

    style UI fill:#FB923C,color:#fff
    style Daemon fill:#8B5CF6,color:#fff
```

### Wallet

The wallet is a mobile-first application for **Holders** — individuals who own and manage their digital identity (one of the platform's core capabilities).

**Responsibilities:**
- Create and manage decentralized identities (DIDs)
- Store private keys securely using AES-256-GCM with Argon2 key derivation
- Provide biometric authentication (fingerprint, Face ID)
- Manage encrypted cloud backups (Google Drive, iCloud)
- Support full identity recovery from cloud backups
- QR code scanning for credential exchange

**Technology:** Tauri v2, React 19, TypeScript

**Architecture:**

```mermaid
graph TB
    subgraph "React Frontend"
        Onboarding[Onboarding Flow<br/>6 steps]
        Recovery[Recovery Flow<br/>6 steps]
        WalletUI[Wallet Home]
        Lock[Lock Screen]
    end
    subgraph "Tauri Bridge"
        OnboardCmd[onboard]
        BiometryCmd[biometry]
        CloudCmd[cloud backup]
        RecoveryCmd[recovery]
    end
    subgraph "Rust Crypto"
        DID[DID Generation<br/>P-256 ECDSA]
        KDF[Key Derivation<br/>Argon2]
        Encrypt[Encryption<br/>AES-256-GCM<br/>XChaCha20-Poly1305]
    end

    Onboarding --> OnboardCmd
    Recovery --> RecoveryCmd
    WalletUI --> BiometryCmd
    OnboardCmd --> DID
    OnboardCmd --> KDF
    OnboardCmd --> Encrypt
    CloudCmd --> Encrypt

    style Onboarding fill:#FB923C,color:#fff
    style Recovery fill:#FB923C,color:#fff
    style DID fill:#8B5CF6,color:#fff
```

### CLI

The CLI provides a terminal interface for daemon management and monitoring.

**Responsibilities:**
- Start, stop, and ping the daemon
- Display daemon status in real time (2-second polling)
- Provide a text-based alternative to the desktop app

**Technology:** Rust, ratatui 0.29, crossterm 0.28, tonic (gRPC client)

## Communication Patterns

### Local Communication (gRPC)

Desktop and CLI communicate with the daemon via **gRPC** on the local machine:

```mermaid
sequenceDiagram
    participant Client as Desktop / CLI
    participant Daemon as almenad
    participant Store as PeerStore

    Client->>Daemon: gRPC Request
    Daemon->>Store: Query internal state
    Store-->>Daemon: Data
    Daemon-->>Client: gRPC Response
```

The proto file at `daemon/proto/almena/daemon/v1/service.proto` is the **single source of truth**. Clients copy and generate code from this file.

### P2P Communication (libp2p)

Daemons discover and communicate with each other over the P2P network:

```mermaid
sequenceDiagram
    participant A as Daemon A
    participant B as Daemon B

    Note over A,B: mDNS Discovery (LAN)
    A->>B: TCP + Noise handshake
    B-->>A: Yamux multiplexed connection
    A->>B: /almena/geo/1.0 request
    B-->>A: Geolocation JSON
```

| Layer | Technology | Details |
|-------|-----------|---------|
| Transport | TCP | IPv4 + IPv6 |
| Encryption | Noise | All traffic encrypted |
| Multiplexing | Yamux | Multiple streams per connection |
| Discovery | mDNS | LAN peers, 5-second interval |
| Custom protocol | `/almena/geo/1.0` | Peer geolocation exchange |

Each daemon maintains a `PeerStore` — a thread-safe map of discovered peers with their connection status.

### Wallet Communication

The wallet currently operates independently without daemon gRPC. DID and credential operations happen locally in the Tauri Rust backend.

## Data Storage

### Platform Directories

Each module stores data in platform-specific locations:

| Module | macOS | Linux |
|--------|-------|-------|
| Daemon | `~/Library/Application Support/network.almena.daemon` | `~/.local/share/network.almena.daemon` |
| CLI | `~/Library/Application Support/network.almena.cli` | `~/.local/share/network.almena.cli` |
| Wallet | Tauri plugin-store (app data directory) | Tauri plugin-store |

In development mode, all modules use a local `./workspace/` directory.

### Security Model

```mermaid
graph TD
    subgraph "Key Management"
        Mnemonic[BIP39 Mnemonic] --> KDF[Key Derivation<br/>Argon2]
        KDF --> PrivKey[Private Keys]
        PrivKey --> Keychain[OS Keychain]
    end
    subgraph "Encryption"
        Password[User Password] --> Argon2[Argon2 KDF]
        Argon2 --> AES[AES-256-GCM<br/>Local encryption]
        Argon2 --> XChaCha[XChaCha20-Poly1305<br/>Cloud backup]
    end
    subgraph "Network"
        TLS[TLS 1.2+<br/>External traffic]
        Noise[Noise Protocol<br/>P2P traffic]
    end

    style Keychain fill:#22c55e,color:#fff
    style AES fill:#8B5CF6,color:#fff
    style XChaCha fill:#8B5CF6,color:#fff
```

| Purpose | Technology |
|---------|-----------|
| **Signing** | P-256 ECDSA (wallet), Ed25519 (daemon) |
| **Key agreement** | X25519 (ECDH) |
| **Symmetric encryption** | AES-256-GCM (local), XChaCha20-Poly1305 (backup) |
| **Key derivation** | Argon2 (password), BIP39 + BIP32 (mnemonic) |
| **Hashing** | SHA-256 |
| **Network** | TLS 1.2+ (external), Noise protocol (P2P) |

## Design System

All frontend applications (desktop and wallet) share a **glassmorphism** design system:

| Token | Value |
|-------|-------|
| Primary color | `#FB923C` (orange) |
| Secondary color | `#8B5CF6` (violet) |
| Background | `#0c0a09` (deep dark) |
| Glass effect | `rgba(255,255,255,0.05)` + `backdrop-filter: blur(12px)` |
| Border radius | 8-12px |
| Base spacing | 8px unit |
| Transitions | 200-250ms ease-out |
| Typography | Inter, Outfit, or similar geometric sans-serif |
| Navigation | Floating dock (macOS-style, centered bottom) |
