---
title: "UC-017: Registrar Wallet en el Mediator"
sidebar_label: "UC-017: Registro en Mediator"
sidebar_position: 17
---

# UC-017: Registrar Wallet en el Mediator

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El registro con el mediator aún no está implementado en la wallet.
:::

## Descripción

Antes de que una wallet pueda enviar o recibir mensajes DIDComm v2, debe registrarse en el servicio mediator. La wallet descubre el mediator a través de una invitación Out-of-Band (OOB), establece una conexión segura y solicita mediación usando el protocolo Coordinate Mediation 2.0. Tras un registro exitoso, el mediator asigna un DID de enrutamiento a la wallet, permitiendo que otras wallets le envíen mensajes a través del mediator. Este registro es una configuración única por mediator que persiste entre sesiones de la wallet.

## Actores

- **Usuario Final**: Persona que inicia el registro con el mediator desde la wallet
- **Wallet (Frontend)**: Aplicación Svelte que gestiona el flujo de UI del registro
- **Wallet (Rust Backend)**: Comandos Tauri que realizan operaciones criptográficas (acuerdo de claves X25519, cifrado JWE)
- **Mediator**: Servicio Go que implementa los protocolos de mediación DIDComm v2

## Precondiciones

- La aplicación wallet está instalada y en ejecución
- El usuario tiene una identidad creada en la wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- La sesión de la wallet está desbloqueada ([UC-005](/docs/developers/use-cases/wallet/uc-005-unlock-wallet-with-biometrics) o contraseña)
- El servicio mediator está en ejecución y accesible por red
- La wallet no está ya registrada en este mediator

## Flujo Principal

1. El usuario abre los ajustes de la wallet o la sección de chat por primera vez
2. La wallet detecta que no existe un registro de mediator en el almacenamiento local
3. La wallet obtiene la invitación Out-of-Band del mediator desde el endpoint `GET /oob` del mediator
4. La invitación OOB contiene:
   - El DID del mediator
   - El endpoint de servicio del mediator (URLs HTTP y WebSocket)
   - La clave pública del mediator para acuerdo de claves (X25519)
5. La wallet genera un par de claves X25519 efímero para el acuerdo de claves ECDH con el mediator
6. La wallet construye un mensaje DIDComm `mediate-request`:
   - Tipo: `https://didcomm.org/coordinate-mediation/2.0/mediate-request`
   - From: el DID de la wallet
   - To: el DID del mediator
7. La wallet cifra el mensaje como JWE (ECDH-ES+A256KW / A256CBC-HS512) usando la clave pública del mediator
8. La wallet envía el mensaje cifrado al endpoint `POST /didcomm` del mediator
9. El mediator procesa la solicitud de mediación:
   - Valida el DID del emisor
   - Crea una entrada de enrutamiento para esta wallet
   - Asigna un DID de enrutamiento para la entrega de mensajes
10. El mediator responde con un mensaje `mediate-grant` que contiene:
    - El DID de enrutamiento asignado a esta wallet
    - El endpoint del mediator para recibir mensajes reenviados
11. La wallet descifra la respuesta y extrae la información de enrutamiento
12. La wallet almacena el registro del mediator localmente en el Tauri Store (`mediator.json`):
    - DID del mediator
    - URLs de endpoint del mediator (HTTP, WebSocket)
    - DID de enrutamiento asignado
    - Timestamp de registro
13. La wallet establece una conexión WebSocket con el mediator (`/ws?did=<wallet_DID>`) para la entrega de mensajes en tiempo real
14. La wallet muestra una indicación de éxito al usuario (ej.: "Conectado a la red de mensajería")

## Flujos Alternativos

### FA-1: Mediator inaccesible
- En el paso 3, el servicio mediator no es accesible (error de red, timeout)
- La wallet muestra un mensaje de error: "No se puede conectar al servicio de mensajería"
- El usuario puede reintentar más tarde; la wallet opera normalmente sin mensajería

