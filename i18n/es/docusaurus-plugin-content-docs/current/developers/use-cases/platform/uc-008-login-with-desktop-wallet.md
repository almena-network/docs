---
title: "UC-008: Login con Wallet de Escritorio"
sidebar_label: "UC-008: Login (Wallet Escritorio)"
sidebar_position: 8
---

# UC-008: Login con Wallet de Escritorio

## Descripción

El usuario inicia sesión en el portal web usando la wallet de Almena ID instalada en el mismo ordenador. El portal solicita un challenge de autenticación al backend, luego intenta entregarlo a la wallet mediante HTTP (`localhost:1421`) con fallback a un deep link (`almena://auth?challenge=...`). La wallet muestra una pantalla de consentimiento donde el usuario aprueba o rechaza. Al aprobar, la wallet firma el challenge con Ed25519 y envía por POST la respuesta a la callback URL del backend. El backend verifica la firma, crea o recupera el usuario, genera un JWT, y el portal detecta la finalización mediante polling.

## Actores

- **Usuario Final**: Persona que inicia sesión en el portal web
- **Frontend (Portal)**: Aplicación web Next.js en `/login` que inicia el flujo de login
- **Backend API**: Servicio FastAPI que gestiona challenges, verificación de firma, gestión de usuarios y emisión de JWT
- **Wallet (Escritorio)**: Aplicación Tauri en la misma máquina que recibe el challenge via HTTP o deep link
- **Blockchain** (opcional): Consultada para resolución del DID Document durante la verificación de firma

## Precondiciones

- El usuario tiene una identidad creada en la wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- La aplicación wallet está instalada y en ejecución en el mismo ordenador
- El backend API es accesible desde el portal
- El portal está cargado en el navegador en la página de login (`/[locale]/login`)

## Flujo Principal

1. El usuario navega a la página de login y hace clic en el botón **Almena ID**
2. El portal establece el estado de UI a "requesting" y llama a `POST /api/v1/auth/challenge` con la URL de origen del portal
3. El backend genera un challenge:
   - `challenge_id`: UUID v4
   - `nonce`: 32 bytes aleatorios criptográficos (`secrets.token_urlsafe(32)`)
   - `timestamp`: hora UTC actual
   - `expires_at`: hora actual + 5 minutos
   - `callback_url`: endpoint de verificación del backend (`/api/v1/auth/verify`)
   - `requested_proof`: `"authentication"`
   - Almacena el challenge en memoria con estado `PENDING`
4. El backend devuelve el `ChallengeResponse` al portal
5. El portal intenta entregar el challenge a la wallet mediante HTTP:
   - `POST http://localhost:1421/auth-request` con los datos del challenge (codificados en base64url), callback URL y origen
6. Si la entrega HTTP tiene éxito, la wallet recibe el challenge directamente
7. Si HTTP falla, el portal recurre a un deep link:
   - Construye `almena://auth?challenge=<base64url>&callback=<callback_url>&origin=<origin>`
   - Crea un elemento anchor oculto, dispara click y lo elimina
8. El SO enruta el deep link `almena://` a la wallet mediante `tauri-plugin-deep-link`
9. La wallet parsea el deep link, decodifica el challenge base64url y lo almacena en el mutex `PENDING_AUTH_REQUEST`
10. La wallet muestra la pantalla **AuthConsent** con el origen, la prueba solicitada y un temporizador de cuenta atrás
11. El portal transiciona al estado "waiting" e inicia polling a `GET /api/v1/auth/status/{challenge_id}` cada 2 segundos (timeout de 5 minutos)
12. El usuario hace clic en **Aprobar** en la wallet
13. La wallet invoca `approve_auth_request(did)`:
    - Recupera la clave privada Ed25519 del keychain del sistema
    - Construye el payload: `{challenge_id, nonce, timestamp, expires_at, origin}`
    - Firma con Ed25519
    - Construye el `AuthResponse`: `{challenge_id, did, signature, signed_payload, verification_method, timestamp}`
14. La wallet envía por POST el `AuthResponse` a la `callback_url` (`POST /api/v1/auth/verify`)
15. El backend verifica la respuesta:
    - Valida que el challenge existe, está `PENDING` y no ha expirado
    - Extrae la clave pública del DID (para `did:almena:*`, el propio DID contiene el hex de la clave pública)
    - Si es necesario, resuelve el DID Document desde la blockchain (`GET /almenachain/did/v1/resolve/{did}`)
    - Verifica la firma Ed25519 usando PyNaCl
    - Valida que el payload firmado coincide con el challenge original (challenge_id y nonce)
