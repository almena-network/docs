---
sidebar_position: 3
---

# Performance Best Practices

Optimize your Almena ID integration for speed and efficiency.

## Caching Strategies

### Cache DID Resolutions

```javascript
const didCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

async function resolveDID(did) {
  // Check cache first
  const cached = didCache.get(did);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Fetch from API
  const data = await fetch(`https://api.almena.id/did/${did}`);
  const resolved = await data.json();
  
  // Cache result
  didCache.set(did, {
    data: resolved,
    timestamp: Date.now()
  });
  
  return resolved;
}
```

### Cache Challenges

```javascript
// In-memory cache for challenges (server-side)
const redis = require('redis').createClient();

async function cacheChallenge(did, challenge, ttl = 300) {
  await redis.set(
    `challenge:${did}`,
    challenge,
    'EX',
    ttl
  );
}

async function getChallengeFromCache(did) {
  return await redis.get(`challenge:${did}`);
}
```

## Connection Pooling

### HTTP/2 Keep-Alive

```javascript
const http2 = require('http2');

// Reuse connections
const client = http2.connect('https://api.almena.id');

async function makeRequest(path) {
  const req = client.request({
    ':path': path,
    ':method': 'GET'
  });
  
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(JSON.parse(data)));
    req.on('error', reject);
  });
}
```

## Batch Requests

### Verify Multiple DIDs

```javascript
// Instead of individual requests
async function verifyDIDsSequential(dids) {
  const results = [];
  for (const did of dids) {
    results.push(await verifyDID(did)); // Slow!
  }
  return results;
}

// Use Promise.all for parallel requests
async function verifyDIDsParallel(dids) {
  return await Promise.all(
    dids.map(did => verifyDID(did))
  );
}

// Or use batch API endpoint (when available)
async function verifyDIDsBatch(dids) {
  const response = await fetch('https://api.almena.id/verify-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dids })
  });
  return await response.json();
}
```

## Request Optimization

### Minimize Payload Size

```javascript
// ❌ Bad: Send unnecessary data
await fetch('/api/authenticate', {
  method: 'POST',
  body: JSON.stringify({
    did: 'did:almena:abc123...',
    challenge: 'challenge123',
    signature: 'sig123',
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    // ... unnecessary fields
  })
});

// ✅ Good: Send only required data
await fetch('/api/authenticate', {
  method: 'POST',
  body: JSON.stringify({
    did: 'did:almena:abc123...',
    challenge: 'challenge123',
    signature: 'sig123'
  })
});
```

### Compress Requests

```javascript
const pako = require('pako');

async function sendCompressed(url, data) {
  const compressed = pako.gzip(JSON.stringify(data));
  
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip'
    },
    body: compressed
  });
}
```

## Database Optimization

### Index DID Column

```sql
-- Create index for faster DID lookups
CREATE INDEX idx_users_did ON users(did);

-- Composite index for common queries
CREATE INDEX idx_users_did_status ON users(did, status);
```

### Use Connection Pooling

```javascript
const { Pool } = require('pg');

// Create pool (reuse connections)
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use pool for queries
async function getUserByDID(did) {
  const result = await pool.query(
    'SELECT * FROM users WHERE did = $1',
    [did]
  );
  return result.rows[0];
}
```

## Client-Side Optimization

### Lazy Load SDK

```javascript
// Only load when needed
async function getAlmenaSDK() {
  if (!window.almenaSDK) {
    window.almenaSDK = await import('./almena-sdk');
  }
  return window.almenaSDK;
}
```

### Debounce API Calls

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage: Don't validate on every keystroke
const validateDIDDebounced = debounce(async (did) => {
  const isValid = await validateDID(did);
  updateUI(isValid);
}, 500);
```

### Use Web Workers

```javascript
// crypto-worker.js
self.addEventListener('message', async (e) => {
  const { did, challenge, signature } = e.data;
  
  // Heavy cryptographic operation
  const isValid = await verifySignature(did, challenge, signature);
  
  self.postMessage({ isValid });
});

// main.js
const worker = new Worker('crypto-worker.js');

function verifyInBackground(did, challenge, signature) {
  return new Promise((resolve) => {
    worker.onmessage = (e) => resolve(e.data.isValid);
    worker.postMessage({ did, challenge, signature });
  });
}
```

## API Rate Limiting

### Client-Side Rate Limiter

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  async throttle() {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle();
    }
    
    this.requests.push(now);
  }
}

// Usage: Max 100 requests per minute
const limiter = new RateLimiter(100, 60000);

async function callAPI(endpoint) {
  await limiter.throttle();
  return await fetch(endpoint);
}
```

## Monitoring

### Track Performance Metrics

```javascript
class PerformanceMonitor {
  static async measureAPICall(fn, name) {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.log({
        name,
        duration,
        status: 'success',
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.log({
        name,
        duration,
        status: 'error',
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  static log(metric) {
    console.log('[Performance]', metric);
    // Send to analytics service
  }
}

// Usage
const data = await PerformanceMonitor.measureAPICall(
  () => fetch('https://api.almena.id/endpoint'),
  'API Call'
);
```

## CDN and Caching

### Cache Static Resources

```javascript
// Service Worker for offline caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('almena-v1').then((cache) => {
      return cache.addAll([
        '/almena-sdk.js',
        '/styles.css',
        '/icons.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## Optimizing Cryptographic Operations

### Reuse Key Pairs

```javascript
// ❌ Bad: Generate new keys every time
async function signChallenge(challenge) {
  const keyPair = await generateKeyPair(); // Expensive!
  return sign(challenge, keyPair.privateKey);
}

// ✅ Good: Reuse keys
let cachedKeyPair;

async function signChallenge(challenge) {
  if (!cachedKeyPair) {
    cachedKeyPair = await generateKeyPair();
  }
  return sign(challenge, cachedKeyPair.privateKey);
}
```

## Load Testing

### Test Your Integration

```javascript
const autocannon = require('autocannon');

// Load test your endpoint
autocannon({
  url: 'http://localhost:3000/auth/verify',
  connections: 100,
  duration: 30,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    did: 'did:almena:test123...',
    challenge: 'challenge',
    signature: 'signature'
  })
}, (err, result) => {
  console.log('Requests per second:', result.requests.average);
  console.log('Latency p99:', result.latency.p99);
});
```

## Best Practices Summary

### ✅ Do

- Cache frequently accessed data
- Use connection pooling
- Batch API requests when possible
- Index database columns properly
- Compress large payloads
- Monitor performance metrics
- Load test your integration
- Use CDN for static assets

### ❌ Don't

- Make unnecessary API calls
- Fetch same data repeatedly
- Block UI with crypto operations
- Send large unnecessary payloads
- Skip database indexes
- Ignore rate limits
- Guess at bottlenecks (measure!)

## Performance Checklist

Before going to production:

- [ ] Implemented caching strategy
- [ ] Database properly indexed
- [ ] Connection pooling configured
- [ ] Rate limiting in place
- [ ] Load testing completed
- [ ] Monitoring set up
- [ ] CDN configured for static assets
- [ ] Heavy operations moved to background
- [ ] Batch operations where possible
- [ ] Compression enabled

## Next Steps

- [Security Best Practices →](./security.md)
- [Error Handling →](./error-handling.md)
- [Complete Example →](../examples/authentication-flow.md)

## Support

Performance questions?
- Email: integrations@almena.id
- [Integrator FAQ →](../../faq-integrator/api.md)
