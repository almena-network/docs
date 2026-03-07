---
title: "UC-028: Registrar Pista de Auditoría"
sidebar_label: "UC-028: Registrar Auditoría"
sidebar_position: 28
---

# UC-028: Registrar Pista de Auditoría

:::note Flujo de Referencia
Corresponde al **Flujo 7 — Trazabilidad y Auditoría**.
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El sistema de pista de auditoría aún no está implementado.
:::

## Descripción

Cada operación relevante en la plataforma genera un registro de auditoría en la blockchain siguiendo el patrón: **hash on-chain, dato off-chain**. El registro en blockchain contiene el hash de la operación, tipo de evento, DIDs participantes, timestamp y referencia al detalle off-chain. Nunca se almacenan datos personales on-chain. Esto asegura trazabilidad completa manteniendo la privacidad y cumplimiento GDPR.

## Actores

- **Sistema**: Registra automáticamente eventos de auditoría para cada operación relevante
- **Blockchain**: Red distribuida donde se almacenan hashes y metadatos
- **Nodo Storage**: Almacenamiento off-chain para datos de auditoría detallados (cifrados si contienen datos personales)

## Precondiciones

- La blockchain está operativa
- Se ha realizado una operación relevante (ver eventos rastreados abajo)

## Eventos Rastreados

Las siguientes operaciones generan registros de auditoría en la blockchain:

- Registro de DID ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity), [UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- Emisión de credenciales ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- Revocación de credenciales ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- Solicitudes de información ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Consentimientos otorgados ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- Presentaciones verificables generadas ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- Resultados de verificación ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- Registros y revocaciones del trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework), [UC-027](/docs/developers/use-cases/platform/uc-027-revoke-issuer-authorization))
- Rotación de claves ([UC-024](/docs/developers/use-cases/wallet/uc-024-rotate-holder-keys))
- Actualizaciones de DID Documents

## Flujo Principal

1. Se realiza una operación relevante en la plataforma
2. El sistema genera un registro de auditoría que contiene:
   - Hash de la operación
   - Tipo de evento (emisión, revocación, presentación, consentimiento, cambio en trust framework, etc.)
   - DIDs de los participantes
   - Timestamp
   - Referencia al detalle off-chain (en storage cifrado o logs privados)
3. El registro de auditoría se registra en la blockchain
4. Los datos detallados de la operación se almacenan off-chain (cifrados si contienen datos personales)

## Flujos Alternativos

### FA-1: Blockchain no disponible
- En el paso 3, la blockchain no es accesible
- El registro de auditoría se encola y se reintenta cuando la blockchain esté disponible
- La operación en sí no se bloquea por fallo en el registro de auditoría

## Postcondiciones

- El hash de la operación está registrado en la blockchain como evidencia inmutable
- El detalle off-chain está almacenado de forma segura para consulta autorizada
- No existen datos personales en la blockchain

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **backend** | Generación de eventos de auditoría, cálculo de hashes, almacenamiento off-chain |
| **blockchain** | Almacenamiento inmutable de registros de auditoría, registro de hashes |
| **storage** | Persistencia de detalle off-chain (cifrado) |

## Notas Técnicas

- **Patrón**: Hash on-chain, dato off-chain — la blockchain almacena solo hashes y metadatos, nunca datos personales
- **Cumplimiento GDPR**: Los datos personales siempre están off-chain y pueden eliminarse (derecho al olvido). Los hashes en blockchain son irreversibles y no constituyen datos personales por sí mismos
- **Retención off-chain**: Los logs off-chain con datos personales están sujetos a políticas de retención y pueden eliminarse cuando sea necesario
- **Inmutabilidad**: Los registros on-chain son inmutables — sirven como evidencia a prueba de manipulaciones de las operaciones
- **Estándares**: GDPR (protección de datos), eIDAS 2.0 (requisitos de auditoría)
