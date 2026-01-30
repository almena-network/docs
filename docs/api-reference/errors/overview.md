---
sidebar_position: 1
---

# Error Handling

Understanding API errors and how to handle them.

## Error Response Format

All Almena ID API errors follow a consistent format:

```json
{
  "detail": "Error message description"
}
```

## HTTP Status Codes

| Status Code | Meaning | Description |
|------------|---------|-------------|
| `200 OK` | Success | Request completed successfully |
| `201 Created` | Created | Resource created successfully |
| `400 Bad Request` | Client Error | Invalid request parameters |
| `401 Unauthorized` | Auth Required | Authentication required or failed |
| `403 Forbidden` | Forbidden | Insufficient permissions |
| `404 Not Found` | Not Found | Resource doesn't exist |
| `422 Unprocessable Entity` | Validation Error | Request validation failed |
| `429 Too Many Requests` | Rate Limited | Too many requests, slow down |
| `500 Internal Server Error` | Server Error | Unexpected server error |
| `503 Service Unavailable` | Unavailable | Service temporarily unavailable |

## Error Handling Examples

### JavaScript (Fetch)

```javascript
try {
  const response = await fetch('https://api.almena.id/endpoint');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Request failed');
  }
  
  const data = await response.json();
  // Handle success
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error
}
```

### JavaScript (Axios)

```javascript
try {
  const response = await axios.get('https://api.almena.id/endpoint');
  // Handle success
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('Status:', error.response.status);
    console.error('Error:', error.response.data.detail);
  } else if (error.request) {
    // No response received
    console.error('Network error: No response');
  } else {
    // Request setup error
    console.error('Error:', error.message);
  }
}
```

### Python

```python
import requests

try:
    response = requests.get('https://api.almena.id/endpoint')
    response.raise_for_status()  # Raises exception for 4xx/5xx
    data = response.json()
    # Handle success
except requests.exceptions.HTTPError as e:
    error_detail = e.response.json().get('detail', 'Unknown error')
    print(f'HTTP Error: {e.response.status_code} - {error_detail}')
except requests.exceptions.ConnectionError:
    print('Connection error')
except requests.exceptions.Timeout:
    print('Request timeout')
except requests.exceptions.RequestException as e:
    print(f'Error: {e}')
```

## Retry Logic

Implement exponential backoff for failed requests:

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (!response.ok && response.status >= 500) {
        // Server error - retry
        if (i === maxRetries - 1) throw new Error('Max retries reached');
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## Best Practices

### ✅ Do

- Check HTTP status codes
- Parse error messages
- Implement retry logic with exponential backoff
- Log errors for debugging
- Show user-friendly messages to end users

### ❌ Don't

- Ignore error responses
- Retry indefinitely
- Show technical error messages to users
- Skip error handling

## Next Steps

- [API Reference →](../endpoints/health.md)
- [Best Practices →](../../integrator-guide/best-practices/security.md)

More error documentation will be added as endpoints are implemented.
