---
title: "UC-002: Recover Identity"
sidebar_label: "UC-002: Recover Identity"
sidebar_position: 2
---

# UC-002: Recover Identity

## Description

The user recovers an existing decentralized identity by entering their 12-word BIP39 recovery phrase. The wallet re-derives the same cryptographic keys (Ed25519 and secp256k1) from the mnemonic, stores them in the system keychain, and restores the DID. The recovered identity is identical to the original since the same mnemonic deterministically produces the same keys.

## Actors

- **End User**: Person recovering their identity through the wallet UI
- **Wallet (Frontend)**: Svelte application handling the recovery UI flow
- **Wallet (Rust Backend)**: Tauri commands performing mnemonic validation, key derivation, and secure storage
- **System Keychain**: OS-level secure storage for private keys

## Preconditions

- The wallet application is installed and running
- The user possesses their 12-word BIP39 recovery phrase
- The system keychain is accessible

## Main Flow

1. The user opens the wallet and sees the welcome screen (`/`)
2. The user selects **Recover Identity**
3. The wallet navigates to the password creation screen (`/recover`)
4. The user enters a new password (minimum 8 characters)
5. The user confirms the password
6. The wallet hashes the password using Argon2 (Rust `hash_password` command)
7. The hash is stored temporarily in `sessionStorage`
8. The wallet navigates to the phrase input screen (`/recover/phrase`)
9. The user enters their 12-word recovery phrase in the text area (space-separated, auto-converted to lowercase)
10. The wallet displays the word count and validates that exactly 12 words are entered
11. The wallet calls `validateRecoveryPhrase(words)` which checks the BIP39 checksum against all available wordlists (English, Spanish)
12. The wallet invokes the Rust command `generate_and_store_identity` with the mnemonic and password hash:
    - Parses the BIP39 mnemonic (auto-detects language)
    - Generates the BIP39 seed (empty passphrase)
    - Derives the Ed25519 keypair: `SHA512(seed[0:32])` → 32-byte secret key
    - Derives the secp256k1 key via BIP44 path `m/44'/118'/0'/0/0`
    - Stores both private keys in the system keychain
    - Returns the DID and public key
13. The wallet saves the identity metadata to the Tauri Store (`identity.json`)
14. The password hash is cleared from `sessionStorage`
15. The session is unlocked via `unlockSession()`
16. The wallet navigates to the recovery success screen (`/recover/success`) displaying the recovered DID
17. The user proceeds to the dashboard

## Alternative Flows

### AF-1: Invalid recovery phrase
- At step 11, if the phrase does not pass BIP39 checksum validation in any supported language, the form shows an error and submission is blocked

### AF-2: Incorrect word count
- At step 10, if fewer or more than 12 words are entered, the form indicates the word count and the submit button remains disabled

### AF-3: Paste from clipboard
- At step 9, the user can use the paste button to read the phrase from the clipboard instead of typing manually

### AF-4: Keychain access denied
- At step 12, if the OS keychain is not accessible, the operation fails with an error message

## Postconditions

- The Ed25519 keypair is stored in the system keychain (identical to the original)
- The secp256k1 keypair is stored in the system keychain (identical to the original)
- The identity metadata is persisted in the Tauri Store (`identity.json`)
- The recovered DID matches the original: `did:almena:<ed25519_public_key_hex>`
- The user session is unlocked
- No blockchain anchoring prompt is shown (unlike identity creation)

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | UI flow: welcome → password → enter phrase → success |
| **wallet** (Rust backend) | Argon2 hashing, BIP39 validation and parsing, Ed25519/secp256k1 key derivation, keychain storage |

## Technical Notes

- **Deterministic recovery**: The same mnemonic always produces the same Ed25519 and secp256k1 keys, so the DID is identical to the original
- **Language auto-detection**: The mnemonic is validated against English and Spanish BIP39 wordlists; the first matching language is used
- **No blockchain anchoring on recovery**: The success screen does not offer anchoring since the DID may already be anchored from the original creation
- **Password is independent**: The new password does not affect key derivation — only the mnemonic determines the keys. The password is used solely for session locking
- **Input normalization**: The phrase input auto-converts to lowercase before validation
