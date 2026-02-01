---
sidebar_position: 3
---

# Recovering Your Identity

Learn how to recover your identity using your 12-word recovery phrase.

## When to Recover

Recover your identity when:
- You've forgotten your password
- You're setting up on a new device
- You've reinstalled the Almena ID wallet
- You've cleared application data

## Before You Start

You'll need:
- Your 12-word recovery phrase (in the correct order)
- Almena ID wallet installed on your device

**Without your recovery phrase, recovery is impossible.**

## Step-by-Step Recovery

### Step 1: Open Almena ID

Open the Almena ID wallet application on your device.

### Step 2: Choose "Recover Identity"

On the welcome screen, click the **"Recover Identity"** button.

### Step 3: Create a New Password

Create a password for this device:
- Minimum 8 characters
- Can be different from your previous password
- Specific to this device only

**Note**: This password only applies to this device. Your identity (DID) will remain the same across all devices.

Enter the password twice to confirm it matches.

### Step 4: Enter Your Recovery Phrase

You'll see a large text area where you can:

1. **Paste your recovery phrase**: Click "Paste from clipboard" to automatically fill all 12 words
2. **Type manually**: Enter your 12 words separated by spaces

**Instructions displayed**:
- Words must be separated by spaces
- You need exactly 12 words
- Word counter shows progress (e.g., "11/12 words")

The **"Recover Identity"** button only activates when you have exactly 12 words entered.

**Common Issues**:
- Make sure words are spelled correctly
- Words should be separated by single spaces
- No extra spaces at the beginning or end
- Ensure you're using the correct recovery phrase

### Step 5: Identity Restoration

When you click "Recover Identity":
1. The app validates your recovery phrase (BIP39 validation)
2. If invalid, you'll see an error message
3. If valid, the app shows "Restoring identity..." with a spinner
4. Your cryptographic keys are regenerated from the recovery phrase
5. Keys are stored securely (same as creation)

### Step 6: Recovery Complete!

Your identity is now restored with:
- The **same DID** as before
- The **same public key**
- The **same private key** (regenerated)
- A new password for this device

You'll see your dashboard with your DID displayed.

## What Gets Restored

When you recover your identity:

✅ **Restored**:
- Your DID (stays exactly the same)
- Your public key (identical)
- Your private key (re-derived from recovery phrase)
- Your identity across all devices

❌ **Not Restored**:
- Your old password (you create a new one)
- Device-specific settings (you'll need to reconfigure)
- Language preferences (reset to default)

## Using Multiple Devices

You can use your identity on multiple devices:

1. Install Almena ID on the new device
2. Use "Recover Account" with your recovery phrase
3. Create a password for that device
4. Your same DID appears on both devices

**Each device can have a different password, but the identity is the same.**

## Troubleshooting Recovery

### "Invalid Recovery Phrase"

If you see this error:
- ✅ Check spelling of each word
- ✅ Verify word order
- ✅ Make sure you're using the correct recovery phrase
- ✅ Try typing words manually (don't paste)

### "Recovery Failed"

Possible causes:
- Storage issues
- Application problems
- Network connectivity (shouldn't affect recovery, but may cause UI issues)

**Solution**:
1. Close and reopen the wallet
2. Try recovery again
3. Restart your device if needed

### Lost Recovery Phrase

**If you've lost your recovery phrase AND forgotten your password**:

Unfortunately, your identity **cannot be recovered**. This is by design for maximum security.

You'll need to:
1. Create a new identity (with a new DID)
2. This time, store your recovery phrase safely

## Security After Recovery

After recovering your identity:

1. **Verify Your DID**: Check that your DID matches what you remember
2. **Update Password**: Make sure your new password is strong
3. **Reconfigure Settings**: Set your language and preferences
4. **Store Recovery Phrase**: Keep it safe for future use

## Next Steps

- [Secure your recovery phrase →](../security/recovery-phrase.md)
- [Password best practices →](../security/password-best-practices.md)
- [Configure settings →](../settings/language.md)
