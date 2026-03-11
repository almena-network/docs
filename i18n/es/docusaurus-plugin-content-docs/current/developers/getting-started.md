---
sidebar_position: 2
title: Primeros Pasos
sidebar_label: Primeros Pasos
---

# Primeros Pasos

Esta guia te acompana en la configuracion del entorno de desarrollo de Almena Network.

## Requisitos Previos

### Herramientas Requeridas

| Herramienta | Version | Instalacion |
|-------------|---------|-------------|
| **Rust** | 2021 edition | [rustup.rs](https://rustup.rs/) |
| **Node.js** | >= 24 | [nodejs.org](https://nodejs.org/) |
| **pnpm** | >= 10 | `npm install -g pnpm` |
| **protoc** | Ultima | Ver abajo |
| **Task** | >= 3 | [taskfile.dev](https://taskfile.dev/) |

### Instalar protoc

El compilador de Protocol Buffers es necesario para compilar el daemon y cualquier cliente gRPC:

```bash
# macOS
brew install protobuf

# Linux (Debian/Ubuntu)
sudo apt install protobuf-compiler

# Windows
choco install protoc
```

### Requisitos de Tauri v2

Para el desarrollo de desktop y wallet, necesitas las dependencias del sistema de Tauri v2:

- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: Ver [requisitos de Tauri](https://v2.tauri.app/start/prerequisites/)
- **Windows**: Visual Studio Build Tools con carga de trabajo de C++

## Clonar el Repositorio

```bash
git clone --recurse-submodules git@github.com:almena-network/almena-network.git
cd almena-network
```

Si ya clonaste sin `--recurse-submodules`:

```bash
git submodule update --init --recursive
```

Todos los submodulos siguen la rama `develop`.

## Instalar Dependencias

```bash
task install
```

Esto ejecuta `task install` en cada submodulo (daemon, desktop, wallet, cli).

## Ejecucion en Desarrollo

Cada modulo tiene su propio comando de desarrollo:

```bash
# Iniciar el daemon (requerido por desktop y CLI)
task daemon:dev

# En una terminal separada, iniciar la app de escritorio
task desktop:dev

# O iniciar el wallet
task wallet:dev

# O iniciar el CLI
task cli:dev
```

:::tip
Siempre inicia el daemon primero. La app de escritorio y el CLI se conectan a el via gRPC en `[::1]:50051`.
:::

## Tareas Comunes

```bash
# Verificacion de tipos / compilacion de todos los modulos
task check

# Compilar todos los modulos (release)
task build

# Limpiar todos los artefactos de compilacion
task clean
```

### Especificas del Daemon

```bash
task daemon:test       # Ejecutar tests
task daemon:clippy     # Lint con Clippy
task daemon:fmt        # Formatear codigo
task daemon:fmt:check  # Verificar formato
```

### Flujo de Proto

Despues de editar `daemon/proto/almena/daemon/v1/service.proto`:

```bash
# Actualizar cliente de desktop
task desktop:proto:copy && task desktop:proto:client

# Actualizar cliente de CLI
task cli:proto:copy && task cli:proto:client
```

## Estructura del Proyecto

```
almena-network/
├── daemon/          # Servidor gRPC en Rust + red P2P
├── desktop/         # Tauri v2 + React 19 consola de administracion
├── wallet/          # Tauri v2 + React 19 wallet de identidad
├── cli/             # Cliente TUI en Rust
├── docs/            # Documentacion con Docusaurus
├── Taskfile.yml     # Orquestacion raiz
├── CLAUDE.md        # Instrucciones para asistente IA
└── LICENSE          # Apache-2.0 OR MIT
```

Cada submodulo tiene su propio `Taskfile.yml`, `README.md` y configuracion independiente de CI/CD.
