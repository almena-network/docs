---
title: "UC-014: Solicitar Información al Usuario"
sidebar_label: "UC-014: Solicitar Información"
sidebar_position: 14
---

# UC-014: Solicitar Información al Usuario

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El sistema de solicitudes de peticionario aún no está implementado.
:::

## Descripción

Desde la perspectiva Peticionario del dashboard, un miembro del peticionario crea una solicitud de información dirigida a un usuario específico. La solicitud define qué información necesita el peticionario (ej: prueba de un título universitario, una certificación profesional). El usuario recibe la solicitud en su perspectiva Titular y puede responder generando una presentación verificable ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation)) o rechazarla. Por ejemplo, un banco (peticionario) solicita a un cliente (titular) que demuestre sus cualificaciones académicas.

## Actores

- **Miembro del Peticionario**: Persona actuando desde la perspectiva Peticionario, creando la solicitud de información
- **Titular (Usuario Destino)**: Persona que recibe la solicitud y debe decidir si compartir la información
- **Frontend (Portal)**: Aplicación web Next.js que proporciona la UI de creación de solicitudes y seguimiento
- **Backend API**: Servicio FastAPI que gestiona la creación, entrega y seguimiento de estado de solicitudes

## Precondiciones

- El miembro del peticionario está autenticado y en el dashboard en **perspectiva Peticionario** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- El miembro del peticionario tiene permiso para crear solicitudes para su organización
- El usuario destino tiene un DID registrado en la plataforma

## Flujo Principal

1. El miembro del peticionario navega a la sección de creación de solicitudes en la perspectiva Peticionario
2. El miembro del peticionario especifica la solicitud:
   - Usuario destino (buscado por nombre o DID)
   - Tipo de información solicitada (ej: "título universitario", "verificación de identidad", "certificación profesional")
   - Atributos específicos requeridos (ej: "nombre del título", "institución", "año de graduación")
   - Propósito / motivo de la solicitud (mostrado al usuario para transparencia)
   - Tiempo de expiración de la solicitud
3. El miembro del peticionario envía la solicitud
4. El backend crea la solicitud de información con:
   - ID de solicitud único
   - DID y nombre de la organización peticionaria
   - DID del titular destino
   - Tipos de credencial y atributos solicitados
   - Nonce de challenge (para vincular la respuesta VP)
   - Estado: `PENDING`
   - Timestamp de expiración
5. El backend notifica al titular que una nueva solicitud de información está disponible
6. El portal confirma la creación de la solicitud y la muestra en el historial de solicitudes del peticionario con estado "Pendiente"
7. El titular ve la solicitud en su perspectiva Titular ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation), paso 1)
8. Cuando el titular responde (aprueba con VP o rechaza), el estado de la solicitud se actualiza:
   - `FULFILLED`: El titular envió una presentación verificable
   - `DECLINED`: El titular rechazó la solicitud
   - `EXPIRED`: La solicitud expiró sin respuesta
9. El miembro del peticionario ve el estado actualizado en su dashboard

## Flujos Alternativos

### FA-1: Usuario no encontrado
- En el paso 2, el usuario buscado no existe en la plataforma
- El formulario muestra un error y la solicitud no puede enviarse

### FA-2: El titular rechaza
- En el paso 7, el titular revisa la solicitud y hace clic en "Rechazar"
- El backend actualiza el estado de la solicitud a `DECLINED`
- El peticionario ve el cambio de estado y el motivo del rechazo (si se proporcionó)

### FA-3: La solicitud expira
- El titular no responde antes del tiempo de expiración
- El backend marca automáticamente la solicitud como `EXPIRED`
- El peticionario ve el estado expirado y puede crear una nueva solicitud

### FA-4: El titular responde con presentación
- El titular genera una VP y la envía ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- El backend actualiza el estado de la solicitud a `FULFILLED` y enlaza la VP
- El peticionario puede ahora verificar la presentación ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Postcondiciones

- Existe una solicitud de información en el sistema con estado `PENDING`
- El titular ha sido notificado de la solicitud
- La solicitud aparece tanto en el historial del peticionario como en las solicitudes pendientes del titular

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de creación de solicitud, búsqueda de usuario, lista de historial de solicitudes, seguimiento de estado |
| **backend** | Creación de solicitud, almacenamiento, entrega de notificación, gestión de estado |

## Notas Técnicas

- **Nonce de challenge**: Cada solicitud incluye un nonce único que debe incluirse en la VP de respuesta. Esto vincula la presentación a la solicitud específica y previene replay
- **Ciclo de vida del estado de solicitud**: `PENDING` → `FULFILLED` / `DECLINED` / `EXPIRED`
- **Notificación**: Inicialmente mediante polling de la plataforma (el titular comprueba nuevas solicitudes al cargar el dashboard). Futuro: notificaciones push o mensajes DIDComm via el mediator
- **Privacidad**: El peticionario solo ve que el usuario tiene ciertas credenciales después de que el usuario las comparta explícitamente. El peticionario no puede explorar la lista de credenciales del usuario
