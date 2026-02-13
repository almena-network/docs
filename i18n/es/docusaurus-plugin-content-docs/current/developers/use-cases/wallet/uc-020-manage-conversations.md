---
title: "UC-020: Gestionar Conversaciones"
sidebar_label: "UC-020: Gestionar Conversaciones"
sidebar_position: 20
---

# UC-020: Gestionar Conversaciones

## Descripción

El usuario gestiona sus conversaciones de chat en la wallet. Esto incluye ver la lista de conversaciones, iniciar una nueva conversación con un contacto introduciendo su DID, abrir una conversación existente para ver el historial de mensajes, y eliminar conversaciones que ya no necesita. La lista de conversaciones muestra un resumen de cada conversación (nombre del contacto o DID, previsualización del último mensaje, timestamp y contador de no leídos) ordenada por actividad más reciente.

## Actores

- **Usuario Final**: Persona que gestiona sus conversaciones en la wallet
- **Wallet (Frontend)**: Aplicación Svelte que proporciona la UI de gestión de conversaciones (vistas de lista, creación y eliminación)
- **Wallet (Rust Backend)**: Tauri Store para datos persistentes de conversaciones y contactos

## Precondiciones

- La aplicación wallet está instalada y en ejecución
- El usuario tiene una identidad creada en la wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- La sesión de la wallet está desbloqueada ([UC-005](/docs/developers/use-cases/wallet/uc-005-unlock-wallet-with-biometrics) o contraseña)

## Flujo Principal: Ver Lista de Conversaciones

1. El usuario navega a la sección de Chat desde la barra lateral del dashboard de la wallet
2. La wallet carga los resúmenes de conversación desde el Tauri Store (`chat.json`)
3. Cada resumen de conversación muestra:
   - Avatar del contacto (letra inicial del alias o DID)
   - Nombre de visualización del contacto (alias si está definido, o DID truncado)
   - Previsualización del último mensaje (truncado a una línea)
   - Timestamp del último mensaje (hora si es hoy, "Ayer", o fecha)
   - Badge de contador de mensajes no leídos (si > 0)
4. Las conversaciones se ordenan por mensaje más reciente primero
5. Si no existen conversaciones, la wallet muestra un estado vacío con una invitación a iniciar una nueva conversación
6. Un badge de cifrado en la parte inferior indica que todos los mensajes están cifrados extremo a extremo

## Flujo Principal: Iniciar Nueva Conversación

7. El usuario pulsa el botón **+** (nueva conversación) en la cabecera de la lista de conversaciones
8. La wallet navega a la vista de nueva conversación
9. El usuario introduce el DID del destinatario en el campo de entrada de DID
10. La wallet valida el formato del DID en tiempo real:
    - Debe seguir el patrón `did:<method>:<method-specific-id>`
    - No debe ser el propio DID del usuario
11. Opcionalmente, el usuario introduce un alias (nombre de visualización) para el contacto
12. El usuario pulsa **Iniciar Chat**
13. La wallet crea una nueva entrada `ChatContact`:
    - `did`: el DID introducido
    - `alias`: el alias introducido (o cadena vacía)
    - `createdAt`: timestamp actual
14. El contacto se guarda en el Tauri Store
15. La wallet navega directamente a la vista de conversación para este contacto, lista para enviar el primer mensaje ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message))

## Flujo Principal: Abrir Conversación Existente

16. Desde la lista de conversaciones (paso 4), el usuario pulsa sobre una tarjeta de conversación
17. La wallet carga el historial completo de mensajes para ese contacto desde el Tauri Store
18. La wallet muestra la conversación:
    - Cabecera: botón atrás, avatar del contacto, nombre del contacto, DID del contacto (si hay alias definido)
    - Área de mensajes: burbujas de mensajes cronológicas (enviados = derecha/naranja, recibidos = izquierda/oscuro)
    - Badge de cifrado: "Los mensajes están cifrados extremo a extremo"
    - Área de entrada: campo de texto y botón de enviar
19. El área de mensajes se desplaza automáticamente al mensaje más reciente
20. El contador de no leídos para esta conversación se reinicia a 0

## Flujo Principal: Eliminar Conversación

21. Desde la lista de conversaciones, el usuario pulsa el icono de eliminar (papelera) en una tarjeta de conversación
22. La wallet muestra un diálogo de confirmación:
    - Título: "Eliminar conversación"
    - Mensaje: advertencia de que la acción es irreversible y todos los mensajes se perderán
    - Acciones: **Confirmar** (variante peligro) y **Cancelar**
