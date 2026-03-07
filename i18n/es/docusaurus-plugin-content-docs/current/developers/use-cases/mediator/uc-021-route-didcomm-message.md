---
title: "UC-021: Enrutar Mensaje DIDComm"
sidebar_label: "UC-021: Enrutar Mensaje"
sidebar_position: 21
---

# UC-021: Enrutar Mensaje DIDComm

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto desde la perspectiva del mediator. La lógica de enrutamiento del mediator está implementada; la integración con la wallet está pendiente.
:::

## Descripción

El mediator recibe un mensaje forward cifrado DIDComm v2 de una wallet emisora, descifra solo el sobre de enrutamiento externo para identificar al destinatario, y entrega el mensaje interno cifrado al destinatario. El mediator sigue un invariante de reenvío con conocimiento cero: nunca lee ni descifra el contenido del mensaje interno. La entrega se intenta en tiempo real a través de la conexión WebSocket del destinatario; si el destinatario está offline, el mensaje se almacena en la cola offline para su posterior recogida.

## Actores

- **Wallet Emisora**: Wallet que envía el mensaje forward cifrado al mediator
- **Mediator**: Servicio Go que enruta el mensaje basándose en el sobre externo
- **Wallet Destinataria**: Wallet que recibe el mensaje interno cifrado

## Precondiciones

- El servicio mediator está en ejecución y operativo
- Tanto la wallet emisora como la destinataria están registradas en el mediator ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- La wallet emisora ha compuesto y cifrado el mensaje con doble sobre ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message))

## Flujo Principal

1. La wallet emisora envía un mensaje forward cifrado DIDComm al endpoint `POST /didcomm` del mediator
2. El mediator recibe el sobre externo cifrado con JWE
3. El mediator descifra el sobre externo usando su propia clave privada X25519:
   - Algoritmo: ECDH-ES+A256KW (envoltorio de claves) + A256CBC-HS512 (cifrado de contenido)
   - Extrae el texto plano del mensaje forward
4. El mediator parsea el mensaje forward:
   - Valida que el `type` es `https://didcomm.org/routing/2.0/forward`
   - Extrae `body.next`: el DID de enrutamiento del destinatario
   - Extrae `attachments[0]`: el sobre interno cifrado (opaco para el mediator)
5. El mediator valida el enrutamiento:
   - Comprueba que el DID de enrutamiento del destinatario existe en sus wallets registradas
   - Verifica que el emisor no está limitado por tasa (60 mensajes/minuto por DID, 120/minuto por IP)
6. El mediator intenta la entrega en tiempo real:
   - Comprueba si el destinatario tiene una conexión WebSocket activa
   - **Si está online**: Envía el sobre interno cifrado por el WebSocket → ir al paso 7
   - **Si está offline**: Almacena el mensaje en la cola offline → ir al paso 8
7. **Entrega en tiempo real**:
   - El mediator envía el sobre interno cifrado al destinatario vía WebSocket
   - La wallet destinataria recibe y procesa el mensaje ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message))
   - El destinatario envía un acuse de recibo `messages-received`
   - El mediator elimina el mensaje de cualquier almacenamiento temporal
   - El mediator responde al emisor con HTTP 202 Accepted
8. **Almacenamiento en cola offline**:
   - El mediator almacena el sobre interno cifrado en el almacén de mensajes (MongoDB, SQLite o en memoria):
     - ID del mensaje
     - DID de enrutamiento del destinatario
     - Payload cifrado (sobre interno, aún cifrado para el destinatario)
     - Timestamp de recepción
     - Estado: `pending`
   - El mediator responde al emisor con HTTP 202 Accepted
   - El mensaje permanece en la cola hasta que el destinatario lo recoge ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message), FA-PICKUP) o el TTL expira

## Flujos Alternativos

### FA-1: Destinatario no registrado
- En el paso 5, el DID de enrutamiento del destinatario no se encuentra en el registro del mediator
- El mediator responde con HTTP 400 y un informe de problema DIDComm:
  - Código: `e.p.me.res.not-found`
  - Comentario: "Destinatario no registrado en este mediator"
- La wallet emisora recibe el error y debe notificar al usuario

