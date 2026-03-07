---
title: "UC-009: Login with Mobile Wallet"
sidebar_label: "UC-009: Login (Mobile Wallet)"
sidebar_position: 9
---

# UC-009: Login with Mobile Wallet

## Description

The user logs into the web portal using the Almena Network wallet installed on a mobile device. The portal requests an authentication challenge from the backend, generates a QR code encoding a deep link (`almena://auth?challenge=...`), and displays it on screen. The user scans the QR with the mobile wallet, approves the challenge, and the wallet signs and sends the response to the backend. The QR auto-rotates every 30 seconds, generating a fresh challenge each time. The portal detects completion via polling.

## Actors

- **End User**: Person logging into the web portal using their mobile device
- **Frontend (Portal)**: Next.js web application displaying the QR code and polling for result
- **Backend API**: FastAPI service managing challenges, signature verification, user management, and JWT issuance
- **Wallet (Mobile)**: Tauri mobile application scanning the QR code and signing the challenge
- **Blockchain** (optional): Consulted for DID Document resolution during signature verification

## Preconditions

- The user has an identity created in the mobile wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- The mobile wallet is installed and the camera is accessible
- The backend API is accessible from the portal
- The portal is loaded in the browser at the login page (`/[locale]/login`)

## Main Flow

1. The user navigates to the login page and clicks the **Almena Network** login button
2. The portal calls `POST /api/v1/auth/challenge` with the portal's origin URL
3. The backend generates a challenge (same as [UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet)): `challenge_id`, `nonce`, `expires_at` (5 minutes), `callback_url`, `requested_proof`
4. The backend returns the `ChallengeResponse` to the portal
5. The portal attempts desktop wallet delivery (HTTP + deep link). If both fail (expected when there is no desktop wallet), the portal proceeds to display the QR code
6. The portal constructs the deep link URL: `almena://auth?challenge=<base64url>&callback=<callback_url>&origin=<origin>`
7. The portal renders a QR code from the deep link URL using the `qrcode.react` library (QRCodeSVG component)
8. The portal starts polling `GET /api/v1/auth/status/{challenge_id}` every 2 seconds
9. The portal starts a QR rotation timer: every 30 seconds, it requests a new challenge from the backend, generates a new QR code, and starts polling the new challenge (stops polling the old one)
10. The user opens the mobile wallet and scans the QR code with the device camera
11. The mobile wallet decodes the QR, extracts the `almena://auth` deep link, and parses the challenge
12. The wallet displays the **AuthConsent** screen showing the origin, requested proof, and countdown timer
13. The user taps **Approve**
14. The wallet signs the challenge with Ed25519 and POSTs the `AuthResponse` to the `callback_url`
15. The backend verifies the signature, consumes the challenge, finds or creates the user, and generates a JWT (same verification flow as [UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet), steps 15-19)
16. The portal's next polling request detects `status: "completed"` with `access_token`
17. The portal stores `almena_token`, `almena_user_id`, `almena_did` in localStorage
18. The portal redirects to `/dashboard`

## Alternative Flows

### AF-1: User rejects the challenge
- At step 13, the user taps **Reject**
- The wallet calls `POST /api/v1/auth/reject/{challenge_id}`
- The portal's polling detects `status: "rejected"`
- The portal shows: "The authentication request was declined in the wallet."

### AF-2: QR rotates before scanning
- At step 9, the 30-second rotation timer fires before the user scans
- The portal requests a new challenge from the backend
- A new QR code is rendered replacing the old one
- Polling switches to the new challenge_id
- The old challenge remains `PENDING` until it expires (5 minutes) and is cleaned up

### AF-3: Challenge expires
- The user does not scan or respond within 5 minutes
- The portal's polling timeout fires
- The portal shows: "The authentication request has expired. Please try again."

### AF-4: Camera permission denied
- At step 10, the mobile device denies camera access
- The user cannot scan the QR and must grant camera permission or use an alternative method

### AF-5: Desktop wallet also available
- At step 5, the desktop wallet delivery succeeds
- Both the desktop wallet consent and the QR code are available simultaneously
- The first approval (from either device) completes the challenge
- The portal polling detects completion regardless of which wallet responded

### AF-6: User scans expired QR
- The user scans a QR code that was already rotated
- The old challenge may still be `PENDING` (within 5 minutes)
- The wallet submits the response for the old challenge_id
- The backend verifies it normally if still valid
- However, the portal may have already switched to polling a newer challenge_id and won't detect it
- The user should scan the currently displayed QR

## Postconditions

- The user is authenticated in the portal with a valid JWT
- `almena_token`, `almena_user_id`, and `almena_did` are stored in localStorage
- A user record exists in the backend database for this DID
- The challenge is consumed and cannot be reused

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Login page UI, challenge request, QR code generation (`qrcode.react`), 30-second QR rotation, polling, session storage, redirect |
| **backend** | Challenge creation and storage (in-memory), signature verification (Ed25519/PyNaCl), user management, JWT issuance, polling endpoint |
| **wallet** (mobile) | QR scanning, deep link parsing, AuthConsent UI, Ed25519 signing, POST response to callback |
| **blockchain** | DID Document resolution (optional) |

## Technical Notes

- **QR rotation**: Every 30 seconds a completely new challenge is created. This means a new `POST /api/v1/auth/challenge` call, new QR image, and polling switches to the new challenge_id. Old challenges expire naturally
- **QR content**: The QR encodes the full `almena://auth?challenge=...` deep link URL, not just the challenge data. This allows the mobile OS to route it directly to the wallet app
- **QR library**: `qrcode.react` (QRCodeSVG component) renders the QR as SVG in the browser
- **Dual path**: Both desktop delivery (HTTP + deep link) and QR display happen simultaneously. The QR appears in the "waiting" state while the portal also tries the desktop wallet. Whichever wallet responds first wins
- **Polling vs rotation**: Polling interval is 2 seconds for status checks. QR rotation interval is 30 seconds for fresh challenges. These are independent timers
- **No WebSocket**: Status is checked via polling only. No push mechanism from backend to frontend
