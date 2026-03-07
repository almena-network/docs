---
title: "UC-016: Revocar Credencial Verificable"
sidebar_label: "UC-016: Revocar Credencial"
sidebar_position: 16
---

# UC-016: Revocar Credencial Verificable

:::note Flujo de Referencia
Corresponde al **Flujo 4 — Revocación de Credencial**.
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La revocación de credenciales aún no está implementada.
:::

## Descripción

Un Issuer revoca una credencial verificable previamente emitida, invalidando su uso en futuras presentaciones. El Issuer envía una transacción a la blockchain cambiando el estado de la credencial de activa a revocada, firmada con su clave privada. La blockchain valida que la transacción proviene del Issuer original. El Holder es notificado de la revocación.

## Actores

- **Issuer**: Organización que emitió originalmente la credencial
- **Holder**: Usuario cuya credencial está siendo revocada
- **Blockchain**: Red distribuida donde la revocación se registra en el registro de estado de credenciales

## Precondiciones

- El Issuer tiene un registro del identificador/hash de la credencial
- La credencial está actualmente en estado activo en la blockchain
- La credencial fue originalmente emitida por este Issuer ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))

## Flujo Principal

1. El Issuer decide revocar la credencial (por cambio de circunstancias, fraude detectado, solicitud del Holder, etc.)
2. El Issuer envía una transacción a la blockchain cambiando el estado de la credencial de **activa** a **revocada**, firmada con su clave privada
3. La blockchain valida que la transacción proviene del Issuer original (verificando la firma contra el DID Document) y actualiza el registro de estado
4. El Holder es notificado de que una de sus credenciales ha sido revocada
5. La blockchain registra el hash de la operación de revocación con fecha y motivo codificado ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Flujos Alternativos

### FA-1: Credencial ya revocada
- En el paso 2, la credencial ya ha sido revocada
- La operación se rechaza — el Issuer es informado de la revocación existente

### FA-2: Issuer no es el emisor original
- En el paso 3, la blockchain detecta que la transacción no proviene del Issuer original
- La revocación se rechaza — solo el Issuer original puede revocar sus credenciales

### FA-3: Fallo en la transacción blockchain
- En el paso 3, la transacción falla (error de red, gas insuficiente)
- La revocación no se registra — el Issuer puede reintentar

## Postcondiciones

- La credencial aparece como revocada en cualquier consulta de estado
- Cualquier presentación verificable que incluya claims de esta credencial será rechazada por el Verifier en el paso de verificación de estado ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- La credencial cifrada puede permanecer en el storage como registro histórico, pero es inutilizable
- La revocación es irreversible — se debe emitir una nueva credencial si la revocación fue hecha por error

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | UI de revocación (búsqueda de credenciales, confirmación, campo de motivo) |
| **backend** | Validación de revocación, envío de transacción blockchain, notificación al Holder |
| **blockchain** | Almacenamiento en registro de revocación, consultas de estado, validación de firma contra DID Document |

## Notas Técnicas

- **Registro de revocación**: La blockchain mantiene un registro de revocación solo de adición — las revocaciones no pueden deshacerse
- **Verificación on-chain**: La revocación se registra on-chain para que cualquier Verifier pueda comprobar el estado sin confiar en el backend del Issuer
- **`credentialStatus`**: Sigue la especificación W3C Bitstring Status List
- **Trazabilidad**: El hash de la operación de revocación se registra on-chain con fecha y motivo codificado
- **Estándares**: W3C Bitstring Status List, W3C VC Data Model 2.0
