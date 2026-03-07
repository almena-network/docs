---
title: "UC-023: Manage Organization Members"
sidebar_label: "UC-023: Manage Members"
sidebar_position: 23
---

# UC-023: Manage Organization Members

## Description

The owner of an organization manages its members: inviting new users, assigning them to groups with specific roles, and removing members. Members are identified by their DID and must have previously logged into the platform at least once. The organization uses a group-based structure where members belong to a group that defines their role within the organization. The owner can also create and manage custom groups beyond the default Admin group. Once added, members can act on behalf of the organization to issue credentials or request information.

## Actors

- **Owner**: Person who created the organization and has full management control
- **Invited User**: Person being added as a member to the organization
- **Frontend (Portal)**: Next.js web application providing the member management UI
- **Backend API**: FastAPI service handling member CRUD operations and role assignments

## Preconditions

- The owner is authenticated in the portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) or [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- The organization exists and was created by this user ([UC-022](/docs/developers/use-cases/platform/uc-022-create-organization))
- The owner is on the organization edit page

## Main Flow: Add Member

1. The owner navigates to the organization edit page (`/[locale]/dashboard/organizations/{id}`)
2. The owner selects the **Members** tab
3. The portal displays the current member list showing: display name (or DID), group assignment, and role
4. The owner clicks **Add Member**
5. The owner searches for the user by DID using the search field
6. The backend searches for the user via `GET /api/v1/users/search?q={did}`:
   - If found: the user's DID and display name are shown
   - If not found: error message "User not found — they must log in to the platform first"
7. The owner selects a group for the new member from the existing groups dropdown
8. The owner selects a role for the member within that group (e.g., `admin`, `member`)
9. The owner confirms the addition
10. The backend adds the member to the organization:
    - Creates a member entry with `user_id`, `group_id`, and `role`
    - The member's DID is resolved from their `user_id`
11. The member list updates to show the new member
12. The invited user now has access to this organization's perspective in their dashboard ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective)) and can act on behalf of the organization

## Main Flow: Create Group

13. The owner selects the **Groups** tab on the organization edit page
14. The portal displays the current group list (Admin group is always first and marked as system group)
15. The owner clicks **Add Group**
16. The owner enters:
    - Group name (required)
    - Group description (optional)
17. The owner confirms the creation
18. The backend creates the group within the organization (`is_admin: false`)
19. The new group appears in the group list and is available for member assignment

## Main Flow: Remove Member

20. From the member list (step 3), the owner clicks the remove action on a member
21. The portal shows a confirmation dialog warning that the member will lose access to this organization
22. The owner confirms the removal
23. The backend deletes the member entry from the organization
24. The removed user's dashboard no longer shows this organization's perspective

## Main Flow: Remove Group

25. From the group list (step 14), the owner clicks the remove action on a custom group
26. The portal shows a confirmation dialog:
    - If the group has members: warns that members will be unassigned
    - If the group is the Admin group: removal is blocked (Admin group cannot be deleted)
27. The owner confirms the removal
28. The backend deletes the group and unassigns its members (they remain as members but need reassignment)

## Alternative Flows

### AF-1: User not found by DID
- At step 6, the DID does not match any user in the platform
- The portal shows: "User not found. They must log in to the platform at least once before they can be added"
- The owner cannot proceed until a valid user is selected

### AF-2: User already a member
- At step 9, the user being added already exists as a member of this organization
- The backend rejects the duplicate with a conflict error
- The portal shows: "This user is already a member of this organization"

### AF-3: Cannot remove owner
- At step 20, the owner attempts to remove themselves
- The backend prevents the removal — the owner cannot be removed from their own organization
- The portal shows: "The organization owner cannot be removed"

### AF-4: Cannot delete Admin group
- At step 25, the owner attempts to delete the Admin group
- The delete action is disabled or the backend rejects the request
- The Admin group (`is_admin: true`) is permanent and cannot be deleted, only renamed

### AF-5: Change member group or role
- From the member list, the owner changes a member's group assignment or role
- The backend updates the member entry with the new `group_id` and/or `role`
- The member's permissions within the organization change immediately

### AF-6: Owner is not the authenticated user
- At step 1, the authenticated user is not the owner of this organization
- The backend returns HTTP 403 (Forbidden) for any modification operation
- Read access may still be permitted for members (future: role-based access control)

## Postconditions

- **Add member**: The new member exists in the organization with assigned group and role; they can access the organization's perspective and perform actions (issue credentials, request information) according to their role
- **Create group**: A new group exists within the organization for member assignment
- **Remove member**: The member is removed and loses access to the organization's perspective
- **Remove group**: The group is deleted; its members need reassignment

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Organization edit page with tabs (Basic Info, Groups, Members), member search by DID, group/role assignment forms, confirmation dialogs |
| **backend** | Member CRUD (add, update, remove), group CRUD (create, update, delete), user search by DID, ownership validation, cascade operations |

## Technical Notes

- **Member resolution**: Members are added by DID. The backend resolves the DID to a `user_id` via the users table. The target user must have logged in at least once (which creates their user record). Adding members by DID (not email) aligns with the decentralized identity model
- **Group model**: Each organization has 1..N groups. The Admin group is auto-created and cannot be deleted (`is_admin: true`). Custom groups can be freely created and deleted by the owner. Each member belongs to exactly one group
- **Role model**: Each member has a `role` string within their group (e.g., `admin`, `member`). Roles determine what actions the member can perform within the organization: issuing credentials, requesting information, or both. The specific permissions per role are enforced by the backend
- **Cascade behavior**: Deleting an organization cascades to all its groups and members. Deleting a group removes the group but the member records need explicit reassignment or removal
- **API**: Member and group management is done through `PATCH /api/v1/organizations/{id}` which accepts the full updated state of groups and members. The backend reconciles the diff (adds new, removes deleted, updates changed)
- **Current implementation**: The existing issuer edit page (`/dashboard/issuers/[id]`) has three tabs (Basic Info, Groups, Members) and will be refactored to the unified organization model at `/dashboard/organizations/[id]`
- **Future: invitation flow**: Currently members are added directly by the owner. A future enhancement could add an invitation flow where the target user receives a notification and must accept the invitation before becoming a member
