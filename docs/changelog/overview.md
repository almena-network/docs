
## [Unreleased]

### Planned
- Verifiable credentials issuance and management
- Credential verification workflows
- Additional authentication methods

## [0.2.0] - 2026-02-08

### Added

#### Wallet - Encrypted Messaging (DIDComm V2)
- Send and receive end-to-end encrypted messages between wallets
- Conversation list with contact aliases, last message preview, and timestamps
- Add contacts by DID with optional alias
- DID format validation for new contacts
- Delete individual conversations
- Encryption badge confirming DIDComm V2 encryption
- Local-only message storage (no server involvement)
- All chat data cleared on logout for security

#### Wallet - Identity QR Code
- Auto-generated QR code containing your DID
- QR code rotates every 30 seconds with security token
- Countdown timer showing time remaining before refresh
- QR code in Almena brand colors

#### Wallet - Blockchain DID Anchoring
- Anchor your DID on the Almena blockchain for public verifiability
- Free anchoring (transaction fees subsidized by network)
- Anchoring status tracking (not anchored, anchoring, anchored, failed)
- Transaction hash display after successful anchoring
- Retry mechanism on failure
- Available on the identity creation success screen

#### Wallet - External Authentication
- Authenticate with external websites and apps using your wallet
- Approve or reject authentication requests
- Request details display (service, action, DID, expiration timer)
- Cryptographic challenge signing
- Automatic expiration of unanswered requests

#### Wallet - Security Page
- Configure blockchain REST API URL
- URL validation and save confirmation
- Reset to default configuration

#### Frontend Web Application
- Landing page with platform features and use cases
- DID-based wallet login (no passwords needed for web app)
- Authentication flow with wallet approval and 5-minute timeout
- Dashboard displaying user DID and profile indicator
- API status page with real-time health monitoring and response times
- Settings page with language selection
- Multi-language support: English, Spanish, French, German, Italian
- Responsive design for mobile, tablet, and desktop

#### Frontend - Authentication Flow
- Challenge-response authentication via wallet
- Real-time polling for wallet approval (every 2 seconds)
- Multiple authentication states (idle, requesting, waiting, success, error, timeout, rejected)
- Session persistence with localStorage
- Protected dashboard routes with AuthGuard

### Changed
- Dashboard sidebar navigation updated with Messages section
- Logout now clears all local data (keys, messages, contacts, blockchain config)
- Settings page streamlined to show only implemented features (language, biometric, auto-lock info)

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
- Multi-step onboarding flow (password, recovery phrase, success)
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
- Private keys stored in native keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service, Android Keystore)
- Public keys and DID stored in Tauri Store
- Password hashing with Argon2

**Languages**
- Multi-language support: English and Spanish
- Auto-detect host system language (defaults to English)

**Platform Support**
- Windows, macOS, Linux (desktop)
- Android, iOS (mobile/tablet) - ready for deployment

#### Backend API (FastAPI)
- REST API setup with FastAPI
- Health check endpoint
- CORS middleware configuration
- Docker containerization with PostgreSQL
- Hexagonal architecture (DDD) structure
- SQLAlchemy async ORM integration

#### Documentation
- User getting started guide
- Complete user guide (wallet, security, settings, troubleshooting)
- User FAQ
- Bilingual documentation (English and Spanish)

### Security
- Client-side only identity management
- No server-side storage of sensitive keys
- BIP39 standard for recovery phrases
- Ed25519 cryptographic keypairs
- Argon2 password hashing
- Native keychain storage for private keys
- Auto-lock after inactivity (5 minutes)
- Biometric authentication support (macOS Touch ID)

---