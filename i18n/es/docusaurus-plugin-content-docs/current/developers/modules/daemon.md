---
sidebar_position: 1
title: "Módulo: Daemon"
sidebar_label: Daemon
---

# Módulo: Daemon (`almenad`)

El daemon es el servicio en segundo plano principal de Almena Network. Proporciona la API gRPC y gestiona la red P2P.

## Visión General

| Propiedad | Valor |
|-----------|-------|
| Nombre del crate | `almenad` |
| Lenguaje | Rust 2021 |
| Versión | `2026.1.1-develop` |
| Licencia | Apache-2.0 OR MIT |
| Repositorio | `almena-network/daemon` |

## Estructura del Código

```
daemon/
├── src/
│   ├── main.rs          # Servidor gRPC, args CLI, handlers de servicio
│   ├── p2p.rs           # Swarm libp2p, descubrimiento mDNS, PeerStore
│   └── path.rs          # Directorios de datos específicos por plataforma
├── proto/
│   └── almena/daemon/v1/
│       └── service.proto  # Contrato de servicio gRPC (fuente de verdad)
├── scripts/
│   ├── dev.sh           # Lanzador modo desarrollo
│   └── package.sh       # Script de empaquetado
├── assets/
│   ├── macos/           # LaunchAgent, postinstall, desinstalar
│   ├── debian/          # Servicio systemd, postinst/postrm
│   └── wix/             # Configuración MSI de Windows
├── build.rs             # Compilación proto con tonic-build
├── Cargo.toml           # Dependencias
└── Taskfile.yml         # Orquestación de tareas
```

## Dependencias Principales

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| tonic | 0.12 | Framework de servidor gRPC |
| prost | 0.13 | Serialización Protocol Buffer |
| libp2p | 0.56 | Red peer-to-peer |
| tokio | 1 | Runtime asíncrono |
| clap | 4 | Parseo de argumentos CLI |
| reqwest | 0.12 | Cliente HTTP (API de geolocalización) |
| sysinfo | 0.31 | Información del SO |
| tracing | 0.1 | Logging estructurado |

## Arquitectura

### Servidor gRPC (`main.rs`)

El struct `DaemonServiceImpl` implementa 5 handlers RPC:

1. **Ping** — Retorna `"pong"` (verificación de salud)
2. **GetVersion** — Retorna `CARGO_PKG_VERSION`
3. **GetSystemInfo** — Usa el crate `sysinfo` para nombre/versión del SO
4. **GetGeolocation** — Llamada HTTP a ipapi.co, retorna IP/ciudad/coordenadas
5. **ListPeers** — Lee del `PeerStore` compartido

El servidor inicia con reflexión gRPC habilitada, permitiendo que herramientas como Postman y grpcurl descubran métodos automáticamente.

### Red P2P (`p2p.rs`)

La capa P2P usa libp2p con:

- **Transporte:** TCP
- **Cifrado:** Protocolo Noise
- **Multiplexación:** Yamux
- **Comportamientos:** Ping + mDNS (descubrimiento de peers en LAN)

El `PeerStore` es un `Arc<RwLock<HashMap<PeerId, PeerEntry>>>` thread-safe compartido entre los handlers gRPC y el loop de eventos del swarm.

**Manejo de eventos:**
- `NewListenAddr` — Registra las direcciones propias del daemon
- `ConnectionEstablished` — Agrega peer, marca conectado, detecta LAN vs internet
- `ConnectionClosed` — Marca peer como desconectado
- `Mdns::Discovered` — Agrega nuevos peers e intenta conectar
- `Mdns::Expired` — Marca peers como desconectados

### Directorios de Datos (`path.rs`)

| Modo | macOS | Linux | Windows |
|------|-------|-------|---------|
| Producción | `~/Library/Application Support/network.almena.daemon` | `~/.local/share/network.almena.daemon` | `%APPDATA%\network.almena.daemon` |
| Desarrollo | `./workspace` | `./workspace` | `./workspace` |

Subdirectorios: `data/`, `config/`, `logs/`

## Desarrollo

```bash
# Instalar dependencias
task install

# Ejecutar con recarga en caliente
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

### Integración con Plataformas

- **macOS**: LaunchAgent en `~/Library/LaunchAgents/network.almena.daemon.plist` (auto-inicio al iniciar sesión)
- **Linux**: Servicio de usuario systemd (`systemctl --user start almenad`)
- **Windows**: Servicio de Windows (`sc start AlmenaD`)
