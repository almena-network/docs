---
title: "UC-016: Revoke Verifiable Credential"
sidebar_label: "UC-016: Revoke Credential"
sidebar_position: 16
---

# UC-016: Revoke Verifiable Credential

:::note Reference Flow
Corresponds to **Flow 4 — Credential Revocation**.
:::

:::info Functional Specification
This use case defines intended behavior. Credential revocation is not yet implemented.
:::

## Description

An Issuer revokes a previously issued verifiable credential, invalidating its use in future presentations. The Issuer sends a transaction to the blockchain changing the credential status from active to revoked, signed with their private key. The blockchain validates that the transaction comes from the original Issuer. The Holder is notified of the revocation.

## Actors

- **Issuer**: Organization that originally issued the credential
- **Holder**: User whose credential is being revoked
- **Blockchain**: Distributed network where the revocation is recorded in the credential status registry

## Preconditions

- The Issuer has a record of the credential identifier/hash
- The credential is currently in active status on the blockchain
- The credential was originally issued by this Issuer ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))

## Main Flow

1. The Issuer decides to revoke the credential (due to change of circumstances, detected fraud, Holder request, etc.)
2. The Issuer sends a transaction to the blockchain changing the credential status from **active** to **revoked**, signed with their private key
3. The blockchain validates that the transaction comes from the original Issuer (verifying the signature against the DID Document) and updates the status registry
4. The Holder is notified that one of their credentials has been revoked
5. The blockchain records the hash of the revocation operation with date and coded reason ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Alternative Flows

### AF-1: Credential already revoked
- At step 2, the credential has already been revoked
- The operation is rejected — the Issuer is informed of the existing revocation

### AF-2: Issuer not the original issuer
- At step 3, the blockchain detects the transaction does not come from the original Issuer
- The revocation is rejected — only the original Issuer can revoke their credentials

### AF-3: Blockchain transaction fails
- At step 3, the transaction fails (network error, insufficient gas)
- The revocation is not recorded — the Issuer can retry

## Postconditions

- The credential appears as revoked in any status query
- Any verifiable presentation that includes claims from this credential will be rejected by the Verifier in the status verification step ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- The encrypted credential may remain in storage as a historical record, but is unusable
- The revocation is irreversible — a new credential must be issued if the revocation was made in error

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Revocation UI (credential search, confirmation, reason input) |
| **backend** | Revocation validation, blockchain transaction submission, Holder notification |
| **blockchain** | Revocation registry storage, status queries, signature validation against DID Document |

## Technical Notes

- **Revocation registry**: The blockchain maintains an append-only revocation registry — revocations cannot be undone
- **On-chain verification**: The revocation is recorded on-chain so any Verifier can check the status without trusting the Issuer's backend
- **`credentialStatus`**: Follows the W3C Bitstring Status List specification
- **Traceability**: The hash of the revocation operation is recorded on-chain with date and coded reason
- **Standards**: W3C Bitstring Status List, W3C VC Data Model 2.0
