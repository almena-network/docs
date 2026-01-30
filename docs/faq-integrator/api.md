---
sidebar_position: 1
---

# API Questions

Frequently asked questions about integrating with the Almena ID API.

## General

### What is the base API URL?

**Production**: `https://api.almena.id/api/v1`
**Development**: `http://localhost:8000/api/v1`

### Is the API RESTful?

Yes, the API follows REST principles with standard HTTP methods and status codes.

### Do I need an API key?

API authentication will be required for most endpoints when they are implemented. Currently, health check endpoints are publicly accessible.

### Is there rate limiting?

Rate limiting will be implemented. Details will be documented when available.

## Authentication

### How do I authenticate API requests?

API authentication methods will be documented when implemented. Planned methods include API keys and OAuth 2.0.

### How do I verify a user's DID?

DID verification endpoints will be available soon. See [Authentication Pattern](../integrator-guide/integration-patterns/authentication.md) for the planned implementation.

## Integration

### Can I use Almena ID for user authentication?

Yes! That's one of the primary use cases. See [Authentication Pattern](../integrator-guide/integration-patterns/authentication.md) for implementation details.

### What programming languages are supported?

The REST API can be used with any language that can make HTTP requests. Examples are provided in:
- JavaScript/TypeScript
- Python
- cURL

SDKs for JavaScript and Python are planned.

### Do I need to run my own server?

Yes, you'll need a backend server to:
- Store challenge-response data
- Manage sessions
- Verify signatures (via Almena API)

## DIDs

### How do I validate a DID format?

Use this regex pattern:
```
^did:almena:[a-f0-9]{32}$
```

See [Understanding DIDs](../getting-started-integrator/understanding-dids.md) for more details.

### Can users have multiple DIDs?

Yes, users can create multiple identities, each with its own DID.

### What if a user loses their DID?

DIDs are permanent and tied to the user's recovery phrase. If they lose their recovery phrase, they lose access to that DID and must create a new identity.

## Errors

### What do I do if I get a 500 error?

- Check API status at [status.almena.id](https://status.almena.id)
- Implement retry logic with exponential backoff
- Contact support if issue persists

### How do I handle network errors?

Implement proper error handling:
- Catch connection errors
- Use timeouts
- Implement retry logic
- Show user-friendly error messages

See [Error Handling](../api-reference/errors/overview.md) for examples.

## Security

### How do I store API credentials securely?

- Use environment variables
- Never commit credentials to version control
- Rotate credentials regularly
- Use different credentials for each environment

See [Security Best Practices](../integrator-guide/best-practices/security.md).

### Are requests encrypted?

Yes, all API communication uses HTTPS/TLS encryption.

### How long should challenges be valid?

Recommended: 5 minutes (300 seconds)

This balances security (short window for attacks) with usability (enough time for users to sign).

## Development

### Is there a test environment?

Test environment details will be provided when available.

### Can I test locally?

Yes! You can run the backend API locally for development. See module README for setup instructions.

### Are there code examples?

Yes! Check out:
- [Complete Authentication Flow](../integrator-guide/examples/authentication-flow.md)
- [Getting Started Tutorial](../tutorials-integrator/getting-started.md)

## Support

### Where can I get help?

- **Documentation**: [docs.almena.id](https://docs.almena.id)
- **Email**: integrations@almena.id
- **Issues**: GitHub Issues (when available)

### How do I report bugs?

Email bugs@almena.id with:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- API endpoint and request details

### Is there a community forum?

Community channels will be announced. Stay tuned!

## Roadmap

### What features are coming?

Planned features:
- Identity verification endpoints
- Credential issuance and verification
- Official SDKs (JavaScript, Python)
- Webhook support
- OAuth 2.0 integration

See [Changelog](../changelog/overview.md) for updates.

### How do I stay updated?

- Subscribe to our newsletter
- Follow [@almenaid](https://twitter.com/almenaid)
- Check the [Changelog](../changelog/overview.md) regularly

More questions? Email: integrations@almena.id
