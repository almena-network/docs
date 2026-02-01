---
sidebar_position: 4
---

# Auto-Lock & Session Security

Learn how Almena ID protects your identity with automatic session locking.

## What is Auto-Lock?

Auto-lock is a security feature that automatically locks your wallet after a period of inactivity. This prevents unauthorized access if you leave your device unattended.

## How It Works

### Inactivity Detection

The wallet monitors your activity by tracking:
- Mouse movements
- Mouse clicks
- Keyboard input
- Touch interactions (on mobile/tablet)
- Scrolling

### Lock Timing

- **Timeout**: 5 minutes of inactivity
- **Check Interval**: Every 10 seconds
- **Auto-lock**: Triggers automatically when timeout is reached

### What Happens When Locked

When your session is locked:
1. You're redirected to the unlock screen
2. Your session state is preserved
3. Sensitive operations are blocked
4. You must re-authenticate to continue

## Unlocking Your Wallet

### Option 1: Password Unlock

1. Enter your wallet password
2. Click "Unlock"
3. If correct, you're returned to where you left off
4. If incorrect, you'll see an error message

### Option 2: Biometric Unlock (if enabled)

If you've enabled biometric authentication:
1. Click "Use Biometric" button
2. Authenticate with Touch ID / Face ID / Fingerprint
3. On success, wallet unlocks immediately

## Activity Events

The following actions reset the inactivity timer:
- Moving your mouse
- Clicking anywhere in the app
- Pressing any key
- Touching the screen (mobile)
- Scrolling

## Security Benefits

### Protection Against

- ✅ Unauthorized access when device is left unlocked
- ✅ Physical access threats (someone using your device)
- ✅ Shoulder surfing (someone seeing your screen)
- ✅ Accidental exposure in public spaces

### What's Protected

When locked, the following are inaccessible:
- Your DID and identity information
- Navigation to wallet sections
- Any wallet operations
- Settings and configuration

### What Remains Secure

Even when unlocked:
- Private key stays in device keychain (never exposed)
- Password is never displayed or logged
- Recovery phrase is never stored (only used during setup)

## Best Practices

### When Using in Public

- ✅ Enable biometric unlock for faster re-authentication
- ✅ Set a strong but memorable password
- ✅ Be aware of the 5-minute timeout
- ✅ Manually lock if stepping away (close app)

### On Shared Devices

If you must use Almena ID on a shared device:
- ⚠️ Remember the 5-minute auto-lock
- ⚠️ Consider logging out instead of just locking
- ⚠️ Never save your password in browser/system
- ⚠️ Use a unique password for this device

### On Personal Devices

- ✅ Enable biometric unlock for convenience
- ✅ Use a strong password
- ✅ Keep your device locked when not in use
- ✅ Auto-lock provides an additional layer of security

## Troubleshooting

### "Session Locked" Appears Too Often

If you're being locked too frequently:
- The 5-minute timeout is currently fixed
- Consider enabling biometric unlock for faster re-authentication
- Future versions may allow customizable timeout periods

### Forgot Password After Lock

If you forget your password:
1. Close the app completely
2. Reopen the app
3. Use "Recover Identity" from the welcome screen
4. Enter your 12-word recovery phrase
5. Create a new password

### Biometric Not Working

If biometric unlock fails:
- Always fall back to password unlock
- Check that biometric is still enabled in Settings
- Verify your device's biometric sensor is working
- Try re-enabling biometric in Settings

## Privacy Note

Auto-lock activity monitoring:
- ✅ Only tracks generic events (mouse, keyboard)
- ✅ Does NOT log what you type or click
- ✅ Does NOT send any data over network
- ✅ Everything happens locally on your device

## Related Topics

- [Biometric Authentication →](./biometric-authentication.md)
- [Password Best Practices →](./password-best-practices.md)
- [Privacy Features →](./privacy.md)
