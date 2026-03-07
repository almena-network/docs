---
title: "UC-008: Login with Desktop Wallet"
sidebar_label: "UC-008: Login (Desktop Wallet)"
sidebar_position: 8
---

# UC-008: Login with Desktop Wallet

## Description

The user logs into the web portal using the Almena Network wallet installed on the same computer. The portal requests an authentication challenge from the backend, then attempts to deliver it to the wallet via HTTP (`localhost:1421`) with fallback to a deep link (`almena://auth?challenge=...`). The wallet displays a consent screen where the user approves or rejects. On approval, the wallet signs the challenge with Ed25519 and POSTs the response to the backend's callback URL. The backend verifies the signature, creates or retrieves the user, generates a JWT, and the portal detects the completion via polling.

## Actors

- **End User**: Person logging into the web portal
- **Frontend (Portal)**: Next.js web application at `/login` initiating the login flow
- **Backend API**: FastAPI service managing challenges, signature verification, user management, and JWT issuance
- **Wallet (Desktop)**: Tauri application on the same machine receiving the challenge via HTTP or deep link
- **Blockchain** (optional): Consulted for DID Document resolution during signature verification

## Preconditions

- The user has an identity created in the wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- The wallet application is installed and running on the same computer
- The backend API is accessible from the portal
- The portal is loaded in the browser at the login page (`/[locale]/login`)

## Main Flow

1. The user navigates to the login page and clicks the **Almena Network** login button
2. The portal sets the UI state to "requesting" and calls `POST /api/v1/auth/challenge` with the portal's origin URL
3. The backend generates a challenge:
   - `challenge_id`: UUID v4
   - `nonce`: 32 bytes cryptographic random (`secrets.token_urlsafe(32)`)
   - `timestamp`: current UTC time
   - `expires_at`: current time + 5 minutes
   - `callback_url`: backend's verify endpoint (`/api/v1/auth/verify`)
   - `requested_proof`: `"authentication"`
   - Stores the challenge in memory with status `PENDING`
4. The backend returns the `ChallengeResponse` to the portal
5. The portal attempts to deliver the challenge to the wallet via HTTP:
   - `POST http://localhost:1421/auth-request` with the challenge data (base64url-encoded), callback URL, and origin
6. If the HTTP delivery succeeds, the wallet receives the challenge directly
7. If HTTP fails, the portal falls back to a deep link:
   - Constructs `almena://auth?challenge=<base64url>&callback=<callback_url>&origin=<origin>`
   - Creates a hidden anchor element, triggers click, and removes it
8. The OS routes the `almena://` deep link to the wallet via `tauri-plugin-deep-link`
9. The wallet parses the deep link, decodes the base64url challenge, and stores it in the `PENDING_AUTH_REQUEST` mutex
10. The wallet displays the **AuthConsent** screen showing the origin, requested proof, and a countdown timer
11. The portal transitions to "waiting" state and starts polling `GET /api/v1/auth/status/{challenge_id}` every 2 seconds (5-minute timeout)
12. The user clicks **Approve** in the wallet
13. The wallet invokes `approve_auth_request(did)`:
    - Retrieves the Ed25519 private key from the system keychain
    - Builds the payload: `{challenge_id, nonce, timestamp, expires_at, origin}`
    - Signs with Ed25519
    - Constructs the `AuthResponse`: `{challenge_id, did, signature, signed_payload, verification_method, timestamp}`
14. The wallet POSTs the `AuthResponse` to the `callback_url` (`POST /api/v1/auth/verify`)
15. The backend verifies the response:
    - Validates the challenge exists, is `PENDING`, and is not expired
    - Extracts the public key from the DID (for `did:almena:*`, the DID itself contains the public key hex)
    - If needed, resolves the DID Document from the blockchain (`GET /almenachain/did/v1/resolve/{did}`)
    - Verifies the Ed25519 signature using PyNaCl
    - Validates the signed payload matches the original challenge (challenge_id and nonce)
16. The backend consumes the challenge (status → `COMPLETED`, stores `responded_did`)
17. The backend finds or creates the user in the database by DID
18. The backend generates a JWT access token (HS256, 60-minute expiration) with payload `{sub: user_id, did, iat, exp, type: "access"}`
19. The backend stores the auth result (token, user_id, did, is_new_user) keyed by challenge_id
20. The portal's next polling request detects `status: "completed"` with `access_token`
21. The portal stores in localStorage: `almena_token`, `almena_user_id`, `almena_did`
22. The portal updates auth state to `isAuthenticated = true`
23. The portal redirects to `/dashboard` after an 800ms success animation

## Alternative Flows

### AF-1: Wallet not found
- At step 5, HTTP to `localhost:1421` fails
- At step 7, deep link click does not open the wallet (no handler registered)
- The portal shows: "Wallet not found. Please make sure the Almena Network wallet is installed and running."

### AF-2: User rejects the challenge
- At step 12, the user clicks **Reject** in the wallet
- The wallet calls `POST /api/v1/auth/reject/{challenge_id}`
- The backend marks the challenge as `REJECTED`
- The portal's polling detects `status: "rejected"`
- The portal shows: "The authentication request was declined in the wallet."

### AF-3: Challenge expires
- The user does not respond within 5 minutes
- The backend auto-marks the challenge as `EXPIRED` on next access
- The portal's polling detects `status: "expired"` or the 5-minute polling timeout fires
- The portal shows: "The authentication request has expired. Please try again."

### AF-4: Signature verification fails
- At step 15, the signature does not match the public key or the payload does not match the challenge
- The backend returns an error to the wallet
- The challenge remains `PENDING` and the portal continues polling until expiration

### AF-5: Wallet session is locked
- At step 9, the wallet is running but locked
- The user must first unlock (password or biometrics, see [UC-005](/docs/developers/use-cases/wallet/uc-005-unlock-wallet-with-biometrics))
- After unlocking, the pending auth request is displayed

### AF-6: New user (first login)
- At step 17, no user exists for this DID
- The backend creates a new user record (`is_new_user: true`)
- The portal may show an onboarding flow after redirect

## Postconditions

- The user is authenticated in the portal with a valid JWT
- `almena_token`, `almena_user_id`, and `almena_did` are stored in localStorage
- A user record exists in the backend database for this DID
- The challenge is consumed and cannot be reused
- The wallet's `PENDING_AUTH_REQUEST` is cleared

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Login page UI, challenge request, wallet delivery (HTTP + deep link fallback), polling, session storage, redirect |
| **backend** | Challenge creation and storage (in-memory), signature verification (Ed25519/PyNaCl), user management (find or create), JWT issuance (HS256), polling endpoint |
| **wallet** | Deep link / HTTP reception, AuthConsent UI, Ed25519 signing, POST response to callback |
| **blockchain** | DID Document resolution (optional, for signature verification) |

## Technical Notes

- **Wallet delivery strategy**: HTTP to `localhost:1421` first (works when wallet exposes a local HTTP server), then deep link fallback via `almena://auth` protocol. This dual approach maximizes compatibility
- **Challenge storage**: In-memory dictionary in the backend. Not persisted to database. Lost on server restart. For horizontal scaling, would need Redis or similar
- **Challenge TTL**: 5 minutes. Auto-cleanup removes expired challenges
- **JWT**: HS256 with 60-minute expiration. Secret from `settings.secret_key`
- **DID resolution**: For `did:almena:*` the public key is extracted directly from the DID string (it IS the hex-encoded public key). Blockchain resolution is a fallback for anchored DIDs
- **Polling**: Frontend polls every 2 seconds. No WebSocket implementation
- **Auto user creation**: First successful auth with a new DID automatically creates a user record in the database
