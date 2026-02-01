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

## [0.1.0] - 2026-02-01

### Added

#### Cross-Platform Wallet (Tauri 2.0 + Svelte 5)

**Identity Creation & Management**
- Create new decentralized identity with password protection
- Generate 12-word recovery phrase (BIP39 standard)
- Derive Ed25519 cryptographic keypair from BIP39 mnemonic
- Generate Decentralized Identifier (DID) format: `did:almena:{identifier}`
- Secure storage: Private key in device keychain, public key in Tauri Store
- Recover identity from existing 12-word recovery phrase
- Cross-device identity recovery (same DID on multiple devices)
- Password hashing with Argon2 (stored for session management)

**Wallet Interface**
- Welcome screen with Create/Recover options
- Multi-step onboarding flow (password → recovery phrase → success)
- Dashboard displaying DID with copy functionality
- Sidebar navigation menu (Home, Identity, Credentials, Security, Settings, Logout)
- Collapsible sidebar on mobile/tablet with hamburger button
- Consistent header and footer across all screens
- Responsive design for mobile, tablet, and desktop

**Security Features**
- Auto-lock after 5 minutes of inactivity
- Unlock screen with password re-authentication
- Biometric authentication (Touch ID on macOS)
- Secure logout with confirmation dialog
- Password validation (minimum 8 characters)
- BIP39 phrase validation
- Activity monitoring (mouse, keyboard, touch events)

**Storage & Cryptography**
- Private keys stored in native keychain:
  - macOS/iOS: Keychain
  - Windows: Credential Manager
  - Linux: Secret Service
  - Android: Keystore
- Public keys and DID stored in Tauri Store
- Password hashing with Argon2
- No sensitive data in logs

**Languages**
- Multi-language support: English and Spanish
- Auto-detect host system language (defaults to English)
- Translations for all UI elements

**Platform Support**
- Windows (desktop)
- macOS (desktop)
- Linux (desktop)
- Android (mobile/tablet) - ready for deployment
- iOS (mobile/tablet) - ready for deployment

#### Backend API (FastAPI)
- REST API setup with FastAPI
- Health check endpoint (`GET /api/v1/health`)
- Root information endpoint (`GET /api/v1/`)
- CORS middleware configuration for frontend
- Docker containerization
- Docker Compose setup with PostgreSQL
- Hexagonal architecture (DDD) structure
- SQLAlchemy async ORM integration

#### Frontend (Next.js)
- Landing page with features and use cases
- Login page (placeholder)
- Dashboard layout with sidebar navigation
- Multi-language support: English and Spanish (next-intl)
- Responsive design (mobile, tablet, desktop)
- TypeScript with strict type checking
- Tailwind CSS styling
- Docker containerization
- Component library: Header, Footer, DashboardLayout
- Health check endpoint for monitoring

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
- Client-side only identity management
- No server-side storage of sensitive keys
- BIP39 standard for recovery phrases
- Ed25519 cryptographic keypairs
- Argon2 password hashing
- Native keychain storage for private keys
- Auto-lock after inactivity (5 minutes)
- Biometric authentication support (macOS Touch ID)
- Secure session management

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
