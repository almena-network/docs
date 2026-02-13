---
title: "UC-029: Query Audit Trail"
sidebar_label: "UC-029: Query Audit Trail"
sidebar_position: 29
---

# UC-029: Query Audit Trail

:::note Reference Flow
Corresponds to **Flow 7 — Traceability and Audit** (Query section).
:::

:::info Functional Specification
This use case defines intended behavior. Audit trail querying is not yet implemented.
:::

## Description

An authorized auditor queries the blockchain for audit records. The query returns on-chain data (hashes, timestamps, event types, participating DIDs) without exposing personal data. If the auditor needs complete detail, they must request access to off-chain storage, which requires authorization and — if containing personal data — the Holder's consent.

## Actors

- **Auditor**: Authorized person or entity querying audit records
- **Blockchain**: Distributed network where audit hashes and metadata are stored
- **Holder**: User whose consent may be required for accessing off-chain personal data

## Preconditions

- The auditor has authorization to query audit records
- Audit records exist on the blockchain ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Main Flow

1. The auditor queries the blockchain filtering by DID, date range, or event type
2. The blockchain returns on-chain records: hashes, timestamps, event types, and participating DIDs — no personal data is exposed
3. If the auditor needs complete detail, they request access to off-chain storage
4. Off-chain access requires authorization and, if containing personal data, the Holder's explicit consent

## Alternative Flows

### AF-1: No records found
- At step 2, no records match the query criteria
- The auditor is informed and can adjust the search parameters

### AF-2: Off-chain access denied
- At step 4, the auditor does not have sufficient authorization or the Holder has not consented
- Only the on-chain records (hashes, metadata) are available

### AF-3: Off-chain data deleted (right to erasure)
- At step 3, the off-chain detail has been deleted per GDPR right to erasure
- The on-chain hash still exists as evidence that the operation occurred, but the detail is no longer available

## Postconditions

- The auditor has received the requested audit records
- On-chain records are always available (immutable)
- Off-chain personal data access is governed by authorization and consent

## Modules Involved

| Module | Role |
|--------|------|
| **frontend** | Audit query interface, results display |
| **backend** | Query orchestration, authorization verification, off-chain data retrieval |
| **blockchain** | Audit record queries (by DID, date, event type) |
| **storage** | Off-chain detail retrieval (with authorization) |

## Technical Notes

- **On-chain queries**: Filter by DID, date range, or event type — returns only hashes, metadata, and DIDs
- **Off-chain access**: Requires separate authorization — personal data access requires Holder consent per GDPR
- **Right to erasure**: Off-chain personal data can be deleted per GDPR — on-chain hashes remain as they are not personal data
- **Audit independence**: The on-chain record provides tamper-proof evidence independent of the platform operator
- **Standards**: GDPR (right of access, right to erasure), eIDAS 2.0 (audit requirements)
