---
sidebar_position: 3
title: "Módulo: Wallet"
sidebar_label: Wallet
---

# Módulo: Wallet

La wallet es una aplicación mobile-first para **Titulares** — individuos que crean y gestionan su identidad descentralizada.

## Visión General

| Propiedad | Valor |
|-----------|-------|
| Identificador | `network.almena.wallet` |
| Framework | Tauri v2 + React 19 |
| Versión | `2026.2.26` |
| Tamaño de ventana | 390×844 (mín 360×640, máx 768×1024) |
| Repositorio | `almena-network/wallet` |

## Estructura del Código

```
wallet/
├── src/                          # Frontend React
│   ├── main.tsx                  # Punto de entrada
│   ├── App.tsx                   # Configuración del router (React Router v7)
│   ├── App.css                   # Tokens de diseño (glassmorphism)
│   ├── pages/
│   │   ├── Onboarding.tsx        # Crear o recuperar identidad
│   │   ├── Onboarding.css        # Estilo glassmorphism
│   │   ├── CreatePassword.tsx    # Configuración de contraseña con validación
│   │   └── CreatePassword.css    # Estilo del formulario
│   └── assets/
│
├── src-tauri/                    # Backend Rust
│   ├── src/
│   │   ├── main.rs               # Punto de entrada Tauri
│   │   └── lib.rs                # Comandos Tauri (mínimo)
│   ├── tauri.conf.json           # Configuración de la app
│   └── Cargo.toml                # Dependencias Rust
│
├── public/
│   └── logo.png                  # Logo de Almena Network
├── package.json                  # Dependencias Node
├── vite.config.ts                # Configuración Vite
└── Taskfile.yml                  # Orquestación de tareas
```

## Funcionalidades Implementadas

### Enrutamiento

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `Onboarding` | Pantalla inicial con opciones crear/recuperar |
| `/register/password` | `CreatePassword` | Configuración de contraseña con validación en tiempo real |

### Pantalla de Onboarding

- Dos botones de acción:
  - **Registrar cuenta** (primario, naranja) — Navega a creación de contraseña
  - **Recuperar cuenta** (estilo glass) — Placeholder (UC-002, aún no implementado)
- Iconos SVG personalizados (Plus, Rotate)
- Completamente estilizado con glassmorphism

### Crear Contraseña

- Validación de contraseña en tiempo real con retroalimentación visual:
  - Mínimo 8 caracteres
  - Al menos una letra mayúscula
  - Al menos una letra minúscula
  - Al menos un dígito
- Confirmación de contraseña con validación de coincidencia
- Botón mostrar/ocultar en ambos campos
- Submit deshabilitado hasta que todas las reglas se cumplan
- Interfaz en español

## Backend Rust

Actualmente mínimo — solo el comando `greet` por defecto está implementado:

```rust
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

**No hay cliente gRPC** configurado aún. La wallet no se comunica con el daemon en esta etapa.

## Sistema de Diseño

La wallet comparte el mismo sistema de diseño glassmorphism que la app de escritorio, con ajustes específicos para móvil:

| Token | Valor |
|-------|-------|
| Fondo glass | `rgba(255,255,255,0.04)` |
| Borde glass | `rgba(255,255,255,0.06)` |
| Backdrop blur | 16px |
| Targets táctiles | 48px altura mínima |
| Sin scroll | Contenido cabe en viewport 390×844 |

## Desarrollo

```bash
# Instalar dependencias
task install

# Ejecutar en modo desarrollo
task dev

# Verificación de tipos
task check

# Compilar para producción
task build
```

## Implementación Pendiente

- **Generación de frase de recuperación** (mnemónico BIP39 — UC-001 Paso 3)
- **Recuperación de identidad** desde mnemónico (UC-002)
- **Integración de cliente gRPC** con daemon
- **Gestión de credenciales** (recibir, almacenar, presentar)
- **Autenticación biométrica** (Touch ID/Face ID)
- **Código QR de identidad** para mostrar
- **Mensajería DIDComm**
- **Almacenamiento de claves** en llavero del SO
