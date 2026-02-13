---
title: "UC-012: Issue Verifiable Credential"
sidebar_label: "UC-012: Issue Credential"
sidebar_position: 12
---

# UC-012: Issue Verifiable Credential

:::info Functional Specification
This use case defines intended behavior. Credential issuance is not yet implemented.
:::

## Description

From the Organization perspective of the dashboard, an organization member issues a verifiable credential (VC) to a user. For example, a university issues a degree credential to a graduate. The member selects the credential type, fills in the claims, sets the validity period (with an optional expiration date), signs the credential with the organization's DID key, and delivers it to the holder. The credential conforms to the W3C Verifiable Credentials Data Model. After issuance, the organization can revoke the credential if needed ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential)).

## Actors

- **Organization Member**: Person acting from the Organization perspective with permission to issue credentials
- **Holder (Target User)**: Person who receives the credential
- **Frontend (Portal)**: Next.js web application providing the issuance UI
- **Backend API**: FastAPI service managing credential creation, signing, and delivery
- **Blockchain**: Almena blockchain for optional credential anchoring or revocation registry

## Preconditions

- The organization member is authenticated and on the dashboard in **Organization perspective** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- The organization member has permission to issue credentials for their organization
- The organization has a DID anchored on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- The target holder has a DID registered in the platform

## Main Flow

1. The organization member navigates to the credential issuance section in the Organization perspective
2. The organization member selects a credential type/schema (e.g., "University Degree", "Professional Certification")
3. The portal displays the form with fields defined by the selected schema
4. The organization member enters the claims:
   - Holder's DID (searched by name or DID)
   - Credential-specific attributes (e.g., degree name, institution, graduation date, honors)
   - Validity period:
     - **Issuance date**: Defaults to the current date/time, can be adjusted
     - **Expiration date** (optional): If set, the credential automatically becomes invalid after this date. If omitted, the credential has no expiration and remains valid until explicitly revoked ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
5. The organization member submits the credential
6. The backend constructs the W3C Verifiable Credential:
   - Sets `@context`, `type`, `issuer` (issuer's DID), `credentialSubject` (holder's DID + claims)
   - Sets `issuanceDate` and optionally `expirationDate`
   - Generates a unique credential ID
7. The backend signs the credential using the organization's private key (Ed25519 key associated with the organization's DID)
8. The backend stores the credential and associates it with the holder's DID
9. The backend notifies the holder (via the platform) that a new credential is available
10. The portal confirms the issuance with credential ID and summary

## Alternative Flows

### AF-1: Holder DID not found
- At step 4, the searched holder does not exist in the platform
- The form shows an error and the member cannot proceed until a valid holder is selected

### AF-2: Organization member lacks permission
- At step 5, the backend validates the member's role within the organization
- If the member does not have issuance permission, the request is rejected with an authorization error

### AF-3: Schema validation fails
- At step 5, the entered claims do not conform to the selected credential schema
- The form shows validation errors for the non-conforming fields

### AF-4: Expiration date in the past
- At step 4, the member enters an expiration date that is before the issuance date or in the past
- The form shows a validation error on the expiration date field
- The member must correct the date before submitting

## Postconditions

- A new verifiable credential exists, signed by the organization, with status `VALID`
- If an expiration date was set, the credential will automatically transition to `EXPIRED` status after that date
- The credential is associated with the holder's DID and accessible from their Holder perspective ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- The issuance is recorded in the organization's history
- The organization can later revoke the credential if needed ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Credential issuance form, schema selection, holder search, confirmation UI |
| **backend** | Credential construction (W3C VC format), signing, storage, holder notification |
| **blockchain** | Organization DID resolution (for key retrieval), optional credential anchoring, revocation registry |

## Technical Notes

- **Credential format**: W3C Verifiable Credentials Data Model 2.0. JSON-LD with cryptographic proof
- **Signing**: The organization's Ed25519 key signs the credential. The key is associated with the organization's DID
- **Schema**: Credentials follow predefined schemas that define required and optional attributes. Schemas are managed by the platform
- **Validity period**: The `issuanceDate` marks when the credential becomes valid. The optional `expirationDate` marks when it ceases to be valid. A credential without an expiration date remains valid indefinitely (until revoked). Typical patterns: professional certifications expire after 1-5 years; academic degrees typically have no expiration
- **Credential status lifecycle**: `VALID` → `EXPIRED` (automatic, based on `expirationDate`) or `VALID` → `REVOKED` (manual, via [UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential)). Expiration and revocation are independent — a credential can be both expired and revoked
- **`credentialStatus` field**: Each credential includes a `credentialStatus` pointing to the blockchain revocation registry, following the W3C Bitstring Status List specification. This allows verifiers to check the revocation status on-chain
- **Delivery**: The credential is stored server-side and made available to the holder via the API. Future: delivery via DIDComm through the mediator module ([UC-021](/docs/developers/use-cases/mediator/uc-021-route-didcomm-message))
- **Current implementation**: The organization management page (`/dashboard/organizations`) allows creating organizations and managing members. Credential issuance UI does not exist yet
