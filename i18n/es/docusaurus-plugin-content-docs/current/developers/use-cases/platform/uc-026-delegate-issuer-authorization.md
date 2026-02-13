---
title: "UC-026: Delegar Autorización de Issuer"
sidebar_label: "UC-026: Delegar Autorización"
sidebar_position: 26
---

# UC-026: Delegar Autorización de Issuer

:::note Flujo de Referencia
Corresponde al **Flujo 6 — Gestión del Trust Framework**, sección 6.2 (Delegación entre Issuers).
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La delegación de Issuers aún no está implementada.
:::

## Descripción

Un Issuer autorizado con capacidad de delegación propone autorizar a otra entidad como Issuer, dentro de los límites de su propia autorización. El sistema verifica las políticas de delegación (profundidad máxima de cadena, tipos de credenciales permitidos, restricciones territoriales o sectoriales). Si las políticas lo permiten, la autorización delegada se registra en la blockchain con la cadena de confianza completa.

## Actores

- **Issuer Autorizado**: Issuer con capacidad de delegación otorgada por el Trust Anchor o un Issuer padre
- **Nuevo Issuer**: Entidad que se propone autorizar
- **Blockchain**: Red distribuida donde se registra la delegación con la cadena de confianza

## Precondiciones

- El Issuer autorizado tiene capacidad de delegación en su registro del trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- El nuevo Issuer tiene un DID anclado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Flujo Principal

1. El Issuer autorizado propone autorizar a una nueva entidad, dentro de los límites de su propia autorización
2. El sistema verifica las políticas de delegación:
   - Profundidad máxima de cadena
   - Tipos de credenciales permitidos
   - Restricciones territoriales o sectoriales
3. Si las políticas lo permiten, el Issuer autorizado registra la autorización delegada en la blockchain con la cadena de confianza completa (Trust Anchor → Issuer A → Issuer B)
4. La blockchain actualiza la Trusted List con el nuevo Issuer y su cadena de autorización

## Flujos Alternativos

### FA-1: Violación de política
- En el paso 2, la delegación viola una o más políticas (cadena demasiado profunda, tipo de credencial no autorizado, etc.)
- La delegación se rechaza con la violación de política específica

### FA-2: Issuer sin capacidad de delegación
- En el paso 1, el Issuer no tiene capacidad de delegación en su autorización
- La delegación se rechaza

## Postcondiciones

- El nuevo Issuer está registrado en la Trusted List con su cadena de confianza completa
- El nuevo Issuer puede emitir credenciales de los tipos autorizados
- La cadena de delegación es transparente y consultable por cualquier Verifier

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | UI de propuesta de delegación |
| **backend** | Verificación de políticas, procesamiento de delegación |
| **blockchain** | Registro de cadena de confianza, actualización de Trusted List |

## Notas Técnicas

- **Cadena de confianza**: Cada delegación registra la cadena completa (Trust Anchor → Issuer padre → Issuer delegado) — es transparente y consultable
- **Aplicación de políticas**: Las políticas de delegación se aplican on-chain — un Issuer delegado no puede exceder los permisos de su padre
- **Revocación en cascada**: Si la autorización de un Issuer padre es revocada, todas las autorizaciones delegadas también se revocan ([UC-027](/docs/developers/use-cases/platform/uc-027-revoke-issuer-authorization))
- **Estándares**: eIDAS 2.0 (Trusted Lists, delegación), W3C DID v1.0
