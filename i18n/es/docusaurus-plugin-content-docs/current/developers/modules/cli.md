---
sidebar_position: 4
title: "Módulo: CLI"
sidebar_label: CLI
---

# Módulo: CLI

El CLI proporciona una interfaz de usuario en terminal (TUI) para gestionar y monitorear el daemon de Almena.

## Visión General

| Propiedad | Valor |
|-----------|-------|
| Nombre del crate | `almena-cli` |
| Lenguaje | Rust 2021 |
| Versión | `2026.3.5` |
| Licencia | Apache-2.0 OR MIT |
| Repositorio | `almena-network/cli` |

## Estructura del Código

```
cli/
├── src/
│   ├── main.rs              # Punto de entrada, args CLI
│   ├── tui.rs               # Loop principal TUI con ratatui
│   ├── daemon.rs            # Cliente gRPC al daemon
│   ├── daemon_process.rs    # Lanzamiento/gestión de procesos
│   ├── theme.rs             # Colores del sistema de diseño
│   └── path.rs              # Directorios de datos por plataforma
├── proto/
│   └── almena/daemon/v1/
│       └── service.proto    # Definición de servicio gRPC (copiado del daemon)
├── build.rs                 # Compilación proto con tonic-build
├── Cargo.toml               # Dependencias
└── Taskfile.yml             # Orquestación de tareas
```

## Dependencias Principales

| Dependencia | Versión | Propósito |
|------------|---------|-----------|
| ratatui | 0.29 | Framework de UI en terminal |
| crossterm | 0.28 | Entrada/salida de terminal |
| tonic | 0.12 | Cliente gRPC |
| prost | 0.13 | Serialización Protocol Buffer |
| tokio | 1 | Runtime asíncrono |
| clap | 4 | Parseo de argumentos CLI |
| anyhow | 1 | Manejo de errores |

## Funcionalidades Implementadas

### Interfaz TUI

El TUI ejecuta un loop de eventos asíncrono con polling de 100ms:

**Comandos de Teclado:**

| Tecla | Acción |
|-------|--------|
| `s` | Iniciar el daemon |
| `x` | Detener el daemon |
| `p` | Hacer ping al daemon |
| `q` / `Esc` | Salir del CLI |

**Diseño de UI:**
1. **Header** — Tagline e indicador de estado del daemon
2. **Tarjeta de Estado** — Punto de color mostrando estado del daemon:
   - Rojo = Detenido
   - Verde = Ejecutándose
   - Amarillo = Verificando
3. **Área Principal** — Comandos disponibles, dirección del daemon, última salida de comando
4. **Footer** — Atajos de teclado

### Monitoreo de Estado del Daemon

Una tarea en segundo plano verifica el estado del daemon cada **2 segundos** intentando un ping gRPC. El indicador de estado se actualiza automáticamente.

### Cliente gRPC

El módulo `daemon.rs` proporciona:

```rust
pub async fn is_running(addr: &str) -> bool  // Verificación de ping
pub async fn ping(addr: &str) -> String       // Ping con mensaje de respuesta
```

### Gestión del Proceso Daemon

Misma gestión dual como la app de escritorio:

| Modo | Iniciar | Detener |
|------|---------|---------|
| **Desarrollo** | Lanza binario desde `ALMENAD_DIR` | Mata proceso hijo |
| **macOS** | `launchctl load ...plist` | `launchctl unload ...plist` |
| **Linux** | `systemctl --user start almenad` | `systemctl --user stop almenad` |
| **Windows** | `sc start AlmenaD` | `sc stop AlmenaD` |

### Tema

El CLI usa un tema de colores consistente con el sistema de diseño de la plataforma:

| Color | Hex | Uso |
|-------|-----|-----|
| Primario | `#FB923C` | Elementos activos, resaltados |
| Secundario | `#8B5CF6` | Acentos |
| Texto | `#fafafa` | Texto principal |
| Atenuado | `#a3a3a3` | Etiquetas, indicaciones |
| Éxito | Verde | Estado ejecutándose |
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

# Verificar compilación
task check
```

### Argumentos CLI

| Flag | Por defecto | Descripción |
|------|-------------|-------------|
| `--daemon-addr` | `http://127.0.0.1:50051` | Dirección gRPC del daemon |
| `--version` | — | Imprimir versión y salir |

### Flujo de Proto

Después de cambios en el proto del daemon:

```bash
task proto:copy     # Copiar proto del daemon
task proto:client   # Recompilar cliente gRPC (incluye proto:copy)
```
