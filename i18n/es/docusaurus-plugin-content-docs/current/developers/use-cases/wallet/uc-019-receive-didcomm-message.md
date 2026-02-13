---
title: "UC-019: Recibir Mensaje DIDComm"
sidebar_label: "UC-019: Recibir Mensaje"
sidebar_position: 19
---

# UC-019: Recibir Mensaje DIDComm

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La recepción de mensajes DIDComm aún no está integrada en la wallet — los mensajes actualmente solo se almacenan localmente.
:::

## Descripción

La wallet recibe un mensaje DIDComm v2 enviado por otra wallet a través del mediator. Los mensajes llegan mediante dos mecanismos: entrega en tiempo real a través de la conexión WebSocket cuando la wallet está online, o recogida offline usando el protocolo Message Pickup 3.0 cuando la wallet se reconecta tras estar offline. La wallet descifra el mensaje recibido, valida la firma del emisor, lo almacena en el historial local de la conversación y lo muestra en la UI del chat.

## Actores

- **Destinatario (Usuario Final)**: Persona que recibe el mensaje en su wallet
- **Wallet (Frontend)**: Aplicación Svelte que muestra el mensaje entrante en la UI del chat
- **Wallet (Rust Backend)**: Comandos Tauri que realizan el descifrado JWE y la verificación de firma JWS
- **Mediator**: Servicio Go que entrega el mensaje cifrado vía WebSocket o lo retiene para recogida

## Precondiciones

- El destinatario tiene una identidad creada en la wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- La sesión de la wallet está desbloqueada
- La wallet está registrada en el mediator ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- El emisor ha enviado previamente un mensaje a esta wallet ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message))

## Flujo Principal (Entrega en tiempo real)

1. La wallet mantiene una conexión WebSocket activa con el mediator (`/ws?did=<wallet_DID>`)
2. El mediator recibe un mensaje reenviado destinado a esta wallet ([UC-021](/docs/developers/use-cases/mediator/uc-021-route-didcomm-message))
3. El mediator detecta que el destinatario tiene una conexión WebSocket activa
4. El mediator entrega el sobre interno cifrado a través del WebSocket
5. La wallet recibe el mensaje cifrado en el handler del WebSocket
6. La wallet invoca el Rust backend para desempaquetar el mensaje:
   - Descifra el JWE usando la clave privada X25519 de la wallet (derivada de Ed25519)
   - Verifica la firma JWS contra la clave pública Ed25519 del emisor
   - Extrae el mensaje DIDComm Basic Message en texto plano
7. La wallet valida la estructura del mensaje:
   - El tipo es `https://didcomm.org/basicmessage/2.0/message`
   - `from` contiene un DID válido
   - `body.content` está presente y no vacío
   - `thid` (ID de hilo) está presente
8. La wallet comprueba si el emisor es un contacto existente:
   - **Si sí**: El mensaje se añade a la conversación existente
   - **Si no**: Se crea automáticamente un nuevo contacto con el DID del emisor (sin alias) y el mensaje inicia una nueva conversación
9. La wallet almacena el mensaje recibido en el Tauri Store (`chat.json`) bajo la conversación del emisor
10. Si el usuario está viendo actualmente la conversación con este emisor:
    - El mensaje aparece como una burbuja recibida (alineada a la izquierda, fondo oscuro) con el timestamp
    - La vista se desplaza automáticamente al nuevo mensaje
11. Si el usuario está en la lista de conversaciones o en otra parte:
    - El `unreadCount` de la conversación se incrementa
    - La conversación se mueve al inicio de la lista con la previsualización del nuevo mensaje
    - Un badge de notificación se muestra en el elemento de navegación del chat
12. La wallet envía un acuse de recibo `messages-received` al mediator para que el mensaje se elimine de la cola

## Flujo Alternativo: Recogida de Mensajes Offline

### FA-PICKUP: Recuperar mensajes tras estar offline
1. La wallet se abre o la conexión WebSocket se restablece tras estar offline
2. La wallet envía un mensaje `status-request` al mediator:
   - Tipo: `https://didcomm.org/messagepickup/3.0/status-request`