23. El usuario confirma la eliminación
24. La wallet elimina el contacto y todos los mensajes asociados del Tauri Store:
    - Elimina la entrada `ChatContact` de la lista de contactos
    - Elimina todas las entradas `ChatMessage` bajo `messages:<contact_did>`
25. La conversación desaparece de la lista
26. Si el usuario estaba viendo esa conversación, la wallet vuelve a la lista de conversaciones

## Flujos Alternativos

### FA-1: Formato de DID inválido
- En el paso 10, el DID introducido no coincide con el formato esperado
- El formulario muestra un mensaje de error: "Formato de DID inválido"
- El botón **Iniciar Chat** está deshabilitado hasta que se corrija el DID

### FA-2: El DID es el propio del usuario
- En el paso 10, el DID introducido coincide con el propio DID del usuario
- El formulario muestra un mensaje de error: "No puedes iniciar una conversación contigo mismo"
- El botón **Iniciar Chat** está deshabilitado

### FA-3: Contacto duplicado
- En el paso 13, ya existe un contacto con el mismo DID
- La wallet redirige silenciosamente a la conversación existente en lugar de crear un duplicado
- El alias del contacto existente no se sobrescribe

### FA-4: Eliminación cancelada
- En el paso 22, el usuario pulsa **Cancelar**
- El diálogo se cierra y no se modifican datos

### FA-5: Conversación creada desde mensaje entrante
- Cuando llega un mensaje de un DID desconocido ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message), paso 8)
- Se crea automáticamente una nueva conversación sin alias
- El usuario puede luego editar el alias o eliminar la conversación desde esta pantalla

### FA-6: Sin registro en el mediator
- Las pantallas de gestión de conversaciones funcionan completamente offline (gestión de contactos, visualización del historial de mensajes)
- La advertencia "No conectado a la red de mensajería" aparece si la wallet no tiene registro en el mediator ([UC-017](/docs/developers/use-cases/wallet/uc-017-register-wallet-with-mediator))
- El usuario puede crear contactos y ver el historial, pero no puede enviar nuevos mensajes

## Postcondiciones

- **Ver lista**: Las conversaciones se muestran ordenadas por actividad más reciente
- **Nueva conversación**: Un nuevo contacto existe en el store y el usuario está en la vista de chat listo para enviar mensajes
- **Abrir conversación**: El historial completo de mensajes se muestra y el contador de no leídos se reinicia
- **Eliminar conversación**: El contacto y todos los mensajes asociados se eliminan permanentemente del almacenamiento local

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | UI de chat con tres vistas (lista, nueva, chat), tarjetas de conversación, diálogo de confirmación de eliminación, validación de formulario, diseño responsive |
| **wallet** (Rust backend) | Persistencia en Tauri Store (`chat.json`): CRUD de contactos, almacenamiento y recuperación de mensajes |

## Notas Técnicas

- **Tres vistas**: La página de chat usa un enfoque de página única con tres estados: `list` (lista de conversaciones), `new` (formulario de nueva conversación) y `chat` (conversación activa). La navegación entre vistas es del lado del cliente sin cambios de ruta — todas las vistas están dentro de `/dashboard/chat`
- **Estructura de almacenamiento**: Los contactos se almacenan como un array bajo la clave `contacts`. Los mensajes se almacenan por contacto bajo `messages:<contact_did>`. Esta estructura ya está implementada en `chat.ts`
- **ID de hilo**: El ID de hilo de cada conversación sigue el patrón `<initiator_did>:<responder_did>`. El iniciador es quien comienza la conversación. Este ID se usa como campo `thid` en todos los mensajes DIDComm
- **Resolución de contacto**: Los contactos se identifican únicamente por DID. El alias es una etiqueta local que no se comparte con la otra parte. Si no hay alias definido, el DID se trunca para visualización (`did:almena:abcd...xyz`)
- **Diseño responsive**: Las vistas de lista de conversaciones y chat se adaptan a móvil (360–428px), tablet (768–1024px) y escritorio (1024px+) siguiendo las reglas de diseño de la wallet. El botón de eliminar está oculto en escritorio hasta hover, y semi-visible en móvil para accesibilidad táctil
- **Badge de cifrado**: Un indicador visual ("Los mensajes están cifrados extremo a extremo") aparece tanto en la lista de conversaciones como en la vista de chat activa. Es informativo y refleja el cifrado DIDComm v2 cuando el transporte esté integrado
- **Sin dependencia de servidor**: Todas las operaciones de gestión de conversaciones (crear, listar, abrir, eliminar) funcionan completamente offline contra el Tauri Store local. La conectividad de red solo es necesaria para enviar ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message)) y recibir ([UC-019](/docs/developers/use-cases/wallet/uc-019-receive-didcomm-message)) mensajes
