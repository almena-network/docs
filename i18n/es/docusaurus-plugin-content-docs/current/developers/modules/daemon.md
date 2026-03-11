---
sidebar_position: 1
title: "Modulo: Daemon"
sidebar_label: Daemon
---

# Modulo: Daemon (`almenad`)

El daemon es el servicio principal en segundo plano de Almena Network. Proporciona la API gRPC y gestiona la red P2P.

## Vision General

| Propiedad | Valor |
|-----------|-------|
| Nombre del crate | `almenad` |
| Lenguaje | Rust 2021 |
| Version | `2026.1.1-develop` |
| Licencia | Apache-2.0 OR MIT |
| Repositorio | `almena-network/daemon` |

## Estructura del Codigo Fuente

```
daemon/
├── src/
│   ├── main.rs          # gRPC server, CLI args, service handlers
│   ├── p2p.rs           # libp2p swarm, mDNS discovery, PeerStore, geo exchange
│   ├── rest.rs          # Axum REST router, Swagger UI
│   ├── geolocation.rs   # Geo cache serialization/deserialization
│   └── path.rs          # Platform-specific data directories
├── proto/
│   └── almena/daemon/v1/
│       └── service.proto  # gRPC service contract (source of truth)
├── scripts/
│   ├── dev.sh           # Dev mode launcher
│   └── package.sh       # Packaging script
├── assets/
│   ├── macos/           # LaunchAgent, postinstall, uninstall
│   ├── debian/          # systemd service, postinst/postrm
│   └── wix/             # Windows MSI config
├── build.rs             # tonic-build proto compilation
├── Cargo.toml           # Dependencies
└── Taskfile.yml         # Task orchestration
```

## Dependencias Clave

| Dependencia | Version | Proposito |
|-------------|---------|-----------|
| tonic | 0.12 | Framework de servidor gRPC |
| prost | 0.13 | Serializacion de Protocol Buffers |
| libp2p | 0.56 | Red peer-to-peer |
| tokio | 1 | Runtime asincrono |
| clap | 4 | Parsing de argumentos CLI |
| reqwest | 0.12 | Cliente HTTP (API de geolocalizacion) |
| sysinfo | 0.31 | Informacion del sistema operativo |
| tracing | 0.1 | Logging estructurado |

## Arquitectura

### Servidor gRPC (`main.rs`)

La struct `DaemonServiceImpl` implementa 5 handlers RPC:

1. **Ping** — Retorna `"pong"` (verificacion de salud)
2. **GetVersion** — Retorna `CARGO_PKG_VERSION`
3. **GetSystemInfo** — Usa el crate `sysinfo` para obtener nombre/version del SO
4. **GetGeolocation** — Llamada HTTP a ipapi.co, retorna IP/ciudad/coordenadas
5. **ListPeers** — Lee del `PeerStore` compartido

El servidor inicia con la reflexion gRPC habilitada, permitiendo que herramientas como Postman y grpcurl descubran los metodos automaticamente.

### REST API (`rest.rs`)

Un router HTTP con Axum proporciona endpoints REST ligeros:

- `GET /status` — Estado del daemon, version, direcciones gRPC/REST
- `GET /api/v1/status` — Lo mismo (versionado)
- `GET /swagger-ui/` — Documentacion interactiva OpenAPI 3.0

Direccion por defecto: `127.0.0.1:8080` (configurable via `--rest-addr`).

### Red P2P (`p2p.rs`)

La capa P2P usa libp2p con:

- **Transporte:** TCP
- **Cifrado:** Protocolo Noise
- **Multiplexacion:** Yamux
- **Behaviours:** Ping + mDNS (descubrimiento de peers en LAN) + protocolo personalizado `/almena/geo/1.0`

El `PeerStore` es un `Arc<RwLock<HashMap<PeerId, PeerEntry>>>` thread-safe compartido entre los handlers gRPC y el bucle de eventos del swarm.

**Manejo de eventos:**
- `NewListenAddr` — Registra las direcciones propias del daemon
- `ConnectionEstablished` — Agrega peer, marca como conectado, detecta LAN vs internet
- `ConnectionClosed` — Marca peer como desconectado
- `Mdns::Discovered` — Agrega nuevos peers e intenta la conexion
- `Mdns::Expired` — Marca peers como desconectados

### Directorios de Datos (`path.rs`)

| Modo | macOS | Linux | Windows |
|------|-------|-------|---------|
| Produccion | `~/Library/Application Support/network.almena.daemon` | `~/.local/share/network.almena.daemon` | `%APPDATA%\network.almena.daemon` |
| Desarrollo | `./workspace` | `./workspace` | `./workspace` |

Subdirectorios: `data/`, `config/`, `logs/`

## Desarrollo

```bash
# Instalar dependencias
task install

# Ejecutar con hot reload
task dev

# Ejecutar tests
task test

# Lint
task clippy

# Formatear
task fmt
```

## Empaquetado

El daemon puede empaquetarse como un instalador nativo para cada plataforma:

```bash
task package          # Auto-detectar plataforma
task package:darwin   # macOS .pkg (firmado + notarizado)
task package:linux    # Linux .deb
task package:windows  # Windows .msi
```

### Integracion con la Plataforma

- **macOS**: LaunchAgent en `~/Library/LaunchAgents/network.almena.daemon.plist` (inicio automatico al login)
- **Linux**: Servicio systemd de usuario (`systemctl --user start almenad`)
- **Windows**: Servicio de Windows (`sc start AlmenaD`)