16. El backend consume el challenge (estado → `COMPLETED`, almacena `responded_did`)
17. El backend busca o crea el usuario en la base de datos por DID
18. El backend genera un token de acceso JWT (HS256, expiración 60 minutos) con payload `{sub: user_id, did, iat, exp, type: "access"}`
19. El backend almacena el resultado de autenticación (token, user_id, did, is_new_user) asociado al challenge_id
20. La siguiente petición de polling del portal detecta `status: "completed"` con `access_token`
21. El portal almacena en localStorage: `almena_token`, `almena_user_id`, `almena_did`
22. El portal actualiza el estado de autenticación a `isAuthenticated = true`
23. El portal redirige a `/dashboard` tras una animación de éxito de 800ms

## Flujos Alternativos

### FA-1: Wallet no encontrada
- En el paso 5, HTTP a `localhost:1421` falla
- En el paso 7, el clic del deep link no abre la wallet (no hay handler registrado)
- El portal muestra: "Wallet no encontrada. Asegúrate de que la wallet de Almena ID esté instalada y en ejecución."

### FA-2: El usuario rechaza el challenge
- En el paso 12, el usuario hace clic en **Rechazar** en la wallet
- La wallet llama a `POST /api/v1/auth/reject/{challenge_id}`
- El backend marca el challenge como `REJECTED`
- El polling del portal detecta `status: "rejected"`
- El portal muestra: "La solicitud de autenticación fue rechazada en la wallet."

### FA-3: El challenge expira
- El usuario no responde en 5 minutos
- El backend auto-marca el challenge como `EXPIRED` en el siguiente acceso
- El polling del portal detecta `status: "expired"` o se dispara el timeout de polling de 5 minutos
- El portal muestra: "La solicitud de autenticación ha expirado. Por favor, inténtalo de nuevo."

### FA-4: La verificación de firma falla
- En el paso 15, la firma no coincide con la clave pública o el payload no coincide con el challenge
- El backend devuelve un error a la wallet
- El challenge permanece `PENDING` y el portal continúa el polling hasta la expiración

### FA-5: La sesión de la wallet está bloqueada
- En el paso 9, la wallet está en ejecución pero bloqueada
- El usuario debe primero desbloquear (contraseña o biometría, ver [UC-005](/docs/developers/use-cases/wallet/uc-005-unlock-wallet-with-biometrics))
- Tras desbloquear, se muestra la solicitud de autenticación pendiente

### FA-6: Usuario nuevo (primer login)
- En el paso 17, no existe usuario para este DID
- El backend crea un nuevo registro de usuario (`is_new_user: true`)
- El portal puede mostrar un flujo de onboarding tras la redirección

## Postcondiciones

- El usuario está autenticado en el portal con un JWT válido
- `almena_token`, `almena_user_id` y `almena_did` están almacenados en localStorage
- Existe un registro de usuario en la base de datos del backend para este DID
- El challenge está consumido y no puede reutilizarse
- El `PENDING_AUTH_REQUEST` de la wallet está limpio

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | UI de login, solicitud de challenge, entrega a wallet (HTTP + fallback deep link), polling, almacenamiento de sesión, redirección |
| **backend** | Creación y almacenamiento de challenges (en memoria), verificación de firma (Ed25519/PyNaCl), gestión de usuarios (buscar o crear), emisión de JWT (HS256), endpoint de polling |
| **wallet** | Recepción deep link / HTTP, UI AuthConsent, firma Ed25519, POST de respuesta al callback |
| **blockchain** | Resolución del DID Document (opcional, para verificación de firma) |

## Notas Técnicas

- **Estrategia de entrega a wallet**: HTTP a `localhost:1421` primero (funciona cuando la wallet expone un servidor HTTP local), luego fallback con deep link via protocolo `almena://auth`. Este enfoque dual maximiza la compatibilidad
- **Almacenamiento de challenges**: Diccionario en memoria en el backend. No persistido a base de datos. Se pierde al reiniciar el servidor. Para escalado horizontal se necesitaría Redis o similar
- **TTL del challenge**: 5 minutos. Auto-limpieza elimina challenges expirados
- **JWT**: HS256 con expiración de 60 minutos. Secreto desde `settings.secret_key`
- **Resolución DID**: Para `did:almena:*` la clave pública se extrae directamente del string DID (ES la clave pública codificada en hex). La resolución blockchain es un fallback para DIDs anclados
- **Polling**: El frontend consulta cada 2 segundos. No hay implementación WebSocket
- **Creación automática de usuario**: La primera autenticación exitosa con un DID nuevo crea automáticamente un registro de usuario en la base de datos
