---
sidebar_position: 1
---

# General Questions

Common questions about using Almena ID.

## What is Almena ID?

Almena ID is a decentralized identity platform that gives you complete control over your digital identity. Instead of relying on usernames and passwords, you use cryptographic keys that only you control.

## Do I need an account?

No traditional "account" is needed. You create an identity that exists only on your device. There's no email signup, no username, no server storing your data.

## Is it free?

Yes, Almena ID is free for users.

## How is my data stored?

All your data is stored locally in your browser:
- Encrypted with your password
- Never sent to our servers
- Only accessible by you
- Deleted when you delete the extension

## Can I use Almena ID on multiple devices?

Yes! Use your 12-word recovery phrase to set up your identity on other devices:

1. Install extension on new device
2. Choose "Recover Account"
3. Enter your recovery phrase
4. Create a password for that device

Your same DID will be available on all devices.

## Is internet required?

- **To create identity**: No
- **To use wallet**: No
- **To authenticate with services**: Yes

The wallet works offline, but connecting to services requires internet.

## Which browsers are supported?

- ✅ Google Chrome
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Brave
- ✅ Any Chromium-based browser

Safari support coming soon.

## Can I use it on mobile?

Mobile browser extension support depends on the browser:
- **Firefox Mobile**: Supported
- **Chrome Mobile**: Limited extension support
- **Safari Mobile**: Coming soon

Native mobile apps are planned for the future.

## What is a DID?

A **DID** (Decentralized Identifier) is your unique identity. It looks like:

```
did:almena:a1b2c3d4e5f6789012345678901234
```

Think of it as a username, but:
- Cryptographically verifiable
- Globally unique
- No one can take it from you
- Works across any compatible service

## Can I change my DID?

No. Your DID is derived from your cryptographic keys. To get a new DID, you'd need to create a new identity.

## What if I forget my password?

Use your 12-word recovery phrase:
1. Click "Recover Account"
2. Enter your recovery phrase
3. Create a new password

If you've lost both password AND recovery phrase, your identity cannot be recovered.

## What is a recovery phrase?

A recovery phrase is 12 random words that can restore your identity:

```
apple banana cherry date elderberry fig
grape honeydew ice jackfruit kiwi lemon
```

**Critical**: This is the ONLY way to recover your identity if you forget your password or lose your device.

## Can Almena ID reset my password?

No. We don't have access to your password or data. Only your recovery phrase can restore access. This ensures true ownership of your identity.

## Is my data private?

Yes:
- Data never leaves your device (unless you use it to authenticate)
- Encrypted with your password
- We can't see your data
- No tracking or analytics on your identity

## Can someone steal my identity?

To steal your identity, someone would need:
- Your recovery phrase, OR
- Your password AND access to your device

**Protect your recovery phrase** and use a strong password.

## What happens if I lose my recovery phrase?

If you lose your recovery phrase and forget your password:
- ❌ Cannot recover identity
- ❌ Cannot access that DID
- ❌ All data lost permanently

This is why we emphasize writing it down safely!

## Can I have multiple identities?

Yes! You can create multiple identities (each with its own DID):
1. Log out
2. Create new account
3. New identity with new DID

Each identity is completely separate.

## How do I delete my identity?

1. Go to Settings
2. Click "Delete Account"
3. Confirm deletion
4. All data is removed

**Note**: This only deletes from this device. If you have it on other devices, delete from those too. Save your recovery phrase if you might want to restore later.

## What is the orange color for?

Orange is Almena ID's brand color. You'll see it throughout our platform and documentation.

## Is Almena ID open source?

Source code availability details will be announced. Check our website for updates.

## What languages are supported?

- 🇬🇧 English
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇮🇹 Italian (Italiano)

More languages coming soon!

## Can I suggest features?

Yes! Send suggestions to:
- Email: feedback@almena.id
- Or through our community channels (coming soon)

## How do I update the extension?

Browser extensions update automatically. You can also manually update:
1. Browser → Extensions → Manage Extensions
2. Find Almena ID
3. Click "Update" if available

## What's new in the latest version?

Check the [Changelog](../changelog/overview.md) for latest updates and features.

## Is there a desktop app?

Not yet. Currently available as:
- Browser extension
- Web application

Desktop apps may come in future versions.

## Can businesses use Almena ID?

Yes! Businesses can integrate Almena ID for:
- User authentication
- Identity verification
- Credential issuance

See [Integrator Guide](../getting-started-integrator/intro.md) for details.

## Who created Almena ID?

Information about the team and organization will be available on our website.

## Is there a community?

Community channels coming soon:
- Discord server
- Forum
- Social media

Follow @almenaid for announcements.

## How do I report a bug?

Email: bugs@almena.id

Include:
- Browser and version
- Operating system
- Steps to reproduce
- Screenshots (no passwords/phrases!)

## How do I get help?

- 📖 [User Guide](../user-guide/intro.md)
- 🔧 [Troubleshooting](../user-guide/troubleshooting/extension-not-working.md)
- 📧 Email: support@almena.id
- 💬 Community forums (coming soon)

## More Questions?

Didn't find your answer?
- Check [Troubleshooting](../user-guide/troubleshooting/extension-not-working.md)
- Read the full [User Guide](../user-guide/intro.md)
- Contact support@almena.id
