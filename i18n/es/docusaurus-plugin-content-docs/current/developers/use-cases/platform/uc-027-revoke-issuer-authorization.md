---
title: "UC-027: Revocar Autorización de Issuer"
sidebar_label: "UC-027: Revocar Auth. Issuer"
sidebar_position: 27
---

# UC-027: Revocar Autorización de Issuer

:::note Flujo de Referencia
Corresponde al **Flujo 6 — Gestión del Trust Framework**, sección 6.3 (Revocación de Autorización).
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La revocación de autorización de Issuers aún no está implementada.
:::

## Descripción

El Trust Anchor o un Issuer padre revoca la autorización de un Issuer en el trust framework. La revocación se realiza en cascada automáticamente: todos los Issuers que el Issuer revocado haya delegado también son revocados. Las credenciales ya emitidas por Issuers revocados seguirán existiendo pero fallarán la verificación de legitimidad del Issuer.

## Actores

- **Trust Anchor / Issuer Padre**: Entidad que autorizó al Issuer y ahora revoca la autorización
- **Issuer Revocado**: Issuer cuya autorización está siendo revocada
- **Blockchain**: Red distribuida donde se actualiza la Trusted List

## Precondiciones

- El Issuer a revocar tiene una autorización activa en el trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- La entidad que revoca es la que originalmente autorizó al Issuer (Trust Anchor o Issuer padre)

## Flujo Principal

1. El Trust Anchor o Issuer padre inicia la revocación
2. El sistema realiza la revocación en cascada:
   - Revoca la autorización del Issuer
   - Revoca automáticamente todos los Issuers que este Issuer haya delegado ([UC-026](/docs/developers/use-cases/platform/uc-026-delegate-issuer-authorization))
3. La blockchain actualiza la Trusted List con los nuevos estados
4. Las credenciales ya emitidas por Issuers revocados continúan existiendo pero fallarán la verificación de legitimidad del Issuer durante la verificación de presentaciones ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Flujos Alternativos

### FA-1: Issuer no encontrado en el trust framework
- En el paso 1, el Issuer no está registrado en el trust framework
- La operación se rechaza

### FA-2: Revocador no autorizado
- En el paso 1, la entidad que intenta la revocación no es la que autorizó al Issuer
- La revocación se rechaza — solo la entidad autorizadora puede revocar

### FA-3: Fallo en la transacción blockchain
- En el paso 3, la transacción falla
- La revocación no se registra — puede reintentarse

## Postcondiciones

- La autorización del Issuer está revocada en la Trusted List
- Todas las autorizaciones delegadas del Issuer revocado también están revocadas (cascada)
- Las futuras verificaciones de credenciales emitidas por el Issuer revocado fallarán la comprobación de legitimidad
- La revocación se registra como evidencia auditable ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | UI de revocación para Trust Anchor e Issuers padre |
| **backend** | Procesamiento de revocación en cascada |
| **blockchain** | Actualización de Trusted List, gestión de estados en cascada |

## Notas Técnicas

- **Revocación en cascada**: Revocar un Issuer padre automáticamente revoca todos los hijos en la cadena de delegación
- **Impacto en credenciales**: Las credenciales ya emitidas no se invalidan por sí mismas — pero fallarán la comprobación del trust framework durante la verificación
- **Irreversible**: La revocación de autorización es permanente — la re-autorización requiere un nuevo proceso de registro
- **Estándares**: eIDAS 2.0 (Trusted Lists), W3C DID v1.0
