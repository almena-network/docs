---
title: "UC-005: Unlock Wallet with Biometrics"
sidebar_label: "UC-005: Unlock with Biometrics"
sidebar_position: 5
---

# UC-005: Unlock Wallet with Biometrics

## Description

The user unlocks the wallet using biometric authentication (Touch ID / Face ID) after the session has been locked due to inactivity. This provides a faster alternative to password entry. The biometric unlock is available on two screens: the in-app lock screen overlay and the dedicated unlock page. Password entry is always available as a fallback.

## Actors

- **End User**: Person unlocking the wallet with biometrics
- **Wallet (Frontend)**: Svelte application managing the lock screen UI and session state
- **Wallet (Rust Backend)**: Tauri commands interfacing with the OS biometric APIs
- **Operating System**: Provides the biometric authentication prompt

## Preconditions

- The user has an identity created in the wallet
- Biometric authentication has been enabled ([UC-004](./uc-004-enable-biometric-authentication.md)) — `biometricEnabled: true` in the Tauri Store
- The wallet session is locked (due to inactivity timeout or manual lock)
- The device has biometric hardware available and functional

## Main Flow

1. The wallet session locks (inactivity timeout or manual lock action)
2. The lock screen is displayed (either `LockScreen.svelte` overlay or `/unlock` page)
3. The lock screen checks biometric availability: invokes `is_biometric_available`
4. Both conditions are met (`biometricEnabled && biometricAvailable`), so the **Use Biometric** button is rendered alongside the password input
5. The user clicks **Use Biometric**
6. The wallet invokes the Rust command `authenticate_biometric`
7. The OS displays the native biometric prompt (Touch ID dialog on macOS)
8. The user authenticates successfully (fingerprint or face)
9. The Rust backend returns success
10. The wallet calls `unlockSession()` to restore the unlocked state
11. The user is returned to the dashboard

## Alternative Flows

### AF-1: Biometric verification fails
- At step 8, the biometric does not match
- The lock screen shows an error message: "Biometric authentication failed"
- The user remains on the lock screen and can retry biometrics or use the password

### AF-2: User cancels biometric prompt
- At step 8, the user cancels the OS dialog
- No error is shown (cancellation is silently handled)
- The user remains on the lock screen and can retry or use the password

### AF-3: Biometric hardware unavailable at unlock time
- At step 3, `is_biometric_available` returns `false` (hardware disconnected, driver issue, etc.)
- The **Use Biometric** button is not shown
- Only password entry is available

### AF-4: User chooses password instead
- At step 5, the user types their password in the password field instead of clicking the biometric button
- The wallet verifies the password hash via Argon2
- If valid, the session unlocks normally

### AF-5: Unlock via dedicated page
- The wallet navigates to `/unlock` instead of showing the lock screen overlay
- The flow is identical: biometric button shown if conditions met, on success navigates to `/dashboard`

## Postconditions

- The wallet session is unlocked
- The user has access to the dashboard and all wallet features
- No persistent state changes occur — biometric unlock is stateless
- The inactivity timer resets

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | Lock screen UI (`LockScreen.svelte` and `/unlock`), biometric button rendering, session unlock |
| **wallet** (Rust backend) | `authenticate_biometric` command via macOS `LAContext` |

## Technical Notes

- **Two unlock screens**: `LockScreen.svelte` is an in-app overlay component; `/unlock` is a dedicated route page. Both implement the same biometric flow independently
- **Stateless authentication**: Each biometric unlock is a fresh OS-level verification. No tokens, sessions, or cached results are reused
- **Password always available**: The password input is always rendered regardless of biometric availability, ensuring the user is never locked out
- **No biometric data flows through the wallet**: The Rust backend asks the OS to verify, receives a boolean result, and never accesses raw biometric data
- **Condition for biometric button**: `biometricEnabled` (user preference from store) AND `biometricAvailable` (live hardware check). Both must be `true`
