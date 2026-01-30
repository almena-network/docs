---
sidebar_position: 2
---

# Root Endpoint

Get information about the Almena ID API.

## Endpoint

```http
GET /
```

**Base URL**: `https://api.almena.id`

**Full URL**: `https://api.almena.id/`

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
  "name": "Almena ID API",
  "version": "1.0.0",
  "description": "Decentralized identity platform API"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | API name |
| `version` | string | Current API version |
| `description` | string | Brief API description |

## Examples

### cURL

```bash
curl https://api.almena.id/
```

### JavaScript (Fetch)

```javascript
const getAPIInfo = async () => {
  const response = await fetch('https://api.almena.id/');
  const data = await response.json();
  console.log(data.name);    // "Almena ID API"
  console.log(data.version); // "1.0.0"
  return data;
};

getAPIInfo();
```

### Python (requests)

```python
import requests

def get_api_info():
    response = requests.get('https://api.almena.id/')
    data = response.json()
    print(f"{data['name']} v{data['version']}")
    return data

get_api_info()
```

## Use Cases

Use this endpoint to:
- Verify API version before making requests
- Display API information in your application
- Check compatibility with expected version

## Related Endpoints

- [Health Check →](./health.md) - API health status

## Support

For API version compatibility questions:
- Email: integrations@almena.id
- Documentation: [docs.almena.id](https://docs.almena.id)
