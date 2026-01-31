# Almena ID - Documentation Structure

## Overview

The Almena ID documentation has been restructured to focus on **two main audiences**:

1. **Users**: How to USE Almena ID (non-technical)
2. **Integrators**: How to INTEGRATE Almena ID into applications (technical)

**Important**: This documentation does NOT cover internal development of Almena ID itself.

## Navigation Structure

### For Users

**Getting Started**
- Installation and setup
- Creating your first identity
- Understanding DIDs

**User Guide** (Modular)
- **Your Wallet**
  - Dashboard
  - Creating identity
  - Recovering identity
- **Security & Privacy**
  - Password best practices
  - Recovery phrase security
  - Privacy features
- **Settings**
  - Language configuration
  - Preferences
- **Troubleshooting**
  - Common issues
  - Error messages

**Tutorials**
- Step-by-step guides

**FAQ**
- Frequently asked questions

### For Integrators

**Getting Started**
- Introduction
- Understanding DIDs
- First API call
- Quick integration

**Integration Guide** (Modular)
- **Integration Patterns**
  - Authentication
  - Identity verification
  - Credential issuance
  - Credential verification
- **Best Practices**
  - Security
  - Error handling
  - Performance
  - Rate limiting
- **Code Examples**
  - Complete implementations
  - Common scenarios

**API Reference** (Modular)
- **Endpoints**
  - Health check
  - Identity endpoints (coming)
  - Credential endpoints (coming)
- **Authentication**
  - API keys
  - OAuth (coming)
- **Errors**
  - Error codes
  - Error handling

**SDK Reference**
- JavaScript/TypeScript SDK
- Python SDK
- Other languages

**Tutorials**
- Integration tutorials

**FAQ**
- Integration questions

### Changelog
- Version history
- Breaking changes
- Migration guides

## Directory Structure

```
docs/docs/
├── getting-started-user/
│   └── overview.md
│
├── user-guide/
│   ├── intro.md
│   ├── wallet/
│   │   ├── dashboard.md
│   │   ├── creating-identity.md
│   │   └── recovering-identity.md
│   ├── security/
│   │   ├── password-best-practices.md
│   │   ├── recovery-phrase.md
│   │   └── privacy.md
│   ├── settings/
│   │   └── language.md
│   └── troubleshooting/
│       └── [various issues]
│
├── tutorials-user/
│   └── [tutorials]
│
├── faq-user/
│   └── [questions]
│
├── getting-started-integrator/
│   ├── intro.md
│   ├── understanding-dids.md
│   └── first-api-call.md
│
├── integrator-guide/
│   ├── integration-patterns/
│   │   ├── authentication.md
│   │   ├── credentials.md
│   │   └── [more patterns]
│   ├── best-practices/
│   │   ├── security.md
│   │   ├── error-handling.md
│   │   └── [more practices]
│   └── examples/
│       └── [code examples]
│
├── api-reference/
│   ├── endpoints/
│   │   ├── health.md
│   │   └── [more endpoints]
│   ├── authentication/
│   │   └── [auth methods]
│   └── errors/
│       └── [error docs]
│
├── sdk-reference/
│   └── [SDK docs]
│
├── tutorials-integrator/
│   └── [tutorials]
│
├── faq-integrator/
│   └── [questions]
│
└── changelog/
    └── overview.md
```

## Key Changes

### 1. Terminology Change
- ✅ **"Integrator"** (developers who integrate Almena ID)
- ❌ ~~"Developer"~~ (ambiguous - could mean internal developers)

### 2. Removed Internal Documentation
Removed from public docs:
- Internal development setup
- Contributing guidelines
- Code architecture
- Build/deployment processes
- Internal workflows

These belong in:
- Module READMEs (backend, frontend, wallet)
- Internal wiki/docs
- CONTRIBUTING.md

### 3. Modularized Content
Instead of long single pages:
- Divided into focused topics
- Separate pages for each feature/concept
- Organized in logical hierarchies
- Easier navigation with sidebars

### 4. Clear Audience Separation
**Users** see:
- Simple language
- How to USE features
- Screenshots and walkthroughs
- Troubleshooting

**Integrators** see:
- Technical details
- How to INTEGRATE
- API documentation
- Code examples

## Benefits

### For Users
- ✅ Easier to find specific topics
- ✅ Less overwhelming (shorter pages)
- ✅ Clear navigation path
- ✅ Focused content

### For Integrators
- ✅ Well-organized API docs
- ✅ Integration patterns separated by use case
- ✅ Complete code examples
- ✅ Best practices in dedicated section

### For Maintainers
- ✅ Easier to update specific sections
- ✅ Clear where each type of content goes
- ✅ Better version control (smaller diffs)
- ✅ Can expand without creating huge files

## Documentation Rules

### Cursor AI Rules Updated
- `docs-docusaurus.mdc`: Updated structure and audience separation
- `documentation-maintenance.mdc`: Changed "Developer" to "Integrator"
- Clear guidelines on what NOT to document

### When to Update
Update documentation when:
- Adding new user features → User Guide
- Adding new API endpoints → API Reference
- Adding integration capabilities → Integrator Guide
- Changing behavior → Update relevant sections
- Releasing new version → Changelog

### Quality Standards
- All docs in English
- Code examples must work
- Cross-link related content
- Keep pages under 500 lines
- Include troubleshooting

## Migration Notes

### Old Structure → New Structure

| Old | New |
|-----|-----|
| `getting-started-developer/` | `getting-started-integrator/` |
| `developer-guide/` | Removed (internal) |
| `architecture/` | Removed (internal) |
| `faq-developer/` | `faq-integrator/` |
| `tutorials-developer/` | `tutorials-integrator/` |
| Long `user-guide/overview.md` | Split into `user-guide/wallet/`, `security/`, etc. |
| Long `api-reference/overview.md` | Split into `endpoints/`, `authentication/`, `errors/` |

## Next Steps

1. **Complete remaining sections**:
   - Troubleshooting pages
   - More API endpoint docs (as they're implemented)
   - Tutorial content
   - FAQ content

2. **Add when features are ready**:
   - Credential issuance docs
   - Signature verification docs
   - SDK documentation
   - More integration patterns

3. **Continuous improvement**:
   - Add screenshots to user docs
   - More code examples
   - Video tutorials
   - Interactive API explorer

## Support

For documentation questions:
- Email: docs@almena.id
- GitHub Issues: [repo]/issues
- Internal: See module READMEs
