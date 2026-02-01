---
sidebar_position: 2
---

# Supported Platforms

Almena ID Wallet is a truly cross-platform application built with Tauri 2.0, running natively on desktop and mobile devices.

## Desktop Platforms

### 🍎 macOS

**Supported Versions**: macOS 10.15 (Catalina) and later

**Features**:
- ✅ Native app (not a web app)
- ✅ Touch ID support for biometric unlock
- ✅ Keychain integration for private key storage
- ✅ Full feature parity
- ✅ Apple Silicon (M1/M2/M3) and Intel support

**Installation**:
- Download `.dmg` file from releases
- Drag to Applications folder
- First run may require permission approval

### 🪟 Windows

**Supported Versions**: Windows 10 (1903+) and Windows 11

**Features**:
- ✅ Native app (not a web app)
- ✅ Credential Manager integration
- ✅ Full feature parity
- 🔄 Windows Hello support (coming soon)

**Installation**:
- Download `.exe` installer or `.msi` package
- Run installer
- App installs to Program Files

### 🐧 Linux

**Supported Distributions**:
- Ubuntu 20.04+ / Debian 11+
- Fedora 35+
- Arch Linux
- Other distributions with GTK 3.24+

**Features**:
- ✅ Native app
- ✅ Secret Service integration (GNOME Keyring, KWallet)
- ✅ Full feature parity
- ❌ No native biometric support

**Installation**:
- Download `.AppImage`, `.deb`, or `.rpm`
- For AppImage: Make executable and run
- For deb/rpm: Install with package manager

## Mobile Platforms

### 📱 iOS

**Supported Versions**: iOS 13 and later

**Features**:
- ✅ Native iOS app
- ✅ Touch ID / Face ID support (coming soon)
- ✅ iOS Keychain integration
- ✅ Full feature parity
- ✅ iPad support

**Installation**:
- Available via TestFlight (beta)
- App Store (coming soon)

**Status**: Ready for deployment, pending App Store approval

### 🤖 Android

**Supported Versions**: Android 7.0 (Nougat) and later

**Features**:
- ✅ Native Android app
- ✅ Android Keystore integration
- ✅ Full feature parity
- 🔄 Fingerprint / Face unlock support (coming soon)
- ✅ Tablet support

**Installation**:
- Available via APK download
- Google Play Store (coming soon)

**Status**: Ready for deployment, pending Play Store approval

## Feature Comparison

| Feature | Windows | macOS | Linux | Android | iOS |
|---------|---------|-------|-------|---------|-----|
| Create Identity | ✅ | ✅ | ✅ | ✅ | ✅ |
| Recover Identity | ✅ | ✅ | ✅ | ✅ | ✅ |
| Secure Storage | ✅ | ✅ | ✅ | ✅ | ✅ |
| Auto-Lock | ✅ | ✅ | ✅ | ✅ | ✅ |
| Biometric | 🔄 | ✅ | ❌ | 🔄 | 🔄 |
| Multi-Language | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend**:
- ✅ Fully supported
- 🔄 Coming soon
- ❌ Not supported / Not available

## System Requirements

### Desktop (All Platforms)

**Minimum**:
- 2 GB RAM
- 100 MB disk space
- Display: 800x600 resolution

**Recommended**:
- 4 GB RAM
- 200 MB disk space
- Display: 1920x1080 resolution

### Mobile

**Minimum**:
- Android: 2 GB RAM, Android 7.0+
- iOS: 2 GB RAM, iOS 13+

**Recommended**:
- Android: 4 GB RAM, Android 10+
- iOS: 4 GB RAM, iOS 15+

## Installation

For detailed installation instructions, download the appropriate installer for your platform from the official Almena ID website or repository.

## Platform-Specific Notes

### macOS

**Keychain Access Prompt**: First time you create or recover an identity, macOS may ask for permission to access the keychain. This is normal and required for secure key storage. Choose "Always Allow" to avoid repeated prompts.

**Gatekeeper**: On first launch, you may need to right-click the app and select "Open" to bypass Gatekeeper if you downloaded from outside App Store.

### Windows

**SmartScreen**: Windows Defender SmartScreen may show a warning on first run. Click "More info" and "Run anyway" if you trust the source.

**Credential Manager**: Private keys are stored in Windows Credential Manager under "almena-id-wallet".

### Linux

**Keyring Requirement**: Requires GNOME Keyring, KWallet, or compatible Secret Service implementation for secure key storage.

**AppImage Permissions**: Make the AppImage executable with `chmod +x` before running.

### Android

**Permissions**: No special permissions required. All storage is app-private and secure.

### iOS

**Trust Developer**: May require trusting the developer certificate in Settings if installed via TestFlight or enterprise distribution.

## Cross-Platform Identity

Your identity is **truly portable** across all platforms:

1. Create identity on any device
2. Save your 12-word recovery phrase
3. Use "Recover Identity" on any other device
4. Same DID appears everywhere

**Your identity is platform-independent!**

## Updates & Versions

- **Auto-update**: Desktop versions support automatic updates
- **Manual update**: Mobile versions update through app stores
- **Version checking**: Built-in update checker (coming soon)

## Related Topics

- [Creating Your Identity →](./wallet/creating-identity.md)
- [Dashboard Overview →](./wallet/dashboard.md)
- [Troubleshooting →](./troubleshooting/extension-not-working.md)
