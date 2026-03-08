---
sidebar_position: 1
title: Desarrolladores
slug: /developers
---

# Almena Network para Desarrolladores

Documentación para miembros del equipo que desarrollan los módulos de la plataforma Almena Network.

## Visión General de la Plataforma

Almena Network es una plataforma de identidad descentralizada construida sobre estándares W3C (DIDs, Credenciales Verificables). El proyecto está organizado como un **monorepo con submódulos git**, donde cada módulo es un repositorio independiente que sigue la rama `develop`.

## Módulos

| Módulo | Tecnología | Descripción | Estado |
|--------|-----------|-------------|--------|
| [**Daemon**](./modules/daemon) | Rust, tonic, libp2p | Servidor gRPC y red P2P | 5 RPCs, descubrimiento mDNS |
| [**Desktop**](./modules/desktop) | Tauri v2, React 19, TypeScript | Consola de admin para Emisores/Solicitantes | Login, Mapa de red, Control del daemon |
| [**Wallet**](./modules/wallet) | Tauri v2, React 19, TypeScript | Billetera de identidad mobile-first para Titulares | Onboarding, Configuración de contraseña |
| [**CLI**](./modules/cli) | Rust, ratatui, crossterm | Interfaz de terminal para el daemon | TUI con gestión del daemon |
| **Docs** | Docusaurus 3 | Sitio de documentación (este sitio) | EN + ES |

## Enlaces Rápidos

- [**Primeros Pasos**](./getting-started) — Configura tu entorno de desarrollo.
- [**Arquitectura**](./architecture) — Arquitectura del sistema y decisiones de diseño.
- [**Guías de Módulos**](./modules/daemon) — Análisis profundo de la implementación de cada módulo.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript 5.8, Vite 7 |
| Framework de escritorio | Tauri v2 |
| Backend | Rust edición 2021 |
| gRPC | tonic 0.12, prost 0.13 |
| P2P | libp2p 0.56 |
| CLI TUI | ratatui 0.29, crossterm 0.28 |
| Gestores de paquetes | pnpm (Node), cargo (Rust) |
| Task runner | [Taskfile](https://taskfile.dev/) |
| Documentación | Docusaurus 3 |

## Esquema de Versiones

Todos los módulos siguen versionado basado en fecha: `YYYY.MM.DD[-variante]`

Ejemplos: `2026.3.5-alpha`, `2026.1.1-develop`
