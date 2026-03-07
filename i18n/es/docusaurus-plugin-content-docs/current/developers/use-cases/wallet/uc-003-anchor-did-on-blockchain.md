---
title: "UC-003: Anclar DID en Blockchain"
sidebar_label: "UC-003: Anclar DID en Blockchain"
sidebar_position: 3
---

# UC-003: Anclar DID en Blockchain

:::note Flujo de Referencia
Corresponde al **Flujo 1 — Registro de Identidad (Onboarding)**, pasos 3-4.
:::

## Descripción

El Holder registra su DID Document en la blockchain, haciendo la identidad públicamente verificable. El DID Document contiene el DID, clave(s) pública(s), métodos de autenticación y endpoints de servicio. Una vez confirmado por la red, el DID Document queda disponible para consulta pública. Este paso es opcional — el DID es utilizable sin anclaje — pero es necesario para recibir credenciales y participar en flujos verificables.

Este mismo proceso de anclaje aplica a entidades (Issuers, Requesters) que necesitan que sus DID Documents sean resolubles públicamente.

## Actores

- **Holder**: Usuario (o entidad) que ancla su DID en la blockchain
- **Wallet**: Aplicación que orquesta el flujo de anclaje y firma la transacción
- **Blockchain**: Red distribuida donde se registra el DID Document

## Precondiciones

- El Holder tiene un DID creado localmente ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- El DID no ha sido anclado aún
- Las claves criptográficas están almacenadas en el keychain del dispositivo
- La blockchain está operativa y accesible

## Flujo Principal

1. El Holder inicia el proceso de anclaje desde el wallet
2. El wallet construye un DID Document conforme a W3C DID Core que contiene:
   - El DID
   - Clave(s) pública(s) con métodos de verificación
   - Métodos de autenticación
   - Endpoints de servicio
3. El wallet firma la transacción de anclaje con la clave privada del Holder
4. El wallet transmite la transacción a la blockchain
5. La blockchain valida y confirma la transacción
6. El DID Document queda registrado on-chain y disponible para consulta pública
7. El wallet actualiza el estado de identidad local para reflejar el anclaje exitoso
8. El Holder es informado del registro exitoso

## Flujos Alternativos

### FA-1: Blockchain inaccesible
- En el paso 4, el nodo de blockchain no es accesible
- El wallet muestra un error con opción de reintentar
- El DID sigue siendo utilizable localmente

### FA-2: Fallo en la transacción
- En el paso 5, la transacción es rechazada por la blockchain
- El wallet muestra el error y ofrece opción de reintentar

### FA-3: Holder omite el anclaje
- El Holder elige no anclar en este momento
- El DID permanece con estado solo local
- El anclaje puede realizarse posteriormente

## Postcondiciones

- El DID Document está registrado en la blockchain
- El DID es públicamente verificable — cualquier parte puede resolver el DID Document desde la blockchain para obtener la clave pública y endpoints de servicio del Holder
- El Holder puede recibir credenciales de Issuers (que resuelven el DID para obtener la clave pública para cifrado)
- El Holder puede participar en flujos de presentaciones verificables

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** | Construcción del DID Document, firma de transacción, transmisión |
| **blockchain** | Validación de transacción, almacenamiento del DID Document, resolución pública |
| **backend** | Indexación del evento de anclaje (best-effort, no bloqueante) |

## Notas Técnicas

- **DID Document**: Conforme a W3C DID Core — contiene métodos de verificación, autenticación, aserción, invocación de capacidad y delegación de capacidad
- **Sin datos personales on-chain**: El DID Document contiene solo claves públicas y endpoints de servicio — nunca datos personales
- **Offline-first**: El anclaje es opcional; el DID funciona completamente sin estar on-chain. El anclaje añade verificabilidad pública
- **Anclaje de entidades**: Las organizaciones siguen el mismo proceso para hacer sus DID Documents resolubles públicamente, lo cual es requerido antes de que puedan operar como Issuers o Requesters
- **Estándares**: W3C DID Core v1.0, modelo de transacciones Cosmos SDK
