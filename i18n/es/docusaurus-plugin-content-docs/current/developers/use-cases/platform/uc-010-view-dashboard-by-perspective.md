---
title: "UC-010: Ver Dashboard por Perspectiva"
sidebar_label: "UC-010: Perspectivas del Dashboard"
sidebar_position: 10
---

# UC-010: Ver Dashboard por Perspectiva

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El sistema de perspectivas aún no está implementado en el frontend.
:::

## Descripción

Tras iniciar sesión, el usuario ve un dashboard que se adapta a dos perspectivas: **Titular** (personal, usuario final) y **Organización** (actuando en nombre de una entidad). El usuario puede cambiar entre perspectivas según sus membresías. Un usuario siempre es un Titular. Además, puede pertenecer a cero o más organizaciones ([UC-022](/docs/developers/use-cases/platform/uc-022-create-organization)). Cada organización es una entidad unificada que puede tanto emitir credenciales como solicitar información — no existe un tipo separado de "emisor" o "solicitante". Cuando se está en la perspectiva Organización, el dashboard muestra dos áreas funcionales: un **buzón de emisión** y un **buzón de peticiones (entrada/salida)**.

## Actores

- **Usuario Final**: Persona autenticada en el portal, alternando entre perspectivas
- **Frontend (Portal)**: Aplicación web Next.js que renderiza el dashboard con contenido basado en la perspectiva
- **Backend API**: Servicio FastAPI que proporciona datos del perfil del usuario y membresías en organizaciones

## Precondiciones

- El usuario está autenticado en el portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) o [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- Las membresías del usuario en organizaciones son recuperables desde el backend

## Flujo Principal

1. El usuario accede al dashboard (`/[locale]/dashboard`)
2. El portal solicita al backend el perfil del usuario y sus membresías en organizaciones
3. El backend devuelve:
   - El perfil base del usuario (DID, user_id)
   - Membresías en organizaciones: lista de organizaciones a las que pertenece el usuario (con rol en cada una)
4. El portal renderiza un selector de perspectiva en la cabecera o barra lateral del dashboard mostrando las perspectivas disponibles:
   - **Titular**: Siempre disponible (todo usuario es un titular)
   - **Organización**: Disponible si el usuario es miembro de al menos una organización. Si el usuario pertenece a varias organizaciones, un selector muestra en nombre de cuál organización está actuando
5. La perspectiva por defecto es **Titular**
6. El contenido del dashboard se adapta a la perspectiva activa:

### Perspectiva Titular
- Credenciales verificadas recibidas de organizaciones ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- Solicitudes de información pendientes de organizaciones ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Acción: Generar presentaciones verificables ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))

### Perspectiva Organización
- **Buzón de emisión**: Historial de credenciales emitidas, acción para emitir nuevas credenciales a usuarios ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential)), revocar credenciales ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- **Buzón de peticiones (salida)**: Solicitudes de información enviadas a usuarios, seguimiento del estado de las solicitudes ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- **Buzón de peticiones (entrada)**: Presentaciones verificables recibidas de usuarios, acción para verificar presentaciones ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))
- **Miembros**: Gestión de miembros de la organización ([UC-023](/docs/developers/use-cases/platform/uc-023-manage-organization-members))
- Si el usuario pertenece a varias organizaciones, un selector secundario permite elegir en nombre de cuál organización está actuando

7. El usuario hace clic en una perspectiva diferente en el selector
8. El contenido del dashboard se recarga para mostrar los datos de la perspectiva seleccionada

## Flujos Alternativos

### FA-1: El usuario no tiene membresías en organizaciones
- En el paso 4, solo la perspectiva Titular está disponible
- El selector de perspectiva se oculta o muestra únicamente "Titular" sin capacidad de cambio
- El dashboard muestra exclusivamente el contenido de Titular

### FA-2: El usuario pertenece a varias organizaciones
- En el paso 6 (perspectiva Organización), un selector secundario permite al usuario elegir en nombre de cuál organización está actuando
- Cambiar de organización recarga el contenido para esa organización específica

### FA-3: Cambio de idioma
- El portal soporta 5 idiomas: inglés, español, francés, alemán, italiano
- El usuario puede cambiar el idioma desde la configuración o la cabecera
- Todo el contenido del dashboard, etiquetas y nombres de perspectivas se traducen
- El prefijo de idioma en la URL cambia (`/en/dashboard` → `/es/dashboard`)

## Postcondiciones

- El dashboard muestra contenido relevante para la perspectiva seleccionada
- No hay cambio de estado persistente — la selección de perspectiva es un filtro a nivel de interfaz
- El usuario puede alternar libremente entre las perspectivas disponibles

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Diseño del dashboard, interfaz del selector de perspectiva, selector de organización, renderizado de contenido por perspectiva, i18n (next-intl con 5 idiomas) |
| **backend** | Perfil de usuario, consultas de membresías en organizaciones, lista de organizaciones |

## Notas Técnicas

- **Multi-idioma**: El portal usa `next-intl` con el idioma en la ruta URL (`/[locale]/dashboard`). 5 idiomas: en, es, fr, de, it. Todas las cadenas de la interfaz provienen de `messages/{locale}.json`
- **Modelo de entidad unificado**: Las organizaciones no se tipifican como "emisor" o "solicitante". Cada organización tiene capacidades duales: emitir credenciales y solicitar información. La perspectiva Organización del dashboard muestra ambas áreas funcionales (buzón de emisión + buzón de peticiones entrada/salida) para la organización seleccionada
- **Modelo de roles**: Un usuario siempre es un Titular. La membresía en organizaciones es muchos-a-muchos (un usuario puede pertenecer a 0..N organizaciones). Cada membresía tiene un rol que determina qué acciones puede realizar el miembro dentro de la organización
- **Implementación actual**: La página de gestión de emisores (`/dashboard/issuers`) existe y permite crear/editar emisores con grupos y miembros. Esto se refactorizará al modelo unificado de organizaciones en `/dashboard/organizations`. El selector de perspectivas y las vistas de Titular aún no están construidos
- **Navegación lateral**: Actualmente tiene Identidad, Credenciales, Emisores, Seguridad, Configuración. Necesitará reestructuración para soportar navegación basada en perspectivas con el modelo unificado de organizaciones
