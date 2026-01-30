---
sidebar_position: 2
---

# Recovery Phrase Security

Your 12-word recovery phrase is the master key to your identity. Learn how to keep it safe.

## What is a Recovery Phrase?

Your recovery phrase is:
- **12 random words** generated when you create your identity
- The **only way** to recover your account
- A **BIP39 mnemonic** (industry standard)
- The source from which all your keys are derived

## Why 12 Words?

The 12-word format:
- Provides 128 bits of entropy
- Is cryptographically secure
- Is manageable to write down
- Follows Bitcoin BIP39 standard
- Cannot be brute-forced

## Critical Security Rules

### ✅ DO

**Write it down on paper**
- Use pen and paper
- Write clearly
- Keep the order correct
- Make multiple copies

**Store it safely**
- Fireproof safe
- Safety deposit box
- Secure physical location
- Consider splitting between locations

**Verify it**
- Check spelling
- Confirm order
- Test recovery on another device

### ❌ NEVER

**Don't store digitally**
- ❌ Screenshots
- ❌ Notes apps
- ❌ Email
- ❌ Cloud storage (Google Drive, iCloud, Dropbox)
- ❌ Password managers
- ❌ Photos

**Don't share it**
- ❌ With friends or family
- ❌ With "support" (it's a scam)
- ❌ On social media
- ❌ In chat apps
- ❌ With anyone, ever

## Storage Methods

### Recommended: Paper Backup

**Simple Method**:
1. Write words on paper
2. Number them 1-12
3. Store in secure location

**Advanced Method**:
1. Write on metal plate (fireproof)
2. Use stamped letters
3. Store in fireproof safe

### Multi-Location Backup

Store copies in different physical locations:
- Primary: Home safe
- Secondary: Bank safety deposit box
- Tertiary: Trusted family member's safe (optional)

**Each location should have the complete phrase.**

### Splitting Your Phrase

Some users split their phrase:
- Words 1-6 in Location A
- Words 7-12 in Location B

**Caution**: If you lose one location, you lose your identity.

## What Your Recovery Phrase Controls

Your recovery phrase can:
- ✅ Recover your identity on any device
- ✅ Restore your DID
- ✅ Recreate your private key
- ✅ Access all future features

**Whoever has your recovery phrase controls your identity completely.**

## Testing Your Recovery

It's good to test your recovery phrase:

1. Install Almena ID on a different browser/device
2. Use "Recover Account"
3. Enter your 12 words
4. Verify your DID appears
5. Log out and return to your primary device

This confirms you wrote it down correctly.

## If You Lose Your Recovery Phrase

**Scenario: Lost phrase but still logged in**:
- You can still use your identity
- But if you forget your password, you're locked out
- **Action**: Write it down now if you still have access

**Scenario: Lost phrase and logged out**:
- Your identity **cannot be recovered**
- This is permanent
- **Action**: Create a new identity with a new DID

## Common Mistakes

### ❌ Storing in Password Manager

While password managers are great for passwords, they're risky for recovery phrases because:
- Single point of failure
- If manager is compromised, phrase is exposed
- Cloud sync means it's stored digitally

**Better**: Store physically, offline.

### ❌ Taking a Photo

Photos are:
- Stored digitally (vulnerable)
- Backed up to cloud automatically
- Visible in photo galleries
- Potentially synced across devices

**Better**: Write on paper.

### ❌ Memorization Only

Relying on memory alone:
- Memory fades over time
- Can be affected by stress or illness
- No backup if forgotten

**Better**: Write it down.

## Advanced: Passphrase (Optional)

BIP39 supports an optional 13th word called a "passphrase":
- Acts as an additional password
- Changes the derived keys
- Creates a different identity

**Note**: Almena ID currently doesn't support this feature, but it may in the future.

## Recovery Phrase Scams

### Common Scams

**⚠️ Watch out for**:
- "Support" asking for your phrase
- Emails requesting verification
- Fake recovery tools
- Social engineering

**Remember**: Almena ID will **NEVER** ask for your recovery phrase.

### How to Spot Scams

Red flags:
- Unexpected contact asking for phrase
- Urgency or threats
- Promises to "help recover" your account
- Links to fake websites

**If in doubt, it's a scam.**

## Physical Security

### At Home

- Store in a locked safe
- Don't leave visible
- Consider fireproof container
- Keep away from water damage

### Safety Deposit Box

- Bank safety deposit boxes are secure
- Requires physical access
- Protected from fire/theft
- Good for long-term storage

### Travel

When traveling:
- Leave recovery phrase at home
- Don't bring it with you
- Access identity via password only
- Consider leaving devices at home

## Inheritance Planning

If you want family to access your identity after you pass:

**Option 1**: Leave instructions
- Store recovery phrase in will
- Include instructions to access
- Ensure executor knows about it

**Option 2**: Share securely
- Split phrase between trusted parties
- Each party holds partial phrase
- Requires collaboration to reconstruct

**⚠️ Caution**: Sharing always increases risk.

## Next Steps

- [Password best practices →](./password-best-practices.md)
- [Privacy features →](./privacy.md)
- [Understanding your identity →](../wallet/dashboard.md)
