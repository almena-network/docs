---
title: "UC-018: Send DIDComm Message"
sidebar_label: "UC-018: Send Message"
sidebar_position: 18
---

# UC-018: Send DIDComm Message

:::info Functional Specification
This use case defines intended behavior. DIDComm message transport is not yet integrated in the wallet — messages are currently stored locally only.
:::

## Description

From an active conversation in the wallet, the user composes and sends a text message to another wallet user. The wallet encrypts the message using DIDComm v2 authenticated encryption (double envelope: inner end-to-end encryption for the recipient, outer routing envelope for the mediator), and delivers it through the mediator service. The recipient receives the message in real-time if online, or retrieves it later from the mediator's offline queue. The sent message is stored locally in the conversation history.

## Actors

- **Sender (End User)**: Person composing and sending the message from their wallet
- **Wallet (Frontend)**: Svelte application providing the chat UI and message composition
- **Wallet (Rust Backend)**: Tauri commands performing DIDComm message packing (JWE encryption, JWS signing)
- **Mediator**: Go service routing the encrypted message to the recipient

## Preconditions

- The sender has an identity created in the wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- The wallet session is unlocked
- The wallet is registered with the mediator ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- An active conversation exists with the recipient ([UC-020](/docs/developers/use-cases/wallet/uc-020-manage-conversations))
- The sender knows the recipient's DID

## Main Flow

1. The user opens an existing conversation from the chat screen
2. The wallet displays the conversation with the message history and the input area
3. The user types a message in the chat input field
4. The user presses Enter or taps the send button
5. The wallet validates the message is not empty after trimming
6. The wallet creates a DIDComm v2 Basic Message:
   - `id`: UUID v4
   - `type`: `https://didcomm.org/basicmessage/2.0/message`
   - `from`: sender's DID (`did:almena:<sender_public_key_hex>`)
   - `to`: recipient's DID (`did:almena:<recipient_public_key_hex>`)
   - `body`: `{ "content": "<message_text>" }`
   - `thid`: thread ID (conversation identifier: `<sender_did>:<recipient_did>`)
   - `created_time`: current UTC timestamp
7. The wallet invokes the Rust backend to pack the message (inner envelope):
   - Signs the plaintext message with the sender's Ed25519 private key (JWS)
   - Encrypts the signed message for the recipient using ECDH-ES+A256KW with the recipient's X25519 public key (JWE)
   - The result is the **inner envelope**: only the recipient can decrypt it
8. The wallet wraps the inner envelope in a **forward message** (outer envelope):
   - Type: `https://didcomm.org/routing/2.0/forward`
   - `to`: the mediator's DID
   - `body.next`: recipient's routing DID at the mediator
   - `attachments`: the encrypted inner envelope
   - Encrypts the forward message for the mediator using the mediator's X25519 public key
9. The wallet sends the double-encrypted message to the mediator via `POST /didcomm`
10. The mediator confirms receipt (HTTP 202 Accepted)
11. The wallet stores the sent message locally in the Tauri Store (`chat.json`) under the recipient's conversation
12. The message appears in the chat UI as a sent bubble (right-aligned, orange gradient) with the current timestamp
13. The message input field is cleared and focus returns to it

## Alternative Flows

### AF-1: Mediator unreachable
- At step 9, the network request to the mediator fails (timeout, connection error)
- The wallet stores the message locally with a `pending` delivery status
- The message appears in the UI with a pending indicator (clock icon)
- The wallet retries delivery when the mediator connection is restored
- On successful retry, the status updates to `sent`

### AF-2: Recipient DID not resolvable
- At step 7, the wallet cannot resolve the recipient's DID to obtain their public key
- The wallet shows an error: "Cannot encrypt message — recipient key unavailable"
- The message is not sent or stored

### AF-3: Empty message
- At step 5, the message is empty or whitespace-only
- The send button is disabled and no action is taken

### AF-4: Message too long
- At step 5, the message exceeds the maximum length (configurable, default 4096 characters)
- The wallet shows a character count warning and prevents sending

### AF-5: WebSocket available for delivery
- If the WebSocket connection to the mediator is active, the wallet can optionally send the message over WebSocket instead of HTTP POST
- The behavior is identical; the transport is an optimization for lower latency

## Postconditions

- The encrypted message has been delivered to the mediator for routing to the recipient
- The mediator holds the message for live delivery or offline pickup
- The plaintext message is stored locally in the sender's conversation history
- The chat UI reflects the new sent message with timestamp
- The message input field is cleared

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | Chat UI, message composition, sent message display, delivery status indicators |
| **wallet** (Rust backend) | Ed25519 signing (JWS), X25519 key agreement, JWE encryption (inner + outer envelopes), DID resolution |
| **mediator** | Message receipt, recipient routing, live delivery via WebSocket or offline queue storage |

## Technical Notes

- **Double envelope encryption**: The message is encrypted twice. The inner envelope (sender → recipient) provides end-to-end encryption that the mediator cannot read. The outer envelope (sender → mediator) provides the routing information. This is the DIDComm v2 standard forwarding mechanism
- **Message type**: `https://didcomm.org/basicmessage/2.0/message` — the simplest DIDComm message type for plain text chat
- **Thread model**: Each conversation has a thread ID (`thid`) formed by `<initiator_did>:<responder_did>`. All messages in a conversation share the same `thid`, enabling message grouping
- **Key resolution**: The sender must obtain the recipient's X25519 public key to encrypt the inner envelope. This can be resolved from the recipient's DID Document (if anchored on blockchain via [UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)) or from a prior key exchange
- **Encryption algorithms**: JWE with ECDH-ES+A256KW key wrapping and A256CBC-HS512 content encryption (same as the mediator specification)
- **Local storage**: Sent messages are stored in plaintext in the Tauri Store (`chat.json`) indexed by contact DID. Only the sender's wallet has access to the plaintext — the mediator only sees encrypted envelopes
- **Offline delivery**: If the recipient is not connected to the mediator via WebSocket, the mediator stores the encrypted inner envelope for up to 72 hours. The recipient retrieves it via Message Pickup 3.0 ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message))
- **Rate limiting**: The mediator enforces 60 messages/minute per DID. If exceeded, the wallet receives HTTP 429 and should back off
