---
sidebar_position: 1
---

# Dashboard

Your dashboard is the main screen in Almena ID where you can view and manage your decentralized identity.

## Dashboard Overview

When you open Almena ID after authentication, you'll see your dashboard with:

### Your Identity Information

**DID (Decentralized Identifier)**
- Your unique identity address
- Format: `did:almena:{identifier}` (displayed on two lines)
- Click the copy button to copy the full DID to clipboard
- Share this with others to let them verify your identity
- The complete identifier is visible without truncation

### Left Sidebar Menu

The sidebar provides navigation to all wallet sections:

- 🏠 **Home**: Your main dashboard (shows your DID)
- 👤 **Identity**: Identity management (placeholder)
- 📄 **Credentials**: Manage verifiable credentials (placeholder)
- 🔒 **Security**: Security and privacy settings (placeholder)
- ⚙️ **Settings**: App preferences and biometric authentication
- 🚪 **Logout**: Sign out of the wallet

**Mobile & Tablet**: The menu can be toggled with a hamburger button (☰) in the header
**Desktop**: The menu is always visible on the left side

### Header & Footer

- **Header**: Displays the Almena ID logo and app title consistently across all screens
- **Footer**: Shows "Secured locally" badge indicating local-only storage

## Using Your Dashboard

### Copying Your DID

1. Locate your DID card on the Home screen
2. Click the **"Copy DID"** button
3. Your full DID is now in your clipboard
4. A confirmation message appears briefly

### Navigating the Wallet

**On Mobile/Tablet**:
1. Tap the hamburger button (☰) in the top-left
2. The menu slides in from the left
3. Tap any menu item to navigate
4. The menu closes automatically after selection

**On Desktop**:
- The sidebar is always visible
- Click any menu item to navigate
- Current page is highlighted

### Sharing Your Identity

Your DID is safe to share publicly. Use it when:
- Someone needs to verify your identity
- Registering with services that support DIDs
- Receiving verifiable credentials
- Connecting with other users

**Remember**: Only share your DID, **never** your password or recovery phrase.

## Security Features

### Auto-Lock (Inactivity Detection)

The wallet automatically locks after **5 minutes of inactivity** to protect your identity.

When locked:
- You'll be redirected to the unlock screen
- Enter your password to unlock
- If biometric is enabled, you can use Touch ID / Face ID

### Biometric Authentication

You can enable biometric authentication in **Settings**:

**Supported**:
- 🍎 **macOS**: Touch ID / Touch Bar
- 🍎 **iOS**: Touch ID / Face ID
- 📱 **Android**: Fingerprint / Face Unlock (coming soon)
- 🪟 **Windows**: Windows Hello (coming soon)
- 🐧 **Linux**: Not supported

**To Enable**:
1. Go to Settings from the sidebar menu
2. Find "Biometric Authentication" option
3. Toggle it ON
4. You'll be prompted to authenticate with your biometric sensor
5. If successful, biometric unlock is enabled

**Note**: Enabling biometric authentication requires an immediate biometric verification to confirm your device supports it.

### Logout

To logout securely:
1. Click **"Logout"** in the sidebar menu
2. A warning dialog appears
3. Confirm your choice
4. Your session ends and sensitive data is cleared from memory
5. Private key remains safely stored in the device keychain
6. You can log back in by entering your password or using recovery phrase

**Note**: Logging out does NOT delete your identity. It only ends your current session.

## Next Steps

- [Learn about security →](../security/password-best-practices.md)
- [Configure settings →](../settings/language.md)
- [Troubleshoot issues →](../troubleshooting/extension-not-working.md)
