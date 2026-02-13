---
title: "UC-010: Ver Dashboard por Perspectiva"
sidebar_label: "UC-010: Perspectivas Dashboard"
sidebar_position: 10
---

# UC-010: Ver Dashboard por Perspectiva

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El sistema de perspectivas aún no está implementado en el frontend.
:::

## Descripción

Tras iniciar sesión, el usuario ve un dashboard que se adapta a tres perspectivas: **Titular** (usuario final), **Emisor** (issuer) y **Peticionario** (requestor). El usuario puede cambiar entre perspectivas según sus roles asignados. Un usuario siempre es Titular. Adicionalmente, puede pertenecer a cero o más Emisores (ej: una universidad que emite certificados), y a cero o un Peticionario (ej: un banco que solicita información verificada). Cada perspectiva muestra contenido y acciones diferentes relevantes a ese rol.

## Actores

- **Usuario Final**: Persona autenticada en el portal, cambiando entre perspectivas
- **Frontend (Portal)**: Aplicación web Next.js que renderiza el dashboard con contenido basado en perspectiva
- **Backend API**: Servicio FastAPI que proporciona datos de roles del usuario (membresías de emisor, membresía de peticionario)

## Precondiciones

- El usuario está autenticado en el portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) o [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- Las asignaciones de roles del usuario son recuperables desde el backend

## Flujo Principal

1. El usuario accede al dashboard (`/[locale]/dashboard`)
2. El portal solicita el perfil del usuario y sus asignaciones de roles al backend
3. El backend devuelve:
   - El perfil base del usuario (DID, user_id)
   - Membresías de emisor: lista de emisores a los que pertenece el usuario (con rol en cada uno)
   - Membresía de peticionario: la organización peticionaria a la que pertenece el usuario (si existe)
4. El portal renderiza un selector de perspectiva en la cabecera o barra lateral del dashboard mostrando las perspectivas disponibles:
   - **Titular**: Siempre disponible (todo usuario es titular)
   - **Emisor**: Disponible si el usuario es miembro de al menos un emisor
   - **Peticionario**: Disponible si el usuario es miembro de una organización peticionaria
5. La perspectiva por defecto es **Titular**
6. El contenido del dashboard se adapta a la perspectiva activa:

### Perspectiva Titular
- Credenciales verificables recibidas de emisores ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- Solicitudes de información pendientes de peticionarios ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Acción: Generar presentaciones verificables ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))

### Perspectiva Emisor
- Solicitudes de credenciales entrantes de usuarios
- Historial de credenciales emitidas
- Acción: Emitir credenciales verificables a usuarios ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- Si el usuario pertenece a múltiples emisores, un selector muestra como qué emisor está actuando

### Perspectiva Peticionario
- Solicitudes de verificación de presentaciones enviadas
- Historial de resultados de verificación
- Acción: Solicitar información a usuarios ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- Acción: Verificar presentaciones contra nodos verificadores ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

7. El usuario hace clic en una perspectiva diferente en el selector
8. El contenido del dashboard se recarga para mostrar los datos de la perspectiva seleccionada

## Flujos Alternativos

### FA-1: El usuario no tiene roles de emisor ni peticionario
- En el paso 4, solo la perspectiva Titular está disponible
- El selector de perspectiva se oculta o muestra solo "Titular" sin capacidad de cambio
- El dashboard muestra contenido exclusivamente de Titular

### FA-2: El usuario pertenece a múltiples emisores
- En el paso 6 (perspectiva Emisor), un selector secundario permite al usuario elegir como qué organización emisora está actuando
- Cambiar de emisor recarga el contenido para ese emisor específico

### FA-3: Cambio de idioma
- El portal soporta 5 idiomas: inglés, español, francés, alemán e italiano
- El usuario puede cambiar el idioma desde ajustes o la cabecera
- Todo el contenido del dashboard, etiquetas y nombres de perspectiva están traducidos
- El prefijo de locale en la URL cambia (`/en/dashboard` → `/es/dashboard`)

## Postcondiciones

- El dashboard muestra contenido relevante a la perspectiva seleccionada
- No hay cambio de estado persistente — la selección de perspectiva es un filtro a nivel de UI
- El usuario puede cambiar libremente entre las perspectivas disponibles

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Layout del dashboard, UI del selector de perspectiva, renderizado de contenido por perspectiva, i18n (next-intl con 5 idiomas) |
| **backend** | Perfil de usuario, consultas de roles/membresías, lista de emisores, asignación de peticionario |

## Notas Técnicas

- **Multi-idioma**: El portal usa `next-intl` con locale en la ruta URL (`/[locale]/dashboard`). 5 idiomas: en, es, fr, de, it. Todos los strings de UI vienen de `messages/{locale}.json`
- **Modelo de roles**: Un usuario siempre es Titular. La membresía de emisor es muchos-a-muchos (el usuario puede pertenecer a 0..N emisores). La membresía de peticionario es cero-a-uno (el usuario pertenece a 0..1 organizaciones peticionarias)
- **Implementación actual**: La página de gestión de emisores (`/dashboard/issuers`) existe y permite crear/editar emisores con grupos y miembros. El selector de perspectivas y las vistas de Titular/Peticionario aún no están construidas
- **Navegación lateral**: Actualmente tiene Identidad, Credenciales, Emisores, Seguridad, Ajustes. Necesitará reestructuración para soportar navegación basada en perspectiva
