---
sidebar_position: 3
---

# Recovering Your Identity

Learn how to recover your identity using your 12-word recovery phrase.

## When to Recover

Recover your identity when:
- You've forgotten your password
- You're setting up on a new device
- You've reinstalled your browser
- You've cleared browser data

## Before You Start

You'll need:
- Your 12-word recovery phrase (in the correct order)
- Access to the Almena ID extension

**Without your recovery phrase, recovery is impossible.**

## Step-by-Step Recovery

### Step 1: Open Almena ID

Click the Almena ID icon in your browser toolbar.

### Step 2: Choose "Recover Account"

On the welcome screen, click the **"Recover Account"** button.

### Step 3: Enter Your Recovery Phrase

1. You'll see 12 input fields
2. Enter each word of your recovery phrase **in order**
3. The words must match exactly (case doesn't matter)
4. Click "Next" when all words are entered

**Common Issues**:
- Make sure words are spelled correctly
- Verify you're entering them in the right order
- Check for extra spaces
- Ensure you're using the recovery phrase for this identity

### Step 4: Create a New Password

Create a new password for this device:
- Minimum 8 characters
- Include letters, numbers, and special characters
- Can be different from your previous password

**Note**: This new password only applies to this device/browser. Your identity (DID) remains the same.

### Step 5: Recovery Complete!

Your identity is now restored with:
- The **same DID** as before
- The **same public key**
- A new password for this device

You'll see your familiar dashboard with your DID.

## What Gets Restored

When you recover your identity:

✅ **Restored**:
- Your DID (stays exactly the same)
- Your public key (identical)
- Your private key (re-derived from recovery phrase)
- Your identity across all devices

❌ **Not Restored**:
- Your old password (you create a new one)
- Browser-specific settings (you'll need to reconfigure)
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
- Browser storage issues
- Extension problems
- Network connectivity (shouldn't affect recovery, but may cause UI issues)

**Solution**:
1. Close and reopen the extension
2. Try recovery again
3. Restart your browser if needed

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
