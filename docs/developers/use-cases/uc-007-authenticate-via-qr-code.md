---
title: "UC-007: Authenticate via QR Code"
sidebar_label: "UC-007: Authenticate via QR"
sidebar_position: 7
---

# UC-007: Authenticate via QR Code

## Description

An external application scans the user's identity QR code (displayed in [UC-006](./uc-006-display-identity-qr-code.md)) and initiates an authentication challenge. The wallet receives the challenge via a deep link (`almena://auth?challenge=...`), displays a consent screen where the user can approve or reject, and if approved, signs the challenge with the Ed25519 private key and sends the signed response to the requesting application's callback URL.

## Actors

- **End User**: Person approving or rejecting the authentication request in the wallet
- **External Application**: Web app, service, or another wallet that scans the QR code and initiates the challenge
- **Backend API**: Platform backend that creates the authentication challenge and validates the signed response
- **Wallet (Frontend)**: Svelte application handling the deep link, consent UI, and response flow
- **Wallet (Rust Backend)**: Tauri commands managing challenge storage, Ed25519 signing, and response construction

## Preconditions

- The user has an identity created in the wallet ([UC-001](./uc-001-create-identity.md))
- The wallet is running (foreground or background)
- The identity QR code has been scanned by an external application
- The `tauri-plugin-deep-link` is configured to handle `almena://` URLs
- The Ed25519 private key is stored in the system keychain

## Main Flow

1. The external application scans the user's identity QR code and extracts the DID from the JSON payload
2. The external application sends the DID to the backend API to initiate an authentication request
3. The backend creates an authentication challenge containing:
   - `challenge_id`: unique identifier
   - `nonce`: random value to prevent replay
   - `timestamp`: when the challenge was created
   - `expires_at`: when the challenge expires
   - `origin`: the requesting application's identifier
   - `callback_url`: where to send the signed response
   - `requested_proof`: what is being requested
4. The backend encodes the challenge as base64url JSON and constructs a deep link: `almena://auth?challenge=<base64url_encoded_challenge>`
5. The deep link is delivered to the wallet (via OS URL handler)
6. The wallet's `tauri-plugin-deep-link` captures the `almena://` URL and triggers `on_open_url`
7. The wallet calls `handle_deep_link()` which parses the URL
8. `auth::parse_auth_deep_link()` extracts the `challenge` parameter, decodes the base64url JSON, and deserializes the `AuthRequest` struct
9. The challenge is stored in the `PENDING_AUTH_REQUEST` mutex (Rust-side global state)
10. The wallet frontend detects the pending request and displays the **AuthConsent** component showing:
    - The requesting origin
    - The requested action/proof
    - A countdown timer showing time remaining until expiration (format: `MM:SS`)
    - **Approve** and **Reject** buttons
11. The user clicks **Approve**
12. The wallet invokes the Rust command `approve_auth_request(did)`:
    - Retrieves the Ed25519 private key from the system keychain
    - Builds the payload to sign:
      ```json
      {
        "challenge_id": "...",
        "nonce": "...",
        "timestamp": "...",
        "expires_at": "...",
        "origin": "..."
      }
      ```
    - Signs the payload bytes with Ed25519: `signing_key.sign(payload_bytes)`
    - Constructs the `AuthResponse`:
      ```json
      {
        "challenge_id": "...",
        "did": "did:almena:...",
        "signature": "<base64url_ed25519_signature>",
        "signed_payload": "<base64url_payload>",
        "verification_method": "did#key-1",
        "timestamp": "..."
      }
      ```
13. The wallet POSTs the `AuthResponse` to the `callback_url` from the original challenge
14. The backend verifies the signature against the DID's public key, validates nonce and timestamps, and completes the authentication
15. The consent screen closes and the user returns to the wallet

## Alternative Flows

### AF-1: User rejects the request
- At step 11, the user clicks **Reject**
- The wallet calls `reject_auth_request()` which clears the `PENDING_AUTH_REQUEST`
- No response is sent to the callback URL
- The consent screen closes

### AF-2: Challenge expired
- At step 10, the countdown reaches zero before the user acts
- The consent screen transitions to an "expired" state
- The approve button is disabled
- The user can only dismiss the screen

### AF-3: Deep link received while wallet is locked
- At step 6, if the wallet session is locked, the user must first unlock (via password or biometrics, see [UC-005](./uc-005-unlock-wallet-with-biometrics.md))
- After unlocking, the pending auth request is displayed

### AF-4: Callback URL unreachable
- At step 13, if the POST to the callback URL fails, an error is shown to the user
- The signed response was generated but could not be delivered

### AF-5: Private key not found
- At step 12, if the Ed25519 private key is not found in the keychain, the operation fails with an error

## Postconditions

- The authentication challenge has been signed and sent to the requesting application
- The `PENDING_AUTH_REQUEST` is cleared
- No persistent state changes in the wallet — the auth flow is stateless
- The external application can verify the user's identity using the signed response

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | AuthConsent UI component, deep link detection, countdown timer, POST response to callback |
| **wallet** (Rust backend) | Deep link parsing (`auth::parse_auth_deep_link`), challenge storage (`PENDING_AUTH_REQUEST` mutex), Ed25519 signing (`sign_challenge`), response construction |
| **backend** | Creates authentication challenges, validates signed responses, completes authentication |

## Technical Notes

- **Deep link protocol**: `almena://auth?challenge=<base64url>` — handled by `tauri-plugin-deep-link`
- **Challenge storage**: Single pending request stored in a Rust `Mutex<Option<AuthRequest>>`. A new challenge overwrites any existing pending one
- **Ed25519 signing**: The challenge payload is signed as raw bytes using the Ed25519 private key from the system keychain. The signature and payload are base64url-encoded in the response
- **Verification method**: The response references `did#key-1` as the verification method, matching the key in the DID Document (if anchored, see [UC-003](./uc-003-anchor-did-on-blockchain.md))
- **No QR scanning in wallet**: The wallet does NOT scan QR codes. It only displays them. Scanning is performed by external applications
- **Stateless flow**: Each authentication is independent. No sessions or tokens are persisted in the wallet after the response is sent
