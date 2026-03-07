---
sidebar_position: 2
title: "Módulo: Desktop"
sidebar_label: Desktop
---

# Módulo: Desktop

La aplicación de escritorio es la consola de administración para organizaciones que actúan como **Emisores** (emisores de credenciales) y **Solicitantes** (verificadores de credenciales).

## Visión General

| Propiedad | Valor |
|-----------|-------|
| Identificador | `network.almena.desktop.dev` |
| Framework | Tauri v2 + React 19 |
| Versión | `2026.3.5-alpha` |
| Tamaño de ventana | 1440×900 (mín 1024×768) |
| Repositorio | `almena-network/desktop` |

## Estructura del Código

```
desktop/
├── src/                          # Frontend React
│   ├── main.tsx                  # Punto de entrada
│   ├── App.tsx                   # Navegación y enrutamiento
│   ├── App.css                   # Tokens de diseño (glassmorphism)
│   ├── components/
│   │   ├── AppHeader.tsx         # Barra superior con estado del daemon
│   │   ├── DaemonStatusButton.tsx # Control iniciar/detener daemon
│   │   ├── Dock.tsx              # Navegación inferior con iconos SVG
│   │   └── Footer.tsx            # Versión y enlace a GitHub
│   ├── pages/
│   │   ├── Login.tsx             # Autenticación por código QR
│   │   ├── Network.tsx           # Mapa mundial + lista de peers
│   │   ├── Dashboard.tsx         # Resumen (esqueleto)
│   │   └── Settings.tsx          # Placeholder
│   └── i18n/                     # Traducciones inglés y español
│
├── src-tauri/                    # Backend Rust
│   ├── src/
│   │   ├── main.rs               # Punto de entrada Tauri
│   │   ├── lib.rs                # Comandos Tauri
│   │   ├── grpc.rs               # Cliente gRPC al daemon
│   │   └── daemon.rs             # Gestión del proceso daemon
│   ├── proto/                    # Archivos proto (copiados del daemon)
│   ├── tauri.conf.json           # Configuración de la app
│   └── Cargo.toml                # Dependencias Rust
│
├── package.json                  # Dependencias Node
├── vite.config.ts                # Configuración Vite
└── Taskfile.yml                  # Orquestación de tareas
```

## Funcionalidades Implementadas

### Página de Login

- Código QR que rota cada **30 segundos** con un nuevo desafío
- Payload del QR: `almena:login:{timestamp}:{UUID}`
- Botón de omitir para desarrollo/pruebas
- Soporte i18n (inglés/español)

### Explorador de Red

- **Mapa mundial** interactivo (react-simple-maps) centrado en el nodo local
- Marcadores de peers con estado de conexión (verde = conectado, gris = desconectado)
- Lista de peers mostrando: Peer ID truncado, tipo LAN/Internet, cantidad de direcciones
- Datos en tiempo real de los RPCs `ListPeers` y `GetGeolocation` del daemon

### Control del Daemon

- Botón de estado en el header: rojo (detenido), verde (ejecutándose), amarillo (verificando)
- Click para iniciar/detener el proceso daemon
- Lógica de reintento: 5 intentos con retrasos de 500ms al iniciar

### Internacionalización

- Idiomas soportados: Inglés (en), Español (es)
- Auto-detecta la preferencia de idioma del SO
- Claves de recursos organizadas por dominio: `app.*`, `nav.*`, `login.*`, `daemon.*`, `network.*`

## Comandos Tauri

Comandos expuestos al frontend React vía `invoke()`:

| Comando | Retorna | Descripción |
|---------|---------|-------------|
| `start_daemon()` | `Result<String>` | Iniciar el proceso daemon |
| `stop_daemon()` | `Result<String>` | Detener el proceso daemon |
| `list_peers()` | `Result<Vec<PeerInfoJson>>` | Obtener peers del daemon |
| `get_geolocation()` | `Result<GeolocationJson>` | Obtener geolocalización del nodo |

## Integración gRPC

El backend Rust (`src-tauri/src/grpc.rs`) actúa como puente entre el frontend React y el daemon:

1. React llama `invoke("list_peers")` vía IPC de Tauri
2. El handler Rust conecta al daemon en `DAEMON_GRPC_URL` (por defecto: `http://[::1]:50051`)
3. La respuesta gRPC se convierte a structs serializables a JSON
4. La respuesta JSON se retorna a React

## Gestión del Proceso Daemon

La app de escritorio gestiona el ciclo de vida del daemon de forma diferente en desarrollo vs producción:

| Modo | Iniciar | Detener |
|------|---------|---------|
| **Desarrollo** | Lanza binario desde `ALMENAD_DIR` | Mata proceso por PID |
| **macOS** | `launchctl load ...plist` | `launchctl unload ...plist` |
| **Linux** | `systemctl --user start almenad` | `systemctl --user stop almenad` |
| **Windows** | `sc start AlmenaD` | `sc stop AlmenaD` |

## Desarrollo

```bash
# Instalar dependencias
task install

# Ejecutar en modo desarrollo (inicia Vite + Tauri)
task dev

# Verificación de tipos
task check

# Compilar para producción
task build

# Previsualizar frontend compilado
task preview
```

### Variables de Entorno

| Variable | Por defecto | Descripción |
|----------|-------------|-------------|
| `DAEMON_GRPC_URL` | `http://[::1]:50051` | Endpoint gRPC del daemon |
| `ALMENAD_DIR` | `../../daemon/target/debug` | Ruta al binario del daemon (modo desarrollo) |

### Flujo de Proto

Después de cambios en el proto del daemon:

```bash
task proto:copy     # Copiar proto del daemon
task proto:client   # Recompilar cliente gRPC
```

## Implementación Pendiente

- **Dashboard** — Actualmente un esqueleto con grid vacío
- **Configuración** — Página placeholder
- Flujos de **emisión de credenciales**
- Manejo de **solicitudes de presentación**
- UI de **gestión de organizaciones**
