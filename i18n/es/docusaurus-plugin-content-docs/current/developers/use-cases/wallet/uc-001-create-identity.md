---
title: "UC-001: Crear Identidad"
sidebar_label: "UC-001: Crear Identidad"
sidebar_position: 1
---

# UC-001: Crear Identidad

## Descripción

El usuario crea una nueva identidad descentralizada desde la wallet. Este proceso genera un mnemónico BIP39, deriva claves criptográficas (Ed25519 para identidad, secp256k1 para blockchain), las almacena de forma segura en el keychain del sistema y produce un DID con el formato `did:almena:<public_key_hex>`. La identidad es utilizable inmediatamente sin interacción con la blockchain.

## Actores

- **Usuario Final**: Persona que crea su identidad a través de la UI de la wallet
- **Wallet (Frontend)**: Aplicación Svelte que gestiona el flujo de UI y la orquestación
- **Wallet (Rust Backend)**: Comandos Tauri que realizan las operaciones criptográficas y el almacenamiento seguro
- **Keychain del Sistema**: Almacenamiento seguro a nivel de SO para claves privadas

## Precondiciones

- La aplicación wallet está instalada y en ejecución
- No existe ninguna identidad en la wallet (primer uso)
- El keychain del sistema es accesible

## Flujo Principal

1. El usuario abre la wallet y ve la pantalla de bienvenida (`/`)
2. El usuario selecciona **Crear Nueva Identidad**
3. La wallet navega a la pantalla de creación de contraseña (`/create`)
4. El usuario introduce una contraseña que cumple las reglas de validación:
   - Mínimo 8 caracteres
   - Al menos 1 letra mayúscula
   - Al menos 1 letra minúscula
   - Al menos 1 dígito
   - Al menos 1 carácter especial (`!@#$%^&*(),.?":{}|<>`)
5. El usuario confirma la contraseña
6. La wallet hashea la contraseña usando Argon2 (comando Rust `hash_password`)
7. El hash se almacena temporalmente en `sessionStorage`
8. La wallet navega a la pantalla de frase de recuperación (`/create/recovery-phrase`)
9. La wallet genera un mnemónico BIP39 de 12 palabras mediante `generateRecoveryPhrase(language)` usando `@scure/bip39` con la lista de palabras correspondiente (inglés o español)
10. Las 12 palabras se muestran en una cuadrícula
11. Un aviso instruye al usuario a respaldar la frase de forma segura
12. El usuario copia la frase (acción obligatoria — habilita el botón Continuar)
13. La wallet invoca el comando Rust `generate_and_store_identity`:
    - Parsea el mnemónico BIP39 (auto-detecta el idioma)
    - Genera la semilla BIP39 (passphrase vacía)
    - Deriva el par de claves Ed25519: `SHA512(seed[0:32])` → clave secreta de 32 bytes
    - Deriva la clave secp256k1 mediante la ruta BIP44 `m/44'/118'/0'/0/0`
    - Almacena la clave privada Ed25519 en el keychain del sistema (servicio: `almena-id-wallet`, clave: `{did}`)
    - Almacena la clave privada secp256k1 en el keychain del sistema (clave: `{did}:almena`)
    - Devuelve el DID (`did:almena:<ed25519_public_key_hex>`) y la clave pública
14. La wallet guarda los metadatos de identidad en el Tauri Store (`identity.json`): DID, clave pública, timestamp de creación, `anchorStatus: 'not_anchored'`
15. El hash de contraseña se elimina de `sessionStorage`
16. La sesión se desbloquea mediante `unlockSession()`
17. La wallet navega a la pantalla de éxito (`/create/success`) mostrando el DID
18. El usuario puede opcionalmente anclar el DID en la blockchain (ver [UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)) o continuar directamente al dashboard

## Flujos Alternativos

### FA-1: Contraseñas no coinciden
- En el paso 5, si la contraseña de confirmación no coincide, el formulario muestra un error y el usuario debe volver a introducir ambas contraseñas

### FA-2: La contraseña no cumple los requisitos
- En el paso 4, el formulario valida en tiempo real y deshabilita el envío hasta que se cumplan todas las reglas

### FA-3: Acceso al keychain denegado
- En el paso 13, si el keychain del SO no es accesible, la operación falla con un mensaje de error y la identidad no se crea

## Postcondiciones

- Un nuevo par de claves Ed25519 existe en el keychain del sistema
- Un nuevo par de claves secp256k1 existe en el keychain del sistema
- Los metadatos de identidad están persistidos en el Tauri Store (`identity.json`)
- El DID está generado y es utilizable localmente: `did:almena:<ed25519_public_key_hex>`
- La sesión del usuario está desbloqueada
- No se ha realizado ninguna transacción en blockchain (el anclaje es un paso separado y opcional)

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | Flujo UI: bienvenida → contraseña → frase de recuperación → éxito |
| **wallet** (Rust backend) | Hashing Argon2, parseo de mnemónico BIP39, derivación de claves Ed25519/secp256k1, almacenamiento en keychain |

## Notas Técnicas

- **Derivación de claves**: Dos derivaciones paralelas desde la misma semilla BIP39 — Ed25519 (identidad) y secp256k1 (firma blockchain mediante BIP44 `m/44'/118'/0'/0/0`)
- **Formato DID**: `did:almena:<ed25519_public_key_hex>` (256 caracteres hexadecimales)
- **Hashing de contraseña**: Argon2 con salt aleatorio, ejecutado en Rust por seguridad
- **Idioma del mnemónico**: Soporta listas de palabras en inglés y español; idioma auto-detectado durante la validación
- **Las claves privadas nunca salen del keychain del sistema** — todas las operaciones criptográficas se ejecutan en Rust
- **No se requieren llamadas de red** — la creación de identidad es completamente offline
