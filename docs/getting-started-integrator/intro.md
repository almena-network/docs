---
sidebar_position: 1
---

# Getting Started - Integrators

Welcome! This guide will help you integrate Almena ID into your application.

## Who is This For?

This guide is for **developers and integrators** who want to:
- Add decentralized identity to their applications
- Implement DID-based authentication
- Issue and verify credentials
- Build applications that use Almena ID

## What is Almena ID?

Almena ID is a decentralized identity platform that allows:
- **Users** to control their own digital identities
- **Applications** to authenticate users without passwords
- **Issuers** to provide verifiable credentials
- **Verifiers** to check credentials cryptographically

## Currently Available

### API Health Check
- ✅ Test API connectivity
- ✅ Verify API is running
- [Health Check Endpoint →](../api-reference/endpoints/health.md)

## Coming Soon

The following integration options are in development:

### 1. Authentication
Use Almena ID for user authentication instead of traditional username/password.

**Planned Use Cases**:
- Web applications
- Mobile apps
- Enterprise systems

### 2. Identity Verification
Verify that a user controls a specific DID.

**Planned Use Cases**:
- KYC processes
- Access control
- Identity confirmation

### 3. Credential Issuance
Issue verifiable credentials to users.

**Planned Use Cases**:
- Certificates
- Licenses
- Memberships
- Achievements

### 4. Credential Verification
Verify credentials issued by others.

**Planned Use Cases**:
- Background checks
- Qualification verification
- Age verification

## Prerequisites

Before you start:
- Basic understanding of REST APIs
- Development environment (Node.js 20+ or Python 3.12+)
- Understanding of DIDs (we'll explain)
- API credentials (coming soon)

## Quick Start

### 1. Test the API

```bash
curl https://api.almena.id/health
```

Expected response:
```json
{
  "status": "ok"
}
```

### 2. Explore Current Documentation

**Available Now**:
- [Health Check Endpoint →](../api-reference/endpoints/health.md)
- [Root Endpoint →](../api-reference/endpoints/root.md)
- [Understanding DIDs →](./understanding-dids.md)

**Coming Soon** (in development):
- Authentication patterns
- Integration examples
- SDK documentation

### 3. Read Best Practices

These best practices apply when authentication features become available:
- [Security →](../integrator-guide/best-practices/security.md)
- [Error Handling →](../integrator-guide/best-practices/error-handling.md)
- [Performance →](../integrator-guide/best-practices/performance.md)

## Next Steps

Choose your path:

### Path 1: Authentication
[Implement DID-based authentication →](../integrator-guide/integration-patterns/authentication.md)

### Path 2: Credentials
[Issue or verify credentials →](../integrator-guide/integration-patterns/credentials.md)

### Path 3: Full Integration
[Complete integration guide →](../integrator-guide/integration-patterns/full-integration.md)

## Support

Need help?
- [Integrator FAQ →](../faq-integrator/api.md)
- Email: integrations@almena.id
- Documentation: [docs.almena.id](https://docs.almena.id)

## What's in This Guide

### Getting Started
- Quick setup
- First API call
- Understanding DIDs

### Integration Patterns
- Authentication flows
- Credential issuance
- Verification methods

### API Reference
- All endpoints documented
- Request/response schemas
- Error codes

### Best Practices
- Security guidelines
- Performance tips
- Error handling

### Examples
- Complete code samples
- Common scenarios
- Production-ready patterns
