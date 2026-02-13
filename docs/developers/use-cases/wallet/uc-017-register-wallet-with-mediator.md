---
title: "UC-017: Register Wallet with Mediator"
sidebar_label: "UC-017: Register with Mediator"
sidebar_position: 17
---

# UC-017: Register Wallet with Mediator

:::info Functional Specification
This use case defines intended behavior. Mediator registration is not yet implemented in the wallet.
:::

## Description

Before a wallet can send or receive DIDComm v2 messages, it must register with the mediator service. The wallet discovers the mediator through an Out-of-Band (OOB) invitation, establishes a secure connection, and requests mediation using the Coordinate Mediation 2.0 protocol. Upon successful registration, the mediator assigns a routing DID to the wallet, enabling other wallets to send messages to it through the mediator. This registration is a one-time setup per mediator that persists across wallet sessions.

## Actors

- **End User**: Person initiating the mediator registration from the wallet
- **Wallet (Frontend)**: Svelte application handling the registration UI flow
- **Wallet (Rust Backend)**: Tauri commands performing cryptographic operations (X25519 key agreement, JWE encryption)
- **Mediator**: Go service implementing DIDComm v2 mediation protocols

## Preconditions

- The wallet application is installed and running
- The user has an identity created in the wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- The wallet session is unlocked ([UC-005](/docs/developers/use-cases/wallet/uc-005-unlock-wallet-with-biometrics) or password)
- The mediator service is running and accessible via network
- The wallet is not already registered with this mediator

## Main Flow

1. The user opens the wallet settings or the chat section for the first time
2. The wallet detects that no mediator registration exists in the local store
3. The wallet fetches the mediator's Out-of-Band invitation from the mediator's `GET /oob` endpoint
4. The OOB invitation contains:
   - The mediator's DID
   - The mediator's service endpoint (HTTP and WebSocket URLs)
   - The mediator's public key for key agreement (X25519)
5. The wallet generates an ephemeral X25519 key pair for the ECDH key agreement with the mediator
6. The wallet constructs a `mediate-request` DIDComm message:
   - Type: `https://didcomm.org/coordinate-mediation/2.0/mediate-request`
   - From: the wallet's DID
   - To: the mediator's DID
7. The wallet encrypts the message as a JWE (ECDH-ES+A256KW / A256CBC-HS512) using the mediator's public key
8. The wallet sends the encrypted message to the mediator's `POST /didcomm` endpoint
9. The mediator processes the mediate-request:
   - Validates the sender's DID
   - Creates a routing entry for this wallet
   - Assigns a routing DID for message delivery
10. The mediator responds with a `mediate-grant` message containing:
    - The routing DID assigned to this wallet
    - The mediator's endpoint for receiving forwarded messages
11. The wallet decrypts the response and extracts the routing information
12. The wallet stores the mediator registration locally in the Tauri Store (`mediator.json`):
    - Mediator DID
    - Mediator endpoint URLs (HTTP, WebSocket)
    - Assigned routing DID
    - Registration timestamp
13. The wallet establishes a WebSocket connection to the mediator (`/ws?did=<wallet_DID>`) for live message delivery
14. The wallet shows a success indication to the user (e.g., "Connected to messaging network")

## Alternative Flows

### AF-1: Mediator unreachable
- At step 3, the mediator service is not reachable (network error, timeout)
- The wallet shows an error message: "Cannot connect to messaging service"
- The user can retry later; the wallet operates normally without messaging

### AF-2: Mediation denied
- At step 9, the mediator responds with `mediate-deny` instead of `mediate-grant`
- Possible reasons: rate limiting, DID blocklist, capacity reached
- The wallet shows the denial reason and the user cannot send/receive messages until resolved

### AF-3: Wallet already registered
- At step 2, the wallet detects an existing mediator registration in the local store
- The wallet skips the registration flow and directly opens the WebSocket connection (step 13)
- If the WebSocket connection fails, the wallet falls back to polling via Message Pickup 3.0

### AF-4: Re-registration after identity recovery
- After recovering an identity ([UC-002](/docs/developers/use-cases/wallet/uc-002-recover-identity)), the mediator registration is lost
- The wallet detects no registration exists and triggers the full registration flow from step 1

### AF-5: WebSocket connection lost
- At step 13 or during ongoing use, the WebSocket connection drops
- The wallet automatically attempts to reconnect with exponential backoff
- While disconnected, the mediator queues messages for offline pickup
- When reconnected, the wallet uses Message Pickup 3.0 to retrieve queued messages ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message))

## Postconditions

- The wallet is registered with the mediator and has a routing DID
- The mediator can accept and queue messages destined for this wallet
- A WebSocket connection is established for real-time message delivery
- The registration data is persisted in the Tauri Store for future sessions
- The wallet can now send ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message)) and receive ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message)) DIDComm messages

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | Registration UI, connection status display, settings screen |
| **wallet** (Rust backend) | X25519 key generation, ECDH key agreement, JWE encryption/decryption |
| **mediator** | OOB invitation, Coordinate Mediation 2.0 protocol, routing DID assignment, WebSocket management |

## Technical Notes

- **Protocol**: Coordinate Mediation 2.0 (`https://didcomm.org/coordinate-mediation/2.0/`). The wallet acts as a mediator client; the mediator acts as the mediator agent
- **Encryption**: All DIDComm messages use authenticated encryption (JWE with ECDH-ES+A256KW key wrapping and A256CBC-HS512 content encryption). The mediator's invariant is zero-knowledge forwarding — it can only decrypt the outer routing envelope, never the inner message content
- **Key agreement**: X25519 (Curve25519 Diffie-Hellman) derived from the wallet's Ed25519 identity key using birational mapping
- **Mediator discovery**: The mediator URL is configured in the wallet settings or comes from a default configuration. The OOB invitation endpoint (`GET /oob`) provides all necessary connection details
- **WebSocket**: The live connection uses `ws(s)://<mediator>/ws?did=<wallet_DID>`. The mediator authenticates the WebSocket by verifying a signed challenge from the wallet's DID key
- **Offline resilience**: If the WebSocket is unavailable, the wallet falls back to HTTP polling using Message Pickup 3.0 (`https://didcomm.org/messagepickup/3.0/`). The mediator stores messages for up to 72 hours (configurable `message_ttl`)
- **Rate limits**: The mediator enforces 60 messages/minute per DID and 120 messages/minute per IP
- **Storage**: Registration data persisted in Tauri Store (`mediator.json`), separate from identity data (`identity.json`) and chat data (`chat.json`)
