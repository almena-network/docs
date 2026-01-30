---
sidebar_position: 1
---

# Getting Started Tutorial

## Currently Available

Right now, you can:
- ✅ Test the API health check endpoint
- ✅ Validate DID formats
- ✅ Prepare your integration infrastructure

## Coming Soon

Authentication and identity verification endpoints are in development.

---

Step-by-step tutorial to integrate Almena ID into your application.

## Overview

In this tutorial, you'll learn how to:
1. Set up your development environment
2. Make your first API call
3. Implement basic DID validation
4. Prepare for authentication integration

## Prerequisites

- Node.js 20+ or Python 3.12+
- Basic understanding of REST APIs
- Text editor or IDE

## Step 1: Test API Connection

Let's verify you can connect to the Almena ID API.

### Using JavaScript

Create a file `test-api.js`:

```javascript
async function testAlmenaAPI() {
  try {
    const response = await fetch('https://api.almena.id/health');
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ Successfully connected to Almena ID API');
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to connect:', error.message);
    return false;
  }
}

testAlmenaAPI();
```

Run it:
```bash
node test-api.js
```

### Using Python

Create a file `test_api.py`:

```python
import requests

def test_almena_api():
    try:
        response = requests.get('https://api.almena.id/health')
        data = response.json()
        
        if data['status'] == 'ok':
            print('✅ Successfully connected to Almena ID API')
            return True
    except Exception as e:
        print(f'❌ Failed to connect: {e}')
        return False

test_almena_api()
```

Run it:
```bash
python test_api.py
```

## Step 2: Validate DID Format

Create a DID validation function.

### JavaScript

```javascript
function isValidAlmenaDID(did) {
  // DID format: did:almena:32-character-hex
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  return pattern.test(did);
}

// Test it
const testDIDs = [
  'did:almena:a1b2c3d4e5f6789012345678901234', // Valid
  'did:almena:invalid',                        // Invalid
  'did:other:a1b2c3d4e5f6789012345678901234'  // Wrong method
];

testDIDs.forEach(did => {
  console.log(`${did}: ${isValidAlmenaDID(did) ? '✅' : '❌'}`);
});
```

### Python

```python
import re

def is_valid_almena_did(did):
    """Validate Almena DID format"""
    pattern = r'^did:almena:[a-f0-9]{32}$'
    return bool(re.match(pattern, did))

# Test it
test_dids = [
    'did:almena:a1b2c3d4e5f6789012345678901234',  # Valid
    'did:almena:invalid',                         # Invalid
    'did:other:a1b2c3d4e5f6789012345678901234'   # Wrong method
]

for did in test_dids:
    status = '✅' if is_valid_almena_did(did) else '❌'
    print(f'{did}: {status}')
```

## Step 3: Create Helper Module

Organize your code into a reusable module.

### JavaScript Module

Create `almena-client.js`:

```javascript
class AlmenaClient {
  constructor(apiUrl = 'https://api.almena.id') {
    this.apiUrl = apiUrl;
  }
  
  async checkHealth() {
    const response = await fetch(`${this.apiUrl}/health`);
    return await response.json();
  }
  
  validateDID(did) {
    const pattern = /^did:almena:[a-f0-9]{32}$/;
    return pattern.test(did);
  }
  
  shortenDID(did) {
    if (!this.validateDID(did)) {
      throw new Error('Invalid DID format');
    }
    const prefix = did.substring(0, 18); // "did:almena:a1b2..."
    const suffix = did.slice(-4);        // "...1234"
    return `${prefix}...${suffix}`;
  }
}

// Export for use in other files
module.exports = AlmenaClient;

// Usage example
const client = new AlmenaClient();
console.log(await client.checkHealth());
console.log(client.validateDID('did:almena:' + 'a'.repeat(32)));
console.log(client.shortenDID('did:almena:' + 'a1b2c3d4'.repeat(4)));
```

### Python Module

Create `almena_client.py`:

