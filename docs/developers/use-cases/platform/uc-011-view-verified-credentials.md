---
title: "UC-011: View Verified Credentials"
sidebar_label: "UC-011: View Credentials"
sidebar_position: 11
---

# UC-011: View Verified Credentials

:::info Functional Specification
This use case defines intended behavior. The credentials view is not yet implemented in the frontend.
:::

## Description

From the Holder perspective of the dashboard, the user views the verifiable credentials (VCs) they have received from issuers. Each credential contains claims about the user (e.g., a university degree, a professional certification) that have been cryptographically signed by the issuing entity. The user can browse, filter, and inspect the details of each credential.

## Actors

- **End User (Holder)**: Person viewing their received credentials
- **Frontend (Portal)**: Next.js web application rendering the credentials list and detail views
- **Backend API**: FastAPI service retrieving the user's credentials from storage

## Preconditions

- The user is authenticated and on the dashboard in **Holder perspective** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- The user has received at least one verifiable credential from an issuer ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))

## Main Flow

1. The user is on the dashboard in Holder perspective
2. The user navigates to the **Credentials** section
3. The portal requests the user's credentials from the backend: `GET /api/v1/credentials`
4. The backend retrieves the credentials associated with the user's DID
5. The portal displays a list of credentials, each showing:
   - Credential type (e.g., "University Degree", "Professional Certification")
   - Issuer name and DID
   - Issuance date
   - Expiration date (if applicable)
   - Status (valid, expired, revoked)
6. The user clicks on a credential to view its details
7. The portal displays the full credential including:
   - All claims/attributes (e.g., degree name, institution, graduation date)
   - Issuer information
   - Cryptographic proof metadata (signature type, verification method)
   - Credential schema reference
   - Validity period

## Alternative Flows

### AF-1: No credentials
- At step 4, the user has no credentials
- The portal shows an empty state with a message explaining how credentials are obtained (issued by organizations)

### AF-2: Credential is expired
- At step 5, one or more credentials have passed their expiration date
- The credential appears in the list with an "Expired" status badge
- The user can still view details but the credential is marked as no longer valid

### AF-3: Credential is revoked
- At step 5, an issuer has revoked a credential
- The credential appears with a "Revoked" status badge
- The user can still view details but the credential cannot be used in presentations

## Postconditions

- The user has viewed their credentials
- No state changes — this is a read-only view

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Credentials list UI, detail view, filtering, status badges |
| **backend** | Credential storage and retrieval, status checking (validity, revocation) |
| **blockchain** | Revocation status queries (if revocation registry is on-chain) |

## Technical Notes

- **Credential format**: W3C Verifiable Credentials Data Model. JSON-LD structure with cryptographic proof
- **Storage**: Credentials are stored in the backend associated with the holder's DID. The wallet may also store a local copy
- **Revocation checking**: The backend may query the blockchain revocation registry or the issuer's revocation list to determine if a credential has been revoked
- **Current implementation**: The credentials page exists at `/dashboard/credentials` but shows a "coming soon" placeholder. No API endpoints for credentials are wired in the frontend yet
