---
sidebar_position: 5
---

# Identity QR Code

Your wallet can generate a QR code that represents your identity. Other people or services can scan this code to quickly receive your DID and verify who you are.

## Viewing Your QR Code

1. Open the **Identity** section from the sidebar menu
2. Your QR code is displayed automatically

## How the QR Code Works

The QR code contains your DID along with a security token that rotates periodically. This means:

- The QR code automatically refreshes every **30 seconds**
- A countdown timer shows how much time remains before the next refresh
- Each code includes a timestamp and expiration, so it cannot be reused after it expires

This rotation mechanism adds an extra layer of security, preventing someone from using a previously captured QR code.

## Sharing Your Identity

Show your QR code to:

- Other Almena ID users who want to start a conversation with you
- Services or applications that accept DID-based identification
- Anyone who needs to verify your identity

The QR code only shares your public DID. It never exposes your private key, password, or recovery phrase.

## Next Steps

- [Learn about messaging →](./messaging.md)
- [Learn about blockchain anchoring →](./blockchain-anchoring.md)
