---
sidebar_position: 2
---

# Credential Patterns

Learn how to issue and verify verifiable credentials with Almena ID.

## Overview

Verifiable credentials are digital statements that:
- Are cryptographically secure
- Can be verified independently
- Are tamper-evident
- Don't require centralized verification

## Coming Soon

Credential issuance and verification features are currently in development.

Planned functionality:
- Issue verifiable credentials to DIDs
- Verify credentials cryptographically
- Revoke credentials
- Check credential status
- Support for standard credential types

## Credential Use Cases

### For Issuers

**Who**: Organizations that issue credentials
- Universities (diplomas, certificates)
- Employers (employment verification)
- Government agencies (licenses, permits)
- Certifying bodies (professional certifications)

**What you can do**:
- Issue tamper-proof credentials
- Revoke credentials if needed
- Track credential status
- No need to handle verification requests

### For Holders (Users)

**Who**: Individuals who receive and hold credentials
- Students
- Employees
- Citizens
- Professionals

**What they can do**:
- Receive credentials from issuers
- Store credentials securely
- Share credentials selectively
- Prove ownership cryptographically

### For Verifiers

**Who**: Applications that verify credentials
- Employers (checking qualifications)
- Service providers (age verification)
- Platforms (membership verification)
- Compliance systems (license verification)

**What you can do**:
- Verify credentials independently
- Check if credentials are revoked
- Confirm issuer authenticity
- Validate credential data

## Planned Credential Types

### Identity Credentials
- Email verification
- Phone verification
- Address verification
- Age verification

### Professional Credentials
- Degrees and diplomas
- Certifications
- Licenses
- Employment records

### Membership Credentials
- Organization membership
- Subscription status
- Access levels
- Roles and permissions

### Custom Credentials
- Define your own credential schemas
- Issue custom attributes
- Set validation rules

## How Credentials Will Work

### 1. Issuance Flow

```
1. User provides information to issuer
2. Issuer verifies information (off-chain)
3. Issuer creates verifiable credential
4. Issuer signs credential with their key
5. User receives and stores credential
6. Credential is linked to user's DID
```

### 2. Verification Flow

```
1. User shares credential with verifier
2. Verifier checks cryptographic signature
3. Verifier confirms issuer identity
4. Verifier checks credential hasn't been revoked
5. Verifier validates credential data
6. Verification succeeds or fails
```

## Planned API Endpoints

### Issue Credential

```http
POST /api/v1/credentials/issue
```

**Request**:
```json
{
  "holderDID": "did:almena:abc123...",
  "type": "EmailVerification",
  "claims": {
    "email": "user@example.com",
    "verified": true,
    "verifiedAt": "2024-01-15T10:00:00Z"
  },
  "expirationDate": "2025-01-15T10:00:00Z"
}
```

**Response**:
```json
{
  "credential": {
    "id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    "type": ["VerifiableCredential", "EmailVerification"],
    "issuer": "did:almena:issuer123...",
    "issuanceDate": "2024-01-15T10:00:00Z",
    "expirationDate": "2025-01-15T10:00:00Z",
    "credentialSubject": {
      "id": "did:almena:abc123...",
      "email": "user@example.com",
      "verified": true
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-01-15T10:00:00Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:almena:issuer123...#keys-1",
      "jws": "eyJhbGc...signature"
    }
  }
}
```

### Verify Credential

```http
POST /api/v1/credentials/verify
```

**Request**:
```json
{
  "credential": {
    "id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    ...
  }
}
```

**Response**:
```json
{
  "verified": true,
  "checks": {
    "signatureValid": true,
    "notRevoked": true,
    "notExpired": true,
    "issuerTrusted": true
  },
  "issuer": {
    "did": "did:almena:issuer123...",
    "name": "Example University"
  }
}
```

### Revoke Credential

```http
POST /api/v1/credentials/revoke
```

**Request**:
```json
{
  "credentialId": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
  "reason": "No longer valid"
}
```

## Data Privacy

### Selective Disclosure

Future support for:
- Share only specific claims
- Prove attributes without revealing actual values
- Zero-knowledge proofs

**Example**: Prove you're over 18 without revealing your birth date.

### Privacy-Preserving Verification

- Verifiers only see what you share
- No tracking across verifiers
- Minimal data exposure

## Integration Examples (Coming Soon)

### For Issuers

```javascript
// Example: Issue a degree credential
const credential = await almenaAPI.credentials.issue({
  holderDID: userDID,
  type: 'UniversityDegree',
  claims: {
    degree: 'Bachelor of Science',
    major: 'Computer Science',
    graduationDate: '2024-05-15',
    university: 'Example University'
  },
  expirationDate: null // Never expires
});
```

### For Verifiers

```javascript
// Example: Verify a credential
const verification = await almenaAPI.credentials.verify(credential);

if (verification.verified) {
  console.log('Credential is valid!');
  console.log('Issued by:', verification.issuer.name);
  console.log('Claims:', credential.credentialSubject);
} else {
  console.log('Verification failed:', verification.checks);
}
```

### For Holders

```javascript
// Example: User requests credential from wallet
const credential = await almenaWallet.requestCredential({
  issuerDID: 'did:almena:university123...',
  type: 'UniversityDegree'
});

// User shares credential with verifier
await almenaWallet.shareCredential(credential, verifierDID);
```

## Standards Compliance

Almena ID credentials will follow:
- W3C Verifiable Credentials Data Model
- W3C DID specification
- JSON-LD format
- Standard proof types

## Stay Updated

Credential functionality is a top priority. Check:
- [Changelog](../../changelog/overview.md) for updates
- [Roadmap](#) for timeline (coming soon)
- Subscribe to our newsletter for announcements

## Early Access

Interested in beta testing credential features?
- Email: beta@almena.id
- Subject: "Credential Beta Program"

## Related Documentation

- [Authentication Pattern →](./authentication.md) - Verify user identity
- [API Reference →](../../api-reference/endpoints/health.md) - API documentation
- [Best Practices →](../best-practices/security.md) - Security guidelines

## Support

Questions about credentials?
- Email: integrations@almena.id
- [Integrator FAQ →](../../faq-integrator/api.md)

---

**Note**: This documentation describes planned functionality. APIs and features are subject to change before release.
