---
title: "UC-014: Request Information to User"
sidebar_label: "UC-014: Request Information"
sidebar_position: 14
---

# UC-014: Request Information to User

:::note Reference Flow
Corresponds to **Flow 3 — Verifiable Request and Presentation**, step 1.
:::

:::info Functional Specification
This use case defines intended behavior. The information request system is not yet implemented.
:::

## Description

A Requester (organization) sends an information request to a Holder. The request specifies the claims needed (e.g., proof of age, address, academic title), includes the Requester's DID and the purpose of the request. The Holder receives the request in their wallet and can respond by generating a verifiable presentation ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation)) or decline it.

## Actors

- **Requester**: Entity that needs verified information from the Holder — has a DID registered on the blockchain
- **Holder**: User who receives the request and decides whether to share information
- **Blockchain**: Provides DID resolution for the Requester

## Preconditions

- The Requester has a DID registered on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- The Holder has a DID registered on the blockchain
- The Requester has a legitimate need to verify information from the Holder

## Main Flow

1. The Requester generates a Presentation Request specifying:
   - The claims needed (e.g., proof of age, address, academic title)
   - The Requester's DID
   - The purpose of the request (displayed to the Holder for transparency)
   - Challenge nonce (for binding the response VP)
   - Request expiration time
2. The request is delivered to the Holder
3. The Holder's wallet receives the request and displays what information is being requested and who is requesting it
4. The Holder can respond:
   - **Accept**: Generate a verifiable presentation ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
   - **Decline**: Reject the request with an optional reason
5. The request status is updated accordingly:
   - `PENDING` → `FULFILLED` (Holder sent a VP)
   - `PENDING` → `DECLINED` (Holder rejected)
   - `PENDING` → `EXPIRED` (no response before expiration)

## Alternative Flows

### AF-1: Holder not found
- At step 2, the Holder's DID cannot be resolved
- The Requester is informed that the request cannot be delivered

### AF-2: Holder declines
- At step 4, the Holder reviews and declines the request
- The Requester is notified of the rejection

### AF-3: Request expires
- The Holder does not respond before the expiration time
- The request is automatically marked as `EXPIRED`
- The Requester can create a new request

## Postconditions

- An information request exists with status `PENDING`
- The Holder has been notified of the request
- The request includes a challenge nonce that must be included in the response VP to prevent replay

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Request creation form, user search, request history, status tracking |
| **backend** | Request creation, delivery, status management |
| **blockchain** | DID resolution for Requester and Holder |

## Technical Notes

- **Presentation Request**: Follows the DIF Presentation Exchange specification for defining what claims are needed
- **Challenge nonce**: Each request includes a unique nonce that must be included in the response VP — this binds the presentation to the specific request and prevents replay
- **Request status lifecycle**: `PENDING` → `FULFILLED` / `DECLINED` / `EXPIRED`
- **Privacy**: The Requester cannot browse the Holder's credential list — they can only request specific claims and wait for the Holder to respond
- **Standards**: DIF Presentation Exchange, OID4VP, GDPR (purpose limitation, data minimization)
