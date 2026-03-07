---
title: "UC-002: Recuperar Identidad"
sidebar_label: "UC-002: Recuperar Identidad"
sidebar_position: 2
---

# UC-002: Recuperar Identidad

## Descripción

El usuario recupera una identidad descentralizada existente introduciendo su frase de recuperación BIP39 de 12 palabras. La wallet re-deriva las mismas claves criptográficas (Ed25519 y secp256k1) a partir del mnemónico, las almacena en el keychain del sistema y restaura el DID. La identidad recuperada es idéntica a la original ya que el mismo mnemónico produce determinísticamente las mismas claves.

## Actores

- **Usuario Final**: Persona que recupera su identidad a través de la UI de la wallet
- **Wallet (Frontend)**: Aplicación Svelte que gestiona el flujo de UI de recuperación
- **Wallet (Rust Backend)**: Comandos Tauri que realizan la validación del mnemónico, derivación de claves y almacenamiento seguro
- **Keychain del Sistema**: Almacenamiento seguro a nivel de SO para claves privadas

## Precondiciones

- La aplicación wallet está instalada y en ejecución
- El usuario posee su frase de recuperación BIP39 de 12 palabras
- El keychain del sistema es accesible

## Flujo Principal

1. El usuario abre la wallet y ve la pantalla de bienvenida (`/`)
2. El usuario selecciona **Recuperar Identidad**
3. La wallet navega a la pantalla de creación de contraseña (`/recover`)
4. El usuario introduce una nueva contraseña (mínimo 8 caracteres)
5. El usuario confirma la contraseña
6. La wallet hashea la contraseña usando Argon2 (comando Rust `hash_password`)
7. El hash se almacena temporalmente en `sessionStorage`
8. La wallet navega a la pantalla de entrada de frase (`/recover/phrase`)
9. El usuario introduce su frase de recuperación de 12 palabras en el área de texto (separadas por espacios, auto-convertidas a minúsculas)
10. La wallet muestra el conteo de palabras y valida que se hayan introducido exactamente 12 palabras
11. La wallet llama a `validateRecoveryPhrase(words)` que verifica el checksum BIP39 contra todas las listas de palabras disponibles (inglés, español)
12. La wallet invoca el comando Rust `generate_and_store_identity` con el mnemónico y el hash de contraseña:
    - Parsea el mnemónico BIP39 (auto-detecta el idioma)
    - Genera la semilla BIP39 (passphrase vacía)
    - Deriva el par de claves Ed25519: `SHA512(seed[0:32])` → clave secreta de 32 bytes
    - Deriva la clave secp256k1 mediante la ruta BIP44 `m/44'/118'/0'/0/0`
    - Almacena ambas claves privadas en el keychain del sistema
    - Devuelve el DID y la clave pública
13. La wallet guarda los metadatos de identidad en el Tauri Store (`identity.json`)
14. El hash de contraseña se elimina de `sessionStorage`
15. La sesión se desbloquea mediante `unlockSession()`
16. La wallet navega a la pantalla de éxito de recuperación (`/recover/success`) mostrando el DID recuperado
17. El usuario continúa al dashboard

## Flujos Alternativos

### FA-1: Frase de recuperación inválida
- En el paso 11, si la frase no pasa la validación de checksum BIP39 en ningún idioma soportado, el formulario muestra un error y el envío queda bloqueado

### FA-2: Número de palabras incorrecto
- En el paso 10, si se introducen menos o más de 12 palabras, el formulario indica el conteo de palabras y el botón de envío permanece deshabilitado

### FA-3: Pegar desde portapapeles
- En el paso 9, el usuario puede usar el botón de pegar para leer la frase desde el portapapeles en lugar de escribirla manualmente

### FA-4: Acceso al keychain denegado
- En el paso 12, si el keychain del SO no es accesible, la operación falla con un mensaje de error

## Postcondiciones

- El par de claves Ed25519 está almacenado en el keychain del sistema (idéntico al original)
- El par de claves secp256k1 está almacenado en el keychain del sistema (idéntico al original)
- Los metadatos de identidad están persistidos en el Tauri Store (`identity.json`)
- El DID recuperado coincide con el original: `did:almena:<ed25519_public_key_hex>`
- La sesión del usuario está desbloqueada
- No se muestra la opción de anclaje en blockchain (a diferencia de la creación de identidad)

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | Flujo UI: bienvenida → contraseña → introducir frase → éxito |
| **wallet** (Rust backend) | Hashing Argon2, validación y parseo BIP39, derivación de claves Ed25519/secp256k1, almacenamiento en keychain |

## Notas Técnicas

- **Recuperación determinística**: El mismo mnemónico siempre produce las mismas claves Ed25519 y secp256k1, por lo que el DID es idéntico al original
- **Auto-detección de idioma**: El mnemónico se valida contra las listas de palabras BIP39 en inglés y español; se usa el primer idioma que coincida
- **Sin anclaje en blockchain en recuperación**: La pantalla de éxito no ofrece anclaje ya que el DID puede estar ya anclado desde la creación original
- **La contraseña es independiente**: La nueva contraseña no afecta la derivación de claves — solo el mnemónico determina las claves. La contraseña se usa únicamente para el bloqueo de sesión
- **Normalización de entrada**: La entrada de la frase se auto-convierte a minúsculas antes de la validación
