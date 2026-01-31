---
sidebar_position: 3
---

# DID Not Displaying

Solutions for issues with DID and key display.

## DID Missing or Not Showing

### Symptoms
- Dashboard shows loading forever
- DID field is blank
- Public key not visible
- "undefined" or "null" shown

### Solutions

1. **Refresh the Wallet**
   - Close the wallet application
   - Reopen Almena ID
   - Wait for it to load

2. **Restart Application**
   - Close Almena ID completely
   - Restart your device if needed
   - Open Almena ID wallet

3. **Check if Logged In**
   - You might have been logged out
   - Try logging in again
   - Enter your password

4. **Recover Your Identity**
   - If problem persists, try recovering
   - Click "Recover Account" in settings
   - Use your 12-word recovery phrase
   - Create new password

## Copy Button Not Working

### Can't Copy DID or Public Key

**Symptoms**:
- Click copy button, nothing happens
- "Copied!" message doesn't appear
- Paste doesn't work

**Solutions**:

1. **Grant Clipboard Permission**
   - Your device may be blocking clipboard access
   - Look for permission prompt
   - Click "Allow"

2. **Manual Copy**
   - Select the DID text manually
   - Use copy from context menu
   - Or use Ctrl+C (Windows/Linux) / Cmd+C (Mac)

3. **Restart Application**
   - Close and reopen Almena ID
   - Try copying again

## DID Format Issues

### DID Looks Wrong

A valid Almena DID looks like:
```
did:almena:a1b2c3d4e5f6789012345678901234
```

**Correct format**:
- Starts with `did:almena:`
- Followed by 32 characters
- Only lowercase letters (a-f) and numbers (0-9)

**If your DID doesn't match**:
1. Try refreshing
2. If still wrong, report bug to support@almena.id

## Truncated DID

### DID Appears Cut Off

**This is normal!**

In some views, DIDs are shortened for readability:
```
Full:      did:almena:a1b2c3d4e5f6789012345678901234
Shortened: did:almena:a1b2...1234
```

**To see full DID**:
- Go to dashboard
- Full DID should be visible there
- Use copy button to get complete DID

## Public Key Issues

### Public Key Not Showing

**Same solutions as DID not showing**:
1. Refresh wallet
2. Restart application
3. Check if logged in
4. Recover identity if needed

### Public Key Format

Public keys are longer than DIDs:
- Usually 64+ hexadecimal characters
- Starts with `0x` in some displays
- Much longer than DID

## Dashboard Empty

### Nothing Showing on Dashboard

**Symptoms**:
- Blank screen
- No DID, no public key
- No data at all

**Solutions**:

1. **Wait for Loading**
   - Give it 10-15 seconds
   - May be loading from storage

2. **Clear Application Cache**
   - Close the wallet
   - Clear app cache through system settings
   - Reopen wallet

3. **Reinstall Wallet**
   - Uninstall Almena ID
   - Restart device
   - Install again
   - Recover with phrase

## Data Inconsistency

### Different DID on Different Devices

**This is expected!**

If you created identities separately on each device, they'll have different DIDs.

**To use same identity**:
1. Choose which DID to keep
2. Get recovery phrase from that device
3. Recover identity on other devices
4. Now all devices show same DID

### DID Changed After Recovery

**This should NOT happen!**

Recovery phrase should restore same DID.

**If DID changed**:
- You may have used wrong recovery phrase
- Or created new identity instead of recovering
- Check that you used correct 12 words

## Storage Issues

### Storage Full or Corrupted

**Symptoms**:
- Data not saving
- DID disappears after refresh
- Constant login required

**Solutions**:

1. **Check Storage Space**
   - Device may be out of storage
   - Free up space on your device

2. **Clear Application Data**
   - Go to device settings
   - Find Almena ID in apps
   - Clear cache (not data!)
   - Try again

3. **Reinstall Application**
   - Uninstall Almena ID
   - Reinstall from store/download
   - Recover identity with phrase

## Visual Glitches

### Display Issues

**Symptoms**:
- Text overlapping
- Buttons misaligned
- DID partially hidden

**Solutions**:

1. **Screen Size**
   - Try different window size (desktop)
   - Rotate device (mobile)

2. **Update Application**
   - Ensure you have latest version
   - Update if available

3. **Restart Device**
   - Sometimes a restart fixes display issues

## Reporting Issues

### If Problem Persists

Contact support with:

**Include**:
- Platform (Windows, macOS, Linux, Android, iOS)
- Application version
- Screenshot of issue
- Steps to reproduce
- Error messages

**Don't include**:
- Your password
- Your recovery phrase
- Your private key

**Contact**:
- Email: support@almena.id
- Subject: "DID Display Issue"

## Prevention

### Avoid Display Issues

✅ **Do**:
- Keep app updated
- Grant necessary permissions
- Restart app occasionally

❌ **Don't**:
- Block storage permissions
- Use very old device versions

## Related Help

- [Wallet Not Working →](./extension-not-working.md)
- [Can't Login →](./cant-login.md)
- [Dashboard Guide →](../wallet/dashboard.md)
