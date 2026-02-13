---
title: "UC-013: Generate Verifiable Presentation"
sidebar_label: "UC-013: Generate Presentation"
sidebar_position: 13
---

# UC-013: Generate Verifiable Presentation

:::info Functional Specification
This use case defines intended behavior. Verifiable presentations are not yet implemented.
:::

## Description

From the Holder perspective, the user generates a verifiable presentation (VP) to respond to an information request from a requestor. A VP is a wrapper that bundles one or more verifiable credentials (or selected claims from them) into a signed package that proves the holder controls the credentials and consents to share them. For example, a bank requests proof of the user's university degree — the user selects the relevant credential, the portal generates a VP signed with the user's DID key, and delivers it to the requesting requestor.

## Actors

- **End User (Holder)**: Person generating the presentation from their credentials
- **Frontend (Portal)**: Next.js web application providing the presentation generation UI
- **Backend API**: FastAPI service constructing and signing the VP
- **Wallet**: Signs the presentation with the holder's Ed25519 private key (via challenge-response)
- **Requestor (Petitioner)**: Organization that will receive and verify the presentation

## Preconditions

- The user is authenticated and on the dashboard in **Holder perspective** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- The user has at least one valid verifiable credential ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- A requestor has requested information from the user ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user)), or the user initiates a presentation proactively

## Main Flow

1. The user is on the Holder perspective and sees a pending information request from a requestor, or navigates to generate a presentation manually
2. The portal displays the request details:
   - Requesting requestor's name and DID
   - Requested information (e.g., "proof of university degree", "professional certification")
   - Request expiration time
3. The portal shows the user's credentials that match the requested information
4. The user selects which credentials (or specific claims within credentials) to include in the presentation
5. The user reviews the data that will be shared and confirms
6. The portal sends the selected credentials and request context to the backend
7. The backend constructs the W3C Verifiable Presentation:
   - Sets `@context`, `type: "VerifiablePresentation"`
   - Sets `holder` to the user's DID
   - Includes the selected verifiable credentials in `verifiableCredential`
   - Includes the `challenge` (nonce from the requestor's request) to bind the VP to the specific request
8. The backend requests the user to sign the VP via the wallet (challenge-response flow):
   - Sends a signing request to the wallet via deep link or HTTP
   - The wallet signs the VP payload with the Ed25519 private key
   - Returns the signature
9. The backend attaches the proof (signature, verification method, created timestamp) to the VP
10. The backend delivers the signed VP to the requestor (via the platform or callback URL)
11. The portal confirms delivery and shows the presentation summary to the user

## Alternative Flows

### AF-1: No matching credentials
- At step 3, the user has no credentials that satisfy the requestor's request
- The portal shows a message indicating which credentials are missing
- The user cannot generate the presentation

### AF-2: User declines the request
- At step 5, the user decides not to share the information
- The user clicks "Decline" and the request is marked as rejected
- The requestor is notified of the rejection

### AF-3: Selective disclosure
- At step 4, the user chooses to share only specific claims from a credential rather than the full credential
- The VP includes only the selected claims (if the credential format supports selective disclosure)

### AF-4: Wallet signing fails
- At step 8, the wallet is unreachable or the user cancels the signing
- The presentation is not generated and the user can retry

### AF-5: Request expired
- At step 1, the requestor's request has passed its expiration time
- The portal shows the request as expired and the user cannot generate a presentation for it

## Postconditions

- A signed verifiable presentation exists containing the selected credentials
- The VP has been delivered to the requesting requestor
- The presentation is recorded in the user's history
- The requestor can now verify the presentation ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Request display, credential selection UI, review and confirm, delivery confirmation |
| **backend** | VP construction (W3C VP format), signing orchestration, delivery to requestor |
| **wallet** | Ed25519 signing of the VP payload (via challenge-response) |
| **blockchain** | Holder DID resolution (for public key retrieval during verification) |

## Technical Notes

- **VP format**: W3C Verifiable Presentations Data Model. JSON-LD wrapping one or more VCs with a holder proof
- **Challenge binding**: The VP includes the requestor's `challenge` (nonce) to prevent replay. The VP is valid only for the specific request it responds to
- **Signing**: The holder's Ed25519 key signs the VP. This proves the holder consents to share the bundled credentials
- **Selective disclosure**: Depends on credential format. Standard JSON-LD VCs include all claims. Future: BBS+ signatures could enable selective attribute disclosure
- **Delivery**: Initially via the platform API. Future: DIDComm v2 through the mediator module for peer-to-peer delivery
