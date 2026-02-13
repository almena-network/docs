---
title: "UC-014: Request Information to User"
sidebar_label: "UC-014: Request Information"
sidebar_position: 14
---

# UC-014: Request Information to User

:::info Functional Specification
This use case defines intended behavior. The requestor request system is not yet implemented.
:::

## Description

From the Requestor perspective of the dashboard, a requestor member creates an information request directed at a specific user. The request defines what information the requestor needs (e.g., proof of a university degree, a professional certification). The user receives the request in their Holder perspective and can respond by generating a verifiable presentation ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation)) or decline it. For example, a bank (requestor) requests a customer (holder) to prove their academic qualifications.

## Actors

- **Requestor Member**: Person acting from the Requestor perspective, creating the information request
- **Holder (Target User)**: Person who receives the request and must decide whether to share the information
- **Frontend (Portal)**: Next.js web application providing the request creation and tracking UI
- **Backend API**: FastAPI service managing request creation, delivery, and status tracking

## Preconditions

- The requestor member is authenticated and on the dashboard in **Requestor perspective** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- The requestor member has permission to create requests for their organization
- The target user has a DID registered in the platform

## Main Flow

1. The requestor member navigates to the request creation section in the Requestor perspective
2. The requestor member specifies the request:
   - Target user (searched by name or DID)
   - Requested information type (e.g., "university degree", "identity verification", "professional certification")
   - Specific attributes required (e.g., "degree name", "institution", "graduation year")
   - Purpose / reason for the request (displayed to the user for transparency)
   - Request expiration time
3. The requestor member submits the request
4. The backend creates the information request with:
   - Unique request ID
   - Requestor organization DID and name
   - Target holder DID
   - Requested credential types and attributes
   - Challenge nonce (for binding the response VP)
   - Status: `PENDING`
   - Expiration timestamp
5. The backend notifies the holder that a new information request is available
6. The portal confirms the request creation and shows it in the requestor's request history with status "Pending"
7. The holder sees the request in their Holder perspective ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation), step 1)
8. When the holder responds (approves with VP or declines), the request status updates:
   - `FULFILLED`: Holder sent a verifiable presentation
   - `DECLINED`: Holder rejected the request
   - `EXPIRED`: Request expired without response
9. The requestor member sees the updated status in their dashboard

## Alternative Flows

### AF-1: User not found
- At step 2, the searched user does not exist in the platform
- The form shows an error and the request cannot be submitted

### AF-2: Holder declines
- At step 7, the holder reviews the request and clicks "Decline"
- The backend updates the request status to `DECLINED`
- The requestor sees the status change and the decline reason (if provided)

### AF-3: Request expires
- The holder does not respond before the expiration time
- The backend automatically marks the request as `EXPIRED`
- The requestor sees the expired status and can create a new request

### AF-4: Holder responds with presentation
- The holder generates a VP and sends it ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- The backend updates the request status to `FULFILLED` and links the VP
- The requestor can now verify the presentation ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Postconditions

- An information request exists in the system with status `PENDING`
- The holder has been notified of the request
- The request appears in both the requestor's history and the holder's pending requests

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Request creation form, user search, request history list, status tracking |
| **backend** | Request creation, storage, notification delivery, status management |

## Technical Notes

- **Challenge nonce**: Each request includes a unique nonce that must be included in the response VP. This binds the presentation to the specific request and prevents replay
- **Request status lifecycle**: `PENDING` → `FULFILLED` / `DECLINED` / `EXPIRED`
- **Notification**: Initially via platform polling (holder checks for new requests on dashboard load). Future: push notifications or DIDComm messages via the mediator
- **Privacy**: The requestor only sees that the user has certain credentials after the user explicitly shares them. The requestor cannot browse the user's credential list