3. El mediator responde con `status` indicando el número de mensajes encolados
4. Si hay mensajes encolados (count > 0):
   - La wallet envía un `delivery-request`:
     - Tipo: `https://didcomm.org/messagepickup/3.0/delivery-request`
     - `limit`: número de mensajes a recuperar (tamaño de lote, por defecto 10)
   - El mediator responde con un mensaje `delivery` que contiene los mensajes cifrados encolados como adjuntos
   - La wallet procesa cada mensaje siguiendo los pasos 6–11 del flujo principal
   - La wallet envía `messages-received` con los IDs de los mensajes procesados
   - El mediator elimina los mensajes confirmados de la cola
   - La wallet repite hasta que todos los mensajes encolados se han recuperado (el count del status llega a 0)

## Otros Flujos Alternativos

### FA-1: Formato de mensaje inválido
- En el paso 7, la estructura del mensaje es inválida (tipo desconocido, campos faltantes)
- La wallet descarta silenciosamente el mensaje y registra el error localmente
- No se almacena ni muestra ningún mensaje

### FA-2: Verificación de firma falla
- En el paso 6, la firma JWS no coincide con la clave pública del emisor
- La wallet descarta el mensaje — puede haber sido alterado
- La wallet registra una advertencia de seguridad localmente

### FA-3: Descifrado falla
- En el paso 6, el descifrado JWE falla (clave incorrecta, mensaje corrupto)
- La wallet descarta el mensaje y registra el error
- Esto puede indicar que el emisor cifró para el destinatario incorrecto

### FA-4: WebSocket desconectado durante la entrega
- La conexión WebSocket se interrumpe antes de que el mensaje se reciba completamente
- El mediator retiene el mensaje en la cola offline
- Cuando la wallet se reconecta, recupera el mensaje vía el flujo de recogida (FA-PICKUP)

### FA-5: Emisor bloqueado
- En una iteración futura, el usuario podrá bloquear DIDs específicos
- Los mensajes de DIDs bloqueados se descifran para verificar el emisor, luego se descartan silenciosamente
- No se produce ninguna notificación ni actualización de conversación

## Postcondiciones

- El mensaje recibido está descifrado, validado y almacenado en el historial local de la conversación
- La UI del chat refleja el nuevo mensaje (inline si la conversación está abierta, o como indicador de no leído)
- El mediator ha eliminado el mensaje entregado de su cola (tras el acuse de recibo)

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | Listener del WebSocket, visualización de mensajes en la UI del chat, badges de mensajes no leídos, indicadores de notificación |
| **wallet** (Rust backend) | Descifrado X25519 (JWE), verificación de firma Ed25519 (JWS), resolución del DID del emisor |
| **mediator** | Entrega en tiempo real vía WebSocket, cola de mensajes offline, protocolo Message Pickup 3.0, acuse de recibo de entrega |

## Notas Técnicas

- **Dos modos de entrega**: Tiempo real (push por WebSocket) es preferido cuando la wallet está online. Recogida offline (polling Message Pickup 3.0) es el fallback. La wallet debe siempre realizar una comprobación de estado al reconectarse para recuperar mensajes perdidos
- **Message Pickup 3.0**: Protocolo `https://didcomm.org/messagepickup/3.0/`. Tres tipos de mensaje: `status-request` → `status`, `delivery-request` → `delivery`, `messages-received`. La wallet controla el tamaño del lote mediante el campo `limit` en `delivery-request`
- **Creación automática de contacto**: Cuando llega un mensaje de un DID desconocido, la wallet crea automáticamente una entrada de contacto. El usuario puede luego asignar un alias o eliminar la conversación ([UC-020](/docs/developers/use-cases/wallet/uc-020-manage-conversations))
- **Seguimiento de no leídos**: El campo `unreadCount` en `ConversationSummary` rastrea los mensajes no leídos por conversación. Se reinicia a 0 cuando el usuario abre la conversación. Actualmente definido en el servicio de chat pero no conectado al transporte
- **TTL de mensajes del mediator**: El mediator almacena mensajes offline hasta 72 horas (configurable `message_ttl` en `mediator.yaml`). Los mensajes no recogidos en esta ventana se eliminan permanentemente
- **Máximo de mensajes almacenados**: El mediator almacena hasta 1000 mensajes por DID de wallet (configurable `max_stored_messages`). Si se alcanza el límite, los mensajes más antiguos se descartan
- **Notificación**: Actualmente limitada a indicadores de badge en la aplicación. Futuro: notificaciones push a nivel de SO en móvil (vía plugins Tauri para móvil) y escritorio (vía APIs de notificación del sistema)
- **Seguridad**: La wallet nunca almacena el sobre cifrado — solo el texto plano descifrado se persiste localmente. La identidad del emisor se verifica vía firma JWS antes de cualquier almacenamiento o visualización
