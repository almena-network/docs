---
title: "UC-006: Display Identity QR Code"
sidebar_label: "UC-006: Display Identity QR"
sidebar_position: 6
---

# UC-006: Display Identity QR Code

## Description

The wallet displays a rotating QR code that represents the user's decentralized identity. The QR encodes a JSON payload containing the DID, a timestamp, an expiration time, and a rotation token. The QR regenerates every 30 seconds (configurable) to prevent static capture and replay. The QR is rendered in Almena brand colors (orange on dark background) and includes a visible countdown timer.

## Actors

- **End User**: Person displaying their identity QR code
- **Wallet (Frontend)**: Svelte application generating and rendering the QR code

## Preconditions

- The user has an identity created in the wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- The user is authenticated and on the dashboard
- The DID is available in the Tauri Store

## Main Flow

1. The user navigates to the **Identity** page (`/dashboard/identity`)
2. The page loads the identity from the Tauri Store (DID and public key)
3. The page calls `generateQRCode()`:
   - Gets the current Unix timestamp (seconds)
   - Calculates `expiresAt = timestamp + QR_ROTATION_INTERVAL` (default: 30s, configurable via `VITE_QR_ROTATION_INTERVAL_SECONDS`)
   - Generates a rotation token: `btoa(did + ":" + timestamp).substring(0, 16)`
   - Builds the JSON payload:
     ```json
     {
       "did": "did:almena:<public_key_hex>",
       "timestamp": 1234567890,
       "expiresAt": 1234567920,
       "token": "base64_16_chars"
     }
     ```
   - Generates the QR image using the `qrcode` npm library via `QRCode.toDataURL()` with options:
     - Width: 200px
     - Margin: 2px
     - Colors: orange (`#f97316`) on dark (`#18181b`)
     - Error correction: Medium (`M`)
4. The QR code image is displayed on screen
5. A countdown timer starts at 30 and decrements every second (displayed as "30s", "29s", etc.)
6. Two `setInterval` loops run:
   - **Rotation interval** (every 30s): calls `generateQRCode()` to regenerate the QR with new timestamp, expiration, and token
   - **Countdown interval** (every 1s): decrements the visible countdown
7. On each rotation, the QR image transitions with a CSS fade animation
8. The QR remains displayed until the user navigates away from the Identity page
9. When leaving the page, both intervals are cleared (cleanup on component destroy)

## Alternative Flows

### AF-1: Identity not found
- At step 2, if no identity exists in the Tauri Store, the page shows an appropriate message or redirects to onboarding

### AF-2: QR generation fails
- At step 3, if `QRCode.toDataURL()` throws an error, the error is logged and the QR area shows an error state

## Postconditions

- The QR code is visible on screen with the user's DID encoded
- The QR rotates automatically every 30 seconds
- No persistent state changes occur — this is a read-only display
- When the user leaves the page, all timers are cleaned up

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** (frontend) | QR generation (`qrcode` npm library), countdown timer, rotation logic, UI rendering |

## Technical Notes

- **No Rust/Tauri commands involved**: QR generation is entirely frontend-side using the `qrcode` npm package (v1.5.4)
- **Token is NOT cryptographic**: The rotation token is a simple `btoa(did:timestamp)` truncated to 16 characters — it serves as a rotation identifier, not a signature
- **No signing of the QR payload**: The QR itself is not cryptographically signed. Authentication happens in a separate challenge-response flow when the QR is scanned (see [UC-007](/docs/developers/use-cases/wallet/uc-007-authenticate-via-qr-code))
- **Rotation interval**: Defaults to 30 seconds, configurable via the environment variable `VITE_QR_ROTATION_INTERVAL_SECONDS`
- **QR format**: JSON string, not binary or base64-wrapped
- **Visual style**: Orange on dark background matches Almena brand identity
- **Cleanup**: Component destroy lifecycle clears both `setInterval` timers to prevent memory leaks
