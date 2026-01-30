---
sidebar_position: 2
---

# Preferences

Customize your Almena ID experience.

## Settings Overview

Access settings by clicking the gear icon ⚙️ in your dashboard.

## Available Settings

### Language

Change the interface language:
- 🇬🇧 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian

**How to change**:
1. Click Settings ⚙️
2. Click Language dropdown
3. Select your preferred language
4. Interface updates immediately

[Learn more about Language Settings →](./language.md)

### Theme (Coming Soon)

Future versions will include:
- Light mode
- Dark mode
- Auto (follows system)

### Notifications (Coming Soon)

Control what notifications you receive:
- Authentication requests
- Credential offers
- System updates

### Privacy Settings (Coming Soon)

Control your privacy:
- Who can see your DID
- Activity tracking
- Analytics preferences

## Account Settings

### Change Password

**To change your password**:

1. Go to Settings
2. Click "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password
6. Click "Update Password"

**Password Requirements**:
- Minimum 8 characters
- Mix of letters, numbers, and symbols recommended
- Different from old password

**Note**: Changing password re-encrypts your private keys. Your DID remains the same.

### View Recovery Phrase

**⚠️ Security Warning**: Only view recovery phrase in a secure, private location.

**To view**:
1. Go to Settings
2. Click "View Recovery Phrase"
3. Enter your password
4. Recovery phrase is displayed
5. Write it down if you didn't before

**Never**:
- Screenshot recovery phrase
- Email recovery phrase
- Share recovery phrase
- Store in unencrypted notes

### Export Data (Coming Soon)

Export your:
- Identity data
- Credentials
- Activity history

### Delete Account

**⚠️ Warning**: This action is irreversible!

**To delete account**:
1. Go to Settings
2. Scroll to bottom
3. Click "Delete Account"
4. Confirm deletion
5. Enter password
6. All local data is deleted

**What happens**:
- All data removed from this device
- Cannot be undone
- DID no longer accessible (unless you have recovery phrase)

**Before deleting**:
- Save your recovery phrase (if you want to recover later)
- Export any important data
- Consider just logging out instead

## Display Settings

### Shorten DID Display

Some apps show shortened DIDs for readability:

```
Full:      did:almena:a1b2c3d4e5f6789012345678901234
Shortened: did:almena:a1b2...1234
```

You can usually click to see the full DID.

### Time Format (Coming Soon)

Choose how dates and times are displayed:
- 24-hour format
- 12-hour format (AM/PM)
- Date format (DD/MM/YYYY or MM/DD/YYYY)

## Advanced Settings

### Developer Mode (Coming Soon)

For developers testing integrations:
- View detailed logs
- Debug authentication
- Test credential flows

**Note**: Regular users don't need this.

### Backup & Sync (Coming Soon)

Future feature to:
- Backup encrypted data
- Sync across devices
- Restore from backup

## Resetting Settings

### Reset to Defaults

If settings get misconfigured:

1. Go to Settings
2. Click "Reset to Defaults"
3. Confirm reset
4. Settings return to default values

**What resets**:
- Language → English
- Theme → Default
- Notifications → All on
- Privacy → Default

**What stays**:
- Your identity
- Your password
- Your data

## Settings Data Storage

All settings are stored:
- Locally in your browser
- Encrypted with your password
- Never sent to servers
- Specific to each browser/device

## Troubleshooting Settings

### Settings Not Saving

**Solutions**:
1. Check browser storage permissions
2. Clear browser cache
3. Restart browser
4. Try again

### Settings Reset After Restart

**Possible causes**:
- Browser in private/incognito mode (doesn't save data)
- Browser clearing data on exit
- Storage quota exceeded

**Solutions**:
- Use normal browser mode
- Check browser privacy settings
- Free up storage space

### Can't Access Settings

**Solutions**:
1. Ensure you're logged in
2. Refresh extension
3. Restart browser
4. Recover identity if needed

## Tips

### Recommended Settings

✅ **Do**:
- Set language you're most comfortable with
- Keep notifications on for security alerts
- Regularly review privacy settings

❌ **Don't**:
- Share your settings screenshots (may reveal personal info)
- Disable important security notifications

## Related Help

- [Language Settings →](./language.md)
- [Security Settings →](../security/password-best-practices.md)
- [Dashboard →](../wallet/dashboard.md)

## Support

Need help with settings?
- [FAQ →](../../faq-user/overview.md)
- Email: support@almena.id
