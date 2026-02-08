---
sidebar_position: 7
---

# External Authentication

Almena ID can be used to log in to websites and applications that support DID-based authentication. When a service requests authentication, your wallet will ask you to approve or reject the request.

## How It Works

1. You visit a website or application that supports Almena ID login
2. The service sends an authentication request to your wallet
3. Your wallet displays the request details, including:
   - The requesting service or application
   - The action being requested
   - Which DID will be shared
   - A countdown timer showing how long the request is valid
4. You choose to **Approve** or **Reject** the request
5. If approved, the wallet signs a challenge using your private key and sends the response back to the service
6. The service verifies the signature and grants you access

## Approving a Request

When you approve an authentication request:

- Your wallet signs a cryptographic challenge
- Only your DID and the signed response are shared
- Your private key, password, and recovery phrase are never exposed
- The authentication completes automatically

## Rejecting a Request

If you don't recognize the request or don't want to authenticate:

- Click **Reject**
- No information is shared with the requesting service
- The request is cancelled

## Request Expiration

Authentication requests have a limited time window. If you don't respond before the timer runs out, the request expires and no action is taken. The requesting service will need to generate a new authentication request.

## Security Considerations

- Always verify the identity of the service before approving
- Only approve requests from services you recognize and trust
- If a request appears unexpectedly, reject it
- Your private key never leaves your device during authentication

## Next Steps

- [Learn about security →](../security/password-best-practices.md)
- [Learn about privacy →](../security/privacy.md)
