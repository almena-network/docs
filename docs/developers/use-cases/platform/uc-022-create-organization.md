---
title: "UC-022: Create Organization"
sidebar_label: "UC-022: Create Organization"
sidebar_position: 22
---

# UC-022: Create Organization

## Description

A user creates a new organization (entity) in the platform. An organization is a unified entity that can both **issue verifiable credentials** and **request verified information** from users. There is no distinction between "issuer" and "requestor" — every organization has both capabilities through two functional areas: an **issuance outbox** (for issuing credentials) and a **requests inbox/outbox** (for requesting and receiving verified information). When a user creates an organization, they automatically become its **owner** and are placed in an auto-created **Admin** group. The organization starts in `draft` status. A user can create and own multiple organizations.

## Actors

- **End User (Creator)**: Person creating the organization from the portal dashboard
- **Frontend (Portal)**: Next.js web application providing the organization creation form
- **Backend API**: FastAPI service handling organization creation, owner assignment, and group initialization

## Preconditions

- The user is authenticated in the portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) or [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- The user has a DID anchored on the blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Main Flow

1. The user navigates to the organization management section: `/[locale]/dashboard/organizations`
2. The user clicks **Create New Organization**
3. The portal displays the creation form with:
   - Organization name (required)
   - Description (required)
4. The user fills in the name and description
5. The user submits the form
6. The backend creates the organization:
   - Generates a unique ID
   - Sets the authenticated user as `owner_id`
   - Sets status to `draft`
   - Auto-creates an **Admin** group (`is_admin: true`) — this group cannot be deleted
   - Adds the owner as a member in the Admin group with role `admin`
   - Sets `created_at` and `updated_at` timestamps
7. The backend returns the created organization with all details
8. The portal navigates to the organization edit page, where the owner can manage groups and add members ([UC-023](/docs/developers/use-cases/platform/uc-023-manage-organization-members))

## Alternative Flows

### AF-1: Missing required fields
- At step 5, the name or description is empty
- The form shows validation errors on the empty fields
- The submit button remains disabled until all required fields are filled

### AF-2: Duplicate organization name
- At step 6, the backend allows organizations with the same name (names are not unique constraints)
- Each organization is uniquely identified by its ID, not its name

### AF-3: User not authenticated
- At step 6, the authentication token is invalid or expired
- The backend returns HTTP 401 and the portal redirects to the login page

## Postconditions

- A new organization exists in the database with status `draft`
- The creator is the organization's owner
- An Admin group exists with the owner as its first member (role: `admin`)
- The organization appears in the user's organization list
- The organization can issue credentials ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential)) and request information ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user)) once members are configured
- The user's perspective switcher in the dashboard now includes the new organization ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Organization creation form, validation, navigation to edit page |
| **backend** | Organization entity creation, Admin group auto-creation, owner member assignment, persistence |

## Technical Notes

- **Unified entity model**: Organizations are not typed as "issuer" or "requestor". Every organization has dual capabilities: issuing credentials and requesting information. The distinction is functional (what action the member performs), not structural (what type the entity is)
- **Two functional areas**: Each organization has an **issuance outbox** (credentials issued to users) and a **requests inbox/outbox** (information requests sent to users and presentations received back). Both areas are accessible from the organization's perspective in the dashboard
- **Status lifecycle**: `draft` → `synced`. The `draft` status indicates the organization has not yet been registered on the blockchain. Syncing anchors the organization's DID on-chain
- **Admin group**: Every organization has exactly one Admin group, auto-created and marked with `is_admin: true`. This group cannot be deleted but can be renamed. Members in the Admin group have full administrative privileges
- **Owner role**: The owner is the user who created the organization. The owner has full control: edit details, manage groups, add/remove members, delete the organization. Ownership is tracked via `owner_id`
- **API endpoints**:
  - `POST /api/v1/organizations` — Create organization
  - `GET /api/v1/organizations` — List organizations the current user belongs to
  - `GET /api/v1/organizations/{id}` — Get organization details
  - `PATCH /api/v1/organizations/{id}` — Update organization
  - `DELETE /api/v1/organizations/{id}` — Delete organization (owner only)
- **Migration from issuers**: The existing issuer entity model and API (`/api/v1/issuers`) will be refactored into the unified organization model. The data structure remains the same (name, description, did, status, owner_id, groups, members); the entity type distinction is removed
- **Backend architecture**: Domain entity (`Organization`) → Repository interface → SQLAlchemy implementation → FastAPI router with Pydantic schemas. Follows clean architecture pattern defined in `backend-fastapi.mdc`
