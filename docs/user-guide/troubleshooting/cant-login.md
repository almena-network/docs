---
sidebar_position: 2
---

# Can't Login

Solutions for login and password issues.

## Wrong Password

### Symptoms
- "Invalid password" error
- Can't access your wallet
- Password doesn't work

### Solutions

1. **Check Password Carefully**
   - Passwords are case-sensitive
   - Check for extra spaces
   - Ensure Caps Lock is off
   - Try typing slowly

2. **Try Another Device**
   - If you set up Almena ID on another device
   - Use that device to access your wallet
   - Then you can recover on this device

3. **Use Recovery Phrase**
   - If you've lost your password
   - Click "Recover Account"
   - Enter your 12-word recovery phrase
   - Create a new password

## Forgot Password

### If You Have Your Recovery Phrase

✅ **You can recover your account!**

1. Click "Recover Account"
2. Enter your 12-word recovery phrase
3. Create a new password
4. Your identity will be restored

### If You Don't Have Your Recovery Phrase

❌ **Cannot recover the account**

Unfortunately, without your recovery phrase, there's no way to recover your account. This is by design for security - we don't have access to your data.

**What to do**:
- Create a new identity
- Save your new recovery phrase safely
- Start fresh

## Recovery Phrase Issues

### Wrong Recovery Phrase

**Symptoms**:
- "Invalid recovery phrase" error
- Phrase not accepted
- Can't recover account

**Solutions**:

1. **Check Word Order**
   - Words must be in exact order
   - Word 1, then word 2, etc.
   - Order matters!

2. **Check Spelling**
   - Each word must be spelled exactly right
   - Use lowercase letters
   - No typos

3. **Check Word Count**
   - Must be exactly 12 words
   - Not 11, not 13
   - Count carefully

4. **Try Different Format**
   - Some people add numbers (1. word, 2. word)
   - Enter only the words, no numbers
   - Remove any punctuation

### Can't Find Recovery Phrase

**Where to look**:
- Password manager (if you saved it there)
- Secure notes apps
- Photo of handwritten copy
- Physical paper in safe location
- Other devices where you set up Almena ID

**If truly lost**:
- Cannot recover account
- Must create new identity
- Previous DID is permanently lost

## Account Locked

### Too Many Failed Attempts

Some browsers may slow down after many failed password attempts.

**Solutions**:
1. Wait 15 minutes
2. Close browser completely
3. Reopen and try again
4. If still locked, restart computer

## Extension Not Responding

If the extension isn't responding to login attempts:

1. **Refresh Extension**
   - Close side panel
   - Reopen it
   - Try again

2. **Restart Browser**
   - Close all browser windows
   - Reopen browser
   - Try logging in

3. **Check Browser Console**
   - Press F12
   - Look for error messages
   - Report errors to support

## Browser Issues

### Different Browser

If you created your identity in Chrome but now using Firefox:

**Note**: Each browser stores data separately. You need to recover your identity in the new browser using your recovery phrase.

1. Install extension in new browser
2. Click "Recover Account"
3. Enter recovery phrase
4. Create password for this browser

### Private/Incognito Mode

**Note**: Almena ID doesn't work in private/incognito mode because it needs to store encrypted data.

**Solution**: Use normal browser mode.

## Data Not Found

### "No wallet found" Error

This means no identity is set up in this browser.

**Solutions**:
- If first time: Create new account
- If you had an account: Recover with recovery phrase

## Prevention Tips

### Avoid Login Issues

✅ **Do**:
- Write down recovery phrase immediately
- Store recovery phrase in multiple safe places
- Use a password manager
- Keep password strong but memorable
- Set up on multiple devices

❌ **Don't**:
- Rely only on memory
- Share recovery phrase
- Use same password everywhere
- Skip writing down recovery phrase

## Still Can't Login?

### Get Help

1. **Check Documentation**
   - [Password Best Practices →](../security/password-best-practices.md)
   - [Recovery Phrase Guide →](../security/recovery-phrase.md)

2. **Contact Support**
   - Email: support@almena.id
   - Include: Browser, OS, error message (not passwords!)

3. **FAQ**
   - [User FAQ →](../../faq-user/overview.md)

## Security Note

🔒 **We cannot reset your password**

This is by design. Your data is encrypted with your password, and we don't have access to it. Only your recovery phrase can restore access.

This ensures your identity is truly yours and can't be accessed by anyone else, including us.
