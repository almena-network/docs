---
sidebar_position: 3
title: "Desktop: Network Explorer"
sidebar_label: "Desktop: Network Explorer"
---

# Desktop: Network Explorer

The Almena Desktop application includes a Network Explorer that provides a real-time view of the peer-to-peer network.

## Accessing the Network Explorer

1. Open the Almena Desktop application.
2. On the login screen, authenticate via QR code or use the skip button (for development).
3. Navigate to the **Network** tab in the bottom dock.

## Network Map

The Network Explorer displays an interactive world map powered by geographic data. Each node in the P2P network appears as a marker on the map:

- **Your node** — Displayed as a larger marker (6px) at your geolocation.
- **Peer nodes** — Shown as smaller markers (4px) at their respective locations.

The map automatically centers on your node's geographic position based on your public IP address.

## Peer List

Below the map, you will see a list of all discovered peers with the following information:

- **Peer ID** — A truncated identifier (first 12 characters) for each node.
- **Connection status** — A colored dot indicates:
  - **Green** — Connected and active.
  - **Gray** — Discovered but currently disconnected.
- **Network type** — Whether the peer is on your local network (LAN) or on the internet.
- **Addresses** — Number of network addresses associated with the peer.

## Daemon Control

The top-right corner of the application header shows the **Daemon Status Button**:

- **Red dot** — Daemon is stopped. Click to start it.
- **Green dot** — Daemon is running. Click to stop it.
- **Yellow dot** — Checking daemon status.

When starting the daemon, the application retries up to 5 times (with 500ms delays) to allow the gRPC server to initialize.

## Current Limitations

- Peer discovery is limited to **local network (LAN)** via mDNS. Internet peer discovery is not yet available.
- Geolocation data is fetched from a public API (ipapi.co) and requires internet access.
- The Dashboard and Settings sections are under development.
