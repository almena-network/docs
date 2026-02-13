---
title: "UC-020: Manage Conversations"
sidebar_label: "UC-020: Manage Conversations"
sidebar_position: 20
---

# UC-020: Manage Conversations

## Description

The user manages their chat conversations in the wallet. This includes viewing the conversation list, starting a new conversation with a contact by entering their DID, opening an existing conversation to view the message history, and deleting conversations they no longer need. The conversation list shows a summary of each conversation (contact name or DID, last message preview, timestamp, and unread count) sorted by most recent activity.

## Actors

- **End User**: Person managing their conversations in the wallet
- **Wallet (Frontend)**: Svelte application providing the conversation management UI (list, create, delete views)
- **Wallet (Rust Backend)**: Tauri Store for persistent conversation and contact data

## Preconditions

- The wallet application is installed and running
- The user has an identity created in the wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- The wallet session is unlocked ([UC-005](/docs/developers/use-cases/wallet/uc-005-unlock-wallet-with-biometrics) or password)

## Main Flow: View Conversation List

1. The user navigates to the Chat section from the wallet dashboard sidebar
2. The wallet loads the conversation summaries from the Tauri Store (`chat.json`)
3. Each conversation summary displays:
   - Contact avatar (initial letter from alias or DID)
   - Contact display name (alias if set, otherwise truncated DID)
   - Last message preview (truncated to one line)
   - Last message timestamp (time if today, "Yesterday", or date)
   - Unread message count badge (if > 0)
4. Conversations are sorted by most recent message first
5. If no conversations exist, the wallet shows an empty state with an invitation to start a new conversation
6. An encryption badge at the bottom indicates all messages are end-to-end encrypted

## Main Flow: Start New Conversation

7. The user taps the **+** button (new conversation) in the conversation list header
8. The wallet navigates to the new conversation view
9. The user enters the recipient's DID in the DID input field
10. The wallet validates the DID format in real-time:
    - Must follow the pattern `did:<method>:<method-specific-id>`
    - Must not be the user's own DID
11. Optionally, the user enters an alias (display name) for the contact
12. The user taps **Start Chat**
13. The wallet creates a new `ChatContact` entry:
    - `did`: the entered DID
    - `alias`: the entered alias (or empty string)
    - `createdAt`: current timestamp
14. The contact is saved to the Tauri Store
15. The wallet navigates directly to the conversation view for this contact, ready to send the first message ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message))

## Main Flow: Open Existing Conversation

16. From the conversation list (step 4), the user taps on a conversation card
17. The wallet loads the full message history for that contact from the Tauri Store
18. The wallet displays the conversation:
    - Header: back button, contact avatar, contact display name, contact DID (if alias is set)
    - Message area: chronological message bubbles (sent = right/orange, received = left/dark)
    - Encryption badge: "Messages are end-to-end encrypted"
    - Input area: text input field and send button
19. The message area auto-scrolls to the most recent message
20. The unread count for this conversation resets to 0

## Main Flow: Delete Conversation

21. From the conversation list, the user taps the delete icon (trash) on a conversation card
22. The wallet displays a confirmation dialog:
    - Title: "Delete conversation"
    - Message: warning that the action is irreversible and all messages will be lost
    - Actions: **Confirm** (danger variant) and **Cancel**
23. The user confirms the deletion
24. The wallet removes the contact and all associated messages from the Tauri Store:
    - Deletes the `ChatContact` entry from the contacts list
    - Deletes all `ChatMessage` entries under `messages:<contact_did>`
25. The conversation disappears from the list
26. If the user was viewing that conversation, the wallet returns to the conversation list

## Alternative Flows

### AF-1: Invalid DID format
- At step 10, the entered DID does not match the expected format
- The form shows an error message: "Invalid DID format"
- The **Start Chat** button is disabled until the DID is corrected

### AF-2: DID is the user's own
- At step 10, the entered DID matches the user's own DID
- The form shows an error message: "Cannot start a conversation with yourself"
- The **Start Chat** button is disabled

### AF-3: Duplicate contact
- At step 13, a contact with the same DID already exists
- The wallet silently redirects to the existing conversation instead of creating a duplicate
- The existing contact's alias is not overwritten

### AF-4: Delete cancelled
- At step 22, the user taps **Cancel**
- The dialog closes and no data is modified

### AF-5: Conversation created from incoming message
- When a message arrives from an unknown DID ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message), step 8)
- A new conversation is automatically created with no alias
- The user can later edit the alias or delete the conversation from this screen

### AF-6: No mediator registration
- The conversation management screens work fully offline (contact management, message history viewing)
- The warning "Not connected to messaging network" appears if the wallet has no mediator registration ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- The user can still create contacts and view history, but cannot send new messages

## Postconditions

- **View list**: Conversations are displayed sorted by most recent activity
- **New conversation**: A new contact exists in the store and the user is in the chat view ready to send messages
- **Open conversation**: The full message history is displayed and unread count is reset
- **Delete conversation**: The contact and all associated messages are permanently removed from the local store

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | Three-view chat UI (list, new, chat), conversation cards, delete confirmation dialog, form validation, responsive layout |
| **wallet** (Rust backend) | Tauri Store persistence (`chat.json`): contacts CRUD, messages storage and retrieval |

## Technical Notes

- **Three views**: The chat page uses a single-page approach with three states: `list` (conversation list), `new` (new conversation form), and `chat` (active conversation). Navigation between views is client-side without route changes — all views are within `/dashboard/chat`
- **Storage structure**: Contacts are stored as an array under the `contacts` key. Messages are stored per contact under `messages:<contact_did>`. This structure is already implemented in `chat.ts`
- **Thread ID**: Each conversation's thread ID follows the pattern `<initiator_did>:<responder_did>`. The initiator is whoever starts the conversation. This ID is used as the `thid` field in all DIDComm messages
- **Contact resolution**: Contacts are identified solely by DID. The alias is a local-only label that is not shared with the other party. If no alias is set, the DID is truncated for display (`did:almena:abcd...xyz`)
- **Responsive design**: The conversation list and chat views adapt to mobile (360–428px), tablet (768–1024px), and desktop (1024px+) following the wallet's design rules. The delete button is hidden on desktop until hover, and semi-visible on mobile for touch accessibility
- **Encryption badge**: A visual indicator ("Messages are end-to-end encrypted") appears on both the conversation list and the active chat view. This is informational and reflects the DIDComm v2 encryption when transport is integrated
- **No server dependency**: All conversation management operations (create, list, open, delete) work entirely offline against the local Tauri Store. Network connectivity is only required for sending ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message)) and receiving ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message)) messages
