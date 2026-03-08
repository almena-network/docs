---
sidebar_position: 3
title: Referencia de API gRPC
sidebar_label: Referencia de API gRPC
---

# Referencia de API gRPC

El daemon de Almena expone una API gRPC definida en el paquete `almena.daemon.v1`. El endpoint por defecto es `[::1]:50051` (localhost IPv6).

## Servicio: DaemonService

### Ping

Verificación de salud para confirmar que el daemon está ejecutándose.

```protobuf
rpc Ping(PingRequest) returns (PingResponse);
```

**Solicitud**: Mensaje vacío.

**Respuesta**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | `string` | Siempre retorna `"pong"` |

---

### GetVersion

Retorna la cadena de versión del daemon.

```protobuf
rpc GetVersion(GetVersionRequest) returns (GetVersionResponse);
```

**Solicitud**: Mensaje vacío.

**Respuesta**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `version` | `string` | Versión del daemon (ej., `"2026.1.1-develop"`) |

---

### GetSystemInfo

Retorna información sobre el sistema operativo del host.

```protobuf
rpc GetSystemInfo(GetSystemInfoRequest) returns (GetSystemInfoResponse);
```

**Solicitud**: Mensaje vacío.

**Respuesta**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `os_name` | `string` | Nombre del sistema operativo (ej., `"macOS"`) |
| `os_version` | `string` | Versión del SO (ej., `"15.3.2"`) |

---

### GetGeolocation

Retorna datos de geolocalización basados en la dirección IP pública del nodo. Los datos se obtienen de la API de ipapi.co.

```protobuf
rpc GetGeolocation(GetGeolocationRequest) returns (GetGeolocationResponse);
```

**Solicitud**: Mensaje vacío.

**Respuesta**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `ip` | `string` | Dirección IP pública |
| `city` | `string` | Nombre de la ciudad |
| `region` | `string` | Región o estado |
| `country_code` | `string` | Código de país ISO (ej., `"US"`) |
| `country_name` | `string` | Nombre completo del país |
| `timezone` | `string` | Identificador de zona horaria (ej., `"America/New_York"`) |
| `latitude` | `double` | Latitud geográfica |
| `longitude` | `double` | Longitud geográfica |

:::note
Este endpoint requiere acceso a internet. Retornará un error gRPC si la API externa no está disponible.
:::

---

### ListPeers

Retorna todos los peers P2P descubiertos, incluyendo el nodo local.

```protobuf
rpc ListPeers(ListPeersRequest) returns (ListPeersResponse);
```

**Solicitud**: Mensaje vacío.

**Respuesta**:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `peers` | `PeerInfo[]` | Lista de peers descubiertos |

#### PeerInfo

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `peer_id` | `string` | Identificador único del peer (libp2p PeerId) |
| `addresses` | `string[]` | Multidirecciones donde este peer es alcanzable |
| `is_internal` | `bool` | `true` si el peer está en la red local (LAN) |
| `is_connected` | `bool` | `true` si está actualmente conectado |
| `is_self` | `bool` | `true` si esta entrada representa al daemon local |
| `geo` | `GetGeolocationResponse?` | Geolocalización de este peer (cuando está disponible) |

---

## Archivo Proto

La definición proto canónica se encuentra en:

```
daemon/proto/almena/daemon/v1/service.proto
```

### Definición Completa

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

El daemon tiene habilitado **gRPC Server Reflection**. Herramientas compatibles (Postman, grpcurl, BloomRPC) pueden descubrir todos los servicios y métodos disponibles automáticamente sin necesitar el archivo proto.

## Ejemplos de Conexión

### grpcurl

```bash
# Listar todos los servicios
grpcurl -plaintext '[::1]:50051' list

# Llamar Ping
grpcurl -plaintext '[::1]:50051' almena.daemon.v1.DaemonService/Ping

# Obtener versión
grpcurl -plaintext '[::1]:50051' almena.daemon.v1.DaemonService/GetVersion

# Listar peers
grpcurl -plaintext '[::1]:50051' almena.daemon.v1.DaemonService/ListPeers
```

### Rust (tonic)

```rust
use tonic::transport::Channel;

// Generado desde proto
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

    println!("Respuesta: {}", response.into_inner().message);
    Ok(())
}
```
