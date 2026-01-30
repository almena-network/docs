---
sidebar_position: 3
---

# Full Integration Guide

## ⚠️ Coming Soon

**Most integration features are not yet implemented.** This documentation describes the planned integration approach.

---

Complete guide to integrating all Almena ID features (planned).

## Overview

This guide walks through a complete integration that includes:
- User authentication with DIDs
- Credential issuance and verification
- Identity management
- Best practices implementation

## Integration Phases

### Phase 1: Basic Authentication (Available Now)

Implement DID-based authentication:

1. **Challenge-Response Authentication**
   - [Authentication Pattern →](./authentication.md)
   - [Complete Example →](../examples/authentication-flow.md)

2. **Session Management**
   - Store sessions securely
   - Handle token refresh
   - Implement logout

3. **Error Handling**
   - [Error Handling Best Practices →](../best-practices/error-handling.md)

### Phase 2: Identity Verification (Coming Soon)

Add identity verification:

1. **DID Resolution**
   - Resolve DIDs to public keys
   - Verify DID ownership
   - Validate signatures

2. **User Profiles**
   - Link DIDs to user accounts
   - Manage multiple DIDs per user
   - Handle DID recovery

### Phase 3: Credentials (Coming Soon)

Implement credential issuance and verification:

1. **Issue Credentials**
   - [Credential Patterns →](./credentials.md)
   - Define credential schemas
   - Sign and issue credentials

2. **Verify Credentials**
   - Check credential validity
   - Verify issuer signatures
   - Check revocation status

### Phase 4: Advanced Features (Planned)

Add advanced functionality:

1. **Zero-Knowledge Proofs**
   - Selective disclosure
   - Privacy-preserving verification
   - Attribute proofs

2. **Multi-Party Workflows**
   - Credential delegation
   - Co-signed credentials
   - Verification chains

## Architecture Examples

### Simple Integration

For basic authentication only:

```
┌─────────────┐
│   Your App  │
│             │
│  ┌───────┐  │
│  │Session│  │
│  │Manager│  │
│  └───┬───┘  │
└──────┼──────┘
       │
       ▼
┌──────────────┐      ┌─────────────┐
│  Almena API  │◄────►│ Almena ID   │
│              │      │  Wallet     │
│ • Challenge  │      │  (Browser)  │
│ • Verify     │      └─────────────┘
└──────────────┘
```

### Full Integration

With all features:

```
┌─────────────────────────────────────┐
│           Your Application          │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │   Auth   │  │Credential│        │
│  │  Module  │  │  Module  │        │
│  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼──────────────┘
        │             │
        ▼             ▼
┌────────────────────────────────┐
│       Almena ID API            │
│                                │
│  • Authentication              │
│  • DID Resolution              │
│  • Credential Issuance         │
│  • Credential Verification     │
│  • Revocation Registry         │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────┐
│   Almena Wallet    │
│                    │
│  • User's DID      │
│  • Private Keys    │
│  • Credentials     │
└────────────────────┘
```

## Implementation Checklist

### Setup Phase

- [ ] Register for API access (when available)
- [ ] Set up development environment
- [ ] Review documentation
- [ ] Test API connectivity
- [ ] Install SDKs (when available)

### Authentication Phase

- [ ] Implement challenge generation
- [ ] Set up challenge storage (Redis/database)
- [ ] Implement signature verification
- [ ] Create session management
- [ ] Add authentication middleware
- [ ] Test authentication flow
- [ ] Implement logout
- [ ] Add error handling

### Security Phase

- [ ] Implement HTTPS
- [ ] Set up rate limiting
- [ ] Add input validation
- [ ] Secure API credentials
- [ ] Implement CORS properly
- [ ] Add security headers
- [ ] Review security best practices
- [ ] Conduct security audit

### Credential Phase (When Available)

- [ ] Define credential schemas
- [ ] Implement issuance flow
- [ ] Add verification logic
- [ ] Set up revocation checking
- [ ] Test credential lifecycle
- [ ] Handle expired credentials
- [ ] Implement selective disclosure

### Production Phase

- [ ] Load testing
- [ ] Performance optimization
- [ ] Monitoring setup
- [ ] Error tracking
- [ ] Backup strategy
- [ ] Documentation for team
- [ ] User support process

## Code Organization

### Recommended Structure

```
your-app/
├── src/
│   ├── auth/
│   │   ├── almena.ts          # Almena integration
│   │   ├── session.ts         # Session management
│   │   ├── middleware.ts      # Auth middleware
│   │   └── utils.ts           # Helper functions
│   │
│   ├── credentials/           # When available
│   │   ├── issue.ts
│   │   ├── verify.ts
│   │   └── revoke.ts
│   │
│   ├── models/
│   │   └── user.ts            # User model with DID
│   │
│   └── config/
│       └── almena.ts          # API configuration
│
├── tests/
│   ├── auth.test.ts
│   └── credentials.test.ts
│
└── docs/
    └── integration.md
```

### Configuration Management

```typescript
// config/almena.ts
export const almenaConfig = {
  apiUrl: process.env.ALMENA_API_URL || 'https://api.almena.id',
  apiKey: process.env.ALMENA_API_KEY, // When required
  challengeTTL: 300, // 5 minutes
  sessionTTL: 86400, // 24 hours
  environment: process.env.NODE_ENV || 'development'
};
```

## Example: Complete Integration

### Backend Setup

