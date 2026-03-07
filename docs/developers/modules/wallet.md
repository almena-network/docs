---
sidebar_position: 3
title: "Module: Wallet"
sidebar_label: Wallet
---

# Module: Wallet

The wallet is a mobile-first application for **Holders** — individuals who create and manage their decentralized identity.

## Overview

| Property | Value |
|----------|-------|
| App identifier | `network.almena.wallet` |
| Framework | Tauri v2 + React 19 |
| Version | `2026.2.26` |
| Window size | 390×844 (min 360×640, max 768×1024) |
| Repository | `almena-network/wallet` |

## Source Structure

```
wallet/
├── src/                          # React frontend
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Router setup (React Router v7)
│   ├── App.css                   # Design tokens (glassmorphism)
│   ├── pages/
│   │   ├── Onboarding.tsx        # Create or recover identity
│   │   ├── Onboarding.css        # Glassmorphism styling
│   │   ├── CreatePassword.tsx    # Password setup with validation
│   │   └── CreatePassword.css    # Form styling
│   └── assets/
│
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── main.rs               # Tauri entry point
│   │   └── lib.rs                # Tauri commands (minimal)
│   ├── tauri.conf.json           # App configuration
│   └── Cargo.toml                # Rust dependencies
│
├── public/
│   └── logo.png                  # Almena Network logo
├── package.json                  # Node dependencies
├── vite.config.ts                # Vite configuration
└── Taskfile.yml                  # Task orchestration
```

## Implemented Features

### Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Onboarding` | Initial screen with create/recover options |
| `/register/password` | `CreatePassword` | Password setup with real-time validation |

### Onboarding Screen

- Two action buttons:
  - **Create Account** (primary, orange) — Navigates to password creation
  - **Recover Account** (glass style) — Placeholder (UC-002, not yet implemented)
- Custom SVG icons (Plus, Rotate)
- Fully styled with glassmorphism

### Create Password

- Real-time password validation with visual feedback:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
- Password confirmation with match validation
- Show/hide toggle on both fields
- Submit disabled until all rules pass
- Spanish language interface

## Rust Backend

Currently minimal — only the default `greet` command is implemented:

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

**No gRPC client** is configured yet. The wallet does not communicate with the daemon at this stage.

## Design System

The wallet shares the same glassmorphism design system as the desktop app, with mobile-specific adjustments:

| Token | Value |
|-------|-------|
| Glass background | `rgba(255,255,255,0.04)` |
| Glass border | `rgba(255,255,255,0.06)` |
| Backdrop blur | 16px |
| Touch targets | 48px minimum height |
| No scroll | Content fits 390×844 viewport |

## Development

```bash
# Install dependencies
task install

# Run in dev mode
task dev

# Type-check
task check

# Build for production
task build
```

## Pending Implementation

- **Recovery phrase generation** (BIP39 mnemonic — UC-001 Step 3)
- **Identity recovery** from mnemonic (UC-002)
- **gRPC client** integration with daemon
- **Credential management** (receive, store, present)
- **Biometric authentication** (Touch ID/Face ID)
- **Identity QR code** display
- **DIDComm messaging**
- **Key storage** in OS keychain
