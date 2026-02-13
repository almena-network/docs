---
title: "UC-022: Create Organization"
sidebar_label: "UC-022: Create Organization"
sidebar_position: 22
---

# UC-022: Create Organization

:::note Reference Flow
Corresponds to **Flow 1 — Identity Registration (Onboarding)** applied to entities, and **Flow 6 — Trust Framework Management** prerequisites.
:::

## Description

A user creates a new organization (entity) in the platform. An organization is a unified entity that can act as both **Issuer** (issue verifiable credentials) and **Requester** (request verified information from users). When a user creates an organization, they become its owner and the organization starts in `draft` status. The organization must follow the same identity registration flow as individual users: generating a DID and anchoring it on the blockchain. To operate as an Issuer, the organization must additionally be authorized in the trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework)).

## Actors

- **User (Creator)**: Person creating the organization — becomes the owner
- **Blockchain**: Distributed network where the organization's DID will be anchored

## Preconditions

- The user is authenticated in the platform ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) or [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- The user has a DID anchored on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Main Flow

1. The user navigates to the organization management section
2. The user clicks **Create New Organization**
3. The user fills in the organization details (name, description)
4. The system creates the organization:
   - Generates a unique ID
   - Sets the user as owner
   - Sets status to `draft`
   - Auto-creates an **Admin** group with the owner as first member
5. The organization generates a DID following the same identity registration flow ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
6. The organization's DID is anchored on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)), making it publicly resolvable
7. The owner can manage groups and add members ([UC-023](/docs/developers/use-cases/platform/uc-023-manage-organization-members))
8. To operate as an Issuer, the organization must register in the trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))

## Alternative Flows

### AF-1: Missing required fields
- At step 3, the name or description is empty
- The form shows validation errors

### AF-2: DID anchoring fails
- At step 6, the blockchain transaction fails
- The organization remains in `draft` status and anchoring can be retried

### AF-3: User not authenticated
- At step 4, the authentication is invalid
- The user is redirected to login

## Postconditions

- A new organization exists with its own DID
- The creator is the organization's owner with an auto-created Admin group
- The organization's DID Document is registered on the blockchain (publicly resolvable)
- The organization can request information from users (Requester capability)
- To issue credentials (Issuer capability), the organization must additionally register in the trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Organization creation form, validation, management UI |
| **backend** | Organization creation, DID generation, Admin group auto-creation, persistence |
| **blockchain** | Organization DID Document anchoring, public resolution |

## Technical Notes

- **Unified entity model**: Organizations are not typed as "issuer" or "requestor" — every organization has dual capabilities
- **Identity flow**: Organizations follow the same DID generation and anchoring flow as individual users (Flow 1)
- **Trust framework**: Operating as an Issuer requires authorization in the trust framework — this is a separate step after organization creation
- **Status lifecycle**: `draft` → `synced` (after DID anchoring on blockchain)
- **Standards**: W3C DID v1.0, eIDAS 2.0 (organizational wallets)
