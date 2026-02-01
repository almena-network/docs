---
sidebar_position: 2
---

# Root Endpoint

Get information about the Almena ID API.

## Endpoint

```http
GET /api/v1/
```

**Base URL**: `https://api.almena.id`

**Full URL**: `https://api.almena.id/api/v1/`

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
  "message": "Welcome to Almena Portal API",
  "status": "running"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Welcome message |
| `status` | string | API status. Value: `"running"` when operational |

## Examples

### cURL

```bash
curl https://api.almena.id/api/v1/
```

### JavaScript (Fetch)

```javascript
const getAPIInfo = async () => {
  const response = await fetch('https://api.almena.id/api/v1/');
  const data = await response.json();
  console.log(data.message); // "Welcome to Almena Portal API"
  console.log(data.status);  // "running"
  return data;
};

getAPIInfo();
```

### Python (requests)

```python
import requests

def get_api_info():
    response = requests.get('https://api.almena.id/api/v1/')
    data = response.json()
    print(data['message'])  # "Welcome to Almena Portal API"
    print(data['status'])   # "running"
    return data

get_api_info()
```

## Use Cases

Use this endpoint to:
- Verify API is reachable and running
- Display welcome message in your application
- Confirm API base URL is correct

## Related Endpoints

- [Health Check →](./health.md) - API health status

## Support

For API version compatibility questions:
- Email: integrations@almena.id
- Documentation: [docs.almena.id](https://docs.almena.id)