```typescript
// auth/almena.ts
import crypto from 'crypto';
import Redis from 'redis';

const redis = Redis.createClient();

export class AlmenaAuth {
  // Generate authentication challenge
  async generateChallenge(did: string): Promise<string> {
    const challenge = crypto.randomBytes(32).toString('hex');
    await redis.set(
      `challenge:${did}`,
      challenge,
      'EX',
      300 // 5 minutes
    );
    return challenge;
  }
  
  // Verify signature (placeholder for actual verification)
  async verifySignature(
    did: string,
    challenge: string,
    signature: string
  ): Promise<boolean> {
    // Get stored challenge
    const storedChallenge = await redis.get(`challenge:${did}`);
    if (!storedChallenge || storedChallenge !== challenge) {
      return false;
    }
    
    // TODO: Verify signature with Almena API
    // const response = await fetch('https://api.almena.id/verify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ did, challenge, signature })
    // });
    
    // Clean up challenge
    await redis.del(`challenge:${did}`);
    
    return true; // Placeholder
  }
  
  // Create session
  async createSession(did: string): Promise<string> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      did,
      createdAt: Date.now()
    };
    
    await redis.set(
      `session:${sessionToken}`,
      JSON.stringify(sessionData),
      'EX',
      86400 // 24 hours
    );
    
    return sessionToken;
  }
  
  // Validate session
  async validateSession(token: string): Promise<string | null> {
    const sessionData = await redis.get(`session:${token}`);
    if (!sessionData) return null;
    
    const { did } = JSON.parse(sessionData);
    return did;
  }
  
  // Logout
  async destroySession(token: string): Promise<void> {
    await redis.del(`session:${token}`);
  }
}
```

### Express Middleware

```typescript
// auth/middleware.ts
import { AlmenaAuth } from './almena';

const almenaAuth = new AlmenaAuth();

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.substring(7);
  const did = await almenaAuth.validateSession(token);
  
  if (!did) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
  
  req.user = { did };
  next();
}
```

### API Routes

```typescript
// routes/auth.ts
import express from 'express';
import { AlmenaAuth } from '../auth/almena';
import { requireAuth } from '../auth/middleware';

const router = express.Router();
const almenaAuth = new AlmenaAuth();

// Request challenge
router.post('/challenge', async (req, res) => {
  const { did } = req.body;
  const challenge = await almenaAuth.generateChallenge(did);
  res.json({ challenge });
});

// Verify and login
router.post('/verify', async (req, res) => {
  const { did, challenge, signature } = req.body;
  
  const isValid = await almenaAuth.verifySignature(did, challenge, signature);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  const sessionToken = await almenaAuth.createSession(did);
  res.json({ sessionToken, did });
});

// Protected route example
router.get('/profile', requireAuth, (req, res) => {
  res.json({ did: req.user.did });
});

// Logout
router.post('/logout', requireAuth, async (req, res) => {
  const token = req.headers.authorization.substring(7);
  await almenaAuth.destroySession(token);
  res.json({ success: true });
});

export default router;
```

## Testing Strategy

### Unit Tests

```typescript
describe('AlmenaAuth', () => {
  it('should generate unique challenges', async () => {
    const challenge1 = await almenaAuth.generateChallenge('did:almena:test1');
    const challenge2 = await almenaAuth.generateChallenge('did:almena:test2');
    expect(challenge1).not.toBe(challenge2);
  });
  
  it('should validate correct signatures', async () => {
    const did = 'did:almena:test';
    const challenge = await almenaAuth.generateChallenge(did);
    const signature = 'valid-signature'; // Mock
    
    const isValid = await almenaAuth.verifySignature(did, challenge, signature);
    expect(isValid).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Auth Flow', () => {
  it('should complete full authentication', async () => {
    // Request challenge
    const challengeRes = await request(app)
      .post('/auth/challenge')
      .send({ did: 'did:almena:test' });
    
    const { challenge } = challengeRes.body;
    
    // Verify and get session
    const verifyRes = await request(app)
      .post('/auth/verify')
      .send({
        did: 'did:almena:test',
        challenge,
        signature: 'mock-signature'
      });
    
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toHaveProperty('sessionToken');
  });
});
```

## Deployment

### Environment Variables

```bash
# .env.production
ALMENA_API_URL=https://api.almena.id
ALMENA_API_KEY=your-api-key
REDIS_URL=redis://localhost:6379
NODE_ENV=production
```

### Docker Deployment

```dockerfile
FROM node:24.13-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Monitoring

### Key Metrics

Monitor these metrics:
- Authentication success/failure rate
- Challenge generation latency
- Signature verification latency
- Session creation/validation time
- API error rates

### Example Monitoring

```typescript
// metrics.ts
import prometheus from 'prom-client';

export const metrics = {
  authAttempts: new prometheus.Counter({
    name: 'almena_auth_attempts_total',
    help: 'Total authentication attempts',
    labelNames: ['status']
  }),
  
  authDuration: new prometheus.Histogram({
    name: 'almena_auth_duration_seconds',
    help: 'Authentication duration',
    buckets: [0.1, 0.5, 1, 2, 5]
  })
};
```

## Next Steps

### Immediate (Phase 1)
1. [Implement Authentication →](./authentication.md)
2. [Review Security →](../best-practices/security.md)
3. [Handle Errors →](../best-practices/error-handling.md)

### Future (Phase 2-4)
1. [Plan for Credentials →](./credentials.md)
2. [Optimize Performance →](../best-practices/performance.md)

## Support

Need integration help?
- Email: integrations@almena.id
- [Integrator FAQ →](../../faq-integrator/api.md)
- [API Reference →](../../api-reference/endpoints/health.md)

## Community

Share your integration:
- Showcase your app (coming soon)
- Share best practices
- Help other integrators

---

**Note**: This guide is continuously updated. Check back for new features and patterns.
