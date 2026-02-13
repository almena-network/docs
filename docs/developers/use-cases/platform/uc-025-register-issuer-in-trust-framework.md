---
title: "UC-025: Register Issuer in Trust Framework"
sidebar_label: "UC-025: Register Issuer"
sidebar_position: 25
---

# UC-025: Register Issuer in Trust Framework

:::note Reference Flow
Corresponds to **Flow 6 — Trust Framework Management**, section 6.1 (Issuer Registration by Trust Anchor).
:::

:::info Functional Specification
This use case defines intended behavior. The trust framework is not yet implemented.
:::

## Description

The Trust Anchor (root entity of the platform) authorizes a new Issuer in the trust framework. The candidate Issuer presents their request including their DID and supporting documentation. The Trust Anchor validates the candidate (legal identity, capacity, regulatory compliance) and registers the authorization on the blockchain. The authorization specifies which types of credentials the Issuer can issue, whether they can delegate to other Issuers, applicable policies, and an expiration date.

## Actors

- **Trust Anchor**: Root entity (platform creator) that manages the trust framework — has a DID registered as Trust Anchor on the blockchain
- **Issuer Candidate**: Organization requesting authorization to become an Issuer — must already have a DID registered on the blockchain ([UC-022](/docs/developers/use-cases/platform/uc-022-create-organization))
- **Blockchain**: Distributed network where the Trusted List is maintained

## Preconditions

- The Trust Anchor has a DID registered as root entity on the blockchain
- A smart contract or authorized Issuer registry exists on the blockchain
- The Issuer candidate has a DID anchored on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Main Flow

1. The Issuer candidate submits an authorization request to the Trust Anchor, including their DID and supporting documentation
2. The Trust Anchor validates the candidate (legal identity, capacity, regulatory compliance)
3. The Trust Anchor registers the authorization on the blockchain:
   - Issuer's DID
   - Types of credentials the Issuer can issue
   - Delegation capability (yes/no)
   - Applicable policies
   - Authorization expiration date
4. The blockchain validates and confirms the registration
5. The Issuer appears in the Trusted List, queryable by any Verifier

## Alternative Flows

### AF-1: Candidate validation fails
- At step 2, the candidate does not meet the requirements
- The Trust Anchor rejects the request with the reasons

### AF-2: Authorization with restrictions
- At step 3, the Trust Anchor grants authorization limited to specific credential types, territories, or sectors

### AF-3: Blockchain transaction fails
- At step 4, the registration transaction fails
- The Trust Anchor can retry

## Postconditions

- The Issuer is registered in the Trusted List on the blockchain
- The Issuer can issue verifiable credentials of the authorized types ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- Any Verifier can query the Trusted List to confirm the Issuer's legitimacy ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- If delegation was granted, the Issuer can authorize other Issuers ([UC-026](/docs/developers/use-cases/platform/uc-026-delegate-issuer-authorization))

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Authorization request form, Trust Anchor management UI |
| **backend** | Request processing, validation orchestration |
| **blockchain** | Trusted List registry, authorization storage, public queries |

## Technical Notes

- **Trusted List**: On-chain registry of authorized Issuers — queryable by any Verifier during the verification flow
- **Authorization scope**: Each authorization specifies credential types, delegation capability, policies, and expiration
- **Revocation**: Issuer authorization can be revoked by the Trust Anchor or parent Issuer ([UC-027](/docs/developers/use-cases/platform/uc-027-revoke-issuer-authorization))
- **Standards**: eIDAS 2.0 (Trusted Lists), W3C DID v1.0
