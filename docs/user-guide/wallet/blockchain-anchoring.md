---
sidebar_position: 6
---

# Blockchain Anchoring

After creating your identity, you can anchor your DID on the Almena blockchain. Anchoring registers your identity on a public, tamper-proof ledger, making it independently verifiable by anyone.

## Why Anchor Your DID?

- **Public verifiability**: Anyone can confirm your DID is legitimate by querying the blockchain
- **Tamper protection**: Once anchored, your DID document cannot be altered without your authorization
- **Persistence**: Your identity is preserved on the blockchain even if you lose access to your device

Anchoring is optional. Your wallet works fully without it, but anchoring strengthens trust in your identity.

## How to Anchor Your DID

Anchoring is available on the success screen right after creating a new identity:

1. After creating your identity, you'll see your new DID on the success screen
2. Click the **Anchor on Blockchain** button
3. The wallet signs a transaction using your keys
4. Wait for the transaction to be processed
5. Once complete, your anchoring status changes to **Anchored** and the transaction hash is displayed

If anchoring fails, a **Retry** button appears so you can try again.

## Anchoring Status

Your DID can have one of these statuses:

- **Not Anchored**: Your DID exists locally but is not registered on the blockchain
- **Anchoring**: The transaction is being processed
- **Anchored**: Your DID is successfully registered on the blockchain
- **Failed**: The anchoring transaction failed (you can retry)

## Blockchain Configuration

You can configure which blockchain node to connect to:

1. Go to the **Security** section from the sidebar menu
2. Enter the blockchain REST API URL
3. Click **Save**
4. Use the **Reset to default** button to restore the default configuration

## Cost

DID anchoring on the Almena blockchain is free. Transaction fees are subsidized by the network.

## Next Steps

- [Learn about your dashboard →](./dashboard.md)
- [Understand security features →](../security/privacy.md)
