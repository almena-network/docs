---
title: "UC-018: Enviar Mensaje DIDComm"
sidebar_label: "UC-018: Enviar Mensaje"
sidebar_position: 18
---

# UC-018: Enviar Mensaje DIDComm

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El transporte de mensajes DIDComm aún no está integrado en la wallet — los mensajes actualmente solo se almacenan localmente.
:::

## Descripción

Desde una conversación activa en la wallet, el usuario compone y envía un mensaje de texto a otro usuario de wallet. La wallet cifra el mensaje usando cifrado autenticado DIDComm v2 (doble sobre: cifrado extremo a extremo interno para el destinatario, sobre de enrutamiento externo para el mediator), y lo entrega a través del servicio mediator. El destinatario recibe el mensaje en tiempo real si está online, o lo recupera más tarde de la cola offline del mediator. El mensaje enviado se almacena localmente en el historial de la conversación.

## Actores

- **Emisor (Usuario Final)**: Persona que compone y envía el mensaje desde su wallet
- **Wallet (Frontend)**: Aplicación Svelte que proporciona la UI de chat y la composición de mensajes
- **Wallet (Rust Backend)**: Comandos Tauri que realizan el empaquetado de mensajes DIDComm (cifrado JWE, firma JWS)
- **Mediator**: Servicio Go que enruta el mensaje cifrado al destinatario

## Precondiciones

- El emisor tiene una identidad creada en la wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- La sesión de la wallet está desbloqueada
- La wallet está registrada en el mediator ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- Existe una conversación activa con el destinatario ([UC-020](/docs/developers/use-cases/wallet/uc-020-manage-conversations))
- El emisor conoce el DID del destinatario

## Flujo Principal

1. El usuario abre una conversación existente desde la pantalla de chat
2. La wallet muestra la conversación con el historial de mensajes y el área de entrada
3. El usuario escribe un mensaje en el campo de entrada del chat
4. El usuario presiona Enter o pulsa el botón de enviar
5. La wallet valida que el mensaje no está vacío tras recortar espacios
6. La wallet crea un mensaje DIDComm v2 Basic Message:
   - `id`: UUID v4
   - `type`: `https://didcomm.org/basicmessage/2.0/message`
   - `from`: DID del emisor (`did:almena:<sender_public_key_hex>`)
   - `to`: DID del destinatario (`did:almena:<recipient_public_key_hex>`)
   - `body`: `{ "content": "<texto_del_mensaje>" }`
   - `thid`: ID de hilo (identificador de conversación: `<sender_did>:<recipient_did>`)
   - `created_time`: timestamp UTC actual
7. La wallet invoca el Rust backend para empaquetar el mensaje (sobre interno):
   - Firma el mensaje en texto plano con la clave privada Ed25519 del emisor (JWS)
   - Cifra el mensaje firmado para el destinatario usando ECDH-ES+A256KW con la clave pública X25519 del destinatario (JWE)
   - El resultado es el **sobre interno**: solo el destinatario puede descifrarlo
8. La wallet envuelve el sobre interno en un **mensaje forward** (sobre externo):
   - Tipo: `https://didcomm.org/routing/2.0/forward`
   - `to`: el DID del mediator
   - `body.next`: DID de enrutamiento del destinatario en el mediator
   - `attachments`: el sobre interno cifrado
   - Cifra el mensaje forward para el mediator usando la clave pública X25519 del mediator
9. La wallet envía el mensaje con doble cifrado al mediator vía `POST /didcomm`
10. El mediator confirma la recepción (HTTP 202 Accepted)
11. La wallet almacena el mensaje enviado localmente en el Tauri Store (`chat.json`) bajo la conversación del destinatario
12. El mensaje aparece en la UI del chat como una burbuja enviada (alineada a la derecha, gradiente naranja) con el timestamp actual
13. El campo de entrada del mensaje se limpia y el foco vuelve a él

## Flujos Alternativos

