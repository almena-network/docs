---
title: "UC-006: Mostrar Código QR de Identidad"
sidebar_label: "UC-006: Mostrar QR de Identidad"
sidebar_position: 6
---

# UC-006: Mostrar Código QR de Identidad

## Descripción

La wallet muestra un código QR rotativo que representa la identidad descentralizada del usuario. El QR codifica un payload JSON que contiene el DID, un timestamp, un tiempo de expiración y un token de rotación. El QR se regenera cada 30 segundos (configurable) para prevenir la captura estática y el replay. El QR se renderiza con los colores de marca de Almena (naranja sobre fondo oscuro) e incluye un temporizador de cuenta atrás visible.

## Actores

- **Usuario Final**: Persona que muestra su código QR de identidad
- **Wallet (Frontend)**: Aplicación Svelte que genera y renderiza el código QR

## Precondiciones

- El usuario tiene una identidad creada en la wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- El usuario está autenticado y en el dashboard
- El DID está disponible en el Tauri Store

## Flujo Principal

1. El usuario navega a la página de **Identidad** (`/dashboard/identity`)
2. La página carga la identidad desde el Tauri Store (DID y clave pública)
3. La página llama a `generateQRCode()`:
   - Obtiene el timestamp Unix actual (segundos)
   - Calcula `expiresAt = timestamp + QR_ROTATION_INTERVAL` (por defecto: 30s, configurable via `VITE_QR_ROTATION_INTERVAL_SECONDS`)
   - Genera un token de rotación: `btoa(did + ":" + timestamp).substring(0, 16)`
   - Construye el payload JSON:
     ```json
     {
       "did": "did:almena:<public_key_hex>",
       "timestamp": 1234567890,
       "expiresAt": 1234567920,
       "token": "base64_16_chars"
     }
     ```
   - Genera la imagen QR usando la librería npm `qrcode` mediante `QRCode.toDataURL()` con opciones:
     - Ancho: 200px
     - Margen: 2px
     - Colores: naranja (`#f97316`) sobre oscuro (`#18181b`)
     - Corrección de errores: Media (`M`)
4. La imagen del código QR se muestra en pantalla
5. Un temporizador de cuenta atrás comienza en 30 y decrementa cada segundo (mostrado como "30s", "29s", etc.)
6. Se ejecutan dos bucles `setInterval`:
   - **Intervalo de rotación** (cada 30s): llama a `generateQRCode()` para regenerar el QR con nuevo timestamp, expiración y token
   - **Intervalo de cuenta atrás** (cada 1s): decrementa la cuenta atrás visible
7. En cada rotación, la imagen QR transiciona con una animación CSS de fade
8. El QR permanece mostrado hasta que el usuario sale de la página de Identidad
9. Al abandonar la página, ambos intervalos se limpian (cleanup en destrucción del componente)

## Flujos Alternativos

### FA-1: Identidad no encontrada
- En el paso 2, si no existe identidad en el Tauri Store, la página muestra un mensaje apropiado o redirige al onboarding

### FA-2: Fallo en la generación del QR
- En el paso 3, si `QRCode.toDataURL()` lanza un error, el error se registra en log y el área del QR muestra un estado de error

## Postcondiciones

- El código QR es visible en pantalla con el DID del usuario codificado
- El QR rota automáticamente cada 30 segundos
- No se producen cambios de estado persistente — es una visualización de solo lectura
- Cuando el usuario abandona la página, todos los temporizadores se limpian

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | Generación QR (librería npm `qrcode`), temporizador de cuenta atrás, lógica de rotación, renderizado UI |

## Notas Técnicas

- **No se invocan comandos Rust/Tauri**: La generación del QR es enteramente frontend usando el paquete npm `qrcode` (v1.5.4)
- **El token NO es criptográfico**: El token de rotación es un simple `btoa(did:timestamp)` truncado a 16 caracteres — sirve como identificador de rotación, no como firma
- **Sin firma del payload QR**: El QR en sí no está firmado criptográficamente. La autenticación ocurre en un flujo separado de challenge-response cuando el QR es escaneado (ver [UC-007](/docs/developers/use-cases/wallet/uc-007-authenticate-via-qr-code))
- **Intervalo de rotación**: Por defecto 30 segundos, configurable mediante la variable de entorno `VITE_QR_ROTATION_INTERVAL_SECONDS`
- **Formato QR**: String JSON, no binario ni envuelto en base64
- **Estilo visual**: Naranja sobre fondo oscuro coincide con la identidad de marca de Almena
- **Limpieza**: El ciclo de vida de destrucción del componente limpia ambos temporizadores `setInterval` para prevenir fugas de memoria
