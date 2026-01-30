---
sidebar_position: 2
---

# Error Handling Best Practices

Robust error handling strategies for Almena ID integration.

## Error Handling Philosophy

Good error handling should:
- **Fail gracefully** - Don't crash your app
- **Be informative** - Log details for debugging
- **Be user-friendly** - Show clear messages to users
- **Be actionable** - Tell users what to do next

## HTTP Error Handling

### Status Code Handling

```javascript
async function callAlmenaAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`https://api.almena.id${endpoint}`, options);
    
    // Handle different status codes
    switch (response.status) {
      case 200:
      case 201:
        return await response.json();
      
      case 400:
        const error = await response.json();
        throw new BadRequestError(error.detail);
      
      case 401:
        throw new UnauthorizedError('Authentication required');
      
      case 403:
        throw new ForbiddenError('Insufficient permissions');
      
      case 404:
        throw new NotFoundError('Resource not found');
      
      case 429:
        throw new RateLimitError('Too many requests');
      
      case 500:
      case 502:
      case 503:
        throw new ServerError('Server error, please try again');
      
      default:
        throw new APIError(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('Cannot connect to Almena API');
    }
    throw error;
  }
}
```

### Custom Error Classes

```javascript
class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

class BadRequestError extends APIError {
  constructor(message) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

class UnauthorizedError extends APIError {
  constructor(message) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class RateLimitError extends APIError {
  constructor(message) {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

## Retry Logic

### Exponential Backoff

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      // Retry server errors (5xx) and rate limits
      if (response.ok || attempt === maxRetries - 1) {
        return response;
      }
      
      // Calculate backoff delay
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await sleep(delay);
      
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await sleep(delay);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Retry with Jitter

```javascript
async function fetchWithJitter(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (attempt < maxRetries - 1) {
        // Add random jitter to prevent thundering herd
        const baseDelay = 1000 * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        await sleep(baseDelay + jitter);
      }
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const baseDelay = 1000 * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      await sleep(baseDelay + jitter);
    }
  }
}
```

## Timeout Handling

### Request Timeout

```javascript
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
```

## Validation Errors

### Input Validation

```javascript
function validateDID(did) {
  if (!did) {
    throw new ValidationError('DID is required');
  }
  
  if (typeof did !== 'string') {
    throw new ValidationError('DID must be a string');
  }
  
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  if (!pattern.test(did)) {
    throw new ValidationError(
      'Invalid DID format. Expected: did:almena:{32 hex chars}'
    );
  }
  
  return true;
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Logging

### Structured Logging

```javascript
class Logger {
  static error(message, context = {}) {
    console.error({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...context
    });
  }
  
  static warn(message, context = {}) {
    console.warn({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...context
    });
  }
  
  static info(message, context = {}) {
    console.log({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...context
    });
  }
}

// Usage
try {
  await callAlmenaAPI('/endpoint');
} catch (error) {
  Logger.error('API call failed', {
    endpoint: '/endpoint',
    error: error.message,
    statusCode: error.statusCode
  });
}
```

### What to Log

✅ **Do log**:
- Error messages
- Request/response status codes
- Timestamps
- User-facing error codes
- Stack traces (in development)

❌ **Never log**:
- API keys
- Session tokens
- Passwords
- Recovery phrases
- Signatures
- Full request/response bodies (may contain sensitive data)

## User-Facing Messages

### Error Message Guidelines

```javascript
function getUserMessage(error) {
  // Map technical errors to user-friendly messages
  const messages = {
    NetworkError: 'Unable to connect. Please check your internet connection.',
    UnauthorizedError: 'Your session has expired. Please log in again.',
    RateLimitError: 'Too many requests. Please wait a moment and try again.',
    ServerError: 'Something went wrong on our end. Please try again later.',
    ValidationError: error.message, // Validation messages are already user-friendly
    default: 'An unexpected error occurred. Please try again.'
  };
  
  return messages[error.name] || messages.default;
}

// Usage
try {
  await authenticateUser(did);
} catch (error) {
  Logger.error('Authentication failed', { error: error.message });
  showUserError(getUserMessage(error));
}
```

## Circuit Breaker Pattern

### Prevent Cascade Failures

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Usage
const breaker = new CircuitBreaker();

async function callAPI() {
  return breaker.execute(async () => {
    return await fetch('https://api.almena.id/endpoint');
  });
}
```

## Error Recovery

### Graceful Degradation

```javascript
async function authenticateWithFallback(did) {
  try {
    // Try primary authentication method
    return await authenticateWithAlmena(did);
  } catch (error) {
    Logger.warn('Primary auth failed, trying fallback', { error });
    
    try {
      // Fallback to cached authentication
      return await authenticateFromCache(did);
    } catch (fallbackError) {
      Logger.error('All auth methods failed', { fallbackError });
      throw new Error('Authentication unavailable');
    }
  }
}
```

## Testing Error Handling

### Mock Errors

```javascript
// Test helper
function mockAPIError(statusCode) {
  return Promise.reject({
    status: statusCode,
    json: () => Promise.resolve({ detail: 'Test error' })
  });
}

// Tests
describe('Error Handling', () => {
  it('should handle 401 errors', async () => {
    global.fetch = jest.fn(() => mockAPIError(401));
    
    await expect(callAlmenaAPI('/endpoint'))
      .rejects
      .toThrow(UnauthorizedError);
  });
  
  it('should retry on 500 errors', async () => {
    global.fetch = jest.fn()
      .mockRejectedValueOnce(mockAPIError(500))
      .mockRejectedValueOnce(mockAPIError(500))
      .mockResolvedValue({ ok: true, json: () => ({}) });
    
    await fetchWithRetry('https://api.almena.id/endpoint');
    
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
```

## Best Practices Summary

### ✅ Do

- Handle all error types explicitly
- Use custom error classes
- Implement retry logic with backoff
- Log errors with context
- Show user-friendly messages
- Validate inputs before API calls
- Set reasonable timeouts
- Test error scenarios

### ❌ Don't

- Swallow errors silently
- Show technical errors to users
- Log sensitive information
- Retry indefinitely
- Use same timeout for all requests
- Ignore validation errors
- Skip error handling in async code

## Next Steps

- [Security Best Practices →](./security.md)
- [Performance →](./performance.md)
- [Complete Example →](../examples/authentication-flow.md)

## Support

Questions about error handling?
- Email: integrations@almena.id
- [Integrator FAQ →](../../faq-integrator/api.md)
