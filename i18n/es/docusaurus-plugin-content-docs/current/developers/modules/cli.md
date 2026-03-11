---
sidebar_position: 4
title: "Modulo: CLI"
sidebar_label: CLI
---

# Modulo: CLI

El CLI proporciona una interfaz de usuario en terminal (TUI) para gestionar y monitorear el daemon de Almena.

## Vision General

| Propiedad | Valor |
|-----------|-------|
| Nombre del crate | `almena-cli` |
| Lenguaje | Rust 2021 |
| Version | `2026.3.5` |
| Licencia | Apache-2.0 OR MIT |
| Repositorio | `almena-network/cli` |

## Estructura del Codigo Fuente

```
cli/
├── src/
│   ├── main.rs              # Entry point, CLI args
│   ├── tui.rs               # Ratatui TUI main loop
│   ├── daemon.rs            # gRPC client to daemon
│   ├── daemon_process.rs    # Process spawning/management
│   ├── theme.rs             # Design system colors
│   └── path.rs              # Platform-specific data directories
├── proto/
│   └── almena/daemon/v1/
│       └── service.proto    # gRPC service definition (copied from daemon)
├── build.rs                 # tonic-build proto compilation
├── Cargo.toml               # Dependencies
└── Taskfile.yml             # Task orchestration
```

## Dependencias Clave

| Dependencia | Version | Proposito |
|-------------|---------|-----------|
| ratatui | 0.29 | Framework de UI en terminal |
| crossterm | 0.28 | Entrada/salida de terminal |
| tonic | 0.12 | Cliente gRPC |
| prost | 0.13 | Serializacion de Protocol Buffers |
| tokio | 1 | Runtime asincrono |
| clap | 4 | Parsing de argumentos CLI |
| anyhow | 1 | Manejo de errores |

## Funcionalidades Implementadas

### Interfaz TUI

La TUI ejecuta un bucle de eventos asincrono con polling de 100ms:

**Comandos de Teclado:**

| Tecla | Accion |
|-------|--------|
| `s` | Iniciar el daemon |
| `x` | Detener el daemon |
| `p` | Hacer ping al daemon |
| `q` / `Esc` | Salir del CLI |

**Disposicion de la UI:**
1. **Header** — Tagline e indicador de estado del daemon
2. **Tarjeta de Estado** — Punto de color mostrando el estado del daemon:
   - Rojo = Detenido
   - Verde = Ejecutando
   - Amarillo = Verificando
3. **Area Principal** — Comandos disponibles, direccion del daemon, salida del ultimo comando
4. **Footer** — Atajos de teclado

### Monitoreo de Estado del Daemon

Una tarea en segundo plano verifica el estado del daemon cada **2 segundos** mediante un ping gRPC. El indicador de estado se actualiza automaticamente.

### Cliente gRPC

El modulo `daemon.rs` proporciona:

```rust
pub async fn is_running(addr: &str) -> bool  // Ping check
pub async fn ping(addr: &str) -> String       // Ping with response message
```

### Gestion del Proceso del Daemon

Misma gestion en doble modo que la app de escritorio:

| Modo | Iniciar | Detener |
|------|---------|---------|
| **Desarrollo** | Lanza el binario desde `ALMENAD_DIR` | Mata el proceso hijo |
| **macOS** | `launchctl load ...plist` | `launchctl unload ...plist` |
| **Linux** | `systemctl --user start almenad` | `systemctl --user stop almenad` |
| **Windows** | `sc start AlmenaD` | `sc stop AlmenaD` |

### Tema

El CLI usa un tema de colores consistente con el sistema de diseno de la plataforma:

| Color | Hex | Uso |
|-------|-----|-----|
| Primario | `#FB923C` | Elementos activos, resaltados |
| Secundario | `#8B5CF6` | Acentos |
| Texto | `#fafafa` | Texto principal |
| Atenuado | `#a3a3a3` | Etiquetas, indicaciones |
| Exito | Verde | Estado ejecutando |
| Error | Rojo | Estado detenido |
| Advertencia | Amarillo | Estado verificando |

## Desarrollo

```bash
# Instalar dependencias
task install

# Ejecutar en modo desarrollo
task dev

# Compilar para release
task build

# Verificar compilacion
task check
```

### Argumentos CLI

| Flag | Valor por defecto | Descripcion |
|------|-------------------|-------------|
| `--daemon-addr` | `http://127.0.0.1:50051` | Direccion gRPC del daemon |
| `--version` | — | Imprimir version y salir |

### Flujo de Proto

Despues de cambios en el proto del daemon:

```bash
task proto:copy     # Copiar proto desde el daemon
task proto:client   # Reconstruir cliente gRPC (incluye proto:copy)
```
