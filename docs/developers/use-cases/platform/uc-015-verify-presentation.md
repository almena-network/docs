---
title: "UC-015: Verify Presentation"
sidebar_label: "UC-015: Verify Presentation"
sidebar_position: 15
---

# UC-015: Verify Presentation

:::note Reference Flow
Corresponds to **Flow 3 — Verifiable Request and Presentation**, steps 7-12.
:::

:::info Functional Specification
This use case defines intended behavior. Presentation verification is not yet implemented.
:::

## Description

The Requester delegates the verification of a received verifiable presentation (VP) to the Verifier. The Verifier performs the complete cryptographic validation: verifies the Holder's signature on the VP, verifies each Issuer's signature on the enclosed credentials, checks the credential status (active/revoked/expired) on the blockchain, and verifies the legitimacy of each Issuer through the trust framework. The Verifier returns the verification result to the Requester.

## Actors

- **Requester**: Entity that received the VP and delegates verification
- **Verifier**: Component or service that performs the cryptographic verification — checks signatures, data integrity, revocation status, and Issuer legitimacy via the trust framework
- **Blockchain**: Provides DID resolution, credential status (revocation registry), and trust framework (authorized Issuers registry)

## Preconditions

- A Holder has responded to an information request with a VP ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- The Verifier service is accessible
- The blockchain is operational

## Main Flow

1. The Requester receives the VP and delegates verification to the Verifier
2. The Verifier verifies the Holder's signature:
   - Resolves the Holder's DID on the blockchain to obtain the public key
   - Verifies the Holder's signature on the VP
   - Validates the challenge nonce matches the original request
   - Checks the VP has not expired
3. For each enclosed credential, the Verifier:
   - Resolves the Issuer's DID on the blockchain to obtain the public key
   - Verifies the Issuer's signature on the credential
   - Validates the credential has not expired
   - Checks the revocation registry on the blockchain to confirm the credential has not been revoked
4. The Verifier verifies the legitimacy of each Issuer:
   - Queries the trust framework on the blockchain to confirm each Issuer is authorized to issue the type of credential presented ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
5. The Verifier returns the verification result to the Requester:
   - Overall status: `VALID`, `INVALID`, or `PARTIAL`
   - Per-credential breakdown with individual check statuses
   - Detail of each verification performed
6. The blockchain records the hash of the verification operation as auditable evidence ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Alternative Flows

### AF-1: Holder signature invalid
- At step 2, the Holder's signature does not match
- The Verifier returns `INVALID` — the presented data cannot be trusted

### AF-2: Credential revoked
- At step 3, one of the enclosed credentials has been revoked
- The Verifier returns `PARTIAL` or `INVALID` depending on whether all credentials are required

### AF-3: Issuer DID not found
- At step 3, the Issuer's DID cannot be resolved from the blockchain
- The Verifier returns `INVALID` — the credential cannot be validated

### AF-4: Challenge nonce mismatch
- At step 2, the nonce in the VP does not match the request's challenge
- The Verifier returns `INVALID` — possible replay attack

### AF-5: Credential expired
- At step 3, a credential has passed its expiration date
- The Verifier flags the credential as expired in the result

### AF-6: Issuer not authorized in trust framework
- At step 4, the Issuer is not found in the trust framework or their authorization has been revoked
- The Verifier returns `INVALID` — the Issuer is not legitimate for this credential type

### AF-7: Verifier unreachable
- At step 1, the Verifier service is not accessible
- The Requester can retry later

## Postconditions

- The Requester has a clear assessment of whether the presented information is trustworthy
- The verification result includes per-credential breakdown of all checks performed
- The verification operation is recorded on the blockchain as auditable evidence
- All data verified without exposing personal information on-chain

## Modules Involved

| Module | Role |
|--------|------|
| **backend** | Verification orchestration, result storage |
| **blockchain** | DID Document resolution (Holder and Issuer DIDs), revocation registry queries, trust framework queries |

## Technical Notes

- **Verifier as separate component**: The Verifier is a dedicated service/component that performs cryptographic verification — separating it from the Requester ensures independent validation
- **Trust framework verification**: This is a new check not present in the previous version — the Verifier queries the blockchain's trust framework to confirm each Issuer is authorized ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework), [UC-026](/docs/developers/use-cases/platform/uc-026-delegate-issuer-authorization))
- **Verification is non-destructive**: The VP and credentials remain unchanged — the process only reads and validates
- **Standards**: W3C VC Data Model 2.0, W3C Bitstring Status List, DIF Presentation Exchange
