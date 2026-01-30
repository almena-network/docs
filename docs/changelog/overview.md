# Changelog

All notable changes to Almena ID will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Identity verification API endpoints
- Credential issuance and verification
- Frontend web portal
- SDK for JavaScript/TypeScript
- SDK for Python
- Additional authentication methods

## [0.1.0] - 2024-01-XX

### Added

#### Browser Extension
- Create new decentralized identity with password protection
- Generate 12-word recovery phrase (BIP39 standard)
- Derive cryptographic keys using BIP32/BIP44 (path: `m/44'/0'/0'/0/0`)
- Generate Decentralized Identifier (DID) from public key
- Encrypt private keys with AES-256 using user password
- Recover identity from existing 12-word recovery phrase
- Dashboard displaying DID and public key
- Copy DID and public key to clipboard
- Multi-language support: English, Spanish, French, German, Italian
- Language selection in settings
- Secure logout with data clearing
- Onboarding flow for new users
- Account recovery flow

#### Backend API
- FastAPI REST API setup
- Health check endpoint (`GET /health`)
- Root information endpoint (`GET /`)
- CORS middleware configuration
- Docker containerization
- Docker Compose setup with PostgreSQL

#### Frontend
- Next.js 16 application setup
- React 19 integration
- TypeScript configuration
- Tailwind CSS styling
- Multi-language support with next-intl
- Docker containerization
- Health check endpoint

#### Documentation
- User getting started guide
- Complete user guide
- Developer getting started guide
- API reference documentation
- User FAQ
- Developer FAQ
- Integration guide structure
- Architecture overview
- SDK reference structure
- Tutorial structures

#### Infrastructure
- Monorepo structure
- Cursor AI development rules
- Git workflow with conventional commits
- TypeScript standards across projects
- Security guidelines
- Docker configurations for all modules
- Comprehensive documentation system

### Security
- No logging of sensitive data (private keys, passwords, mnemonics)
- Client-side encryption only
- No server-side storage of sensitive keys
- BIP39/BIP32/BIP44 cryptographic standards
- AES-256 encryption for stored keys

## Version History

### Versioning Strategy

Almena ID follows Semantic Versioning:

- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New features, backward compatible
- **PATCH** version (0.0.X): Bug fixes, backward compatible

### Release Cycle

- **Patch releases**: As needed for bug fixes
- **Minor releases**: Monthly feature releases
- **Major releases**: Yearly or when breaking changes

## Upgrade Guides

### Upgrading to 0.1.0

Initial release - no upgrade needed.

## Deprecation Notices

None yet.

## Breaking Changes

### 0.1.0
- Initial release - no breaking changes

## Support

- **Current Version**: 0.1.0
- **Supported Versions**: 0.1.x
- **Support Period**: 1 year from release

For older versions, please upgrade to the latest release.

## Contributing

See [Integrator FAQ](../faq-integrator/api.md) for how to integrate with Almena ID.

When adding features, always update this changelog with:
- What was added/changed/fixed
- Any breaking changes
- Migration guides if needed

---

## How to Read This Changelog

- **[Unreleased]**: Features in development
- **[Version] - Date**: Released versions with date
- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Features to be removed
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
