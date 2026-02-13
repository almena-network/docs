---
title: "UC-001: Create Identity"
sidebar_label: "UC-001: Create Identity"
sidebar_position: 1
---

# UC-001: Create Identity

:::note Reference Flow
Corresponds to **Flow 1 — Identity Registration (Onboarding)**, steps 1-2 and 5.
:::

## Description

The Holder creates a new decentralized identity. This process generates a cryptographic key pair (public/private) on the local device, produces a DID (Decentralized Identifier) following the W3C DID standard, and stores the private key securely. The private key never leaves the device. The identity is usable immediately without blockchain interaction; anchoring on-chain is a separate, optional step ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)).

This same onboarding flow applies to entities (Issuers, Requesters). For Issuers, identity registration must be complemented with authorization in the trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework)).

## Actors

- **Holder**: User creating their decentralized identity
- **Wallet**: Application running on the Holder's device that manages keys, DIDs, and credentials
- **System Keychain**: OS-level secure storage for private keys

## Preconditions

- The Holder has a device with the wallet application installed
- No identity currently exists in the wallet (first-time use)
- The system keychain is accessible

## Main Flow

1. The Holder opens the wallet and selects **Create New Identity**
2. The Holder creates a password that meets security requirements
3. The wallet generates a recovery phrase (BIP39 mnemonic) and displays it to the Holder
4. The Holder backs up the recovery phrase securely
5. The wallet generates the cryptographic key pair (public/private) on the local device
6. The wallet derives the DID from the public key, following the W3C DID standard: `did:almena:<public_key>`
7. The wallet stores the private key securely in the system keychain — the private key never leaves the device
8. The wallet persists the identity metadata locally (DID, public key, creation timestamp)
9. The Holder sees a confirmation screen with their new DID
10. The Holder can optionally anchor the DID on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)) or proceed directly to use the wallet

## Alternative Flows

### AF-1: Password mismatch
- At step 2, the confirmation password does not match
- The wallet shows an error and the Holder must re-enter both passwords

### AF-2: Keychain access denied
- At step 7, the system keychain is not accessible
- The operation fails with an error message and the identity is not created

### AF-3: Recovery phrase not backed up
- At step 4, the Holder must acknowledge they have backed up the phrase before proceeding

## Postconditions

- The Holder possesses a DID generated following the W3C DID standard
- A cryptographic key pair exists securely stored on the device
- The private key is in the system keychain and has never left the device
- The DID is usable locally for signing and authentication
- No blockchain transaction has occurred (anchoring is a separate, optional step)
- The Holder can receive credentials and generate verifiable presentations

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** | Key generation, DID creation, secure storage, UI flow |

## Technical Notes

- **Key types**: Ed25519 for identity operations, secp256k1 for blockchain transactions — both derived from the same BIP39 seed
- **DID format**: `did:almena:<public_key_hex>` following W3C DID v1.0
- **Recovery phrase**: 12-word BIP39 mnemonic enabling deterministic key recovery ([UC-002](/docs/developers/use-cases/wallet/uc-002-recover-identity))
- **Offline-first**: Identity creation requires no network access
- **Entities onboarding**: Organizations (Issuers/Requesters) follow this same identity flow via [UC-022](/docs/developers/use-cases/platform/uc-022-create-organization), then register in the trust framework via [UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework)
- **Standards**: W3C Decentralized Identifiers (DID) v1.0, eIDAS 2.0 wallet requirements
