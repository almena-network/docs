---
title: "UC-004: Enable Biometric Authentication"
sidebar_label: "UC-004: Enable Biometric Auth"
sidebar_position: 4
---

# UC-004: Enable Biometric Authentication

## Description

The user activates biometric authentication (Touch ID / Face ID) from the wallet settings. This allows unlocking the wallet using the device's biometric sensor instead of typing the password. Enabling requires a successful biometric verification to confirm the user has biometric access. Currently fully implemented on macOS only.

## Actors

- **End User**: Person enabling biometric authentication in their wallet
- **Wallet (Frontend)**: Svelte application managing the settings UI and state
- **Wallet (Rust Backend)**: Tauri commands interfacing with the OS biometric APIs
- **Operating System**: Provides the biometric authentication framework (LocalAuthentication on macOS)

## Preconditions

- The user has an identity created in the wallet ([UC-001](./uc-001-create-identity.md))
- The user is authenticated and on the dashboard
- The device has biometric hardware available (e.g., Touch ID sensor on macOS)
- Biometrics are enrolled in the OS (at least one fingerprint or face registered)
- Biometric authentication is currently disabled (`biometricEnabled: false`)

## Main Flow

1. The user navigates to **Settings** (`/dashboard/settings`)
2. The settings page runs an availability check on mount: invokes the Rust command `is_biometric_available`
3. The Rust backend (macOS): instantiates an `LAContext`, calls `canEvaluatePolicy` with policy `deviceOwnerAuthenticationWithBiometrics` (policy value 1)
4. The check returns `true` — the biometric toggle is shown as enabled and interactive
5. The user toggles the **Biometric Authentication** switch to ON
6. The wallet invokes the Rust command `authenticate_biometric` to verify the user's biometric
7. The OS displays the native biometric prompt with message: "Authenticate to enable biometric unlock for Almena ID"
8. The user authenticates successfully (fingerprint or face)
9. The Rust backend returns success
10. The wallet updates the auth store: `setBiometricEnabled(true)`
11. The wallet persists the flag to the Tauri Store: `updateIdentityInStore({ biometricEnabled: true })` in `identity.json`
12. The toggle remains ON and the description updates to "Unlock with fingerprint or face recognition"

## Alternative Flows

### AF-1: Biometric hardware not available
- At step 3, `canEvaluatePolicy` returns `false`
- The toggle is shown as disabled with an "Unavailable" badge
- Description reads: "Not available on this device"
- The user cannot enable biometrics

### AF-2: User cancels biometric prompt
- At step 8, the user cancels the OS biometric dialog
- The Rust backend returns error code `LAErrorUserCancel` (-2) mapped to `USER_CANCELLED`
- The toggle reverts to OFF silently (no error alert shown)

### AF-3: Biometric verification fails
- At step 8, the biometric does not match
- The Rust backend returns an error with the failure description
- An alert is shown to the user with the error message
- The toggle reverts to OFF

### AF-4: Authentication timeout
- At step 8, the user does not respond within 60 seconds
- The Rust backend returns "Authentication timed out"
- The toggle reverts to OFF

### AF-5: User disables biometrics
- The user toggles the switch to OFF
- The wallet updates the auth store: `setBiometricEnabled(false)`
- The wallet persists: `updateIdentityInStore({ biometricEnabled: false })`
- No biometric prompt is needed for disabling

## Postconditions

- `biometricEnabled: true` is persisted in the Tauri Store (`identity.json`)
- The auth store reflects `biometricEnabled: true`
- On subsequent wallet locks, the lock screen will show a "Use Biometric" button (see [UC-005](./uc-005-unlock-wallet-with-biometrics.md))
- No biometric templates or secrets are stored by the wallet — the OS manages all biometric data

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | Settings UI, toggle handling, availability check, auth store update |
| **wallet** (Rust backend) | macOS `LAContext` integration via Objective-C runtime, `is_biometric_available` and `authenticate_biometric` commands |

## Technical Notes

- **macOS implementation**: Uses the `LocalAuthentication` framework via Objective-C runtime bindings (`objc` and `block` crates). Policy: `deviceOwnerAuthenticationWithBiometrics` (biometric only, no device passcode fallback)
- **Platform support status**:
  - macOS: Fully implemented (Touch ID / Face ID)
  - Windows: Stubbed — `is_biometric_available` returns `false`
  - Linux: Stubbed — returns `false`
  - iOS: Stubbed — returns `true` (placeholder)
  - Android: Stubbed — returns `true` (placeholder)
- **No biometric data stored**: The wallet only stores a boolean flag. All biometric verification is delegated to the OS — the wallet never accesses fingerprint templates or face data
- **Stateless verification**: Each biometric prompt is independent. There is no session token or cached biometric result
- **Enabling requires proof**: The user must pass a biometric check to enable the feature, preventing unauthorized activation
