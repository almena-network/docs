---
title: "UC-027: Revoke Issuer Authorization"
sidebar_label: "UC-027: Revoke Issuer Auth"
sidebar_position: 27
---

# UC-027: Revoke Issuer Authorization

:::note Reference Flow
Corresponds to **Flow 6 — Trust Framework Management**, section 6.3 (Authorization Revocation).
:::

:::info Functional Specification
This use case defines intended behavior. Issuer authorization revocation is not yet implemented.
:::

## Description

The Trust Anchor or a parent Issuer revokes the authorization of an Issuer in the trust framework. The revocation cascades automatically: all Issuers that the revoked Issuer had delegated are also revoked. Credentials already issued by revoked Issuers will continue to exist but will fail the Issuer legitimacy verification.

## Actors

- **Trust Anchor / Parent Issuer**: Entity that authorized the Issuer and now revokes the authorization
- **Revoked Issuer**: Issuer whose authorization is being revoked
- **Blockchain**: Distributed network where the Trusted List is updated

## Preconditions

- The Issuer to be revoked has an active authorization in the trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- The revoking entity is the one that originally authorized the Issuer (Trust Anchor or parent Issuer)

## Main Flow

1. The Trust Anchor or parent Issuer initiates the revocation
2. The system performs cascade revocation:
   - Revokes the Issuer's authorization
   - Automatically revokes all Issuers that this Issuer had delegated ([UC-026](/docs/developers/use-cases/platform/uc-026-delegate-issuer-authorization))
3. The blockchain updates the Trusted List with the new states
4. Credentials already issued by revoked Issuers continue to exist but will fail the Issuer legitimacy verification during presentation verification ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Alternative Flows

### AF-1: Issuer not found in trust framework
- At step 1, the Issuer is not registered in the trust framework
- The operation is rejected

### AF-2: Unauthorized revoker
- At step 1, the entity attempting the revocation is not the one that authorized the Issuer
- The revocation is rejected — only the authorizing entity can revoke

### AF-3: Blockchain transaction fails
- At step 3, the transaction fails
- The revocation is not recorded — can be retried

## Postconditions

- The Issuer's authorization is revoked in the Trusted List
- All delegated authorizations from the revoked Issuer are also revoked (cascade)
- Future verifications of credentials issued by the revoked Issuer will fail the legitimacy check
- The revocation is recorded as auditable evidence ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Revocation UI for Trust Anchor and parent Issuers |
| **backend** | Cascade revocation processing |
| **blockchain** | Trusted List update, cascade state management |

## Technical Notes

- **Cascade revocation**: Revoking a parent Issuer automatically revokes all children in the delegation chain
- **Credential impact**: Already-issued credentials are not invalidated by themselves — but they will fail the trust framework check during verification
- **Irreversible**: Authorization revocation is permanent — re-authorization requires a new registration process
- **Standards**: eIDAS 2.0 (Trusted Lists), W3C DID v1.0
