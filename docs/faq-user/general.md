---
sidebar_position: 1
---

# General Questions

Common questions about using Almena ID.

## What is Almena ID?

Almena ID is a decentralized identity platform that gives you complete control over your digital identity. Instead of relying on usernames and passwords, you use cryptographic keys that only you control.

## Do I need an account?

No traditional "account" is needed. You create an identity that exists only on your device. There's no email signup, no username, no server storing your data.

## Is it free?

Yes, Almena ID is free for users.

## How is my data stored?

All your data is stored locally on your device:
- Encrypted with your password
- Never sent to our servers
- Only accessible by you
- Deleted when you uninstall the wallet

## Can I use Almena ID on multiple devices?

Yes! Use your 12-word recovery phrase to set up your identity on other devices:

1. Install Almena ID on the new device
2. Choose "Recover Account"
3. Enter your recovery phrase
4. Create a password for that device

Your same DID will be available on all devices.

## Is internet required?

- **To create identity**: No
- **To use wallet**: No
- **To authenticate with services**: Yes

The wallet works offline, but connecting to services requires internet.

## Which platforms are supported?

### Desktop
- ✅ Windows 10+
- ✅ macOS 10.13+
- ✅ Linux (Ubuntu, Debian, Fedora, etc.)

### Mobile
- ✅ Android 8.0+
- ✅ iOS 13.0+

## What is a DID?

A **DID** (Decentralized Identifier) is your unique identity. It looks like:

```
did:almena:a1b2c3d4e5f6789012345678901234
```

Think of it as a username, but:
- Cryptographically verifiable
- Globally unique
- No one can take it from you
- Works across any compatible service

## Can I change my DID?

No. Your DID is derived from your cryptographic keys. To get a new DID, you'd need to create a new identity.

## What if I forget my password?

Use your 12-word recovery phrase:
1. Click "Recover Account"
2. Enter your recovery phrase
3. Create a new password

If you've lost both password AND recovery phrase, your identity cannot be recovered.

## What is a recovery phrase?

A recovery phrase is 12 random words that can restore your identity:

```
apple banana cherry date elderberry fig
grape honeydew ice jackfruit kiwi lemon
```

**Critical**: This is the ONLY way to recover your identity if you forget your password or lose your device.

## Can Almena ID reset my password?

No. We don't have access to your password or data. Only your recovery phrase can restore access. This ensures true ownership of your identity.

## Is my data private?

Yes:
- Data never leaves your device (unless you use it to authenticate)
- Encrypted with your password
- We can't see your data
- No tracking or analytics on your identity

## Can someone steal my identity?

To steal your identity, someone would need:
- Your recovery phrase, OR
- Your password AND access to your device

**Protect your recovery phrase** and use a strong password.

## What happens if I lose my recovery phrase?

If you lose your recovery phrase and forget your password:
- ❌ Cannot recover identity
- ❌ Cannot access that DID
- ❌ All data lost permanently

This is why we emphasize writing it down safely!

## Can I have multiple identities?

Yes! You can create multiple identities (each with its own DID):
1. Log out
2. Create new account
3. New identity with new DID

Each identity is completely separate.

## How do I delete my identity?

Your identity exists only on your device. To remove it:

1. Log out from the wallet (this clears all local data including keys, messages, contacts, and configuration)
2. Uninstall the application

**Note**: If you have your identity on other devices, remove it from those too. Save your recovery phrase if you might want to restore later.

## What is the orange color for?

Orange is Almena ID's brand color. You'll see it throughout our platform and documentation.

## Is Almena ID open source?

Source code availability details will be announced. Check our website for updates.

## What languages are supported?

**Wallet**: English and Spanish

**Web Application**: English, Spanish, French, German, and Italian

More languages coming soon!

## Can I suggest features?

Yes! Send suggestions to:
- Email: feedback@almena.id
- Or through our community channels (coming soon)

## Messaging

### How do I send encrypted messages?

1. Open the Messages section from the sidebar
2. Start a new conversation by entering a contact's DID
3. Type your message and send

All messages are encrypted end-to-end using DIDComm V2.

### Are my messages stored on a server?

No. Messages are stored only on your device. No server has access to the content of your messages.

### What happens to messages when I log out?

All chat data (messages and contacts) is deleted from the device when you log out. This is a security feature to protect your privacy.

## Blockchain Anchoring

### What is blockchain anchoring?

Anchoring registers your DID on the Almena blockchain, making it publicly verifiable. Anyone can confirm your identity is legitimate by querying the blockchain.

### Is anchoring required?

No. Anchoring is optional. Your wallet works fully without it, but anchoring strengthens trust in your identity.

### Does anchoring cost anything?

No. DID anchoring on the Almena blockchain is free. Transaction fees are subsidized by the network.

## Web Application

### Is there a web application?

Yes. Almena ID includes a web application you can access from any browser. You log in using your wallet - no separate account or password is needed.

### How do I log in to the web app?

Click the login button on the web app. Your wallet will receive an authentication request that you can approve or reject. The request expires after 5 minutes.

## How do I update the wallet?

### Desktop
Updates are automatic when available, or you can download the latest version from the official website.

### Mobile
Updates are delivered through your app store (Google Play or App Store).

## Can businesses use Almena ID?

Yes! Businesses can integrate Almena ID for:
- User authentication
- Identity verification
- Credential issuance

For integration details, please contact us at integrations@almena.id

## Who created Almena ID?

Information about the team and organization will be available on our website.

## Is there a community?

Community channels coming soon:
- Discord server
- Forum
- Social media

Follow @almenaid for announcements.

## How do I report a bug?

Email: bugs@almena.id

Include:
- Platform and version (Windows, macOS, Linux, Android, iOS)
- Operating system version
- Steps to reproduce
- Screenshots (no passwords/phrases!)

## How do I get help?

- 📖 [User Guide](../user-guide/intro.md)
- 🔧 [Troubleshooting](../user-guide/troubleshooting/extension-not-working.md)
- 📧 Email: support@almena.id
- 💬 Community forums (coming soon)

## More Questions?

Didn't find your answer?
- Check [Troubleshooting](../user-guide/troubleshooting/extension-not-working.md)
- Read the full [User Guide](../user-guide/intro.md)
- Contact support@almena.id
