---
sidebar_position: 1
---

# Authentication Pattern

## ⚠️ Coming Soon

**DID-based authentication is not yet implemented.** This documentation describes the planned authentication pattern.

---

Learn how to implement DID-based authentication in your application (planned).

## Overview

Replace traditional username/password authentication with decentralized identity authentication using DIDs (when available).

## Benefits

- **No password storage**: No passwords to manage or leak
- **Cryptographic proof**: Users prove ownership of their DID
- **User control**: Users own their identity, not your service
- **Privacy**: No email or personal info required

## How It Works

```
1. User provides their DID
2. Your app generates a challenge
3. User signs challenge with their private key (in their wallet)
4. Your app verifies signature with public key
5. Authentication successful
```

## Implementation Steps

### Step 1: Request User's DID

**User Interface**:
```html
<form>
  <label for="did">Enter your DID:</label>
  <input 
    type="text" 
    id="did" 
    placeholder="did:almena:abc123..."
    pattern="^did:almena:[a-f0-9]{32}$"
  />
  <button type="submit">Login</button>
</form>
```

**Validation**:
```javascript
function isValidDID(did) {
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  return pattern.test(did);
}
```

### Step 2: Generate Challenge

Create a unique, random challenge:

```javascript
// Node.js
const crypto = require('crypto');

function generateChallenge() {
  return crypto.randomBytes(32).toString('hex');
}

// Browser
function generateChallenge() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
}
```

**Store Challenge**:
```javascript
// Store with expiration (5 minutes)
await redis.set(
  `challenge:${did}`, 
  challenge,
  'EX',
  300
);
```

### Step 3: Request Signature from User

**Response to User**:
```javascript
app.post('/auth/challenge', async (req, res) => {
  const { did } = req.body;
  
  if (!isValidDID(did)) {
    return res.status(400).json({ error: 'Invalid DID format' });
  }
  
  const challenge = generateChallenge();
  await storeChallenge(did, challenge);
  
  res.json({
    challenge,
    message: 'Sign this challenge with your Almena ID wallet'
  });
});
```

**User Signs in Wallet**:
The user opens their Almena ID wallet and signs the challenge. This happens client-side in the browser extension.

### Step 4: Verify Signature

When user returns with signature:

```javascript
app.post('/auth/verify', async (req, res) => {
  const { did, challenge, signature } = req.body;
  
  // Verify challenge was issued and not expired
  const storedChallenge = await redis.get(`challenge:${did}`);
  if (storedChallenge !== challenge) {
    return res.status(400).json({ error: 'Invalid or expired challenge' });
  }
  
  // Verify signature (API endpoint to be implemented)
  const isValid = await verifySignature(did, challenge, signature);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Clean up challenge
  await redis.del(`challenge:${did}`);
  
  // Create session
  const sessionToken = await createSession(did);
  
  res.json({
    success: true,
    sessionToken,
    did
  });
});
```

### Step 5: Maintain Session

**Create Session**:
```javascript
async function createSession(did) {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  await redis.set(
    `session:${sessionToken}`,
    JSON.stringify({
      did,
      createdAt: Date.now()
    }),
    'EX',
    86400 // 24 hours
  );
  
  return sessionToken;
}
```

**Verify Session**:
```javascript
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const session = await redis.get(`session:${token}`);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  
  req.user = JSON.parse(session);
  next();
}
```

## Complete Example

### Backend (Express.js)

```javascript
const express = require('express');
const crypto = require('crypto');
const redis = require('redis').createClient();

const app = express();
app.use(express.json());

// Step 1: Request challenge
app.post('/auth/challenge', async (req, res) => {
  const { did } = req.body;
  
  if (!/^did:almena:[a-f0-9]{32}$/.test(did)) {
    return res.status(400).json({ error: 'Invalid DID' });
  }
  
  const challenge = crypto.randomBytes(32).toString('hex');
  await redis.set(`challenge:${did}`, challenge, 'EX', 300);
  
  res.json({ challenge });
});

// Step 2: Verify signature
app.post('/auth/verify', async (req, res) => {
  const { did, challenge, signature } = req.body;
  
  const storedChallenge = await redis.get(`challenge:${did}`);
  if (storedChallenge !== challenge) {
    return res.status(400).json({ error: 'Invalid challenge' });
  }
  
  // TODO: Call Almena API to verify signature
  const isValid = await almenaAPI.verifySignature(did, challenge, signature);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  await redis.del(`challenge:${did}`);
  
  const sessionToken = crypto.randomBytes(32).toString('hex');
  await redis.set(
    `session:${sessionToken}`,
    JSON.stringify({ did, createdAt: Date.now() }),
    'EX',
    86400
  );
  
  res.json({ sessionToken, did });
});

// Protected route
app.get('/api/protected', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = await redis.get(`session:${token}`);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const user = JSON.parse(session);
  res.json({ message: 'Success', user });
});
```

### Frontend

```javascript
// Request challenge
async function login(did) {
  // Get challenge
  const challengeResp = await fetch('/auth/challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ did })
  });
  const { challenge } = await challengeResp.json();
  
  // Request user to sign in wallet (this would interact with extension)
  const signature = await requestWalletSignature(challenge);
  
  // Verify signature
  const verifyResp = await fetch('/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ did, challenge, signature })
  });
  const { sessionToken } = await verifyResp.json();
  
  // Store token
  localStorage.setItem('sessionToken', sessionToken);
  
  return sessionToken;
}
```

## Security Considerations

### Challenge Requirements

✅ **Do**:
- Generate cryptographically random challenges
- Make challenges unique
- Set expiration (5 minutes recommended)
- Use challenge once only
- Clear challenge after verification

❌ **Don't**:
- Reuse challenges
- Use predictable challenges
- Allow unlimited time
- Skip verification

### Session Management

✅ **Do**:
- Use secure, random session tokens
- Set reasonable expiration (24 hours)
- Store sessions securely (Redis, database)
- Implement logout functionality
- Use HTTPS only

❌ **Don't**:
- Store sessions client-side only
- Use predictable session IDs
- Allow session reuse after logout
- Send tokens in URLs

## Future Improvements

When signature verification API is available:
- Implement actual signature verification
- Support multiple signature algorithms
- Add support for DID rotation
- Implement refresh tokens

## Related

- [Understanding DIDs →](../../getting-started-integrator/understanding-dids.md)
- [Security Best Practices →](../best-practices/security.md)
- [Code Examples →](../examples/authentication-flow.md)
