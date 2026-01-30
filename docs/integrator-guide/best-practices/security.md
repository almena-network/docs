---
sidebar_position: 1
---

# Security Best Practices

Essential security guidelines for integrating Almena ID.

## API Key Management

### ✅ Do

- Store API keys in environment variables
- Rotate keys regularly (every 90 days recommended)
- Use different keys for different environments (dev, staging, production)
- Restrict API key permissions to minimum required

### ❌ Don't

- Commit API keys to version control
- Share API keys in logs or error messages
- Use production keys in development
- Hardcode keys in source code

## Challenge-Response Security

When implementing authentication:

### Generate Secure Challenges

```javascript
// ✅ Good: Cryptographically random
const challenge = crypto.randomBytes(32).toString('hex');

// ❌ Bad: Predictable
const challenge = Date.now().toString();
```

### Set Appropriate Timeouts

```javascript
// ✅ Good: 5 minute expiration
await redis.set(`challenge:${did}`, challenge, 'EX', 300);

// ❌ Bad: No expiration
await redis.set(`challenge:${did}`, challenge);
```

### Use Once Only

```javascript
// ✅ Good: Delete after verification
await redis.del(`challenge:${did}`);

// ❌ Bad: Allow reuse
// Challenge stays in storage
```

## Signature Verification

Always verify signatures before trusting:

```javascript
// ❌ Bad: Trust without verification
const { did } = req.body;
createSession(did);

// ✅ Good: Verify signature
const { did, challenge, signature } = req.body;
const isValid = await verifySignature(did, challenge, signature);
if (isValid) {
  createSession(did);
}
```

## Session Management

### Session Tokens

```javascript
// ✅ Good: Random, unique tokens
const sessionToken = crypto.randomBytes(32).toString('hex');

// ❌ Bad: Predictable tokens
const sessionToken = userId + Date.now();
```

### Session Storage

```javascript
// ✅ Good: Server-side storage with expiration
await redis.set(`session:${token}`, userData, 'EX', 86400);

// ❌ Bad: Client-side only
localStorage.setItem('session', JSON.stringify(userData));
```

## Data Validation

### Validate All Inputs

```javascript
// ✅ Good: Validate DID format
if (!/^did:almena:[a-f0-9]{32}$/.test(did)) {
  return res.status(400).json({ error: 'Invalid DID' });
}

// ❌ Bad: No validation
const user = await db.users.findOne({ did: req.body.did });
```

## HTTPS Only

### Enforce HTTPS

```javascript
// ✅ Good: Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.protocol !== 'https') {
    return res.redirect('https://' + req.hostname + req.url);
  }
  next();
});
```

## Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Logging

### What to Log

✅ Log:
- Authentication attempts (success/failure)
- API requests (without sensitive data)
- Error messages
- Rate limit violations

❌ Never log:
- API keys
- Session tokens
- User passwords
- Challenge strings
- Signatures

## Next Steps

- [Error Handling →](./error-handling.md)
- [Performance →](./performance.md)
- [Authentication Pattern →](../integration-patterns/authentication.md)

More best practices documentation coming soon.
