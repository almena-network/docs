---
title: "UC-015: Verify Presentation"
sidebar_label: "UC-015: Verify Presentation"
sidebar_position: 15
---

# UC-015: Verify Presentation

:::info Functional Specification
This use case defines intended behavior. Presentation verification is not yet implemented.
:::

## Description

From the Organization perspective, an organization member verifies a verifiable presentation (VP) received from a user. The verification process validates the holder's signature on the VP, each issuer's signature on the enclosed verifiable credentials, the credential revocation status, and the integrity of the data. Verification is performed against a verifier node that resolves DIDs from the blockchain and checks cryptographic proofs. For example, a bank verifies that a customer's degree credential was genuinely issued by a university and has not been revoked.

## Actors

- **Organization Member**: Person acting from the Organization perspective, initiating the verification
- **Frontend (Portal)**: Next.js web application displaying verification results
- **Backend API**: FastAPI service orchestrating the verification process
- **Verifier Node**: Service that performs the cryptographic verification (signature validation, revocation checks)
- **Blockchain**: Almena blockchain providing DID Document resolution and revocation registry

## Preconditions

- The organization member is authenticated and on the dashboard in **Organization perspective** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- A user has responded to an information request with a verifiable presentation ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- The information request is in `FULFILLED` status ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- The verifier node is accessible

## Main Flow

1. The organization member sees a fulfilled request in the Organization perspective with a linked verifiable presentation
2. The organization member clicks **Verify** on the presentation
3. The portal sends the VP to the backend for verification
4. The backend submits the VP to the verifier node
5. The verifier node performs the following checks:

### VP-level Verification (Holder)
   - Resolves the holder's DID from the blockchain (or extracts the public key from the DID string for `did:almena:*`)
   - Verifies the holder's Ed25519 signature on the VP
   - Validates the challenge nonce matches the original request
   - Checks the VP has not expired

### VC-level Verification (for each enclosed credential)
   - Resolves the issuer's DID from the blockchain
   - Retrieves the issuer's public key from the DID Document
   - Verifies the issuer's signature on the credential
   - Validates the credential has not expired
   - Checks the revocation registry: queries the blockchain to confirm the credential has not been revoked
   - Validates the credential schema conformance

6. The verifier node returns the verification result:
   - Overall status: `VALID`, `INVALID`, or `PARTIAL`
   - Per-credential results with individual check statuses
   - Failure reasons (if any)
7. The backend stores the verification result linked to the original request
8. The portal displays the verification result to the organization member:
   - Overall status with visual indicator (green/red/yellow)
   - Per-credential breakdown showing each check (signature, expiration, revocation)
   - The verified claims/attributes from the credentials
   - Timestamp of verification

## Alternative Flows

### AF-1: VP signature invalid
- At step 5, the holder's signature does not match
- The verifier node returns `INVALID` with reason "Holder signature verification failed"
- The portal shows the failure and the organization cannot trust the presented data

### AF-2: Credential revoked
- At step 5, one of the enclosed credentials has been revoked by its issuer
- The verifier node returns `PARTIAL` or `INVALID` depending on whether all credentials are required
- The portal highlights which credential was revoked

### AF-3: Issuer DID not found
- At step 5, the issuer's DID cannot be resolved from the blockchain
- The verifier node returns `INVALID` with reason "Issuer DID not resolvable"
- This may indicate the issuer's DID was never anchored or the blockchain is unreachable

### AF-4: Challenge nonce mismatch
- At step 5, the nonce in the VP does not match the request's challenge
- The verifier node returns `INVALID` with reason "Challenge mismatch — possible replay"
- This indicates the VP may have been reused from a different request

### AF-5: Credential expired
- At step 5, a credential has passed its expiration date
- The verifier node flags the credential as expired
- The organization member is informed and can decide whether to accept the expired credential contextually

### AF-6: Verifier node unreachable
- At step 4, the verifier node is not accessible
- The portal shows an error and the organization member can retry later

## Postconditions

- The verification result is stored and associated with the original information request
- The organization member has a clear assessment of whether the presented information is trustworthy
- The verification result is recorded in the organization's history

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Verification trigger, result display with per-credential breakdown, status indicators |
| **backend** | Verification orchestration, result storage, verifier node communication |
| **blockchain** | DID Document resolution (holder and issuer DIDs), revocation registry queries |

## Technical Notes

- **Verifier node**: A dedicated service (or backend module) that performs the actual cryptographic verification. Separating verification logic allows it to be reused across different contexts (API, CLI, etc.)
- **DID resolution**: For `did:almena:*`, the public key is embedded in the DID string. For anchored DIDs, the blockchain DID module is queried to retrieve the full DID Document with verification methods
- **Revocation registry**: The blockchain's credential module maintains a revocation registry. Checking revocation is a query to the blockchain, not a modification
- **Challenge binding**: The VP's challenge nonce must match the original request's nonce. This prevents a holder from resubmitting a previously generated VP for a different request
- **Verification is non-destructive**: The VP and credentials remain unchanged after verification. The process only reads and validates
- **Audit trail**: Each verification result is stored with timestamp, enabling the organization to demonstrate when and how they verified the information