### FA-1: Mediator inaccesible
- En el paso 9, la petición de red al mediator falla (timeout, error de conexión)
- La wallet almacena el mensaje localmente con estado de entrega `pending`
- El mensaje aparece en la UI con un indicador de pendiente (icono de reloj)
- La wallet reintenta la entrega cuando se restablece la conexión con el mediator
- Tras un reintento exitoso, el estado se actualiza a `sent`

### FA-2: DID del destinatario no resoluble
- En el paso 7, la wallet no puede resolver el DID del destinatario para obtener su clave pública
- La wallet muestra un error: "No se puede cifrar el mensaje — clave del destinatario no disponible"
- El mensaje no se envía ni se almacena

### FA-3: Mensaje vacío
- En el paso 5, el mensaje está vacío o solo contiene espacios en blanco
- El botón de enviar está deshabilitado y no se realiza ninguna acción

### FA-4: Mensaje demasiado largo
- En el paso 5, el mensaje excede la longitud máxima (configurable, por defecto 4096 caracteres)
- La wallet muestra un aviso de contador de caracteres e impide el envío

### FA-5: WebSocket disponible para entrega
- Si la conexión WebSocket con el mediator está activa, la wallet puede opcionalmente enviar el mensaje por WebSocket en lugar de HTTP POST
- El comportamiento es idéntico; el transporte es una optimización para menor latencia

## Postcondiciones

- El mensaje cifrado ha sido entregado al mediator para su enrutamiento al destinatario
- El mediator retiene el mensaje para entrega en vivo o recogida offline
- El mensaje en texto plano se almacena localmente en el historial de conversación del emisor
- La UI del chat refleja el nuevo mensaje enviado con timestamp
- El campo de entrada del mensaje está limpio

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | UI de chat, composición de mensajes, visualización de mensajes enviados, indicadores de estado de entrega |
| **wallet** (Rust backend) | Firma Ed25519 (JWS), acuerdo de claves X25519, cifrado JWE (sobres interno + externo), resolución de DID |
| **mediator** | Recepción de mensajes, enrutamiento al destinatario, entrega en vivo vía WebSocket o almacenamiento en cola offline |

## Notas Técnicas

- **Cifrado de doble sobre**: El mensaje se cifra dos veces. El sobre interno (emisor → destinatario) proporciona cifrado extremo a extremo que el mediator no puede leer. El sobre externo (emisor → mediator) proporciona la información de enrutamiento. Este es el mecanismo estándar de reenvío de DIDComm v2
- **Tipo de mensaje**: `https://didcomm.org/basicmessage/2.0/message` — el tipo de mensaje DIDComm más simple para chat de texto plano
- **Modelo de hilos**: Cada conversación tiene un ID de hilo (`thid`) formado por `<initiator_did>:<responder_did>`. Todos los mensajes en una conversación comparten el mismo `thid`, permitiendo la agrupación de mensajes
- **Resolución de claves**: El emisor debe obtener la clave pública X25519 del destinatario para cifrar el sobre interno. Puede resolverse desde el DID Document del destinatario (si está anclado en blockchain vía [UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)) o desde un intercambio de claves previo
- **Algoritmos de cifrado**: JWE con ECDH-ES+A256KW para envoltorio de claves y A256CBC-HS512 para cifrado de contenido (igual que la especificación del mediator)
- **Almacenamiento local**: Los mensajes enviados se almacenan en texto plano en el Tauri Store (`chat.json`) indexados por DID del contacto. Solo la wallet del emisor tiene acceso al texto plano — el mediator solo ve sobres cifrados
- **Entrega offline**: Si el destinatario no está conectado al mediator vía WebSocket, el mediator almacena el sobre interno cifrado hasta 72 horas. El destinatario lo recupera mediante Message Pickup 3.0 ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message))
- **Limitación de tasa**: El mediator impone 60 mensajes/minuto por DID. Si se excede, la wallet recibe HTTP 429 y debe aplicar backoff
