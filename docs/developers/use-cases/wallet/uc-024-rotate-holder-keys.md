---
title: "UC-024: Rotate Holder Keys"
sidebar_label: "UC-024: Rotate Keys"
sidebar_position: 24
---

# UC-024: Rotate Holder Keys

:::note Reference Flow
Corresponds to **Flow 5 — Holder Key Rotation**.
:::

:::info Functional Specification
This use case defines intended behavior. Key rotation is not yet implemented.
:::

## Description

The Holder updates their cryptographic keys while maintaining their identity (DID). The process involves generating a new key pair, updating the DID Document on the blockchain with the new public key (signed with the current private key to prove DID control), re-encrypting all credentials stored in decentralized storage with the new public key, and securely discarding the old private key.

## Actors

- **Holder**: User rotating their keys
- **Wallet**: Application managing the key rotation process
- **Blockchain**: Distributed network where the DID Document is updated
- **Storage Node**: Decentralized storage where credentials must be re-encrypted

## Preconditions

- The Holder has an active DID with a DID Document published on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- The Holder maintains access to their current private key

## Main Flow

1. The Holder generates a new cryptographic key pair on their device
2. The Holder sends a transaction to the blockchain to update their DID Document with the new public key — the transaction is signed with the current private key (proving control of the DID)
3. The blockchain validates the signature and updates the DID Document — the previous key may be marked as revoked or kept temporarily for transition
4. The Holder decrypts their credentials from decentralized storage with the old private key and re-encrypts them with the new public key, updating the storage
5. Once migration is complete, the old private key is securely deleted from the device

## Alternative Flows

### AF-1: Blockchain transaction fails
- At step 2, the update transaction fails
- The old keys remain active and the Holder can retry

### AF-2: Credential re-encryption fails
- At step 4, some credentials cannot be re-encrypted (storage unreachable, corrupted data)
- The old key is NOT discarded until all credentials are migrated
- The Holder is informed of which credentials could not be migrated

### AF-3: Old key compromised (emergency rotation)
- The Holder suspects their key has been compromised
- Steps 1-3 are performed immediately (key update on blockchain)
- Step 4 (re-encryption) is performed as soon as possible
- The old key is revoked immediately on the blockchain

## Postconditions

- The Holder's DID remains the same
- The DID Document reflects the new public key(s)
- All credentials are re-encrypted with the new key
- Future verifications will use the new public key
- The old private key has been securely discarded

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** | New key generation, transaction signing, credential re-encryption, old key deletion |
| **blockchain** | DID Document update, key status management |
| **storage** | Credential re-encryption (decrypt with old key, encrypt with new key) |

## Technical Notes

- **DID persistence**: The DID does not change during key rotation — only the keys in the DID Document are updated
- **Transition period**: During migration, both old and new keys may coexist in the DID Document to avoid service disruption
- **Re-encryption**: All credentials must be decrypted with the old key and re-encrypted with the new key — this is a potentially time-consuming operation depending on the number of credentials
- **Security**: The old private key must be securely wiped from the device after successful migration
- **Standards**: W3C DID Core v1.0 (key rotation), NIST SP 800-63-3 (key management)
