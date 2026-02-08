---
sidebar_position: 1
---

# Web Application

Almena ID also includes a web application that you can access from any browser. The web app lets you log in with your wallet, view your dashboard, and check the status of the platform services.

## Accessing the Web App

Open your browser and navigate to the Almena ID web application URL provided by your organization or community.

## Features

### Landing Page

The landing page introduces the Almena ID platform and its main features:

- **Self-Sovereign Identity**: You own and control your digital identity
- **Zero-Knowledge Proofs**: Verify attributes without revealing unnecessary data
- **Instant Verification**: Fast and reliable identity verification
- **Key Rotation & Recovery**: Maintain access even when keys change
- **Granular Privacy Control**: Choose exactly what to share
- **Interoperability**: Works with W3C DID standards

The landing page also showcases real-world use cases such as passwordless login, encrypted messaging, device identity, and more.

### Logging In with Your Wallet

The web app uses your Almena ID wallet for authentication. No passwords or usernames are needed for the web app itself.

1. Click the **Almena ID** button on the login page
2. Your wallet receives an authentication request
3. Approve the request in your wallet (see [External Authentication](../wallet/authentication.md))
4. You are automatically logged in to the web app

The login process has a 5-minute timeout. If you don't approve in time, you can try again.

### Dashboard

Once logged in, you have access to your dashboard which shows:

- **Your DID**: Your full decentralized identifier with a profile indicator
- **Statistics overview**: Credentials, verifications, and connections (coming soon)
- **Quick Actions**: Shortcuts for common tasks (coming soon)
- **Recent Activity**: A feed of your latest actions (coming soon)

The dashboard sidebar provides navigation to:

- Identity (coming soon)
- Credentials (coming soon)
- Security (coming soon)
- Settings

### Settings

In the web app settings you can change the interface language. Supported languages:

- English
- Spanish
- French
- German
- Italian

The language changes immediately when you select a new one.

### API Status

The status page lets you check if the Almena ID backend services are running:

- **Online**: The service is running normally
- **Offline**: The service is not reachable
- **Degraded**: The service is running but slower than usual

The page shows response times and automatically refreshes every 30 seconds. You can also manually refresh at any time.

## Multi-Language Support

The entire web application is available in 5 languages. You can switch the language from:

- The footer on any page
- The settings page when logged in

Your language preference is reflected in the URL and persists as you navigate.

## Next Steps

- [Learn about wallet authentication →](../wallet/authentication.md)
- [Configure your wallet settings →](../settings/language.md)
