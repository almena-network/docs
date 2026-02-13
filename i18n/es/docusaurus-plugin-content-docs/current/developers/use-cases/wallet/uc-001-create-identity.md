---
title: "UC-001: Crear Identidad"
sidebar_label: "UC-001: Crear Identidad"
sidebar_position: 1
---

# UC-001: Crear Identidad

:::note Flujo de Referencia
Corresponde al **Flujo 1 — Registro de Identidad (Onboarding)**, pasos 1-2 y 5.
:::

## Descripción

El Holder crea una nueva identidad descentralizada. Este proceso genera un par de claves criptográficas (pública/privada) en el dispositivo local, produce un DID (Decentralized Identifier) siguiendo el estándar W3C DID y almacena la clave privada de forma segura. La clave privada nunca abandona el dispositivo. La identidad es utilizable inmediatamente sin interacción con la blockchain; el anclaje on-chain es un paso separado y opcional ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)).

Este mismo flujo de onboarding aplica para entidades (Issuers, Requesters). Para Issuers, el registro de identidad debe complementarse con la autorización en el trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework)).

## Actores

- **Holder**: Usuario que crea su identidad descentralizada
- **Wallet**: Aplicación en el dispositivo del Holder que gestiona claves, DIDs y credenciales
- **System Keychain**: Almacenamiento seguro a nivel de sistema operativo para claves privadas

## Precondiciones

- El Holder dispone de un dispositivo con la aplicación wallet instalada
- No existe ninguna identidad actualmente en el wallet (primer uso)
- El system keychain es accesible

## Flujo Principal

1. El Holder abre el wallet y selecciona **Crear Nueva Identidad**
2. El Holder crea una contraseña que cumple los requisitos de seguridad
3. El wallet genera una frase de recuperación (mnemónico BIP39) y la muestra al Holder
4. El Holder respalda la frase de recuperación de forma segura
5. El wallet genera el par de claves criptográficas (pública/privada) en el dispositivo local
6. El wallet deriva el DID a partir de la clave pública, siguiendo el estándar W3C DID: `did:almena:<clave_pública>`
7. El wallet almacena la clave privada de forma segura en el system keychain — la clave privada nunca abandona el dispositivo
8. El wallet persiste los metadatos de identidad localmente (DID, clave pública, fecha de creación)
9. El Holder ve una pantalla de confirmación con su nuevo DID
10. El Holder puede opcionalmente anclar el DID en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)) o proceder directamente a usar el wallet

## Flujos Alternativos

### FA-1: Contraseñas no coinciden
- En el paso 2, la contraseña de confirmación no coincide
- El wallet muestra un error y el Holder debe reingresar ambas contraseñas

### FA-2: Acceso al keychain denegado
- En el paso 7, el system keychain no es accesible
- La operación falla con un mensaje de error y la identidad no se crea

### FA-3: Frase de recuperación no respaldada
- En el paso 4, el Holder debe confirmar que ha respaldado la frase antes de continuar

## Postcondiciones

- El Holder posee un DID generado siguiendo el estándar W3C DID
- Un par de claves criptográficas existe almacenado de forma segura en el dispositivo
- La clave privada está en el system keychain y nunca ha abandonado el dispositivo
- El DID es utilizable localmente para firma y autenticación
- No se ha realizado ninguna transacción en blockchain (el anclaje es un paso separado y opcional)
- El Holder puede recibir credenciales y generar presentaciones verificables

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** | Generación de claves, creación de DID, almacenamiento seguro, flujo de UI |

## Notas Técnicas

- **Tipos de clave**: Ed25519 para operaciones de identidad, secp256k1 para transacciones blockchain — ambas derivadas de la misma semilla BIP39
- **Formato DID**: `did:almena:<clave_pública_hex>` siguiendo W3C DID v1.0
- **Frase de recuperación**: Mnemónico BIP39 de 12 palabras que permite la recuperación determinista de claves ([UC-002](/docs/developers/use-cases/wallet/uc-002-recover-identity))
- **Offline-first**: La creación de identidad no requiere acceso a red
- **Onboarding de entidades**: Las organizaciones (Issuers/Requesters) siguen este mismo flujo de identidad vía [UC-022](/docs/developers/use-cases/platform/uc-022-create-organization), luego se registran en el trust framework vía [UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework)
- **Estándares**: W3C Decentralized Identifiers (DID) v1.0, requisitos de wallet eIDAS 2.0
