---
title: "UC-019: Receive DIDComm Message"
sidebar_label: "UC-019: Receive Message"
sidebar_position: 19
---

# UC-019: Receive DIDComm Message

:::info Functional Specification
This use case defines intended behavior. DIDComm message reception is not yet integrated in the wallet — messages are currently stored locally only.
:::

## Description

The wallet receives a DIDComm v2 message sent by another wallet through the mediator. Messages arrive via two mechanisms: real-time delivery over the WebSocket connection when the wallet is online, or offline pickup using the Message Pickup 3.0 protocol when the wallet reconnects after being offline. The wallet decrypts the received message, validates the sender's signature, stores it in the local conversation history, and displays it in the chat UI.

## Actors

- **Recipient (End User)**: Person receiving the message in their wallet
- **Wallet (Frontend)**: Svelte application displaying the incoming message in the chat UI
- **Wallet (Rust Backend)**: Tauri commands performing JWE decryption and JWS signature verification
- **Mediator**: Go service delivering the encrypted message via WebSocket or holding it for pickup

## Preconditions

- The recipient has an identity created in the wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- The wallet session is unlocked
- The wallet is registered with the mediator ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- The sender has previously sent a message to this wallet ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message))

## Main Flow (Real-time delivery)

1. The wallet maintains an active WebSocket connection to the mediator (`/ws?did=<wallet_DID>`)
2. The mediator receives a forwarded message destined for this wallet ([UC-021](/docs/developers/use-cases/mediator/uc-021-route-didcomm-message))
3. The mediator detects the recipient has an active WebSocket connection
4. The mediator delivers the encrypted inner envelope over the WebSocket
5. The wallet receives the encrypted message on the WebSocket handler
6. The wallet invokes the Rust backend to unpack the message:
   - Decrypts the JWE using the wallet's X25519 private key (derived from Ed25519)
   - Verifies the JWS signature against the sender's Ed25519 public key
   - Extracts the plaintext DIDComm Basic Message
7. The wallet validates the message structure:
   - Type is `https://didcomm.org/basicmessage/2.0/message`
   - `from` contains a valid DID
   - `body.content` is present and not empty
   - `thid` (thread ID) is present
8. The wallet checks if the sender is an existing contact:
   - **If yes**: The message is added to the existing conversation
   - **If no**: A new contact is created automatically with the sender's DID (no alias) and the message starts a new conversation
9. The wallet stores the received message in the Tauri Store (`chat.json`) under the sender's conversation
10. If the user is currently viewing the conversation with this sender:
    - The message appears as a received bubble (left-aligned, dark background) with the timestamp
    - The view auto-scrolls to the new message
11. If the user is on the conversation list or elsewhere:
    - The conversation's `unreadCount` is incremented
    - The conversation moves to the top of the list with the new message preview
    - A notification badge shows on the chat navigation item
12. The wallet sends a `messages-received` acknowledgment to the mediator so the message is removed from the queue

## Alternative Flow: Offline Message Pickup

### AF-PICKUP: Retrieve messages after being offline
1. The wallet opens or the WebSocket connection is re-established after being offline
2. The wallet sends a `status-request` message to the mediator:
   - Type: `https://didcomm.org/messagepickup/3.0/status-request`
3. The mediator responds with `status` indicating the number of queued messages
4. If there are queued messages (count > 0):
   - The wallet sends a `delivery-request`:
     - Type: `https://didcomm.org/messagepickup/3.0/delivery-request`
     - `limit`: number of messages to retrieve (batch size, default 10)
   - The mediator responds with a `delivery` message containing the queued encrypted messages as attachments
   - The wallet processes each message following steps 6–11 of the main flow
   - The wallet sends `messages-received` with the IDs of processed messages
   - The mediator removes the acknowledged messages from the queue
   - The wallet repeats until all queued messages are retrieved (status count reaches 0)

## Other Alternative Flows

### AF-1: Invalid message format
- At step 7, the message structure is invalid (unknown type, missing fields)
- The wallet silently discards the message and logs the error locally
- No message is stored or displayed

### AF-2: Signature verification fails
- At step 6, the JWS signature does not match the sender's public key
- The wallet discards the message — it may have been tampered with
- The wallet logs a security warning locally

### AF-3: Decryption fails
- At step 6, the JWE decryption fails (wrong key, corrupted message)
- The wallet discards the message and logs the error
- This may indicate the sender encrypted for the wrong recipient

### AF-4: WebSocket disconnected during delivery
- The WebSocket connection drops before the message is fully received
- The mediator retains the message in the offline queue
- When the wallet reconnects, it retrieves the message via the pickup flow (AF-PICKUP)

### AF-5: Sender blocked
- In a future iteration, the user may block specific DIDs
- Messages from blocked DIDs are decrypted to verify the sender, then silently discarded
- No notification or conversation update occurs

## Postconditions

- The received message is decrypted, validated, and stored in the local conversation history
- The chat UI reflects the new message (inline if the conversation is open, or as an unread indicator)
- The mediator has removed the delivered message from its queue (after acknowledgment)

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | WebSocket listener, message display in chat UI, unread count badges, notification indicators |
| **wallet** (Rust backend) | X25519 decryption (JWE), Ed25519 signature verification (JWS), sender DID resolution |
| **mediator** | Real-time WebSocket delivery, offline message queue, Message Pickup 3.0 protocol, delivery acknowledgment |

## Technical Notes

- **Two delivery modes**: Real-time (WebSocket push) is preferred when the wallet is online. Offline pickup (Message Pickup 3.0 polling) is the fallback. The wallet should always perform a status check on reconnect to retrieve any missed messages
- **Message Pickup 3.0**: Protocol `https://didcomm.org/messagepickup/3.0/`. Three message types: `status-request` → `status`, `delivery-request` → `delivery`, `messages-received`. The wallet controls the batch size via the `limit` field in `delivery-request`
- **Auto-contact creation**: When a message arrives from an unknown DID, the wallet automatically creates a contact entry. The user can later assign an alias or delete the conversation ([UC-020](/docs/developers/use-cases/wallet/uc-020-manage-conversations))
- **Unread tracking**: The `unreadCount` field in `ConversationSummary` tracks unread messages per conversation. It resets to 0 when the user opens the conversation. Currently defined in the chat service but not connected to transport
- **Mediator message TTL**: The mediator stores offline messages for up to 72 hours (configurable `message_ttl` in `mediator.yaml`). Messages not picked up within this window are permanently deleted
- **Max stored messages**: The mediator stores up to 1000 messages per wallet DID (configurable `max_stored_messages`). If the limit is reached, the oldest messages are discarded
- **Notification**: Currently limited to in-app badge indicators. Future: OS-level push notifications on mobile (via Tauri mobile plugins) and desktop (via system notification APIs)
- **Security**: The wallet never stores the encrypted envelope — only the decrypted plaintext is persisted locally. The sender's identity is verified via JWS signature before any storage or display
