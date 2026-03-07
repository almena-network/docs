---
title: "UC-012: Issue Verifiable Credential"
sidebar_label: "UC-012: Issue Credential"
sidebar_position: 12
---

# UC-012: Issue Verifiable Credential

:::note Reference Flow
Corresponds to **Flow 2 — Verifiable Credential Issuance**.
:::

:::info Functional Specification
This use case defines intended behavior. Credential issuance is not yet implemented.
:::

## Description

An authorized Issuer (organization) issues a verifiable credential (VC) to a Holder. The Issuer constructs the credential with the corresponding claims, signs it with their private key, encrypts it with the Holder's public key (obtained by resolving the Holder's DID on the blockchain), and persists it in decentralized storage. The credential status (active, with expiration date) is registered on the blockchain. Only the Holder can decrypt the credential with their private key. The Issuer retains only an identifier/hash for revocation management.

## Actors

- **Issuer**: Authorized organization that issues the credential — must be registered in the trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- **Holder**: User who receives the credential
- **Blockchain**: Distributed network for DID resolution and credential status registration
- **Storage Node**: Decentralized storage where the encrypted credential is persisted

## Preconditions

- The Issuer and the Holder have DIDs registered on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- The Issuer is authorized in the trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- The Holder has requested or accepted to receive the credential

## Main Flow

1. The Issuer constructs the Verifiable Credential (VC) with:
   - The corresponding claims (Holder's data)
   - Issuance date
   - Expiration date (TTL) — optional: if omitted, the credential has no expiration
   - Reference to the Holder's DID as `credentialSubject`
   - Reference to the Issuer's DID as `issuer`
2. The Issuer signs the VC with their private key — this signature allows verifying the authenticity and integrity of the credential
3. The Issuer resolves the Holder's DID on the blockchain to obtain their public key
4. The Issuer encrypts the signed VC with the Holder's public key — only the Holder can decrypt it with their private key
5. The encrypted credential is persisted in the decentralized storage node — a reference identifier/hash is generated
6. The Issuer registers the credential status on the blockchain:
   - Credential identifier
   - Issuer's DID
   - Initial status: **active**
   - Expiration date (if set)
7. The Holder receives a notification that a new credential is available — the wallet stores the reference to the storage and the metadata
8. The blockchain records the hash of the issuance operation as auditable evidence ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Alternative Flows

### AF-1: Holder DID not found
- At step 3, the Holder's DID cannot be resolved on the blockchain
- The issuance cannot proceed — the Issuer is informed that the Holder must anchor their DID first

### AF-2: Issuer not authorized
- At step 1, the system verifies the Issuer is authorized in the trust framework
- If the Issuer is not authorized or their authorization has been revoked, the issuance is rejected

### AF-3: Schema validation fails
- At step 1, the claims do not conform to the credential schema
- The Issuer is shown validation errors and must correct the data

### AF-4: Storage node unreachable
- At step 5, the decentralized storage is not accessible
- The operation fails and the Issuer can retry later

### AF-5: Blockchain transaction fails
- At step 6, the blockchain transaction for status registration fails
- The credential is not considered issued — the Issuer can retry

## Postconditions

- The encrypted credential is in decentralized storage, accessible only by the Holder (who can decrypt it with their private key)
- The credential status (active, with expiration date) is registered on the blockchain
- The Issuer retains only the credential identifier/hash for revocation management ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- The issuance operation hash is recorded on the blockchain as auditable evidence
- The Holder can view the credential from their perspective ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Credential issuance form, schema selection, Holder search, confirmation UI |
| **backend** | VC construction (W3C format), signing, DID resolution, encryption, storage persistence |
| **blockchain** | Holder DID resolution (public key retrieval), credential status registration, audit trail |
| **storage** | Encrypted credential persistence, reference identifier generation |

## Technical Notes

- **Credential format**: W3C Verifiable Credentials Data Model 2.0 with `credentialStatus` field pointing to the blockchain revocation registry (W3C Bitstring Status List)
- **Encryption**: The VC is encrypted with the Holder's public key before persistence — this ensures only the Holder can access the credential content
- **Decentralized storage**: Credentials are stored in the IPFS-based storage node, not in the backend database — the backend only stores metadata and references
- **Status lifecycle**: `ACTIVE` → `EXPIRED` (automatic, based on TTL) or `ACTIVE` → `REVOKED` (manual, via [UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- **Traceability**: The hash of the issuance operation is recorded on-chain — no personal data is stored on the blockchain
- **Standards**: W3C VC Data Model 2.0, W3C Bitstring Status List, eIDAS 2.0, OID4VCI
