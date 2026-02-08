---
sidebar_position: 4
---

# Mensajería

Almena ID incluye un sistema de mensajería segura que te permite comunicarte con otros titulares de identidad mediante mensajes cifrados de extremo a extremo con el protocolo DIDComm V2.

## Cómo Funciona la Mensajería

Los mensajes se intercambian directamente entre wallets utilizando el protocolo DIDComm V2. Todos los mensajes están cifrados de extremo a extremo, lo que significa que solo tú y el destinatario pueden leerlos.

## Iniciar una Nueva Conversación

Para enviar un mensaje a alguien, necesitas su DID.

1. Abre la sección **Mensajes** desde el menú lateral
2. Haz clic en el botón **Nueva Conversación**
3. Introduce el DID del destinatario en el campo proporcionado
4. Opcionalmente, añade un alias (un nombre amigable) para identificarlo fácilmente
5. Haz clic en **Iniciar Conversación**

El DID debe tener un formato válido (por ejemplo, `did:almena:...`). Aparecerá un mensaje de error si el formato es incorrecto.

## Enviar Mensajes

Una vez abierta la conversación:

1. Escribe tu mensaje en el campo de texto en la parte inferior
2. Pulsa **Enter** o haz clic en el botón **Enviar**
3. Tu mensaje aparece en el lado derecho de la conversación

Usa **Shift + Enter** para añadir una nueva línea sin enviar el mensaje.

## Lista de Conversaciones

La lista de conversaciones muestra todas tus conversaciones activas:

- **Nombre del contacto**: El alias que asignaste, o una versión abreviada de su DID
- **Último mensaje**: Una vista previa del mensaje más reciente
- **Hora**: Cuándo se envió el último mensaje (muestra "Hoy", "Ayer" o la fecha)

## Gestión de Conversaciones

### Asignar Alias

Al iniciar una conversación, puedes asignar un nombre al contacto. Este alias se almacena localmente y te ayuda a identificar tus contactos sin memorizar sus DIDs.

### Eliminar una Conversación

Para eliminar una conversación:

1. Pasa el cursor sobre la conversación en la lista
2. Haz clic en el botón **Eliminar** que aparece
3. Confirma la eliminación

Las conversaciones eliminadas no se pueden recuperar.

## Privacidad y Seguridad

- Todos los mensajes están cifrados de extremo a extremo con DIDComm V2
- Los mensajes se almacenan localmente solo en tu dispositivo
- Ningún servidor almacena el contenido de tus mensajes
- Un indicador de cifrado es visible en la parte inferior de cada conversación confirmando el cifrado DIDComm V2
- Al cerrar sesión, todos los datos de chat (contactos y mensajes) se eliminan del dispositivo

## Siguientes Pasos

- [Conoce tu panel de control →](./dashboard.md)
- [Entiende las características de privacidad →](../security/privacy.md)
