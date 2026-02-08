# Frequently Asked Questions - Users

Common questions from Almena ID users.

## General Questions

### What is Almena ID?

Almena ID is a decentralized identity wallet that gives you complete control over your digital identity. Unlike traditional accounts, your identity is secured by cryptography and only you have access to it.

### Is Almena ID free?

Yes, the Almena ID wallet and basic identity management is free to use.

### Which platforms are supported?

Almena ID is available on:
- Windows
- macOS
- Linux
- Android
- iOS

## Account Creation

### How do I create an account?

1. Install the Almena ID wallet on your device
2. Click "Create New Account"
3. Create a strong password
4. Save your 12-word recovery phrase
5. Your identity is created!

### What is a recovery phrase?

A recovery phrase (also called a mnemonic or seed phrase) is a list of 12 words that acts as a master key to your identity. With this phrase, you can recover your account on any device.

### Why 12 words?

The 12-word format follows the BIP39 standard, which provides 128 bits of entropy - enough to be cryptographically secure while remaining manageable to write down.

### Can I change my recovery phrase?

No. Your recovery phrase is mathematically derived from your identity. To get a new recovery phrase, you must create a new identity (which will have a different DID).

## Account Recovery

### I forgot my password. What do I do?

If you have your 12-word recovery phrase:
1. Click "Recover Account"
2. Enter your recovery phrase
3. Create a new password
4. Your identity is restored

### I lost my recovery phrase. Can you help?

Unfortunately, no. Your recovery phrase is the ONLY way to recover your account. If you lose it and forget your password, your identity cannot be recovered. This is by design to ensure maximum security and decentralization.

### Can Almena ID recover my account for me?

No. This is a fundamental principle of decentralized identity - only you control your keys. We have no "backdoor" or recovery mechanism.

## Security

### Is Almena ID secure?

Yes. Almena ID uses:
- Industry-standard cryptography (BIP39, BIP32, BIP44)
- AES-256 encryption for stored keys
- Your password never leaves your device
- Your keys are never transmitted to any server

### Where is my data stored?

Your encrypted private key, public key, and DID are stored locally on your device. Your password and recovery phrase are NEVER stored anywhere.

### Can someone hack my identity?

Your identity is as secure as your password and recovery phrase. As long as you:
- Use a strong password
- Keep your recovery phrase safe and secret
- Don't share your credentials

...your identity is extremely secure.

### Should I store my recovery phrase digitally?

**No!** Never store your recovery phrase:
- In screenshots
- In notes apps
- In email
- In cloud storage
- As a photo

Write it on paper and store it in a safe place.

## Using Almena ID

### What is a DID?

DID stands for Decentralized Identifier. It's your unique identity address on the Almena ID network. It looks like: `did:almena:a1b2c3d4...`

### Can I have multiple identities?

Yes! You can create multiple identities by:
1. Logging out of your current identity
2. Creating a new account

Each identity will have its own DID and recovery phrase.

### Can I use my identity on multiple devices?

Yes! Use your 12-word recovery phrase to restore your identity on any device. Your DID will be the same across all devices.

### Can I change my DID?

No. Your DID is mathematically derived from your public key. To get a new DID, you must create a new identity.

### How do I share my identity with others?

Share your DID. It's safe to share publicly - it's like a username or email address. Others can use it to verify your identity or send you verifiable credentials. You can also show your identity QR code from the Identity section of your wallet.

## Messaging

### How do I send a message?

1. Open the Messages section from the sidebar
2. Click New Conversation
3. Enter the recipient's DID
4. Start typing and press Enter to send

### Are messages encrypted?

Yes. All messages use DIDComm V2 end-to-end encryption. Only you and the recipient can read them.

### Where are messages stored?

Messages are stored locally on your device only. No server stores the content of your messages.

### What happens to my messages if I log out?

All chat data (messages and contacts) is deleted from the device when you log out. This is by design for security purposes.

## Blockchain Anchoring

### What is blockchain anchoring?

Anchoring registers your DID on the Almena blockchain, making it publicly verifiable. Anyone can confirm your identity is legitimate by querying the blockchain.

### Do I have to anchor my DID?

No. Anchoring is optional. Your wallet works fully without it, but anchoring strengthens trust in your identity.

### Does anchoring cost anything?

No. DID anchoring on the Almena blockchain is free. Transaction fees are subsidized by the network.

## Web Application

### Is there a web app?

Yes. Almena ID includes a web application you can access from any browser. You log in using your wallet - no separate account is needed.

### How do I log in to the web app?

Click the "Almena ID" button on the login page. Your wallet will receive an authentication request. Approve it in your wallet and you'll be logged in automatically.

## Language & Preferences

### How do I change the language?

1. Click Settings from your dashboard
2. Select Language
3. Choose your preferred language
4. The interface updates immediately

### What languages are supported?

- English
- Spanish
- French
- German
- Italian

## Troubleshooting

### The wallet isn't working

Try these steps:
1. Close and reopen the wallet
2. Restart your device
3. Reinstall the application

### I can't see my DID

Make sure:
1. You're logged in
2. Your wallet was created successfully
3. Wait a few seconds for data to load

### Language isn't changing

1. Restart the wallet
2. Verify your selection was saved
3. Restart the application

## Privacy

### What data does Almena ID collect?

None. We don't collect any personal data, analytics, or tracking information.

### Can you see my identity information?

No. Your identity information is stored locally on your device and encrypted with your password. We have no access to it.

### Is my activity tracked?

No. The Almena ID wallet doesn't track your activity or collect any data about your usage.

## Technical Questions

### What is BIP39/BIP32/BIP44?

These are Bitcoin Improvement Proposals that define standards for:
- **BIP39**: Mnemonic phrase generation
- **BIP32**: Hierarchical key derivation
- **BIP44**: Key derivation paths

Almena ID uses these battle-tested standards for security.

### How is my private key stored?

Your private key is:
1. Generated from your recovery phrase
2. Encrypted with AES-256 using your password
3. Stored in your device's local storage
4. Never transmitted to any server

### Can I export my private key?

Currently, no. Your private key is automatically managed by the wallet. You can always restore your identity using your recovery phrase.

## Getting Help

### How do I contact support?

- Email: support@almena.id
- Documentation: [docs.almena.id](https://docs.almena.id)
- FAQ: This page!

### Where can I report bugs?

Report bugs via:
- Email: bugs@almena.id
- GitHub Issues (if open source)

### Is there a community?

Check out:
- Discord: [discord.gg/almenaid](https://discord.gg/almenaid)
- Telegram: [@almenaid](https://t.me/almenaid)
- Twitter: [@almenaid](https://twitter.com/almenaid)

## Account Management

### How do I delete my account?

Your identity is decentralized and exists only on your device. To "delete" it:
1. Log out
2. Uninstall the Almena ID wallet

Note: This only removes it from your device. Your DID still exists on any blockchain or systems where it was recorded.

### How do I change my password?

Currently, to change your password:
1. Use "Recover Account" with your recovery phrase
2. Create a new password

Your identity (DID) remains the same.

## Still Have Questions?

Can't find your answer here? Contact us at support@almena.id
