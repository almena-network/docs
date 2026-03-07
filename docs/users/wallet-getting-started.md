---
sidebar_position: 2
title: "Wallet: Getting Started"
sidebar_label: "Wallet: Getting Started"
---

# Wallet: Getting Started

The Almena Wallet is your personal identity application. It allows you to create and manage your decentralized identity (DID) on your own device.

## Creating Your Account

When you open the wallet for the first time, you will see the onboarding screen with two options:

1. **Create Account** — Start fresh with a new identity.
2. **Recover Account** — Restore an existing identity from a recovery phrase (coming soon).

### Step 1: Choose "Create Account"

Tap the primary button to begin the account creation process.

### Step 2: Set Your Password

You will be asked to create a secure password. The wallet validates your password in real time with the following rules:

- Minimum **8 characters**
- At least one **uppercase** letter (A-Z)
- At least one **lowercase** letter (a-z)
- At least one **digit** (0-9)

Each rule shows a visual indicator as you type:
- A checkmark appears when a rule is satisfied.
- The confirm password field must match exactly.

You can toggle password visibility using the show/hide button on each field.

### Step 3: Recovery Phrase

:::info Coming Soon
After setting your password, the wallet will generate a **12-word recovery phrase** (BIP39 mnemonic). This phrase is the only way to recover your identity if you lose access to your device. Write it down and store it securely — it will never be shown again.
:::

## Technical Details

- The wallet runs as a native desktop application built with [Tauri](https://tauri.app/).
- Your private keys are stored securely in your operating system's keychain (macOS Keychain, Windows Credential Store, or Linux Secret Service).
- No data is sent to any server during account creation — everything happens locally on your device.
- The interface is optimized for a mobile-first experience (390×844 viewport).
