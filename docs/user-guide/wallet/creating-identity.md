---
sidebar_position: 2
---

# Creating Your Identity

Learn how to create your decentralized identity with Almena ID.

## Before You Start

Make sure you have:
- Almena ID wallet installed on your device
- A pen and paper to write down your recovery phrase
- A safe place to store your recovery phrase

## Step-by-Step Guide

### Step 1: Open Almena ID

Open the Almena ID wallet application on your device (Windows, macOS, Linux, Android, or iOS).

### Step 2: Choose "Create Identity"

On the welcome screen, click the **"Create Identity"** button.

### Step 3: Create a Strong Password

Create a password that:
- Is at least 8 characters long
- You can remember
- Is unique to this identity

**Important**: This password:
- Protects your wallet on this device
- Is used to unlock the app after inactivity
- Can be different on each device
- Is stored securely as a hash

Enter the password twice to confirm it matches.

### Step 4: Save Your Recovery Phrase

You'll see **12 words** displayed on screen in a grid format.

**⚠️ CRITICAL**: 
- Click **"Copy to clipboard"** to copy all 12 words
- Paste them into a secure location (password manager, paper, etc.)
- Write them down **in order**
- Store them in a safe place
- The **"I have saved my phrase"** button only activates after copying

These 12 words are the **ONLY** way to recover your identity across devices or if you lose access.

#### Why 12 Words?

Your recovery phrase uses the **BIP39 standard**, providing cryptographic security while remaining manageable to write down.

#### What Happens When You Continue

When you click "I have saved my phrase":
1. The wallet generates your cryptographic keys from the recovery phrase
2. Your **private key** is stored in your device's secure keychain
3. Your **public key** and DID are stored in the app's secure storage
4. You're ready to use your identity!

### Step 5: Identity Created!

Your identity is now created with:
- A unique **DID** (Decentralized Identifier) format: `did:almena:xxxxx`
- A **public key** (Ed25519, for verification)
- A **private key** (Ed25519, stored securely in device keychain)

You'll see your dashboard with your DID displayed.

## What Happens Behind the Scenes

When you create an identity:

1. **Mnemonic Generation**: 12 random words are generated using BIP39 standard
2. **Key Derivation**: Ed25519 keypair is derived from your mnemonic
3. **DID Creation**: Your DID is generated from your public key (format: `did:almena:{identifier}`)
4. **Secure Storage**:
   - **Private key** → Device's native keychain (Keychain on macOS/iOS, Credential Manager on Windows, Secret Service on Linux, Keystore on Android)
   - **Public key and DID** → Tauri secure store
   - **Password hash** → Argon2 hashed and stored in Tauri store
5. **No Network**: Everything happens locally on your device

**Nothing is sent to any server**. Your identity is completely self-sovereign and private.

## After Creation

### ✅ Do This Now

- [ ] Store your recovery phrase safely
- [ ] Test copying your DID
- [ ] Verify your dashboard displays correctly
- [ ] Note your DID somewhere accessible (it's safe to share)

### ❌ Never Do This

- Don't share your recovery phrase with anyone
- Don't store your recovery phrase digitally
- Don't share your password
- Don't take screenshots of your recovery phrase

## Next Steps

- [Learn about your dashboard →](./dashboard.md)
- [Understand recovery phrases →](../security/recovery-phrase.md)
- [Configure your settings →](../settings/language.md)