### FA-2: Límite de tasa excedido
- En el paso 5, el emisor ha excedido el límite de tasa
- El mediator responde con HTTP 429 (Too Many Requests)
- La wallet emisora debe implementar backoff y reintento

### FA-3: Fallo en el descifrado del sobre externo
- En el paso 3, el descifrado JWE falla (payload malformado, clave del mediator incorrecta)
- El mediator responde con HTTP 400
- No se almacena ni reenvía ningún mensaje

### FA-4: Cola de mensajes llena
- En el paso 8, el destinatario ya tiene el número máximo de mensajes almacenados (por defecto 1000)
- El mediator descarta el mensaje más antiguo para hacer espacio al nuevo (evicción FIFO)
- El emisor aún recibe HTTP 202 — la evicción es transparente para el emisor

### FA-5: Expiración del TTL del mensaje
- Un mensaje almacenado ha estado en la cola offline más tiempo que el TTL (por defecto 72 horas)
- El proceso de limpieza en segundo plano del mediator elimina los mensajes expirados
- El mensaje se pierde permanentemente — el emisor no es notificado

### FA-6: Fallo en la entrega por WebSocket durante el envío
- En el paso 7, la conexión WebSocket se interrumpe durante la entrega
- El mediator mueve el mensaje a la cola offline (paso 8)
- El destinatario lo recupera mediante Message Pickup al reconectarse

## Postcondiciones

- **Si el destinatario está online**: El sobre interno cifrado ha sido entregado vía WebSocket y confirmado
- **Si el destinatario está offline**: El sobre interno cifrado está almacenado en la cola offline con estado `pending`
- El emisor ha recibido HTTP 202 Accepted
- El mediator nunca ha accedido al contenido del mensaje interno (reenvío con conocimiento cero)

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **mediator** | Descifrado del sobre externo, búsqueda de DID de enrutamiento, entrega por WebSocket, almacenamiento en cola offline, limitación de tasa, aplicación del TTL |
| **wallet** (emisora) | Construye y envía el mensaje forward con doble cifrado |
| **wallet** (destinataria) | Recibe y descifra el sobre interno (tiempo real o recogida) |

## Notas Técnicas

- **Invariante de conocimiento cero**: El mediator SOLO descifra el sobre de enrutamiento externo (envoltorio forward) para identificar al destinatario. NUNCA lee, registra ni almacena el contenido del mensaje interno en forma descifrada. El sobre interno permanece cifrado extremo a extremo entre emisor y destinatario
- **Protocolo forward**: `https://didcomm.org/routing/2.0/forward` — el mecanismo estándar de enrutamiento DIDComm v2. El campo `body.next` contiene el DID de enrutamiento; el array `attachments` contiene el sobre interno cifrado
- **Backends de almacenamiento**: El mediator soporta tres backends de almacenamiento configurados en `mediator.yaml`:
  - **En memoria**: Para desarrollo y testing (datos perdidos al reiniciar)
  - **MongoDB**: Para producción (recomendado para escalado horizontal)
  - **SQLite**: Para despliegues de nodo único (Go puro, sin dependencia CGO)
- **Modelo de mensaje**: `StoredMessage { id, recipient_did, payload (cifrado), received_at, status (pending|delivered), expires_at }`
- **Confirmación de entrega**: Cuando el destinatario confirma vía `messages-received` (Message Pickup 3.0), el mediator marca los mensajes como entregados y los elimina del almacenamiento
- **Métricas**: El mediator expone métricas Prometheus en `GET /metrics`:
  - `mediator_messages_forwarded_total` (counter)
  - `mediator_messages_stored_total` (counter)
  - `mediator_messages_delivered_total` (counter)
  - `mediator_active_connections` (gauge)
  - `mediator_message_queue_size` (gauge por DID)
- **Logging**: El mediator registra eventos de enrutamiento (DID emisor → DID destinatario, ID de mensaje, método de entrega) pero NUNCA registra contenido de mensajes ni claves de cifrado. Regla de seguridad de logging de `mediator-didcomm.mdc`: nunca registrar payloads ni claves privadas
- **Gestor de conexiones**: El gestor de conexiones WebSocket (`internal/connection/manager.go`) rastrea conexiones activas por DID. Soporta múltiples conexiones concurrentes por DID (ej.: wallet de escritorio + móvil para la misma identidad)
