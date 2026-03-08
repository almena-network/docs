---
sidebar_position: 3
title: gRPC API Reference
sidebar_label: gRPC API Reference
---

# gRPC API Reference

The Almena daemon exposes a gRPC API defined in the `almena.daemon.v1` package. The default endpoint is `[::1]:50051` (IPv6 localhost).

## Service: DaemonService

### Ping

Health check to verify the daemon is running.

```protobuf
rpc Ping(PingRequest) returns (PingResponse);
```

**Request**: Empty message.

**Response**:

| Field | Type | Description |
|-------|------|-------------|
| `message` | `string` | Always returns `"pong"` |

---

### GetVersion

Returns the daemon's version string.

```protobuf
rpc GetVersion(GetVersionRequest) returns (GetVersionResponse);
```

**Request**: Empty message.

**Response**:

| Field | Type | Description |
|-------|------|-------------|
| `version` | `string` | Daemon version (e.g., `"2026.1.1-develop"`) |

---

### GetSystemInfo

Returns information about the host operating system.

```protobuf
rpc GetSystemInfo(GetSystemInfoRequest) returns (GetSystemInfoResponse);
```

**Request**: Empty message.

**Response**:

| Field | Type | Description |
|-------|------|-------------|
| `os_name` | `string` | Operating system name (e.g., `"macOS"`) |
| `os_version` | `string` | OS version string (e.g., `"15.3.2"`) |

---

### GetGeolocation

Returns geolocation data based on the node's public IP address. Data is fetched from the ipapi.co API.

```protobuf
rpc GetGeolocation(GetGeolocationRequest) returns (GetGeolocationResponse);
```

**Request**: Empty message.

**Response**:

| Field | Type | Description |
|-------|------|-------------|
| `ip` | `string` | Public IP address |
| `city` | `string` | City name |
| `region` | `string` | Region or state |
| `country_code` | `string` | ISO country code (e.g., `"US"`) |
| `country_name` | `string` | Full country name |
| `timezone` | `string` | Timezone identifier (e.g., `"America/New_York"`) |
| `latitude` | `double` | Geographic latitude |
| `longitude` | `double` | Geographic longitude |

:::note
This endpoint requires internet access. It will return a gRPC error if the external API is unavailable.
:::

---

### ListPeers

Returns all discovered P2P peers, including the local node.

```protobuf
rpc ListPeers(ListPeersRequest) returns (ListPeersResponse);
```

**Request**: Empty message.

**Response**:

| Field | Type | Description |
|-------|------|-------------|
| `peers` | `PeerInfo[]` | List of discovered peers |

#### PeerInfo

| Field | Type | Description |
|-------|------|-------------|
| `peer_id` | `string` | Unique peer identifier (libp2p PeerId) |
| `addresses` | `string[]` | Multiaddresses where this peer is reachable |
| `is_internal` | `bool` | `true` if the peer is on the local network (LAN) |
| `is_connected` | `bool` | `true` if currently connected |
| `is_self` | `bool` | `true` if this entry represents the local daemon |
| `geo` | `GetGeolocationResponse?` | Geolocation for this peer (when available) |

---

## Proto File

The canonical proto definition is located at:

```
daemon/proto/almena/daemon/v1/service.proto
```

### Full Definition

```protobuf
syntax = "proto3";

package almena.daemon.v1;

service DaemonService {
  rpc Ping(PingRequest) returns (PingResponse);
  rpc GetVersion(GetVersionRequest) returns (GetVersionResponse);
  rpc GetSystemInfo(GetSystemInfoRequest) returns (GetSystemInfoResponse);
  rpc GetGeolocation(GetGeolocationRequest) returns (GetGeolocationResponse);
  rpc ListPeers(ListPeersRequest) returns (ListPeersResponse);
}

message PingRequest {}
message PingResponse { string message = 1; }

message GetVersionRequest {}
message GetVersionResponse { string version = 1; }

message GetSystemInfoRequest {}
message GetSystemInfoResponse {
  string os_name = 1;
  string os_version = 2;
}

message GetGeolocationRequest {}
message GetGeolocationResponse {
  string ip = 1;
  string city = 2;
  string region = 3;
  string country_code = 4;
  string country_name = 5;
  string timezone = 6;
  double latitude = 7;
  double longitude = 8;
}

message ListPeersRequest {}
message ListPeersResponse {
  repeated PeerInfo peers = 1;
}

message PeerInfo {
  string peer_id = 1;
  repeated string addresses = 2;
  bool is_internal = 3;
  bool is_connected = 4;
  bool is_self = 5;
  GetGeolocationResponse geo = 6;
}
```

## Server Reflection

The daemon has **gRPC Server Reflection** enabled. Compatible tools (Postman, grpcurl, BloomRPC) can discover all available services and methods automatically without needing the proto file.

## Connection Examples

### grpcurl

```bash
# List all services
grpcurl -plaintext '[::1]:50051' list

# Call Ping
grpcurl -plaintext '[::1]:50051' almena.daemon.v1.DaemonService/Ping

# Get version
grpcurl -plaintext '[::1]:50051' almena.daemon.v1.DaemonService/GetVersion

# List peers
grpcurl -plaintext '[::1]:50051' almena.daemon.v1.DaemonService/ListPeers
```

### Rust (tonic)

```rust
use tonic::transport::Channel;

// Generated from proto
pub mod daemon {
    tonic::include_proto!("almena.daemon.v1");
}

use daemon::daemon_service_client::DaemonServiceClient;
use daemon::PingRequest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let channel = Channel::from_static("http://[::1]:50051")
        .connect()
        .await?;

    let mut client = DaemonServiceClient::new(channel);
    let response = client.ping(PingRequest {}).await?;

    println!("Response: {}", response.into_inner().message);
    Ok(())
}
```
