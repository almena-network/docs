---
sidebar_position: 2
---

# Creating Your Identity

Learn how to create your decentralized identity with Almena ID.

## Before You Start

Make sure you have:
- Almena ID browser extension installed
- A pen and paper to write down your recovery phrase
- A safe place to store your recovery phrase

## Step-by-Step Guide

### Step 1: Open Almena ID

Click the Almena ID icon in your browser toolbar to open the extension.

### Step 2: Choose "Create New Account"

On the welcome screen, click the **"Create New Account"** button.

### Step 3: Create a Strong Password

Create a password that:
- Is at least 8 characters long
- Contains letters (uppercase and lowercase)
- Includes numbers
- Has special characters (!@#$%^&*)

**Important**: This password:
- Encrypts your private key
- Never leaves your device
- Cannot be recovered if lost

### Step 4: Save Your Recovery Phrase

You'll see 12 words displayed on screen.

**⚠️ CRITICAL**: 
- Write down all 12 words **in order**
- Write them on paper (not digitally)
- Double-check each word
- Store the paper in a safe place

These 12 words are the **ONLY** way to recover your identity if you forget your password.

#### Why 12 Words?

Your recovery phrase uses the BIP39 standard, providing cryptographic security while remaining manageable to write down.

### Step 5: Identity Created!

Your identity is now created with:
- A unique DID (Decentralized Identifier)
- A public key (for verification)
- A private key (encrypted and stored locally)

You'll see your dashboard with your DID displayed.

## What Happens Behind the Scenes

When you create an identity:

1. **Mnemonic Generation**: 12 random words are generated
2. **Key Derivation**: Cryptographic keys are derived from your mnemonic
3. **DID Creation**: Your DID is generated from your public key
4. **Encryption**: Your private key is encrypted with your password
5. **Local Storage**: Everything is stored encrypted in your browser

**Nothing is sent to any server**. Your identity is completely self-sovereign.

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
