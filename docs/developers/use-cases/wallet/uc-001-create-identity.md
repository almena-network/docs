---
title: "UC-001: Create Identity"
sidebar_label: "UC-001: Create Identity"
sidebar_position: 1
---

# UC-001: Create Identity

## Description

The user creates a new decentralized identity from the wallet. This process generates a BIP39 mnemonic, derives cryptographic keys (Ed25519 for identity, secp256k1 for blockchain), stores them securely in the system keychain, and produces a DID in the format `did:almena:<public_key_hex>`. The identity is usable immediately without blockchain interaction.

## Actors

- **End User**: Person creating their identity through the wallet UI
- **Wallet (Frontend)**: Svelte application handling the UI flow and orchestration
- **Wallet (Rust Backend)**: Tauri commands performing cryptographic operations and secure storage
- **System Keychain**: OS-level secure storage for private keys

## Preconditions

- The wallet application is installed and running
- No identity currently exists in the wallet (first-time use)
- The system keychain is accessible

## Main Flow

1. The user opens the wallet and sees the welcome screen (`/`)
2. The user selects **Create New Identity**
3. The wallet navigates to the password creation screen (`/create`)
4. The user enters a password that meets validation rules:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter
   - At least 1 digit
   - At least 1 special character (`!@#$%^&*(),.?":{}|<>`)
5. The user confirms the password
6. The wallet hashes the password using Argon2 (Rust `hash_password` command)
7. The hash is stored temporarily in `sessionStorage`
8. The wallet navigates to the recovery phrase screen (`/create/recovery-phrase`)
9. The wallet generates a 12-word BIP39 mnemonic via `generateRecoveryPhrase(language)` using `@scure/bip39` with the appropriate wordlist (English or Spanish)
10. The 12 words are displayed in a grid layout
11. A warning instructs the user to back up the phrase securely
12. The user copies the phrase (required action — enables the Continue button)
13. The wallet invokes the Rust command `generate_and_store_identity`:
    - Parses the BIP39 mnemonic (auto-detects language)
    - Generates the BIP39 seed (empty passphrase)
    - Derives the Ed25519 keypair: `SHA512(seed[0:32])` → 32-byte secret key
    - Derives the secp256k1 key via BIP44 path `m/44'/118'/0'/0/0`
    - Stores the Ed25519 private key in the system keychain (service: `almena-id-wallet`, key: `{did}`)
    - Stores the secp256k1 private key in the system keychain (key: `{did}:almena`)
    - Returns the DID (`did:almena:<ed25519_public_key_hex>`) and public key
14. The wallet saves the identity metadata to the Tauri Store (`identity.json`): DID, public key, creation timestamp, `anchorStatus: 'not_anchored'`
15. The password hash is cleared from `sessionStorage`
16. The session is unlocked via `unlockSession()`
17. The wallet navigates to the success screen (`/create/success`) displaying the DID
18. The user can optionally anchor the DID on the blockchain (see [UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)) or proceed directly to the dashboard

## Alternative Flows

### AF-1: Password mismatch
- At step 5, if the confirmation password does not match, the form shows an error and the user must re-enter both passwords

### AF-2: Password does not meet requirements
- At step 4, the form validates in real-time and disables submission until all rules are met

### AF-3: Keychain access denied
- At step 13, if the OS keychain is not accessible, the operation fails with an error message and the identity is not created

## Postconditions

- A new Ed25519 keypair exists in the system keychain
- A new secp256k1 keypair exists in the system keychain
- The identity metadata is persisted in the Tauri Store (`identity.json`)
- The DID is generated and usable locally: `did:almena:<ed25519_public_key_hex>`
- The user session is unlocked
- No blockchain transaction has occurred (anchoring is a separate, optional step)

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | UI flow: welcome → password → recovery phrase → success |
| **wallet** (Rust backend) | Argon2 hashing, BIP39 mnemonic parsing, Ed25519/secp256k1 key derivation, keychain storage |

## Technical Notes

- **Key derivation**: Two parallel derivations from the same BIP39 seed — Ed25519 (identity) and secp256k1 (blockchain signing via BIP44 `m/44'/118'/0'/0/0`)
- **DID format**: `did:almena:<ed25519_public_key_hex>` (256 hex characters)
- **Password hashing**: Argon2 with random salt, executed in Rust for security
- **Mnemonic language**: Supports English and Spanish wordlists; language auto-detected during validation
- **Private keys never leave the system keychain** — all cryptographic operations happen in Rust
- **No network calls required** — identity creation is fully offline
