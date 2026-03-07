---
sidebar_position: 3
title: Arquitectura
sidebar_label: Arquitectura
---

# Arquitectura

Almena Network sigue una arquitectura modular donde cada componente tiene una responsabilidad clara y se comunica a través de interfaces bien definidas.

## Visión General del Sistema

```
┌─────────────────────────────────────────────────────┐
│                Dispositivos de Usuario               │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Wallet   │  │   Desktop    │  │     CLI       │  │
│  │(Titulares)│  │ (Emisores/   │  │  (Terminal)   │  │
│  │          │  │ Solicitantes)│  │               │  │
│  └────┬─────┘  └──────┬───────┘  └───────┬───────┘  │
│       │               │                  │           │
│       │          ┌─────┴─────┐            │           │
│       │          │  Daemon   │◄───────────┘           │
│       │          │ (almenad) │                        │
│       │          │  gRPC +   │                        │
│       │          │  libp2p   │                        │
│       │          └─────┬─────┘                        │
└───────│────────────────│─────────────────────────────┘
        │                │
        │                │ P2P (mDNS, TCP+Noise+Yamux)
        │                │
        │           ┌────┴────┐
        │           │  Otros  │
        │           │ Daemons │
        │           └─────────┘
        │
        │ (futuro: DIDComm v2)
        │
   ┌────┴────┐
   │Mediador │
   │(planeado)│
   └─────────┘
```

## Componentes

### Daemon (`almenad`)

El daemon es el servicio en segundo plano principal que se ejecuta en cada nodo. Es el **único componente que participa en la red P2P**.

**Responsabilidades:**
- Exponer API gRPC para clientes locales (desktop, CLI)
- Gestionar conexiones P2P vía libp2p
- Descubrir peers en la red local (mDNS)
- Proporcionar datos de geolocalización para visualización de red

**Tecnología:** Rust, tonic 0.12, libp2p 0.56, tokio

**Endpoints RPC actuales:** Ping, GetVersion, GetSystemInfo, GetGeolocation, ListPeers

### Desktop

La aplicación de escritorio es una consola de administración diseñada para **Emisores** (entidades que emiten credenciales) y **Solicitantes** (entidades que solicitan presentaciones de credenciales).

**Responsabilidades:**
- Autenticar usuarios mediante código QR
- Visualizar la red P2P en un mapa mundial interactivo
- Controlar el ciclo de vida del daemon (iniciar/detener)
- Proporcionar interfaz de gestión de organizaciones

**Tecnología:** Tauri v2, React 19, TypeScript, tonic (cliente gRPC Rust)

**Arquitectura:** El backend Rust de Tauri actúa como puente entre el frontend React y la API gRPC del daemon. Los componentes del frontend llaman comandos Tauri vía `invoke()`, que a su vez hacen llamadas gRPC al daemon.

### Wallet

La wallet es una aplicación mobile-first para **Titulares** — individuos que poseen y gestionan su identidad descentralizada.

**Responsabilidades:**
- Crear y gestionar identidades descentralizadas (DIDs)
- Almacenar claves privadas de forma segura en el llavero del SO
- Mostrar códigos QR de identidad para autenticación

**Tecnología:** Tauri v2, React 19, TypeScript

**Arquitectura:** Similar a Desktop pero optimizada para un viewport móvil de 390×844. Actualmente tiene un backend Rust mínimo (sin cliente gRPC aún).

### CLI

El CLI proporciona una interfaz de terminal para gestión y monitoreo del daemon.

**Responsabilidades:**
- Iniciar, detener y hacer ping al daemon
- Mostrar estado del daemon en tiempo real
- Proporcionar una alternativa basada en texto a la app de escritorio

**Tecnología:** Rust, ratatui 0.29, crossterm 0.28, tonic (cliente gRPC)

## Patrones de Comunicación

### Comunicación Local (gRPC)

Desktop, wallet y CLI se comunican con el daemon vía **gRPC** en la máquina local:

```
Cliente (Desktop/CLI) ──gRPC──► Daemon ([::1]:50051)
```

El archivo proto en `daemon/proto/almena/daemon/v1/service.proto` es la **fuente única de verdad**. Los clientes copian y generan código desde este archivo.

### Comunicación P2P (libp2p)

Los daemons se descubren y comunican entre sí sobre la red P2P:

- **Transporte:** TCP
- **Cifrado:** Protocolo Noise
- **Multiplexación:** Yamux
- **Descubrimiento:** mDNS (solo LAN, actualmente)

Cada daemon mantiene un `PeerStore` — un mapa thread-safe de peers descubiertos con su estado de conexión.

## Almacenamiento de Datos

### Directorios de Plataforma

Cada módulo almacena datos en ubicaciones específicas de cada plataforma:

| Módulo | macOS | Linux |
|--------|-------|-------|
| Daemon | `~/Library/Application Support/network.almena.daemon` | `~/.local/share/network.almena.daemon` |
| CLI | `~/Library/Application Support/network.almena.cli` | `~/.local/share/network.almena.cli` |

En modo desarrollo, todos los módulos usan un directorio local `./workspace/`.

### Modelo de Seguridad

- **Claves privadas** se almacenan en el llavero del SO (nunca en archivos de texto plano)
- **Criptografía:** Ed25519 (firma), X25519 (acuerdo de claves), A256GCM (cifrado)
- **Derivación de claves:** Mnemónico BIP39 + derivación jerárquica BIP32
- **Cifrado de red:** TLS 1.2+ para tráfico externo, protocolo Noise para P2P

## Sistema de Diseño

Todas las aplicaciones frontend (desktop y wallet) comparten un sistema de diseño **glassmorphism**:

| Token | Valor |
|-------|-------|
| Color primario | `#FB923C` (naranja) |
| Color secundario | `#8B5CF6` (violeta) |
| Fondo | `#0c0a09` (oscuro profundo) |
| Efecto glass | `rgba(255,255,255,0.05)` + `backdrop-filter: blur(12px)` |
| Border radius | 8–12px |
| Espaciado base | unidad de 8px |
| Transiciones | 200–250ms ease-out |
