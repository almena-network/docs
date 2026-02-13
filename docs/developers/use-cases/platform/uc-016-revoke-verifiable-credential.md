---
title: "UC-016: Revoke Verifiable Credential"
sidebar_label: "UC-016: Revoke Credential"
sidebar_position: 16
---

# UC-016: Revoke Verifiable Credential

:::info Functional Specification
This use case defines intended behavior. Credential revocation is not yet implemented.
:::

## Description

From the Organization perspective, an organization member revokes a previously issued verifiable credential. Revocation is an irreversible action that marks a credential as no longer valid, regardless of its expiration date. The revocation is recorded on the blockchain's revocation registry, making it publicly verifiable. For example, a university revokes a degree credential because it was issued in error, or a professional body revokes a certification because the holder no longer meets the requirements.

## Actors

- **Organization Member**: Person acting from the Organization perspective with permission to revoke credentials for their organization
- **Frontend (Portal)**: Next.js web application providing the revocation UI
- **Backend API**: FastAPI service orchestrating the revocation process
- **Blockchain**: Almena blockchain where the revocation is recorded in the credential module's revocation registry

## Preconditions

- The organization member is authenticated and on the dashboard in **Organization perspective** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- The organization member has permission to revoke credentials for their organization
- The credential was originally issued by this organization ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- The credential is currently in `VALID` or `EXPIRED` status (not already revoked)

## Main Flow

1. The organization member navigates to the issued credentials history in the Organization perspective
2. The organization member locates the credential to revoke (by credential ID, holder name/DID, or credential type)
3. The organization member clicks **Revoke** on the credential
4. The portal displays a confirmation dialog with:
   - Credential summary (type, holder, issuance date)
   - Warning that revocation is irreversible
   - Required field: revocation reason
5. The organization member enters the revocation reason and confirms
6. The backend validates the revocation request:
   - Verifies the organization member has revocation permission
   - Verifies the credential belongs to this organization
   - Verifies the credential has not already been revoked
7. The backend submits a revocation transaction to the blockchain:
   - Sends `MsgRevokeCredential` with credential ID, issuer DID, and revocation reason
   - The blockchain's credential module records the revocation in the revocation registry
   - The transaction is signed with the organization's secp256k1 key
8. The blockchain confirms the revocation transaction
9. The backend updates the credential status to `REVOKED` in the local database with:
   - Revocation timestamp
   - Revocation reason
   - Transaction hash from the blockchain
10. The portal confirms the revocation to the organization member
11. The holder is notified that one of their credentials has been revoked

## Alternative Flows

### AF-1: Credential already revoked
- At step 6, the credential has already been revoked
- The portal shows an error indicating the credential is already revoked with the original revocation date and reason

### AF-2: Organization member lacks revocation permission
- At step 6, the member does not have the required role to revoke credentials
- The backend rejects the request with an authorization error
- The portal shows an access denied message

### AF-3: Blockchain transaction fails
- At step 8, the blockchain transaction fails (insufficient gas, network error, etc.)
- The backend does NOT update the local status
- The portal shows an error and the organization member can retry

### AF-4: Credential belongs to different organization
- At step 6, the credential was issued by a different organization
- The backend rejects the request — only the original issuing organization can revoke their own credentials
- The portal shows an error

## Postconditions

- The credential status is `REVOKED` in both the backend database and the blockchain revocation registry
- The revocation is publicly verifiable via blockchain queries
- The holder sees the credential marked as "Revoked" in their Holder perspective ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- Any future verification of this credential will flag it as revoked ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- The revocation is irreversible — a new credential must be issued if the revocation was made in error

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Revocation UI (credential search, confirmation dialog, reason input), status update in issued credentials list |
| **backend** | Revocation validation, blockchain transaction submission, local status update, holder notification |
| **blockchain** | Revocation registry storage (`MsgRevokeCredential`), revocation status queries |

## Technical Notes

- **Revocation registry**: The blockchain's credential module maintains a revocation registry. Each revocation entry stores: credential ID, issuer DID, revocation timestamp, and reason. The registry is append-only — revocations cannot be undone
- **On-chain vs off-chain**: The revocation is recorded on-chain so that any verifier can check the revocation status without trusting the organization's backend. The backend also stores a local copy for fast queries
- **W3C `credentialStatus`**: Revoked credentials include a `credentialStatus` field pointing to the blockchain revocation registry, following the W3C Bitstring Status List specification
- **Revocation reasons**: Common reasons include: "Issued in error", "Holder no longer meets requirements", "Credential information changed", "Organization dissolved", "Holder requested revocation"
- **Notification**: The holder is notified via the platform (dashboard notification). Future: DIDComm v2 message via the mediator ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message), [UC-021](/docs/developers/use-cases/mediator/uc-021-route-didcomm-message))
- **Impact on presentations**: When a credential in an existing VP is revoked, the VP does not become invalid by itself — but the next verification will detect the revocation and flag the credential accordingly
