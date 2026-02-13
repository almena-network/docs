---
title: "UC-028: Record Audit Trail"
sidebar_label: "UC-028: Record Audit Trail"
sidebar_position: 28
---

# UC-028: Record Audit Trail

:::note Reference Flow
Corresponds to **Flow 7 — Traceability and Audit**.
:::

:::info Functional Specification
This use case defines intended behavior. The audit trail system is not yet implemented.
:::

## Description

Every relevant operation in the platform generates an audit record on the blockchain following the pattern: **hash on-chain, data off-chain**. The blockchain record contains the operation hash, event type, participating DIDs, timestamp, and a reference to off-chain detail. No personal data is ever stored on-chain. This ensures full traceability while maintaining privacy and GDPR compliance.

## Actors

- **System**: Automatically records audit events for every relevant operation
- **Blockchain**: Distributed network where hashes and metadata are stored
- **Storage Node**: Off-chain storage for detailed audit data (encrypted if containing personal data)

## Preconditions

- The blockchain is operational
- A relevant operation has been performed (see tracked events below)

## Tracked Events

The following operations generate audit records on the blockchain:

- DID registration ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity), [UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- Credential issuance ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- Credential revocation ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- Information requests ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Consent granted ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- Verifiable presentations generated ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- Verification results ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- Trust framework registrations and revocations ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework), [UC-027](/docs/developers/use-cases/platform/uc-027-revoke-issuer-authorization))
- Key rotation ([UC-024](/docs/developers/use-cases/wallet/uc-024-rotate-holder-keys))
- DID Document updates

## Main Flow

1. A relevant operation is performed in the platform
2. The system generates an audit record containing:
   - Hash of the operation
   - Event type (issuance, revocation, presentation, consent, trust framework change, etc.)
   - DIDs of the participants
   - Timestamp
   - Reference to off-chain detail (in encrypted storage or private logs)
3. The audit record is registered on the blockchain
4. Detailed operation data is stored off-chain (encrypted if containing personal data)

## Alternative Flows

### AF-1: Blockchain unavailable
- At step 3, the blockchain is not accessible
- The audit record is queued and retried when the blockchain becomes available
- The operation itself is not blocked by audit recording failure

## Postconditions

- The operation hash is recorded on the blockchain as immutable evidence
- The off-chain detail is stored securely for authorized consultation
- No personal data exists on the blockchain

## Modules Involved

| Module | Role |
|--------|------|
| **backend** | Audit event generation, hash computation, off-chain storage |
| **blockchain** | Immutable audit record storage, hash registration |
| **storage** | Off-chain detail persistence (encrypted) |

## Technical Notes

- **Pattern**: Hash on-chain, data off-chain — the blockchain stores only hashes and metadata, never personal data
- **GDPR compliance**: Personal data is always off-chain and can be deleted (right to erasure). Hashes on blockchain are irreversible and do not constitute personal data by themselves
- **Off-chain retention**: Off-chain logs with personal data are subject to retention policies and can be deleted when necessary
- **Immutability**: On-chain records are immutable — they serve as tamper-proof evidence of operations
- **Standards**: GDPR (data protection), eIDAS 2.0 (audit requirements)
