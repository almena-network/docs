---
sidebar_position: 3
---

# Privacy Features

Understand how Almena ID protects your privacy and what data is stored.

## Privacy by Design

Almena ID is built with privacy as a core principle:

### No Tracking
- ❌ No analytics
- ❌ No telemetry
- ❌ No usage tracking
- ❌ No behavioral data collection

### No Central Database
- Your identity is **not stored on our servers**
- Everything is **local to your device**
- No user database to hack

### No Personal Information Required
- No email required
- No phone number needed
- No name or address
- Just your password and recovery phrase

## What Data is Stored

### Locally (In Your Browser)

**Stored in browser local storage**:
- ✅ Encrypted private key
- ✅ Public key (not sensitive)
- ✅ DID (public identifier)
- ✅ Language preference

**Never stored**:
- ❌ Your password
- ❌ Your recovery phrase
- ❌ Unencrypted keys

### On Servers

**Nothing is stored on Almena ID servers.**

When backend APIs are implemented, the server may store:
- ✅ DIDs (public by nature)
- ✅ Public keys (meant to be public)
- ✅ Credentials you've issued/received (if using credential service)

**Never stored on servers**:
- ❌ Private keys
- ❌ Passwords
- ❌ Recovery phrases
- ❌ Personal information

## Encryption

### Local Encryption

Your private key is encrypted with:
- **Algorithm**: AES-256
- **Key**: Derived from your password
- **Storage**: Browser local storage

This means:
- Without your password, the encrypted key is useless
- Even if someone accesses your browser storage, they can't use your key

### In Transit

When APIs are implemented:
- All communication uses HTTPS
- TLS encryption protects data in transit
- No sensitive data is transmitted

## What Can Others See?

### Public Information

Anyone can see (if you share it):
- ✅ Your DID
- ✅ Your public key

This is **intentional and safe**. These are meant to be public identifiers.

### Private Information

No one can access:
- ❌ Your private key (encrypted, local only)
- ❌ Your password (never stored anywhere)
- ❌ Your recovery phrase (never stored)

## Browser Privacy

### Browser Storage

Your data is isolated by:
- **Browser**: Can't access other browsers' data
- **Profile**: Separate from other browser profiles
- **Origin**: Isolated from other websites

### Incognito/Private Mode

**Warning**: Using incognito mode means:
- Your data is cleared when you close the window
- You'll need to recover your identity each time

**Recommendation**: Use regular browser mode for Almena ID.

## Network Privacy

### Extension Permissions

The Almena ID extension:
- ❌ Doesn't read your browsing history
- ❌ Doesn't monitor web pages
- ❌ Doesn't track your activity
- ✅ Only runs when you open it

### Internet Connection

Currently:
- Extension works entirely offline
- No internet connection needed
- Future API features will require internet

## Data Deletion

### Logging Out

When you log out:
- Session is cleared
- Encrypted data remains in browser storage
- Can log back in with your password

### Complete Deletion

To completely remove your data:

1. Log out of Almena ID
2. Open browser settings
3. Go to Extension settings
4. Clear data for Almena ID extension

**⚠️ Warning**: This cannot be undone without your recovery phrase.

## Third-Party Services

### No Third Parties

Almena ID does not:
- Use third-party analytics
- Integrate tracking scripts
- Share data with partners
- Use advertising networks

## Comparing to Traditional Systems

### Traditional Identity (Username/Password)

| Feature | Traditional | Almena ID |
|---------|-------------|-----------|
| Central Database | ✅ Your data stored | ❌ No central storage |
| Server Access | ✅ Can access all data | ❌ No access to keys |
| Data Breaches | ⚠️ Risk of exposure | ✅ Nothing to breach |
| Account Recovery | ✅ Password reset | ❌ Self-sovereign only |
| Privacy | ⚠️ Varies by service | ✅ Private by default |

### Blockchain-Based Identity

| Feature | Blockchain | Almena ID |
|---------|------------|-----------|
| Public Ledger | ⚠️ All transactions public | ✅ Only share what you want |
| Transaction Fees | ⚠️ Gas fees | ✅ No fees (currently) |
| Permanence | ✅ Permanent record | ✅ Self-controlled |
| Speed | ⚠️ Block confirmation | ✅ Instant (local) |

## Privacy Best Practices

### ✅ Do

- Use Almena ID on trusted devices only
- Keep your browser updated
- Use device passwords/biometrics
- Log out on shared computers

### ❌ Don't

- Use on public computers (libraries, internet cafés)
- Share your device with your Almena ID logged in
- Screenshot your dashboard
- Share your DID on untrusted platforms

## Browser Security

### Recommended Browsers

Almena ID works on:
- ✅ Chrome (good privacy options)
- ✅ Firefox (strong privacy focus)
- ✅ Edge (built on Chromium)
- ✅ Brave (privacy-focused)

### Browser Extensions

Be careful with other browser extensions:
- Some extensions can read page content
- Malicious extensions could compromise security
- Only install extensions from trusted sources

## Future Privacy Features

Planned privacy enhancements:
- Zero-knowledge proofs for credential verification
- Selective disclosure of credential attributes
- Privacy-preserving credential sharing
- Enhanced encryption options

## Privacy FAQs

### Can Almena ID see my private key?

No. Your private key never leaves your device and is always encrypted.

### Is my browsing tracked?

No. The extension doesn't monitor your browsing activity.

### Can I be anonymous?

Yes. Your DID doesn't contain personal information. However, if you share your DID with services that know your identity, they can link it.

### What if a government requests my data?

We have no data to provide. Your identity is self-sovereign and local to your device.

## Next Steps

- [Password security →](./password-best-practices.md)
- [Recovery phrase security →](./recovery-phrase.md)
- [Troubleshooting →](../troubleshooting/extension-not-working.md)