### FA-2: Mediación denegada
- En el paso 9, el mediator responde con `mediate-deny` en lugar de `mediate-grant`
- Posibles razones: limitación de tasa, lista de bloqueo de DIDs, capacidad alcanzada
- La wallet muestra el motivo de la denegación y el usuario no puede enviar/recibir mensajes hasta que se resuelva

### FA-3: Wallet ya registrada
- En el paso 2, la wallet detecta un registro de mediator existente en el almacenamiento local
- La wallet omite el flujo de registro y abre directamente la conexión WebSocket (paso 13)
- Si la conexión WebSocket falla, la wallet recurre al polling mediante Message Pickup 3.0

### FA-4: Re-registro tras recuperación de identidad
- Después de recuperar una identidad ([UC-002](/docs/developers/use-cases/wallet/uc-002-recover-identity)), el registro del mediator se pierde
- La wallet detecta que no existe registro e inicia el flujo completo de registro desde el paso 1

### FA-5: Conexión WebSocket perdida
- En el paso 13 o durante el uso continuo, la conexión WebSocket se interrumpe
- La wallet intenta reconectarse automáticamente con backoff exponencial
- Mientras está desconectada, el mediator encola los mensajes para recogida offline
- Al reconectarse, la wallet usa Message Pickup 3.0 para recuperar los mensajes encolados ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message))

## Postcondiciones

- La wallet está registrada en el mediator y tiene un DID de enrutamiento
- El mediator puede aceptar y encolar mensajes destinados a esta wallet
- Una conexión WebSocket está establecida para la entrega de mensajes en tiempo real
- Los datos de registro están persistidos en el Tauri Store para futuras sesiones
- La wallet puede ahora enviar ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message)) y recibir ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message)) mensajes DIDComm

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | UI de registro, indicador de estado de conexión, pantalla de ajustes |
| **wallet** (Rust backend) | Generación de claves X25519, acuerdo de claves ECDH, cifrado/descifrado JWE |
| **mediator** | Invitación OOB, protocolo Coordinate Mediation 2.0, asignación de DID de enrutamiento, gestión de WebSocket |

## Notas Técnicas

- **Protocolo**: Coordinate Mediation 2.0 (`https://didcomm.org/coordinate-mediation/2.0/`). La wallet actúa como cliente del mediator; el mediator actúa como agente mediador
- **Cifrado**: Todos los mensajes DIDComm usan cifrado autenticado (JWE con ECDH-ES+A256KW para envoltorio de claves y A256CBC-HS512 para cifrado de contenido). El invariante del mediator es el reenvío con conocimiento cero — solo puede descifrar el sobre de enrutamiento externo, nunca el contenido del mensaje interno
- **Acuerdo de claves**: X25519 (Diffie-Hellman de Curve25519) derivado de la clave de identidad Ed25519 de la wallet usando mapeo biracional
- **Descubrimiento del mediator**: La URL del mediator se configura en los ajustes de la wallet o proviene de una configuración por defecto. El endpoint de invitación OOB (`GET /oob`) proporciona todos los detalles de conexión necesarios
- **WebSocket**: La conexión en vivo usa `ws(s)://<mediator>/ws?did=<wallet_DID>`. El mediator autentica el WebSocket verificando un challenge firmado con la clave DID de la wallet
- **Resiliencia offline**: Si el WebSocket no está disponible, la wallet recurre al polling HTTP usando Message Pickup 3.0 (`https://didcomm.org/messagepickup/3.0/`). El mediator almacena mensajes hasta 72 horas (configurable `message_ttl`)
- **Límites de tasa**: El mediator impone 60 mensajes/minuto por DID y 120 mensajes/minuto por IP
- **Almacenamiento**: Datos de registro persistidos en Tauri Store (`mediator.json`), separado de los datos de identidad (`identity.json`) y datos de chat (`chat.json`)
