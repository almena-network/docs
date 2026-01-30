---
sidebar_position: 2
---

# Understanding DIDs

Learn about Decentralized Identifiers (DIDs) and how they work in Almena ID.

## What is a DID?

A **DID** (Decentralized Identifier) is a unique identifier that:
- Is **globally unique**
- Is **cryptographically verifiable**
- Is **user-controlled** (self-sovereign)
- **Doesn't require** a central authority

### DID Format

Almena ID DIDs follow this format:

```
did:almena:{identifier}
```

**Example**:
```
did:almena:a1b2c3d4e5f6789...
```

**Components**:
- `did`: The DID scheme
- `almena`: The DID method (Almena ID network)
- `{identifier}`: Unique identifier (32 characters, derived from public key)

## How DIDs are Generated

When a user creates an identity:

1. **Generate Mnemonic**: 12 random words (BIP39)
2. **Derive Keys**: Use BIP32/BIP44 to derive keys
3. **Hash Public Key**: SHA-256 hash of the public key
4. **Create DID**: Take first 32 characters and format as DID

```
Public Key → SHA-256 → First 32 chars → did:almena:{hash}
```

## DIDs vs Traditional Identifiers

| Feature | Traditional (Email/Username) | DID |
|---------|------------------------------|-----|
| **Central Authority** | Required (email provider, website) | None |
| **Portability** | Tied to provider | Fully portable |
| **User Control** | Provider controls | User controls |
| **Verification** | Password-based | Cryptographic |
| **Privacy** | Tied to personal info | Pseudonymous |

## Key Concepts

### Public Key

Each DID has an associated **public key**:
- Used for verification
- Derived from the same seed as the DID
- Safe to share publicly

### Private Key

The corresponding **private key**:
- Used for signing
- Proves control of the DID
- Never shared
- Stored encrypted locally

### Self-Sovereign Identity

Users control their own identities:
- No central authority needed
- Can't be revoked by a company
- Works across any compatible service
- User owns their identity permanently

## Using DIDs in Your Application

### As User Identifier

Use DIDs instead of usernames:

```javascript
// Traditional
const user = await db.users.findOne({ username: "john_doe" });

// With DIDs
const user = await db.users.findOne({ did: "did:almena:a1b2c3..." });
```

### For Authentication

Verify users control their DID through cryptographic signatures:

```javascript
// User claims to own a DID
const did = "did:almena:a1b2c3...";

// Request signature of a challenge
const challenge = generateChallenge();
const signature = await requestUserSignature(did, challenge);

// Verify signature with public key
const isValid = await verifySignature(did, challenge, signature);

if (isValid) {
  // User proven to control this DID
  authenticateUser(did);
}
```

## DID Properties

### Immutable

Once created, a DID never changes:
- Same DID across all devices
- Same DID even if password changes
- Only way to get a new DID is create a new identity

### Pseudonymous

DIDs don't contain personal information:
- No name
- No email
- No identifying info
- Just a cryptographic identifier

### Resolvable

DIDs can be "resolved" to get associated data:
- Public key
- Service endpoints (future)
- Authentication methods (future)

## DID Documents (Future)

In future versions, each DID will have a DID Document containing:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:almena:a1b2c3...",
  "publicKey": [{
    "id": "did:almena:a1b2c3...#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:almena:a1b2c3...",
    "publicKeyHex": "0x1234..."
  }],
  "authentication": ["did:almena:a1b2c3...#keys-1"]
}
```

## Working with DIDs

### Validating DID Format

Check if a string is a valid Almena DID:

```javascript
function isValidAlmenaDID(did) {
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  return pattern.test(did);
}
```

### Storing DIDs

Store DIDs as strings in your database:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  did VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Displaying DIDs

DIDs are long. Consider showing shortened versions in UI:

```javascript
function shortenDID(did) {
  // did:almena:a1b2c3d4... → did:almena:a1b2...d4e5
  const prefix = did.substring(0, 18); // "did:almena:a1b2..."
  const suffix = did.slice(-4);        // "...d4e5"
  return `${prefix}...${suffix}`;
}
```

## DIDs and Privacy

### Correlation Resistance

Using the same DID across services allows correlation:
- Service A knows your DID
- Service B knows your DID
- They can correlate it's the same person

**Future Solution**: Users could have multiple DIDs for different contexts.

### Public by Design

DIDs are meant to be public identifiers:
- Like usernames (but cryptographically verifiable)
- Not like passwords (which are secret)
- Sharing your DID is expected and safe

## Common Questions

### Can I change my DID?

No. Your DID is derived from your cryptographic keys. To get a new DID, you'd need to create a new identity.

### Is my DID personal information?

No. A DID itself contains no personal information. However, if you associate it with personal data (like your real name), then that linkage becomes personal information.

### Can two people have the same DID?

Cryptographically impossible. The odds of collision are astronomically low (2^128 possibilities).

### What if I lose access to my DID?

If you lose your recovery phrase and forget your password, you lose access to that DID permanently. This is why recovery phrases are critical.

## Next Steps

- [Complete Tutorial →](../tutorials-integrator/getting-started.md)
- [Authentication Patterns →](../integrator-guide/integration-patterns/authentication.md)
- [API Reference →](../api-reference/endpoints/health.md)
