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

After logging in, the user sees a dashboard that adapts to three perspectives: **Holder** (end user), **Issuer**, and **Requestor** (petitioner). The user can switch between perspectives based on their assigned roles. A user is always a Holder. Additionally, they may belong to zero or more Issuers (e.g., a university issuing certificates), and to zero or one Requestor (e.g., a bank requesting verified information). Each perspective shows different content and actions relevant to that role.

## Actors

- **End User**: Person authenticated in the portal, switching between perspectives
- **Frontend (Portal)**: Next.js web application rendering the dashboard with perspective-based content
- **Backend API**: FastAPI service providing user role data (issuer memberships, requestor membership)

## Preconditions

- The user is authenticated in the portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) or [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- The user's role assignments are retrievable from the backend

## Main Flow

1. The user accesses the dashboard (`/[locale]/dashboard`)
2. The portal requests the user's profile and role assignments from the backend
3. The backend returns:
   - The user's base profile (DID, user_id)
   - Issuer memberships: list of issuers the user belongs to (with role in each)
   - Requestor membership: the requestor organization the user belongs to (if any)
4. The portal renders a perspective switcher in the dashboard header or sidebar showing available perspectives:
   - **Holder**: Always available (every user is a holder)
   - **Issuer**: Available if the user is a member of at least one issuer
   - **Requestor**: Available if the user is a member of a requestor organization
5. The default perspective is **Holder**
6. The dashboard content adapts to the active perspective:

### Holder Perspective
- Verified credentials received from issuers ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- Pending information requests from requestors ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Action: Generate verifiable presentations ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))

### Issuer Perspective
- Incoming credential requests from users
- Issued credentials history
- Action: Issue verifiable credentials to users ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- If the user belongs to multiple issuers, a selector shows which issuer they are acting as

### Requestor Perspective
- Submitted presentation verification requests
- Verification results history
- Action: Request information from users ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Action: Verify presentations against verifier nodes ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

7. The user clicks on a different perspective in the switcher
8. The dashboard content reloads to show the selected perspective's data

## Alternative Flows

### AF-1: User has no issuer or requestor roles
- At step 4, only the Holder perspective is available
- The perspective switcher is either hidden or shows only "Holder" without switch capability
- The dashboard shows Holder content exclusively

### AF-2: User belongs to multiple issuers
- At step 6 (Issuer perspective), a secondary selector allows the user to choose which issuer organization they are acting as
- Switching issuer reloads the content for that specific issuer

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
| **frontend** | Dashboard layout, perspective switcher UI, content rendering per perspective, i18n (next-intl with 5 languages) |
| **backend** | User profile, role/membership queries, issuer list, requestor assignment |

## Technical Notes

- **Multi-language**: The portal uses `next-intl` with locale in the URL path (`/[locale]/dashboard`). 5 languages: en, es, fr, de, it. All UI strings come from `messages/{locale}.json`
- **Role model**: A user is always a Holder. Issuer membership is many-to-many (user can belong to 0..N issuers). Requestor membership is zero-to-one (user belongs to 0..1 requestor organizations)
- **Current implementation**: The issuer management page (`/dashboard/issuers`) exists and allows creating/editing issuers with groups and members. The perspective switcher and Holder/Requestor views are not yet built
- **Sidebar navigation**: Currently has Identity, Credentials, Issuers, Security, Settings. Will need restructuring to support perspective-based navigation
