---
title: "UC-016: Revocar Credencial Verificable"
sidebar_label: "UC-016: Revocar Credencial"
sidebar_position: 16
---

# UC-016: Revocar Credencial Verificable

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La revocación de credenciales aún no está implementada.
:::

## Descripción

Desde la perspectiva Emisor, un miembro del emisor revoca una credencial verificable emitida previamente. La revocación es una acción irreversible que marca una credencial como ya no válida, independientemente de su fecha de expiración. La revocación se registra en el registro de revocación de la blockchain, haciéndola públicamente verificable. Por ejemplo, una universidad revoca una credencial de título porque se emitió por error, o un colegio profesional revoca una certificación porque el titular ya no cumple los requisitos.

## Actores

- **Miembro del Emisor**: Persona actuando desde la perspectiva Emisor con permiso para revocar credenciales de su organización
- **Frontend (Portal)**: Aplicación web Next.js que proporciona la UI de revocación
- **Backend API**: Servicio FastAPI que orquesta el proceso de revocación
- **Blockchain**: Blockchain de Almena donde la revocación se registra en el registro de revocación del módulo de credenciales

## Precondiciones

- El miembro del emisor está autenticado y en el dashboard en **perspectiva Emisor** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- El miembro del emisor tiene permiso para revocar credenciales de su organización
- La credencial fue originalmente emitida por esta organización emisora ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- La credencial está actualmente en estado `VALID` o `EXPIRED` (no ha sido ya revocada)

## Flujo Principal

1. El miembro del emisor navega al historial de credenciales emitidas en la perspectiva Emisor
2. El miembro del emisor localiza la credencial a revocar (por ID de credencial, nombre/DID del titular, o tipo de credencial)
3. El miembro del emisor hace clic en **Revocar** sobre la credencial
4. El portal muestra un diálogo de confirmación con:
   - Resumen de la credencial (tipo, titular, fecha de emisión)
   - Advertencia de que la revocación es irreversible
   - Campo obligatorio: motivo de revocación
5. El miembro del emisor introduce el motivo de revocación y confirma
6. El backend valida la solicitud de revocación:
   - Verifica que el miembro del emisor tiene permiso de revocación
   - Verifica que la credencial pertenece a esta organización emisora
   - Verifica que la credencial no ha sido ya revocada
7. El backend envía una transacción de revocación a la blockchain:
   - Envía `MsgRevokeCredential` con ID de credencial, DID del emisor y motivo de revocación
   - El módulo de credenciales de la blockchain registra la revocación en el registro de revocación
   - La transacción se firma con la clave secp256k1 de la organización emisora
8. La blockchain confirma la transacción de revocación
9. El backend actualiza el estado de la credencial a `REVOKED` en la base de datos local con:
   - Timestamp de revocación
   - Motivo de revocación
   - Hash de transacción de la blockchain
10. El portal confirma la revocación al miembro del emisor
11. El titular es notificado de que una de sus credenciales ha sido revocada

## Flujos Alternativos

### FA-1: Credencial ya revocada
- En el paso 6, la credencial ya ha sido revocada
- El portal muestra un error indicando que la credencial ya está revocada con la fecha y motivo de revocación originales

### FA-2: El miembro del emisor no tiene permiso de revocación
- En el paso 6, el miembro no tiene el rol necesario para revocar credenciales
- El backend rechaza la solicitud con un error de autorización
- El portal muestra un mensaje de acceso denegado

### FA-3: La transacción en blockchain falla
- En el paso 8, la transacción en blockchain falla (gas insuficiente, error de red, etc.)
- El backend NO actualiza el estado local
- El portal muestra un error y el miembro del emisor puede reintentar

### FA-4: La credencial pertenece a un emisor diferente
- En el paso 6, la credencial fue emitida por una organización diferente
- El backend rechaza la solicitud — solo el emisor original puede revocar sus propias credenciales
- El portal muestra un error

## Postcondiciones

- El estado de la credencial es `REVOKED` tanto en la base de datos del backend como en el registro de revocación de la blockchain
- La revocación es públicamente verificable mediante consultas a la blockchain
- El titular ve la credencial marcada como "Revocada" en su perspectiva Titular ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- Cualquier verificación futura de esta credencial la señalará como revocada ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- La revocación es irreversible — se debe emitir una nueva credencial si la revocación fue hecha por error

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | UI de revocación (búsqueda de credencial, diálogo de confirmación, entrada de motivo), actualización de estado en lista de credenciales emitidas |
| **backend** | Validación de revocación, envío de transacción a blockchain, actualización de estado local, notificación al titular |
| **blockchain** | Almacenamiento en registro de revocación (`MsgRevokeCredential`), consultas de estado de revocación |

## Notas Técnicas

- **Registro de revocación**: El módulo de credenciales de la blockchain mantiene un registro de revocación. Cada entrada de revocación almacena: ID de credencial, DID del emisor, timestamp de revocación y motivo. El registro es solo de adición — las revocaciones no pueden deshacerse
- **On-chain vs off-chain**: La revocación se registra on-chain para que cualquier verificador pueda comprobar el estado de revocación sin confiar en el backend del emisor. El backend también almacena una copia local para consultas rápidas
- **W3C `credentialStatus`**: Las credenciales revocadas incluyen un campo `credentialStatus` que apunta al registro de revocación de la blockchain, siguiendo la especificación W3C Bitstring Status List
- **Motivos de revocación**: Motivos comunes incluyen: "Emitida por error", "El titular ya no cumple los requisitos", "La información de la credencial cambió", "Organización emisora disuelta", "El titular solicitó la revocación"
- **Notificación**: El titular es notificado via la plataforma (notificación en dashboard). Futuro: mensaje DIDComm v2 via el mediator
- **Impacto en presentaciones**: Cuando una credencial en una VP existente es revocada, la VP no se invalida por sí misma — pero la siguiente verificación detectará la revocación y señalará la credencial correspondientemente
