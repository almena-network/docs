---
title: "UC-021: Route DIDComm Message"
sidebar_label: "UC-021: Route Message"
sidebar_position: 21
---

# UC-021: Route DIDComm Message

:::info Functional Specification
This use case defines intended behavior from the mediator's perspective. The mediator's routing logic is implemented; wallet integration is pending.
:::

## Description

The mediator receives an encrypted DIDComm v2 forward message from a sender wallet, decrypts only the outer routing envelope to identify the recipient, and delivers the inner encrypted message to the recipient. The mediator follows a zero-knowledge forwarding invariant: it never reads or decrypts the inner message content. Delivery is attempted in real-time via the recipient's WebSocket connection; if the recipient is offline, the message is stored in the offline queue for later pickup.

## Actors

- **Sender Wallet**: Wallet that sends the encrypted forward message to the mediator
- **Mediator**: Go service that routes the message based on the outer envelope
- **Recipient Wallet**: Wallet that receives the inner encrypted message

## Preconditions

- The mediator service is running and healthy
- Both the sender and recipient wallets are registered with the mediator ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- The sender has composed and double-encrypted the message ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message))

## Main Flow

1. The sender wallet sends an encrypted DIDComm forward message to the mediator's `POST /didcomm` endpoint
2. The mediator receives the JWE-encrypted outer envelope
3. The mediator decrypts the outer envelope using its own X25519 private key:
   - Algorithm: ECDH-ES+A256KW (key wrapping) + A256CBC-HS512 (content encryption)
   - Extracts the forward message plaintext
4. The mediator parses the forward message:
   - Validates `type` is `https://didcomm.org/routing/2.0/forward`
   - Extracts `body.next`: the recipient's routing DID
   - Extracts `attachments[0]`: the encrypted inner envelope (opaque to the mediator)
5. The mediator validates the routing:
   - Checks that the recipient routing DID exists in its registered wallets
   - Verifies the sender is not rate-limited (60 messages/minute per DID, 120/minute per IP)
6. The mediator attempts real-time delivery:
   - Checks if the recipient has an active WebSocket connection
   - **If online**: Pushes the encrypted inner envelope over the WebSocket → go to step 7
   - **If offline**: Stores the message in the offline queue → go to step 8
7. **Real-time delivery**:
   - The mediator sends the encrypted inner envelope to the recipient via WebSocket
   - The recipient wallet receives and processes the message ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message))
   - The recipient sends a `messages-received` acknowledgment
   - The mediator removes the message from any temporary storage
   - The mediator responds to the sender with HTTP 202 Accepted
8. **Offline queue storage**:
   - The mediator stores the encrypted inner envelope in the message store (MongoDB, SQLite, or in-memory):
     - Message ID
     - Recipient routing DID
     - Encrypted payload (inner envelope, still encrypted for the recipient)
     - Received timestamp
     - Status: `pending`
   - The mediator responds to the sender with HTTP 202 Accepted
   - The message remains in the queue until the recipient picks it up ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message), AF-PICKUP) or the TTL expires

## Alternative Flows

### AF-1: Recipient not registered
- At step 5, the recipient routing DID is not found in the mediator's registry
- The mediator responds with HTTP 400 and a DIDComm problem report:
  - Code: `e.p.me.res.not-found`
  - Comment: "Recipient not registered with this mediator"
- The sender wallet receives the error and should notify the user

### AF-2: Rate limit exceeded
- At step 5, the sender has exceeded the rate limit
- The mediator responds with HTTP 429 (Too Many Requests)
- The sender wallet should implement backoff and retry

### AF-3: Outer envelope decryption fails
- At step 3, the JWE decryption fails (malformed payload, wrong mediator key)
- The mediator responds with HTTP 400
- No message is stored or forwarded

### AF-4: Message queue full
- At step 8, the recipient already has the maximum number of stored messages (default 1000)
- The mediator discards the oldest message to make room for the new one (FIFO eviction)
- The sender still receives HTTP 202 — the eviction is transparent to the sender

### AF-5: Message TTL expiration
- A stored message has been in the offline queue longer than the TTL (default 72 hours)
- The mediator's background cleanup process removes expired messages
- The message is permanently lost — the sender is not notified

### AF-6: WebSocket delivery fails mid-stream
- At step 7, the WebSocket connection drops during delivery
- The mediator moves the message to the offline queue (step 8)
- The recipient retrieves it via Message Pickup on reconnect

## Postconditions

- **If recipient online**: The encrypted inner envelope has been delivered via WebSocket and acknowledged
- **If recipient offline**: The encrypted inner envelope is stored in the offline queue with status `pending`
- The sender has received HTTP 202 Accepted
- The mediator has never accessed the inner message content (zero-knowledge forwarding)

## Modules Involved

| Module | Role |
|--------|------|
| **mediator** | Outer envelope decryption, routing DID lookup, WebSocket delivery, offline queue storage, rate limiting, TTL enforcement |
| **wallet** (sender) | Constructs and sends the double-encrypted forward message |
| **wallet** (recipient) | Receives and decrypts the inner envelope (real-time or pickup) |

## Technical Notes

- **Zero-knowledge invariant**: The mediator ONLY decrypts the outer routing envelope (forward wrapper) to identify the recipient. It NEVER reads, logs, or stores the inner message content in decrypted form. The inner envelope remains encrypted end-to-end between sender and recipient
- **Forward protocol**: `https://didcomm.org/routing/2.0/forward` — the standard DIDComm v2 routing mechanism. The `body.next` field contains the routing DID; the `attachments` array contains the encrypted inner envelope
- **Storage backends**: The mediator supports three storage backends configured in `mediator.yaml`:
  - **In-memory**: For development and testing (data lost on restart)
  - **MongoDB**: For production (recommended for horizontal scaling)
  - **SQLite**: For single-node deployments (pure Go, no CGO dependency)
- **Message model**: `StoredMessage { id, recipient_did, payload (encrypted), received_at, status (pending|delivered), expires_at }`
- **Delivery confirmation**: When the recipient acknowledges via `messages-received` (Message Pickup 3.0), the mediator marks messages as delivered and removes them from storage
- **Metrics**: The mediator exposes Prometheus metrics at `GET /metrics`:
  - `mediator_messages_forwarded_total` (counter)
  - `mediator_messages_stored_total` (counter)
  - `mediator_messages_delivered_total` (counter)
  - `mediator_active_connections` (gauge)
  - `mediator_message_queue_size` (gauge per DID)
- **Logging**: The mediator logs routing events (sender DID → recipient DID, message ID, delivery method) but NEVER logs message content or encryption keys. Security logging rule from `mediator-didcomm.mdc`: never log payloads or private keys
- **Connection manager**: The WebSocket connection manager (`internal/connection/manager.go`) tracks active connections by DID. It supports multiple concurrent connections per DID (e.g., desktop + mobile wallet for the same identity)
