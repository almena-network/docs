---
sidebar_position: 1
---

# Health Check

Check if the Almena ID API is running and responding.

## Endpoint

```http
GET /health
```

**Base URL**: `https://api.almena.id`

**Full URL**: `https://api.almena.id/health`

## Request

### Headers

No special headers required.

### Parameters

None.

### Request Body

None.

## Response

### Success Response

**Status Code**: `200 OK`

**Response Body**:
```json
{
  "status": "ok"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | API status. Value: `"ok"` when operational |

## Examples

### cURL

```bash
curl https://api.almena.id/health
```

### JavaScript (Fetch)

```javascript
const checkHealth = async () => {
  const response = await fetch('https://api.almena.id/health');
  const data = await response.json();
  console.log(data.status); // "ok"
  return data;
};

checkHealth();
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const checkHealth = async () => {
  const response = await axios.get('https://api.almena.id/health');
  console.log(response.data.status); // "ok"
  return response.data;
};

checkHealth();
```

### Python (requests)

```python
import requests

def check_health():
    response = requests.get('https://api.almena.id/health')
    data = response.json()
    print(data['status'])  # "ok"
    return data

check_health()
```

### Python (httpx)

```python
import httpx

async def check_health():
    async with httpx.AsyncClient() as client:
        response = await client.get('https://api.almena.id/health')
        data = response.json()
        print(data['status'])  # "ok"
        return data

# Run with: asyncio.run(check_health())
```

## Use Cases

### Monitoring

Use this endpoint to monitor API availability:

```javascript
// Check every 30 seconds
setInterval(async () => {
  try {
    const response = await fetch('https://api.almena.id/health');
    if (response.ok) {
      console.log('API is healthy');
    } else {
      console.error('API returned error status');
    }
  } catch (error) {
    console.error('API is unreachable', error);
  }
}, 30000);
```

### Health Checks in Applications

Include in your application's health check:

```javascript
app.get('/health', async (req, res) => {
  try {
    // Check Almena API
    const almenaHealth = await fetch('https://api.almena.id/health');
    const almenaData = await almenaHealth.json();
    
    if (almenaData.status === 'ok') {
      res.json({ status: 'ok', almena: 'connected' });
    } else {
      res.status(503).json({ status: 'degraded', almena: 'unhealthy' });
    }
  } catch (error) {
    res.status(503).json({ status: 'degraded', almena: 'unreachable' });
  }
});
```

## Error Responses

### Network Error

If the API is unreachable:
- No HTTP response
- Connection timeout
- DNS resolution failure

**Handle in your code**:

```javascript
try {
  const response = await fetch('https://api.almena.id/health', {
    timeout: 5000 // 5 second timeout
  });
  // Handle response
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Request timed out');
  } else {
    console.error('Network error:', error.message);
  }
}
```

## Rate Limiting

The health check endpoint is not rate limited.

## Best Practices

### ✅ Do

- Use for monitoring and alerting
- Include in your health check endpoints
- Set reasonable timeout values (5-10 seconds)
- Log failures for debugging

### ❌ Don't

- Rely on this for authentication checks
- Call excessively (keep to reasonable intervals like 30-60 seconds)
- Use as a ping endpoint (it's for health checks specifically)

## Related Endpoints

- [Root Endpoint →](./root.md) - API information endpoint
- [Status Page →](#) - Detailed status page (coming soon)

## Support

If the health check consistently fails:
- Check [status.almena.id](https://status.almena.id) (when available)
- Contact support@almena.id
- Check [GitHub Status](https://github.com/almena-id)
