---
title: "UC-010: View Dashboard by Perspective"
sidebar_label: "UC-010: Dashboard Perspectives"
sidebar_position: 10
---

# UC-010: View Dashboard by Perspective

:::info Functional Specification
This use case defines intended behavior. The perspective system is not yet implemented in the frontend.
:::

## Description

After logging in, the user sees a dashboard that adapts to two perspectives: **Holder** (personal, end user) and **Organization** (acting on behalf of an entity). The user can switch between perspectives based on their memberships. A user is always a Holder. Additionally, they may belong to zero or more organizations ([UC-022](/docs/developers/use-cases/platform/uc-022-create-organization)). Each organization is a unified entity that can both issue credentials and request information — there is no separate "issuer" or "requestor" type. When in the Organization perspective, the dashboard shows two functional areas: an **issuance outbox** and a **requests inbox/outbox**.

## Actors

- **End User**: Person authenticated in the portal, switching between perspectives
- **Frontend (Portal)**: Next.js web application rendering the dashboard with perspective-based content
- **Backend API**: FastAPI service providing user profile and organization membership data

## Preconditions

- The user is authenticated in the portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) or [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- The user's organization memberships are retrievable from the backend

## Main Flow

1. The user accesses the dashboard (`/[locale]/dashboard`)
2. The portal requests the user's profile and organization memberships from the backend
3. The backend returns:
   - The user's base profile (DID, user_id)
   - Organization memberships: list of organizations the user belongs to (with role in each)
4. The portal renders a perspective switcher in the dashboard header or sidebar showing available perspectives:
   - **Holder**: Always available (every user is a holder)
   - **Organization**: Available if the user is a member of at least one organization. If the user belongs to multiple organizations, a selector shows which organization they are acting as
5. The default perspective is **Holder**
6. The dashboard content adapts to the active perspective:

### Holder Perspective
- Verified credentials received from organizations ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- Pending information requests from organizations ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Action: Generate verifiable presentations ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))

### Organization Perspective
- **Issuance outbox**: Issued credentials history, action to issue new credentials to users ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential)), revoke credentials ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- **Requests outbox**: Submitted information requests to users, request status tracking ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- **Requests inbox**: Received verifiable presentations from users, action to verify presentations ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- **Members**: Organization member management ([UC-023](/docs/developers/use-cases/platform/uc-023-manage-organization-members))
- If the user belongs to multiple organizations, a secondary selector allows choosing which organization they are acting as

7. The user clicks on a different perspective in the switcher
8. The dashboard content reloads to show the selected perspective's data

## Alternative Flows

### AF-1: User has no organization memberships
- At step 4, only the Holder perspective is available
- The perspective switcher is either hidden or shows only "Holder" without switch capability
- The dashboard shows Holder content exclusively

### AF-2: User belongs to multiple organizations
- At step 6 (Organization perspective), a secondary selector allows the user to choose which organization they are acting as
- Switching organization reloads the content for that specific organization

### AF-3: Language switch
- The portal supports 5 languages: English, Spanish, French, German, Italian
- The user can switch language from settings or header
- All dashboard content, labels, and perspective names are translated
- The URL locale prefix changes (`/en/dashboard` → `/es/dashboard`)

## Postconditions

- The dashboard displays content relevant to the selected perspective
- No persistent state change — perspective selection is a UI-level filter
- The user can freely switch between available perspectives

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Dashboard layout, perspective switcher UI, organization selector, content rendering per perspective, i18n (next-intl with 5 languages) |
| **backend** | User profile, organization membership queries, organization list |

## Technical Notes

- **Multi-language**: The portal uses `next-intl` with locale in the URL path (`/[locale]/dashboard`). 5 languages: en, es, fr, de, it. All UI strings come from `messages/{locale}.json`
- **Unified entity model**: Organizations are not typed as "issuer" or "requestor". Every organization has dual capabilities: issuing credentials and requesting information. The dashboard's Organization perspective shows both functional areas (issuance outbox + requests inbox/outbox) for the selected organization
- **Role model**: A user is always a Holder. Organization membership is many-to-many (user can belong to 0..N organizations). Each membership has a role that determines what actions the member can perform within the organization
- **Current implementation**: The issuer management page (`/dashboard/issuers`) exists and allows creating/editing issuers with groups and members. This will be refactored to the unified organization model at `/dashboard/organizations`. The perspective switcher and Holder views are not yet built
- **Sidebar navigation**: Currently has Identity, Credentials, Issuers, Security, Settings. Will need restructuring to support perspective-based navigation with the unified organization model
