---
sidebar_position: 1
title: Integrators
slug: /integrators
---

# Almena Network for Integrators

This section provides documentation for developers integrating their applications with the Almena Network platform.

## Integration Points

Almena Network exposes a **gRPC API** through its daemon service (`almenad`). This is the primary way external applications communicate with the platform.

### Available Today

| Capability | Description |
|-----------|-------------|
| **Health Check** | Verify the daemon is running and responsive |
| **Version Info** | Query the daemon version programmatically |
| **System Info** | Retrieve OS name and version from the host |
| **Geolocation** | Get the node's public IP geolocation (city, country, coordinates) |
| **Peer Discovery** | List all discovered P2P peers with connection status and network type |

### Integration Guides

- [**Daemon Setup**](./daemon-setup) — Install and run the Almena daemon on your system.
- [**gRPC API Reference**](./grpc-api) — Complete reference for all available RPC methods and message types.

## Protocol & Standards

Almena Network follows W3C standards for decentralized identity:

- **DIDs** (Decentralized Identifiers) v1.0
- **Verifiable Credentials** Data Model v2.0
- **DIDComm** v2 for secure messaging

The gRPC API uses Protocol Buffers (proto3) as the wire format. The canonical proto definition lives in the daemon repository at `proto/almena/daemon/v1/service.proto`.

:::info Coming Soon
Credential issuance, presentation verification, and trust framework APIs will be added as they are implemented.
:::
