---
sidebar_position: 5
---

# Biometric Authentication

Learn how to use Touch ID, Face ID, or other biometric sensors to unlock your Almena ID wallet.

## What is Biometric Authentication?

Biometric authentication allows you to unlock your wallet using your device's biometric sensor instead of typing your password. This provides:
- **Faster unlock**: One touch or glance
- **Convenience**: No need to remember or type password
- **Security**: Your biometric data never leaves your device

## Supported Platforms

### ✅ Currently Supported

- **macOS**: Touch ID (Touch Bar, Magic Keyboard)
- **iOS**: Touch ID / Face ID (coming soon)

### 🔄 Coming Soon

- **Android**: Fingerprint / Face Unlock
- **Windows**: Windows Hello

### ❌ Not Supported

- **Linux**: No native biometric support

## Enabling Biometric Authentication

### Prerequisites

- Your device must have a biometric sensor
- The biometric sensor must be configured in your device settings
- You must have created or recovered an identity in Almena ID

### Step-by-Step

1. Open Almena ID wallet
2. Click the **hamburger menu** (☰) to open the sidebar
3. Navigate to **Settings**
4. Find **"Biometric Authentication"** section
5. Toggle the switch to **ON**
6. **Immediate verification**: You'll be prompted to authenticate with your biometric sensor
7. If authentication succeeds, biometric unlock is enabled
8. If authentication fails, the toggle remains OFF

**Note**: The biometric verification happens immediately when you toggle ON. There's no intermediate confirmation dialog.

## Using Biometric Unlock

### When Auto-Locked

After 5 minutes of inactivity, your wallet auto-locks. To unlock with biometric:

1. You'll see the unlock screen
2. Two options are presented:
   - **Password**: Enter your password
   - **Use Biometric**: Authenticate with biometric sensor
3. Click "Use Biometric"
4. Authenticate with Touch ID / Face ID
5. On success, you're returned to your previous screen

### On macOS (Touch ID)

- Place your registered finger on the Touch ID sensor
- Or touch the Touch ID button on Magic Keyboard
- Authentication happens in ~1 second

### On iOS (Touch ID / Face ID)

- **Touch ID**: Place registered finger on home button
- **Face ID**: Look at your device
- Authentication is nearly instant

## Security Considerations

### What Biometric Protects

✅ **Protected**:
- Quick unlock after auto-lock
- Access to your wallet dashboard
- Navigation through wallet sections

✅ **How It's Secured**:
- Biometric data NEVER leaves your device
- Your device's secure enclave handles authentication
- Almena ID only receives "success" or "fail" from the system
- No biometric data is stored in the app

### What Biometric Doesn't Replace

❌ **Still Required**:
- Password during initial setup (create/recover identity)
- Recovery phrase for cross-device recovery
- Password as fallback if biometric fails

### Biometric vs Password

| Feature | Biometric | Password |
|---------|-----------|----------|
| Speed | Very fast | Requires typing |
| Convenience | High | Medium |
| Availability | Device-dependent | Always available |
| Fallback | Password required | N/A |
| Setup | Must test first | Always works |

## Disabling Biometric

To turn off biometric authentication:

1. Go to **Settings**
2. Find "Biometric Authentication"
3. Toggle the switch to **OFF**
4. No confirmation needed
5. You'll now only use password to unlock

**Note**: Disabling biometric doesn't affect your ability to use the wallet. Password unlock is always available.

## Troubleshooting

### "Biometric Authentication Unavailable"

If you see this message:
- Your device doesn't have a biometric sensor
- The sensor isn't configured in system settings
- Almena ID doesn't support biometric on your OS yet

### Biometric Fails to Enable

If authentication fails when trying to enable:
- Verify your biometric sensor works in other apps
- Check system settings for biometric configuration
- Try again with clean/dry fingers (Touch ID)
- Ensure good lighting and position (Face ID)

### Biometric Unlock Not Working

If biometric fails during unlock:
- Use password unlock as fallback
- Check if biometric is still enabled in Settings
- Verify sensor is clean and working
- Re-enable biometric in Settings if needed

### "Authentication Timed Out"

If you see this error:
- You took too long to authenticate (60-second timeout)
- Use password unlock instead
- Try biometric again

## Privacy & Security

### Your Biometric Data

- ✅ Stored in device's secure enclave
- ✅ Never accessible by Almena ID
- ✅ Never transmitted over network
- ✅ Managed entirely by your operating system

### How Authentication Works

1. Almena ID requests authentication from the OS
2. OS shows biometric prompt (Touch ID / Face ID)
3. You authenticate with your sensor
4. OS returns only "success" or "failure" to the app
5. App unlocks on success

**Almena ID never sees or handles your biometric data**.

## Platform-Specific Notes

### macOS

- Uses LocalAuthentication framework
- Supports Touch ID on MacBook Pro, Magic Keyboard
- Works with Apple Watch unlock (if configured)
- Fallback to password is always available

### iOS (Coming Soon)

- Touch ID on iPhone 5s through iPhone 8
- Face ID on iPhone X and later
- Works even when app is in background

### Android (Coming Soon)

- Fingerprint sensors
- Face unlock (on supported devices)
- Follows Android Biometric API

### Windows (Coming Soon)

- Windows Hello (facial recognition, fingerprint, PIN)
- Integrated with Windows security

## Related Topics

- [Auto-Lock & Session Security →](./auto-lock.md)
- [Password Best Practices →](./password-best-practices.md)
- [Privacy Features →](./privacy.md)
