---
title: "UC-003: Anchor DID on Blockchain"
sidebar_label: "UC-003: Anchor DID on Blockchain"
sidebar_position: 3
---

# UC-003: Anchor DID on Blockchain

## Description

The user anchors their DID on the Almena blockchain. This registers the DID Document (W3C DID Core compliant) on-chain via a `MsgAnchorDID` transaction, making the identity publicly verifiable. This step is optional — the DID is usable without anchoring — and is only offered after identity creation (not after recovery).

## Actors

- **End User**: Person choosing to anchor their DID
- **Wallet (Frontend)**: Svelte application orchestrating the anchoring flow
- **Wallet (Rust Backend)**: Tauri commands building the DID Document, signing the transaction, and managing keychain access
- **Almena Blockchain**: Cosmos SDK chain that receives and processes the `MsgAnchorDID` transaction
- **Backend API** (optional): Platform backend that registers the anchor event for indexing

## Preconditions

- The user has just completed identity creation ([UC-001](./uc-001-create-identity.md)) and is on the success screen
- The DID exists locally with `anchorStatus: 'not_anchored'`
- The Ed25519 and secp256k1 private keys are stored in the system keychain
- The blockchain node is reachable at the configured API URL (default: `http://localhost:1317`)

## Main Flow

1. The user is on the creation success screen (`/create/success`) and sees the **Anchor DID** button with a description of what anchoring means
2. The user clicks **Anchor DID**
3. The UI transitions to the `anchoring` state (loading spinner, "Anchoring..." text)
4. The wallet retrieves the Almena address from the secp256k1 key:
   - Calls `getAlmenaAddress(did)` which invokes the Rust command to get the secp256k1 public key from the keychain
   - Derives the Bech32 address: compress pubkey (33 bytes) → SHA256 → RIPEMD160 → Bech32 with prefix `almena`
5. The wallet queries the blockchain account info:
   - GET `/cosmos/auth/v1beta1/accounts/{address}`
   - Retrieves account number and sequence (both 0 for new accounts)
6. The wallet invokes the Rust command `prepare_anchor_did_tx` with:
   - secp256k1 private key (from keychain)
   - DID and Ed25519 public key
   - Account number, sequence, chain ID (`almenachain`)
   - Fee configuration: `0 stake`, gas limit `200000`
7. The Rust backend:
   - Builds a W3C DID Core compliant DID Document:
     - Verification method with Ed25519 public key in multibase format (z + base58)
     - Authentication, assertion, capability invocation, and capability delegation references
   - Creates the `MsgAnchorDID` protobuf message (creator address, DID, DID Document JSON)
   - Signs the transaction with the secp256k1 private key
   - Returns the base64-encoded `TxRaw` bytes
8. The wallet broadcasts the transaction:
   - POST `/cosmos/tx/v1beta1/txs` with the signed transaction bytes (broadcast mode: `BROADCAST_MODE_SYNC`)
9. If successful, the blockchain returns the transaction hash
10. The wallet updates the identity in the Tauri Store:
    - `anchorStatus: 'anchored'`
    - `anchorTxHash: <transaction_hash>`
    - `anchoredAt: <ISO_timestamp>`
11. The UI transitions to the `anchored` state (green checkmark, transaction hash displayed)
12. Best-effort: the wallet calls `registerAnchorWithBackend(did, txHash)` to notify the platform backend (POST `/api/v1/identities/anchor`) — this call does not block and failures are silently ignored
13. The user clicks **Continue** to navigate to the dashboard

## Alternative Flows

### AF-1: Blockchain node unreachable
- At step 5, if the blockchain API is not reachable, the operation fails
- The UI transitions to the `failed` state with an error message
- A **Retry** button is shown

### AF-2: Transaction broadcast failure
- At step 8, if the broadcast returns an error (insufficient gas, invalid transaction, etc.), the UI transitions to the `failed` state
- The error message is displayed and a **Retry** button is shown

### AF-3: User skips anchoring
- At step 2, instead of clicking **Anchor DID**, the user clicks **Continue**
- The DID remains with `anchorStatus: 'not_anchored'`
- The user proceeds to the dashboard without any blockchain interaction

### AF-4: Backend registration fails
- At step 12, if the backend API call fails, the failure is silently ignored
- The anchor status remains `anchored` since the blockchain transaction succeeded

## Postconditions

- The DID Document is registered on the Almena blockchain
- The Tauri Store reflects `anchorStatus: 'anchored'` with the transaction hash
- The DID is publicly verifiable via the blockchain
- The backend (if reachable) has been notified of the anchor event

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | UI state management (not_anchored → anchoring → anchored/failed), API calls to blockchain |
| **wallet** (Rust backend) | DID Document construction, `MsgAnchorDID` protobuf building, secp256k1 transaction signing |
| **blockchain** | Processes and stores the `MsgAnchorDID` transaction, registers the DID Document on-chain |
| **backend** | Receives anchor notification for indexing (best-effort, non-blocking) |

## Technical Notes

- **DID Document structure**: W3C DID Core compliant with Ed25519VerificationKey2020, public key encoded in multibase (z + base58)
- **Transaction signing**: secp256k1 signature over the Cosmos SDK `SignDoc` structure
- **Fee subsidization**: Transaction fee is `0 stake` — the blockchain subsidizes identity anchoring
- **Gas limit**: Fixed at `200000` for anchor transactions
- **Chain ID**: `almenachain`
- **Broadcast mode**: `BROADCAST_MODE_SYNC` — waits for transaction to be accepted into the mempool but not for block confirmation
- **Idempotency**: If the user retries, a new transaction is built and broadcast; the blockchain handles duplicate DID registration via its own validation rules
- **Offline-first**: Anchoring is optional; the DID functions fully without being on-chain. Anchoring adds public verifiability
