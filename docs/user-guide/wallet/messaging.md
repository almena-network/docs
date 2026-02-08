---
sidebar_position: 4
---

# Messaging

Almena ID includes a secure messaging system that lets you communicate with other identity holders using end-to-end encrypted DIDComm V2 messages.

## How Messaging Works

Messages are exchanged directly between wallets using the DIDComm V2 protocol. All messages are encrypted end-to-end, meaning only you and the recipient can read them.

## Starting a New Conversation

To message someone, you need their DID.

1. Open the **Messages** section from the sidebar menu
2. Click the **New Conversation** button
3. Enter the recipient's DID in the field provided
4. Optionally, add an alias (a friendly name) to identify them easily
5. Click **Start Conversation**

The DID must be in a valid format (e.g., `did:almena:...`). An error message will appear if the format is incorrect.

## Sending Messages

Once a conversation is open:

1. Type your message in the text field at the bottom
2. Press **Enter** or click the **Send** button
3. Your message appears on the right side of the conversation

Use **Shift + Enter** to add a new line without sending the message.

## Conversation List

The conversation list shows all your active conversations:

- **Contact name**: The alias you assigned, or a shortened version of their DID
- **Last message**: A preview of the most recent message
- **Time**: When the last message was sent (shows "Today", "Yesterday", or the date)

## Managing Conversations

### Assigning Aliases

When starting a conversation, you can assign a name to the contact. This alias is stored locally and helps you identify your contacts without memorizing their DIDs.

### Deleting a Conversation

To delete a conversation:

1. Hover over the conversation in the list
2. Click the **Delete** button that appears
3. Confirm the deletion

Deleted conversations cannot be recovered.

## Privacy and Security

- All messages are encrypted end-to-end using DIDComm V2
- Messages are stored locally on your device only
- No server stores the content of your messages
- An encryption badge is visible at the bottom of each conversation confirming DIDComm V2 encryption
- When you log out, all chat data (contacts and messages) is deleted from the device

## Next Steps

- [Learn about your dashboard →](./dashboard.md)
- [Understand privacy features →](../security/privacy.md)
