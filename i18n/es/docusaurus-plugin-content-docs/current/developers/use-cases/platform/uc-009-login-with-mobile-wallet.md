---
title: "UC-009: Login con Wallet Móvil"
sidebar_label: "UC-009: Login (Wallet Móvil)"
sidebar_position: 9
---

# UC-009: Login con Wallet Móvil

## Descripción

El usuario inicia sesión en el portal web usando la wallet de Almena ID instalada en un dispositivo móvil. El portal solicita un challenge de autenticación al backend, genera un código QR que codifica un deep link (`almena://auth?challenge=...`), y lo muestra en pantalla. El usuario escanea el QR con la wallet móvil, aprueba el challenge, y la wallet firma y envía la respuesta al backend. El QR auto-rota cada 30 segundos, generando un challenge nuevo cada vez. El portal detecta la finalización mediante polling.

## Actores

- **Usuario Final**: Persona que inicia sesión en el portal web usando su dispositivo móvil
- **Frontend (Portal)**: Aplicación web Next.js que muestra el código QR y realiza polling del resultado
- **Backend API**: Servicio FastAPI que gestiona challenges, verificación de firma, gestión de usuarios y emisión de JWT
- **Wallet (Móvil)**: Aplicación Tauri móvil que escanea el código QR y firma el challenge
- **Blockchain** (opcional): Consultada para resolución del DID Document durante la verificación de firma

## Precondiciones

- El usuario tiene una identidad creada en la wallet móvil ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- La wallet móvil está instalada y la cámara es accesible
- El backend API es accesible desde el portal
- El portal está cargado en el navegador en la página de login (`/[locale]/login`)

## Flujo Principal

1. El usuario navega a la página de login y hace clic en el botón **Almena ID**
2. El portal llama a `POST /api/v1/auth/challenge` con la URL de origen del portal
3. El backend genera un challenge (igual que en [UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet)): `challenge_id`, `nonce`, `expires_at` (5 minutos), `callback_url`, `requested_proof`
4. El backend devuelve el `ChallengeResponse` al portal
5. El portal intenta la entrega a wallet de escritorio (HTTP + deep link). Si ambos fallan (esperado cuando no hay wallet de escritorio), el portal procede a mostrar el código QR
6. El portal construye la URL de deep link: `almena://auth?challenge=<base64url>&callback=<callback_url>&origin=<origin>`
7. El portal renderiza un código QR a partir de la URL del deep link usando la librería `qrcode.react` (componente QRCodeSVG)
8. El portal inicia polling a `GET /api/v1/auth/status/{challenge_id}` cada 2 segundos
9. El portal inicia un temporizador de rotación QR: cada 30 segundos solicita un nuevo challenge al backend, genera un nuevo código QR e inicia polling del nuevo challenge (detiene el polling del anterior)
10. El usuario abre la wallet móvil y escanea el código QR con la cámara del dispositivo
11. La wallet móvil decodifica el QR, extrae el deep link `almena://auth` y parsea el challenge
12. La wallet muestra la pantalla **AuthConsent** con el origen, la prueba solicitada y un temporizador de cuenta atrás
13. El usuario pulsa **Aprobar**
14. La wallet firma el challenge con Ed25519 y envía por POST el `AuthResponse` a la `callback_url`
15. El backend verifica la firma, consume el challenge, busca o crea el usuario y genera un JWT (mismo flujo de verificación que [UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet), pasos 15-19)
16. La siguiente petición de polling del portal detecta `status: "completed"` con `access_token`
17. El portal almacena `almena_token`, `almena_user_id`, `almena_did` en localStorage
18. El portal redirige a `/dashboard`

## Flujos Alternativos

### FA-1: El usuario rechaza el challenge
- En el paso 13, el usuario pulsa **Rechazar**
- La wallet llama a `POST /api/v1/auth/reject/{challenge_id}`
- El polling del portal detecta `status: "rejected"`
- El portal muestra: "La solicitud de autenticación fue rechazada en la wallet."

### FA-2: El QR rota antes del escaneo
- En el paso 9, el temporizador de rotación de 30 segundos se dispara antes de que el usuario escanee
- El portal solicita un nuevo challenge al backend
- Se renderiza un nuevo código QR reemplazando el anterior
- El polling cambia al nuevo challenge_id
- El challenge anterior permanece `PENDING` hasta que expire (5 minutos) y sea limpiado

### FA-3: El challenge expira
- El usuario no escanea ni responde en 5 minutos
- Se dispara el timeout de polling del portal
- El portal muestra: "La solicitud de autenticación ha expirado. Por favor, inténtalo de nuevo."

### FA-4: Permiso de cámara denegado
- En el paso 10, el dispositivo móvil deniega el acceso a la cámara
- El usuario no puede escanear el QR y debe otorgar permiso de cámara o usar un método alternativo

### FA-5: Wallet de escritorio también disponible
- En el paso 5, la entrega a wallet de escritorio tiene éxito
- Tanto el consentimiento de la wallet de escritorio como el código QR están disponibles simultáneamente
- La primera aprobación (desde cualquier dispositivo) completa el challenge
- El polling del portal detecta la finalización independientemente de qué wallet respondió

### FA-6: El usuario escanea un QR expirado
- El usuario escanea un código QR que ya fue rotado
- El challenge anterior puede seguir `PENDING` (dentro de los 5 minutos)
- La wallet envía la respuesta para el challenge_id anterior
- El backend lo verifica normalmente si sigue vigente
- Sin embargo, el portal puede haber cambiado a polling de un challenge_id más nuevo y no lo detectará
- El usuario debería escanear el QR mostrado actualmente

## Postcondiciones

- El usuario está autenticado en el portal con un JWT válido
- `almena_token`, `almena_user_id` y `almena_did` están almacenados en localStorage
- Existe un registro de usuario en la base de datos del backend para este DID
- El challenge está consumido y no puede reutilizarse

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | UI de login, solicitud de challenge, generación de código QR (`qrcode.react`), rotación QR cada 30 segundos, polling, almacenamiento de sesión, redirección |
| **backend** | Creación y almacenamiento de challenges (en memoria), verificación de firma (Ed25519/PyNaCl), gestión de usuarios, emisión de JWT, endpoint de polling |
| **wallet** (móvil) | Escaneo QR, parseo de deep link, UI AuthConsent, firma Ed25519, POST de respuesta al callback |
| **blockchain** | Resolución del DID Document (opcional) |

## Notas Técnicas

- **Rotación QR**: Cada 30 segundos se crea un challenge completamente nuevo. Esto significa una nueva llamada `POST /api/v1/auth/challenge`, nueva imagen QR, y el polling cambia al nuevo challenge_id. Los challenges anteriores expiran naturalmente
- **Contenido QR**: El QR codifica la URL completa del deep link `almena://auth?challenge=...`, no solo los datos del challenge. Esto permite que el SO móvil lo enrute directamente a la app wallet
- **Librería QR**: `qrcode.react` (componente QRCodeSVG) renderiza el QR como SVG en el navegador
- **Doble vía**: Tanto la entrega a escritorio (HTTP + deep link) como la visualización QR ocurren simultáneamente. El QR aparece en el estado "waiting" mientras el portal también intenta la wallet de escritorio. La primera wallet que responda gana
- **Polling vs rotación**: El intervalo de polling es 2 segundos para verificaciones de estado. El intervalo de rotación QR es 30 segundos para challenges frescos. Son temporizadores independientes
- **Sin WebSocket**: El estado se verifica solo mediante polling. No hay mecanismo push del backend al frontend