```python
import re
import requests

class AlmenaClient:
    def __init__(self, api_url='https://api.almena.id'):
        self.api_url = api_url
    
    def check_health(self):
        """Check API health"""
        response = requests.get(f'{self.api_url}/health')
        return response.json()
    
    def validate_did(self, did):
        """Validate DID format"""
        pattern = r'^did:almena:[a-f0-9]{32}$'
        return bool(re.match(pattern, did))
    
    def shorten_did(self, did):
        """Shorten DID for display"""
        if not self.validate_did(did):
            raise ValueError('Invalid DID format')
        prefix = did[:18]  # "did:almena:a1b2..."
        suffix = did[-4:]  # "...1234"
        return f'{prefix}...{suffix}'

# Usage example
if __name__ == '__main__':
    client = AlmenaClient()
    print(client.check_health())
    print(client.validate_did('did:almena:' + 'a' * 32))
    print(client.shorten_did('did:almena:' + 'a1b2c3d4' * 4))
```

## Step 4: Build a Simple UI

Create a basic HTML page to test your integration.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Almena ID Integration Test</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      box-sizing: border-box;
    }
    button {
      background: #ff6b35;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background: #ff5722;
    }
    .result {
      margin-top: 20px;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 5px;
    }
    .error { background: #ffebee; color: #c62828; }
    .success { background: #e8f5e9; color: #2e7d32; }
  </style>
</head>
<body>
  <h1>Almena ID Integration Test</h1>
  
  <h2>1. Test API Connection</h2>
  <button onclick="testAPI()">Test API</button>
  <div id="api-result" class="result" style="display:none"></div>
  
  <h2>2. Validate DID</h2>
  <input 
    type="text" 
    id="did-input" 
    placeholder="Enter DID (e.g., did:almena:abc123...)"
  />
  <button onclick="validateDID()">Validate</button>
  <div id="did-result" class="result" style="display:none"></div>
  
  <script>
    async function testAPI() {
      const resultDiv = document.getElementById('api-result');
      resultDiv.style.display = 'block';
      resultDiv.textContent = 'Testing...';
      resultDiv.className = 'result';
      
      try {
        const response = await fetch('https://api.almena.id/health');
        const data = await response.json();
        
        if (data.status === 'ok') {
          resultDiv.textContent = '✅ API is reachable and healthy';
          resultDiv.classList.add('success');
        } else {
          resultDiv.textContent = '❌ API returned unexpected response';
          resultDiv.classList.add('error');
        }
      } catch (error) {
        resultDiv.textContent = '❌ Failed to connect: ' + error.message;
        resultDiv.classList.add('error');
      }
    }
    
    function validateDID() {
      const input = document.getElementById('did-input');
      const resultDiv = document.getElementById('did-result');
      const did = input.value.trim();
      
      resultDiv.style.display = 'block';
      resultDiv.className = 'result';
      
      const pattern = /^did:almena:[a-f0-9]{32}$/;
      
      if (pattern.test(did)) {
        const shortened = did.substring(0, 18) + '...' + did.slice(-4);
        resultDiv.textContent = `✅ Valid DID!\nShortened: ${shortened}`;
        resultDiv.classList.add('success');
      } else {
        resultDiv.textContent = '❌ Invalid DID format\n\nExpected format: did:almena:{32 hex chars}';
        resultDiv.classList.add('error');
      }
    }
  </script>
</body>
</html>
```

Save as `test.html` and open in your browser.

## Next Steps

Now that you have the basics working:

1. **Learn about Authentication**
   - [Authentication Pattern →](../integrator-guide/integration-patterns/authentication.md)
   - [Complete Example →](../integrator-guide/examples/authentication-flow.md)

2. **Explore the API**
   - [API Reference →](../api-reference/endpoints/health.md)
   - [Error Handling →](../api-reference/errors/overview.md)

3. **Best Practices**
   - [Security →](../integrator-guide/best-practices/security.md)

## Troubleshooting

### Can't connect to API

- Check your internet connection
- Verify the API URL is correct
- Check browser console for CORS errors

### DID validation failing

- Ensure DID starts with `did:almena:`
- Verify the identifier is exactly 32 hexadecimal characters
- Check for typos or extra spaces

## Support

Need help?
- [Integrator FAQ →](../faq-integrator/api.md)
- Email: integrations@almena.id
