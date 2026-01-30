---
sidebar_position: 1
---

# Complete Authentication Flow

## ⚠️ Coming Soon

**This feature is not yet implemented.** This documentation shows how authentication will work when the feature is available.

---

A production-ready example of DID-based authentication (planned implementation).

## Overview

This example shows a complete implementation of DID-based authentication with:
- Challenge generation and storage
- Signature verification (placeholder)
- Session management
- Error handling

## Backend Implementation

### Dependencies

```bash
npm install express redis crypto
```

### Complete Server

```javascript
const express = require('express');
const crypto = require('crypto');
const redis = require('redis').createClient();

const app = express();
app.use(express.json());

// Middleware to verify DID format
function validateDID(req, res, next) {
  const { did } = req.body;
  if (!/^did:almena:[a-f0-9]{32}$/.test(did)) {
    return res.status(400).json({ error: 'Invalid DID format' });
  }
  next();
}

// Step 1: Request authentication challenge
app.post('/auth/challenge', validateDID, async (req, res) => {
  try {
    const { did } = req.body;
    
    // Generate random challenge
    const challenge = crypto.randomBytes(32).toString('hex');
    
    // Store challenge with 5 minute expiration
    await redis.set(
      `challenge:${did}`,
      challenge,
      'EX',
      300
    );
    
    res.json({
      challenge,
      expiresIn: 300,
      message: 'Sign this challenge with your Almena ID wallet'
    });
  } catch (error) {
    console.error('Challenge generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Step 2: Verify signature and create session
app.post('/auth/verify', validateDID, async (req, res) => {
  try {
    const { did, challenge, signature } = req.body;
    
    // Validate required fields
    if (!challenge || !signature) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }
    
    // Verify challenge exists and matches
    const storedChallenge = await redis.get(`challenge:${did}`);
    if (!storedChallenge) {
      return res.status(400).json({ 
        error: 'Challenge not found or expired' 
      });
    }
    
    if (storedChallenge !== challenge) {
      return res.status(400).json({ 
        error: 'Challenge mismatch' 
      });
    }
    
    // TODO: Verify signature with Almena API
    // For now, we'll simulate verification
    const isValid = await verifySignature(did, challenge, signature);
    
    if (!isValid) {
      // Clean up failed challenge
      await redis.del(`challenge:${did}`);
      return res.status(401).json({ 
        error: 'Invalid signature' 
      });
    }
    
    // Clean up used challenge
    await redis.del(`challenge:${did}`);
    
    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      did,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    await redis.set(
      `session:${sessionToken}`,
      JSON.stringify(sessionData),
      'EX',
      86400 // 24 hours
    );
    
    res.json({
      success: true,
      sessionToken,
      did,
      expiresIn: 86400
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware to require authentication
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.substring(7);
    const sessionData = await redis.get(`session:${token}`);
    
    if (!sessionData) {
      return res.status(401).json({ 
        error: 'Invalid or expired session' 
      });
    }
    
    req.user = JSON.parse(sessionData);
    
    // Check if session is expired
    if (req.user.expiresAt < Date.now()) {
      await redis.del(`session:${token}`);
      return res.status(401).json({ error: 'Session expired' });
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Protected route example
app.get('/api/profile', requireAuth, async (req, res) => {
  res.json({
    did: req.user.did,
    createdAt: req.user.createdAt
  });
});

// Logout endpoint
app.post('/auth/logout', requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.substring(7);
    await redis.del(`session:${token}`);
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Placeholder for signature verification
// This will use Almena API when available
async function verifySignature(did, challenge, signature) {
  // TODO: Call Almena ID API to verify signature
  // const response = await fetch('https://api.almena.id/verify-signature', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ did, challenge, signature })
  // });
  // return response.ok;
  
  // For now, simulate verification
  console.log('Simulating signature verification for DID:', did);
  return true; // In production, this must verify the actual signature
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Frontend Implementation

```javascript
class AlmenaAuth {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }
  
  // Request authentication challenge
  async requestChallenge(did) {
    const response = await fetch(`${this.apiUrl}/auth/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to request challenge');
    }
    
    return await response.json();
  }
  
  // Verify signature and get session token
  async verifySignature(did, challenge, signature) {
    const response = await fetch(`${this.apiUrl}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did, challenge, signature })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verification failed');
    }
    
    return await response.json();
  }
  
  // Make authenticated request
  async authenticatedRequest(endpoint, token, options = {}) {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired');
      }
      throw new Error('Request failed');
    }
    
    return await response.json();
  }
  
  // Logout
  async logout(token) {
    const response = await fetch(`${this.apiUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  }
}

// Usage example
async function loginWithAlmenaID() {
  const auth = new AlmenaAuth('http://localhost:3000');
  
  try {
    // 1. Get user's DID
    const did = document.getElementById('did-input').value;
    
    // 2. Request challenge
    const { challenge } = await auth.requestChallenge(did);
    
    // 3. Request user to sign challenge in their wallet
    // This would interact with the Almena ID extension
    const signature = await requestWalletSignature(challenge);
    
    // 4. Verify signature
    const { sessionToken } = await auth.verifySignature(
      did,
      challenge,
      signature
    );
    
    // 5. Store session token
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('did', did);
    
    // 6. Redirect to dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed: ' + error.message);
  }
}
```

## Testing

### Test with cURL

```bash
# 1. Request challenge
curl -X POST http://localhost:3000/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{"did":"did:almena:a1b2c3d4e5f6789012345678901234"}'

# 2. Verify signature (using challenge from step 1)
curl -X POST http://localhost:3000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "did":"did:almena:a1b2c3d4e5f6789012345678901234",
    "challenge":"<challenge-from-step-1>",
    "signature":"<user-signature>"
  }'

# 3. Access protected route (using token from step 2)
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer <session-token>"

# 4. Logout
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <session-token>"
```

## Next Steps

- [Authentication Pattern →](../integration-patterns/authentication.md)
- [Security Best Practices →](../best-practices/security.md)
- [Error Handling →](../best-practices/error-handling.md)

More examples coming soon.
