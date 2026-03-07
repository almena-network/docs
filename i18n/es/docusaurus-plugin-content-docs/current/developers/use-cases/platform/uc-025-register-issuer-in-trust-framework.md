---
title: "UC-025: Registrar Issuer en Trust Framework"
sidebar_label: "UC-025: Registrar Issuer"
sidebar_position: 25
---

# UC-025: Registrar Issuer en Trust Framework

:::note Flujo de Referencia
Corresponde al **Flujo 6 — Gestión del Trust Framework**, sección 6.1 (Alta de Issuer por el Trust Anchor).
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El trust framework aún no está implementado.
:::

## Descripción

El Trust Anchor (entidad raíz de la plataforma) autoriza a un nuevo Issuer en el trust framework. El Issuer candidato presenta su solicitud incluyendo su DID y documentación acreditativa. El Trust Anchor valida al candidato (identidad legal, capacidad, cumplimiento normativo) y registra la autorización en la blockchain. La autorización especifica qué tipos de credenciales puede emitir el Issuer, si puede delegar a otros Issuers, políticas aplicables y fecha de expiración.

## Actores

- **Trust Anchor**: Entidad raíz (creadora de la plataforma) que gestiona el trust framework — tiene un DID registrado como Trust Anchor en la blockchain
- **Issuer Candidato**: Organización que solicita autorización para convertirse en Issuer — debe tener un DID registrado en la blockchain ([UC-022](/docs/developers/use-cases/platform/uc-022-create-organization))
- **Blockchain**: Red distribuida donde se mantiene la Trusted List

## Precondiciones

- El Trust Anchor tiene un DID registrado como entidad raíz en la blockchain
- Existe un smart contract o registro de Issuers autorizados en la blockchain
- El Issuer candidato tiene un DID anclado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Flujo Principal

1. El Issuer candidato presenta su solicitud de autorización al Trust Anchor, incluyendo su DID y documentación acreditativa
2. El Trust Anchor valida al candidato (identidad legal, capacidad, cumplimiento normativo)
3. El Trust Anchor registra la autorización en la blockchain:
   - DID del Issuer
   - Tipos de credenciales que puede emitir
   - Capacidad de delegación (sí/no)
   - Políticas aplicables
   - Fecha de expiración de la autorización
4. La blockchain valida y confirma el registro
5. El Issuer aparece en la Trusted List, consultable por cualquier Verifier

## Flujos Alternativos

### FA-1: Fallo en la validación del candidato
- En el paso 2, el candidato no cumple los requisitos
- El Trust Anchor rechaza la solicitud con los motivos

### FA-2: Autorización con restricciones
- En el paso 3, el Trust Anchor otorga autorización limitada a tipos de credenciales, territorios o sectores específicos

### FA-3: Fallo en la transacción blockchain
- En el paso 4, la transacción de registro falla
- El Trust Anchor puede reintentar

## Postcondiciones

- El Issuer está registrado en la Trusted List en la blockchain
- El Issuer puede emitir credenciales verificables de los tipos autorizados ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- Cualquier Verifier puede consultar la Trusted List para confirmar la legitimidad del Issuer ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- Si se otorgó delegación, el Issuer puede autorizar a otros Issuers ([UC-026](/docs/developers/use-cases/platform/uc-026-delegate-issuer-authorization))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de solicitud de autorización, UI de gestión del Trust Anchor |
| **backend** | Procesamiento de solicitudes, orquestación de validación |
| **blockchain** | Registro de Trusted List, almacenamiento de autorizaciones, consultas públicas |

## Notas Técnicas

- **Trusted List**: Registro on-chain de Issuers autorizados — consultable por cualquier Verifier durante el flujo de verificación
- **Alcance de autorización**: Cada autorización especifica tipos de credenciales, capacidad de delegación, políticas y expiración
- **Revocación**: La autorización del Issuer puede ser revocada por el Trust Anchor o Issuer padre ([UC-027](/docs/developers/use-cases/platform/uc-027-revoke-issuer-authorization))
- **Estándares**: eIDAS 2.0 (Trusted Lists), W3C DID v1.0
