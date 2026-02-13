---
title: "UC-011: Ver Credenciales Verificables"
sidebar_label: "UC-011: Ver Credenciales"
sidebar_position: 11
---

# UC-011: Ver Credenciales Verificables

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La vista de credenciales aún no está implementada en el frontend.
:::

## Descripción

Desde la perspectiva Titular del dashboard, el usuario visualiza las credenciales verificables (VCs) que ha recibido de los emisores. Cada credencial contiene afirmaciones sobre el usuario (ej: un título universitario, una certificación profesional) que han sido firmadas criptográficamente por la entidad emisora. El usuario puede explorar, filtrar e inspeccionar los detalles de cada credencial.

## Actores

- **Usuario Final (Titular)**: Persona que visualiza sus credenciales recibidas
- **Frontend (Portal)**: Aplicación web Next.js que renderiza la lista de credenciales y vistas de detalle
- **Backend API**: Servicio FastAPI que recupera las credenciales del usuario desde el almacenamiento

## Precondiciones

- El usuario está autenticado y en el dashboard en **perspectiva Titular** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- El usuario ha recibido al menos una credencial verificable de un emisor ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))

## Flujo Principal

1. El usuario está en el dashboard en perspectiva Titular
2. El usuario navega a la sección de **Credenciales**
3. El portal solicita las credenciales del usuario al backend: `GET /api/v1/credentials`
4. El backend recupera las credenciales asociadas al DID del usuario
5. El portal muestra una lista de credenciales, cada una mostrando:
   - Tipo de credencial (ej: "Título Universitario", "Certificación Profesional")
   - Nombre y DID del emisor
   - Fecha de emisión
   - Fecha de expiración (si aplica)
   - Estado (válida, expirada, revocada)
6. El usuario hace clic en una credencial para ver sus detalles
7. El portal muestra la credencial completa incluyendo:
   - Todas las afirmaciones/atributos (ej: nombre del título, institución, fecha de graduación)
   - Información del emisor
   - Metadatos de prueba criptográfica (tipo de firma, método de verificación)
   - Referencia al esquema de la credencial
   - Período de validez

## Flujos Alternativos

### FA-1: Sin credenciales
- En el paso 4, el usuario no tiene credenciales
- El portal muestra un estado vacío con un mensaje explicando cómo se obtienen las credenciales (emitidas por organizaciones)

### FA-2: Credencial expirada
- En el paso 5, una o más credenciales han superado su fecha de expiración
- La credencial aparece en la lista con una etiqueta de estado "Expirada"
- El usuario puede ver los detalles pero la credencial está marcada como ya no válida

### FA-3: Credencial revocada
- En el paso 5, un emisor ha revocado una credencial
- La credencial aparece con una etiqueta de estado "Revocada"
- El usuario puede ver los detalles pero la credencial no puede usarse en presentaciones

## Postcondiciones

- El usuario ha visualizado sus credenciales
- No hay cambios de estado — es una vista de solo lectura

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | UI de lista de credenciales, vista de detalle, filtrado, etiquetas de estado |
| **backend** | Almacenamiento y recuperación de credenciales, verificación de estado (validez, revocación) |
| **blockchain** | Consultas de estado de revocación (si el registro de revocación está on-chain) |

## Notas Técnicas

- **Formato de credencial**: W3C Verifiable Credentials Data Model. Estructura JSON-LD con prueba criptográfica
- **Almacenamiento**: Las credenciales se almacenan en el backend asociadas al DID del titular. La wallet también puede almacenar una copia local
- **Verificación de revocación**: El backend puede consultar el registro de revocación en blockchain o la lista de revocación del emisor para determinar si una credencial ha sido revocada
- **Implementación actual**: La página de credenciales existe en `/dashboard/credentials` pero muestra un placeholder "coming soon". No hay endpoints de API para credenciales conectados en el frontend aún
