---
title: "UC-014: Solicitar Información al Usuario"
sidebar_label: "UC-014: Solicitar Información"
sidebar_position: 14
---

# UC-014: Solicitar Información al Usuario

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El sistema de solicitud de información aún no está implementado.
:::

## Descripción

Desde la perspectiva Organización del dashboard, un miembro de la organización crea una solicitud de información dirigida a un usuario específico. La solicitud define qué información necesita la organización (ej., prueba de un título universitario, una certificación profesional). El usuario recibe la solicitud en su perspectiva Titular y puede responder generando una presentación verificable ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation)) o rechazarla. Por ejemplo, un banco (organización) solicita a un cliente (titular) que demuestre sus cualificaciones académicas.

## Actores

- **Miembro de la Organización**: Persona actuando desde la perspectiva Organización, creando la solicitud de información
- **Titular (Usuario Destinatario)**: Persona que recibe la solicitud y debe decidir si comparte la información
- **Frontend (Portal)**: Aplicación web Next.js que proporciona la interfaz de creación y seguimiento de solicitudes
- **Backend API**: Servicio FastAPI que gestiona la creación, entrega y seguimiento del estado de las solicitudes

## Precondiciones

- El miembro de la organización está autenticado y en el dashboard en **perspectiva Organización** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- El miembro de la organización tiene permiso para crear solicitudes para su organización
- El usuario destinatario tiene un DID registrado en la plataforma

## Flujo Principal

1. El miembro de la organización navega a la sección de creación de solicitudes en la perspectiva Organización
2. El miembro de la organización especifica la solicitud:
   - Usuario destinatario (buscado por nombre o DID)
   - Tipo de información solicitada (ej., "título universitario", "verificación de identidad", "certificación profesional")
   - Atributos específicos requeridos (ej., "nombre del título", "institución", "año de graduación")
   - Propósito / motivo de la solicitud (mostrado al usuario por transparencia)
   - Tiempo de expiración de la solicitud
3. El miembro de la organización envía la solicitud
4. El backend crea la solicitud de información con:
   - ID de solicitud único
   - DID y nombre de la organización
   - DID del titular destinatario
   - Tipos de credenciales y atributos solicitados
   - Nonce de desafío (para vincular la VP de respuesta)
   - Estado: `PENDING`
   - Marca temporal de expiración
5. El backend notifica al titular que una nueva solicitud de información está disponible
6. El portal confirma la creación de la solicitud y la muestra en el historial de solicitudes de la organización con estado "Pendiente"
7. El titular ve la solicitud en su perspectiva Titular ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation), paso 1)
8. Cuando el titular responde (aprueba con VP o rechaza), el estado de la solicitud se actualiza:
   - `FULFILLED`: El titular envió una presentación verificable
   - `DECLINED`: El titular rechazó la solicitud
   - `EXPIRED`: La solicitud expiró sin respuesta
9. El miembro de la organización ve el estado actualizado en su dashboard

## Flujos Alternativos

### FA-1: Usuario no encontrado
- En el paso 2, el usuario buscado no existe en la plataforma
- El formulario muestra un error y la solicitud no puede enviarse

### FA-2: El titular rechaza
- En el paso 7, el titular revisa la solicitud y hace clic en "Rechazar"
- El backend actualiza el estado de la solicitud a `DECLINED`
- El miembro de la organización ve el cambio de estado y el motivo del rechazo (si se proporcionó)

### FA-3: La solicitud expira
- El titular no responde antes del tiempo de expiración
- El backend marca automáticamente la solicitud como `EXPIRED`
- El miembro de la organización ve el estado expirado y puede crear una nueva solicitud

### FA-4: El titular responde con una presentación
- El titular genera una VP y la envía ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- El backend actualiza el estado de la solicitud a `FULFILLED` y vincula la VP
- La organización puede ahora verificar la presentación ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Postcondiciones

- Existe una solicitud de información en el sistema con estado `PENDING`
- El titular ha sido notificado de la solicitud
- La solicitud aparece tanto en el historial de la organización como en las solicitudes pendientes del titular

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de creación de solicitudes, búsqueda de usuarios, lista del historial de solicitudes, seguimiento de estado |
| **backend** | Creación de solicitudes, almacenamiento, entrega de notificaciones, gestión de estado |

## Notas Técnicas

- **Nonce de desafío**: Cada solicitud incluye un nonce único que debe incluirse en la VP de respuesta. Esto vincula la presentación a la solicitud específica y previene la repetición
- **Ciclo de vida del estado de la solicitud**: `PENDING` → `FULFILLED` / `DECLINED` / `EXPIRED`
- **Notificación**: Inicialmente mediante sondeo desde la plataforma (el titular comprueba nuevas solicitudes al cargar el dashboard). Futuro: notificaciones push o mensajes DIDComm vía el mediador ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message), [UC-021](/docs/developers/use-cases/mediator/uc-021-route-didcomm-message))
- **Privacidad**: La organización solo ve que el usuario tiene ciertas credenciales después de que el usuario las comparta explícitamente. La organización no puede explorar la lista de credenciales del usuario
