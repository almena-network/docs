---
title: "UC-026: Delegate Issuer Authorization"
sidebar_label: "UC-026: Delegate Authorization"
sidebar_position: 26
---

# UC-026: Delegate Issuer Authorization

:::note Reference Flow
Corresponds to **Flow 6 — Trust Framework Management**, section 6.2 (Delegation between Issuers).
:::

:::info Functional Specification
This use case defines intended behavior. Issuer delegation is not yet implemented.
:::

## Description

An authorized Issuer with delegation capability proposes to authorize another entity as an Issuer, within the limits of their own authorization. The system verifies delegation policies (maximum chain depth, allowed credential types, territorial or sectoral restrictions). If policies allow it, the delegated authorization is registered on the blockchain with the complete trust chain.

## Actors

- **Authorized Issuer**: Issuer with delegation capability granted by the Trust Anchor or a parent Issuer
- **New Issuer**: Entity being proposed for authorization
- **Blockchain**: Distributed network where the delegation is registered with the trust chain

## Preconditions

- The authorized Issuer has delegation capability in their trust framework registration ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- The new Issuer has a DID anchored on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Main Flow

1. The authorized Issuer proposes to authorize a new entity, within the limits of their own authorization
2. The system verifies delegation policies:
   - Maximum chain depth
   - Allowed credential types
   - Territorial or sectoral restrictions
3. If policies allow it, the authorized Issuer registers the delegated authorization on the blockchain with the complete trust chain (Trust Anchor → Issuer A → Issuer B)
4. The blockchain updates the Trusted List with the new Issuer and their authorization chain

## Alternative Flows

### AF-1: Policy violation
- At step 2, the delegation violates one or more policies (chain too deep, unauthorized credential type, etc.)
- The delegation is rejected with the specific policy violation

### AF-2: Issuer lacks delegation capability
- At step 1, the Issuer does not have delegation capability in their authorization
- The delegation is rejected

## Postconditions

- The new Issuer is registered in the Trusted List with their complete trust chain
- The new Issuer can issue credentials of the authorized types
- The delegation chain is transparent and queryable by any Verifier

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Delegation proposal UI |
| **backend** | Policy verification, delegation processing |
| **blockchain** | Trust chain registration, Trusted List update |

## Technical Notes

- **Trust chain**: Each delegation records the complete chain (Trust Anchor → parent Issuer → delegated Issuer) — this is transparent and queryable
- **Policy enforcement**: Delegation policies are enforced on-chain — a delegated Issuer cannot exceed the permissions of their parent
- **Cascade revocation**: If a parent Issuer's authorization is revoked, all delegated authorizations are also revoked ([UC-027](/docs/developers/use-cases/platform/uc-027-revoke-issuer-authorization))
- **Standards**: eIDAS 2.0 (Trusted Lists, delegation), W3C DID v1.0
