---
sidebar_position: 1
title: Integradores
slug: /integrators
---

# Almena Network para Integradores

Esta sección proporciona documentación para desarrolladores que integran sus aplicaciones con la plataforma Almena Network.

## Puntos de Integración

Almena Network expone una **API gRPC** a través de su servicio daemon (`almenad`). Esta es la forma principal en que las aplicaciones externas se comunican con la plataforma.

### Disponible Hoy

| Capacidad | Descripción |
|-----------|-------------|
| **Health Check** | Verificar que el daemon está ejecutándose y responde |
| **Información de Versión** | Consultar la versión del daemon programáticamente |
| **Información del Sistema** | Obtener el nombre y versión del SO del host |
| **Geolocalización** | Obtener la geolocalización por IP pública del nodo (ciudad, país, coordenadas) |
| **Descubrimiento de Peers** | Listar todos los peers P2P descubiertos con estado de conexión y tipo de red |

### Guías de Integración

- [**Configuración del Daemon**](./daemon-setup) — Instalar y ejecutar el daemon de Almena en tu sistema.
- [**Referencia de API gRPC**](./grpc-api) — Referencia completa de todos los métodos RPC y tipos de mensajes disponibles.

## Protocolo y Estándares

Almena Network sigue los estándares W3C para identidad descentralizada:

- **DIDs** (Identificadores Descentralizados) v1.0
- **Credenciales Verificables** Data Model v2.0
- **DIDComm** v2 para mensajería segura

La API gRPC utiliza Protocol Buffers (proto3) como formato de transmisión. La definición proto canónica se encuentra en el repositorio del daemon en `proto/almena/daemon/v1/service.proto`.

:::info Próximamente
Las APIs de emisión de credenciales, verificación de presentaciones y marco de confianza se añadirán a medida que se implementen.
:::
