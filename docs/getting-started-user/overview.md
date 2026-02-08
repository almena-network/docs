# Getting Started - User Guide

Welcome to Almena ID! This guide will help you get started with your decentralized identity wallet.

## What is Almena ID?

Almena ID is a decentralized identity platform that gives you complete control over your digital identity. Your identity is secured by cryptography and only you have access to it.

## Prerequisites

- A device running Windows, macOS, Linux, Android, or iOS
- Approximately 100-200 MB of free storage space

See [Supported Platforms](../user-guide/supported-platforms.md) for detailed requirements.

## Installation

### Desktop (Windows, macOS, Linux)

**Almena ID Wallet** is a native desktop application built with Tauri 2.0.

1. Download the installer for your operating system:
   - **macOS**: `.dmg` file
   - **Windows**: `.exe` or `.msi` installer
   - **Linux**: `.AppImage`, `.deb`, or `.rpm`
2. Run the installer
3. Launch Almena ID from your applications menu

See [Supported Platforms](../user-guide/supported-platforms.md) for platform-specific installation details.

### Mobile (Android, iOS)

**Coming soon**: Mobile apps are ready for deployment, pending app store approval.

- **Android**: APK available for testing
- **iOS**: TestFlight beta available

## First Time Setup

When you first open Almena ID Wallet, you'll see two options:

### Option 1: Create Identity

If you're new to Almena ID:

1. Click **"Create Identity"**
2. **Create a password**:
   - Minimum 8 characters
   - Confirm password by typing again
3. **Save your recovery phrase**:
   - You'll see 12 words displayed in a grid
   - Click "Copy to clipboard" to copy all words
   - Save them in a secure location
   - The "I have saved my phrase" button activates after copying
4. **Keys are generated**:
   - Your cryptographic keys are generated from the recovery phrase
   - Private key is stored in your device's keychain
   - Public key and DID are stored in secure app storage
5. **Success!** Your identity is created and you'll see your dashboard

**⚠️ Critical**: 
- Never share your recovery phrase with anyone
- Anyone with your recovery phrase can recreate your identity
- Store it safely - it's the only way to recover your identity

### Option 2: Recover Identity

If you already have an Almena ID identity:

1. Click **"Recover Identity"**
2. **Create a password** for this device:
   - Can be different from your previous password
   - Specific to this device only
3. **Enter your recovery phrase**:
   - Type or paste your 12 words separated by spaces
   - Click "Paste from clipboard" for quick input
   - Word counter shows progress (X/12 words)
4. Click **"Recover Identity"**
5. Your identity is restored with the same DID

## Your Identity

Once set up, you'll have:

- **DID (Decentralized Identifier)**: Your unique identity on the platform (format: `did:almena:...`)
- **Public Key**: Your public cryptographic key for verification
- **Private Key**: Encrypted and stored securely on your device

## Web Application

Almena ID also includes a web application you can access from any browser. The web app lets you:

- Log in using your wallet (no passwords needed)
- View your dashboard and DID
- Check the status of the platform services
- Change your interface language (5 languages supported)

Learn more in the [Web Application guide](../user-guide/web-app/overview.md).

## Language Support

Almena ID is available in multiple languages:

- **Wallet**: English and Spanish
- **Web Application**: English, Spanish, French, German, and Italian

The wallet automatically detects your device's language and uses it if supported. Otherwise, it defaults to English.

## Security Features

Almena ID includes multiple security layers:

- **Password protection**: Required to set up and unlock your wallet
- **Auto-lock**: Automatically locks after 5 minutes of inactivity
- **Biometric unlock**: Use Touch ID (macOS supported, others coming soon)
- **Secure storage**: Private keys stored in device's native keychain
- **Blockchain anchoring**: Optionally register your DID on the Almena blockchain
- **Encrypted messaging**: DIDComm V2 end-to-end encrypted messages
- **No data sent to servers**: Identity operations are client-side only

## Security Notes

- **Your password** is hashed with Argon2 and never stored in plain text
- **Your private key** is stored in your device's secure keychain
- **Your recovery phrase** is the ONLY way to recover your identity across devices
- **We cannot recover** your identity if you lose your recovery phrase
- **Messages** are encrypted end-to-end and stored only on your device

## Next Steps

- [Dashboard Overview →](../user-guide/wallet/dashboard.md)
- [Creating Your Identity (detailed) →](../user-guide/wallet/creating-identity.md)
- [Send Encrypted Messages →](../user-guide/wallet/messaging.md)
- [Blockchain Anchoring →](../user-guide/wallet/blockchain-anchoring.md)
- [Web Application →](../user-guide/web-app/overview.md)
- [Understanding Auto-Lock →](../user-guide/security/auto-lock.md)
- [Setting Up Biometric →](../user-guide/security/biometric-authentication.md)

## Need Help?

- [Frequently Asked Questions →](../faq-user/overview.md)
- Contact support at support@almena.id
