---
title: "UC-013: Generate Verifiable Presentation"
sidebar_label: "UC-013: Generate Presentation"
sidebar_position: 13
---

# UC-013: Generate Verifiable Presentation

:::note Reference Flow
Corresponds to **Flow 3 — Verifiable Request and Presentation**, steps 2-6.
:::

:::info Functional Specification
This use case defines intended behavior. Verifiable presentations are not yet implemented.
:::

## Description

The Holder generates a verifiable presentation (VP) to respond to an information request from a Requester. The Holder reviews the request, grants consent (which is recorded on the blockchain), decrypts the relevant credentials from decentralized storage using their private key, constructs a VP containing only the specific claims requested (selective disclosure), and signs it with their private key. The VP is then sent to the Requester.

## Actors

- **Holder**: User generating the presentation from their credentials
- **Requester**: Entity that sent the information request and will receive the VP
- **Wallet**: Signs the presentation with the Holder's private key
- **Blockchain**: Records the consent and provides DID resolution
- **Storage Node**: Decentralized storage where the Holder's encrypted credentials are stored

## Preconditions

- The Holder has a DID registered on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- The Holder possesses valid credentials issued by authorized Issuers ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- A Requester has sent an information request to the Holder ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))

## Main Flow

1. The Holder receives the request and the wallet displays what information is being requested and who is requesting it
2. The Holder reviews the request and approves it via a cryptographic challenge-response — the consent is recorded on the blockchain
3. The Holder decrypts the relevant credentials from decentralized storage using their private key
4. The Holder constructs a Verifiable Presentation (VP) containing only the specific claims requested (selective disclosure), extracted from the corresponding credentials
5. The VP is signed with the Holder's private key
6. The signed VP is transmitted to the Requester
7. The blockchain records the hash of the presentation operation as auditable evidence ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Alternative Flows

### AF-1: No matching credentials
- At step 3, the Holder has no credentials that satisfy the Requester's request
- The wallet shows a message indicating which credentials are missing
- The Holder cannot generate the presentation

### AF-2: Holder declines the request
- At step 2, the Holder decides not to share the information
- The request is marked as declined and the Requester is notified

### AF-3: Selective disclosure
- At step 4, the Holder chooses to share only specific claims from a credential rather than the full credential
- The VP includes only the selected claims (minimum exposure principle)

### AF-4: Wallet signing fails
- At step 5, the wallet is unreachable or the Holder cancels the signing
- The presentation is not generated and the Holder can retry

### AF-5: Request expired
- At step 1, the Requester's request has passed its expiration time
- The wallet shows the request as expired and the Holder cannot generate a presentation for it

### AF-6: Credential decryption fails
- At step 3, the credential cannot be decrypted from storage (corrupted data, storage unreachable)
- The Holder is informed and can retry

## Postconditions

- The Requester has received the signed VP containing only the requested claims
- The Holder has shared only the minimum information necessary (selective disclosure)
- The consent is recorded on the blockchain without personal data
- The entire operation is traced on the blockchain via hashes ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))
- The Requester can now delegate verification to the Verifier ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Modules Involved

| Module | Role |
|--------|------|
| **wallet** | Request display, consent UI, credential decryption, VP signing |
| **backend** | VP construction (W3C VP format), delivery to Requester |
| **blockchain** | Consent registration, DID resolution, audit trail |
| **storage** | Encrypted credential retrieval |

## Technical Notes

- **VP format**: W3C Verifiable Presentations Data Model — JSON-LD wrapping one or more VCs with a Holder proof
- **Challenge binding**: The VP includes the Requester's challenge (nonce) to prevent replay — the VP is valid only for the specific request it responds to
- **Consent on-chain**: The Holder's consent is recorded on the blockchain as a hash — no personal data is stored on-chain
- **Selective disclosure**: The VP contains only the specific claims requested, not the full credentials — this follows the minimum exposure principle
- **Encryption**: Credentials are decrypted from storage only by the Holder's private key — they are never transmitted in cleartext
- **Standards**: W3C VC Data Model 2.0, DIF Presentation Exchange, OID4VP, GDPR (explicit consent)
