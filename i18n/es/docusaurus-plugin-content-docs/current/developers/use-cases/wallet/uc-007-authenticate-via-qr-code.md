---
title: "UC-007: Autenticarse mediante Código QR"
sidebar_label: "UC-007: Autenticarse via QR"
sidebar_position: 7
---

# UC-007: Autenticarse mediante Código QR

## Descripción

Una aplicación externa escanea el código QR de identidad del usuario (mostrado en [UC-006](./uc-006-display-identity-qr-code.md)) e inicia un challenge de autenticación. La wallet recibe el challenge mediante un deep link (`almena://auth?challenge=...`), muestra una pantalla de consentimiento donde el usuario puede aprobar o rechazar, y si se aprueba, firma el challenge con la clave privada Ed25519 y envía la respuesta firmada a la URL de callback de la aplicación solicitante.

## Actores

- **Usuario Final**: Persona que aprueba o rechaza la solicitud de autenticación en la wallet
- **Aplicación Externa**: App web, servicio u otra wallet que escanea el código QR e inicia el challenge
- **Backend API**: Backend de la plataforma que crea el challenge de autenticación y valida la respuesta firmada
- **Wallet (Frontend)**: Aplicación Svelte que gestiona el deep link, la UI de consentimiento y el flujo de respuesta
- **Wallet (Rust Backend)**: Comandos Tauri que gestionan el almacenamiento del challenge, la firma Ed25519 y la construcción de la respuesta

## Precondiciones

- El usuario tiene una identidad creada en la wallet ([UC-001](./uc-001-create-identity.md))
- La wallet está en ejecución (primer plano o segundo plano)
- El código QR de identidad ha sido escaneado por una aplicación externa
- El `tauri-plugin-deep-link` está configurado para manejar URLs `almena://`
- La clave privada Ed25519 está almacenada en el keychain del sistema

## Flujo Principal

1. La aplicación externa escanea el código QR de identidad del usuario y extrae el DID del payload JSON
2. La aplicación externa envía el DID al backend API para iniciar una solicitud de autenticación
3. El backend crea un challenge de autenticación que contiene:
   - `challenge_id`: identificador único
   - `nonce`: valor aleatorio para prevenir replay
   - `timestamp`: cuándo se creó el challenge
   - `expires_at`: cuándo expira el challenge
   - `origin`: identificador de la aplicación solicitante
   - `callback_url`: a dónde enviar la respuesta firmada
   - `requested_proof`: qué se está solicitando
4. El backend codifica el challenge como JSON en base64url y construye un deep link: `almena://auth?challenge=<challenge_codificado_base64url>`
5. El deep link se entrega a la wallet (mediante el manejador de URLs del SO)
6. El `tauri-plugin-deep-link` de la wallet captura la URL `almena://` y dispara `on_open_url`
7. La wallet llama a `handle_deep_link()` que parsea la URL
8. `auth::parse_auth_deep_link()` extrae el parámetro `challenge`, decodifica el JSON base64url y deserializa la estructura `AuthRequest`
9. El challenge se almacena en el mutex `PENDING_AUTH_REQUEST` (estado global en Rust)
10. El frontend de la wallet detecta la solicitud pendiente y muestra el componente **AuthConsent** mostrando:
    - El origen solicitante
    - La acción/prueba solicitada
    - Un temporizador de cuenta atrás mostrando el tiempo restante hasta la expiración (formato: `MM:SS`)
    - Botones **Aprobar** y **Rechazar**
11. El usuario hace clic en **Aprobar**
12. La wallet invoca el comando Rust `approve_auth_request(did)`:
    - Recupera la clave privada Ed25519 del keychain del sistema
    - Construye el payload a firmar:
      ```json
      {
        "challenge_id": "...",
        "nonce": "...",
        "timestamp": "...",
        "expires_at": "...",
        "origin": "..."
      }
      ```
    - Firma los bytes del payload con Ed25519: `signing_key.sign(payload_bytes)`
    - Construye el `AuthResponse`:
      ```json
      {
        "challenge_id": "...",
        "did": "did:almena:...",
        "signature": "<firma_ed25519_base64url>",
        "signed_payload": "<payload_base64url>",
        "verification_method": "did#key-1",
        "timestamp": "..."
      }
      ```
13. La wallet envía por POST el `AuthResponse` a la `callback_url` del challenge original
14. El backend verifica la firma contra la clave pública del DID, valida el nonce y los timestamps, y completa la autenticación
15. La pantalla de consentimiento se cierra y el usuario vuelve a la wallet

## Flujos Alternativos

### FA-1: El usuario rechaza la solicitud
- En el paso 11, el usuario hace clic en **Rechazar**
- La wallet llama a `reject_auth_request()` que limpia el `PENDING_AUTH_REQUEST`
- No se envía respuesta a la callback URL
- La pantalla de consentimiento se cierra

### FA-2: Challenge expirado
- En el paso 10, la cuenta atrás llega a cero antes de que el usuario actúe
- La pantalla de consentimiento transiciona a un estado "expirado"
- El botón de aprobar se deshabilita
- El usuario solo puede descartar la pantalla

### FA-3: Deep link recibido con la wallet bloqueada
- En el paso 6, si la sesión de la wallet está bloqueada, el usuario debe primero desbloquear (mediante contraseña o biometría, ver [UC-005](./uc-005-unlock-wallet-with-biometrics.md))
- Tras desbloquear, se muestra la solicitud de autenticación pendiente

### FA-4: Callback URL inaccesible
- En el paso 13, si el POST a la callback URL falla, se muestra un error al usuario
- La respuesta firmada fue generada pero no pudo ser entregada

### FA-5: Clave privada no encontrada
- En el paso 12, si la clave privada Ed25519 no se encuentra en el keychain, la operación falla con un error

## Postcondiciones

- El challenge de autenticación ha sido firmado y enviado a la aplicación solicitante
- El `PENDING_AUTH_REQUEST` se ha limpiado
- No hay cambios de estado persistente en la wallet — el flujo de autenticación es sin estado
- La aplicación externa puede verificar la identidad del usuario usando la respuesta firmada

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | Componente UI AuthConsent, detección de deep link, temporizador de cuenta atrás, POST de respuesta al callback |
| **wallet** (Rust backend) | Parseo de deep link (`auth::parse_auth_deep_link`), almacenamiento del challenge (mutex `PENDING_AUTH_REQUEST`), firma Ed25519 (`sign_challenge`), construcción de respuesta |
| **backend** | Crea challenges de autenticación, valida respuestas firmadas, completa la autenticación |

## Notas Técnicas

- **Protocolo de deep link**: `almena://auth?challenge=<base64url>` — manejado por `tauri-plugin-deep-link`
- **Almacenamiento del challenge**: Una única solicitud pendiente almacenada en un `Mutex<Option<AuthRequest>>` en Rust. Un nuevo challenge sobrescribe cualquier pendiente existente
- **Firma Ed25519**: El payload del challenge se firma como bytes crudos usando la clave privada Ed25519 del keychain del sistema. La firma y el payload se codifican en base64url en la respuesta
- **Método de verificación**: La respuesta referencia `did#key-1` como método de verificación, coincidiendo con la clave en el DID Document (si está anclado, ver [UC-003](./uc-003-anchor-did-on-blockchain.md))
- **Sin escaneo QR en la wallet**: La wallet NO escanea códigos QR. Solo los muestra. El escaneo lo realizan aplicaciones externas
- **Flujo sin estado**: Cada autenticación es independiente. No se persisten sesiones ni tokens en la wallet después de enviar la respuesta
