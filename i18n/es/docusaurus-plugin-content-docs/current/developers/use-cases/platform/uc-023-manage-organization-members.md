---
title: "UC-023: Gestionar Miembros de Organización"
sidebar_label: "UC-023: Gestionar Miembros"
sidebar_position: 23
---

# UC-023: Gestionar Miembros de Organización

## Descripción

El propietario de una organización gestiona sus miembros: invitando a nuevos usuarios, asignándolos a grupos con roles específicos y eliminando miembros. Los miembros se identifican por su DID y deben haber iniciado sesión previamente en la plataforma al menos una vez. La organización utiliza una estructura basada en grupos donde los miembros pertenecen a un grupo que define su rol dentro de la organización. El propietario también puede crear y gestionar grupos personalizados además del grupo Admin por defecto. Una vez añadidos, los miembros pueden actuar en nombre de la organización para emitir credenciales o solicitar información.

## Actores

- **Propietario**: Persona que creó la organización y tiene control total de gestión
- **Usuario Invitado**: Persona que se añade como miembro a la organización
- **Frontend (Portal)**: Aplicación web Next.js que proporciona la interfaz de gestión de miembros
- **Backend API**: Servicio FastAPI que gestiona las operaciones CRUD de miembros y asignaciones de roles

## Precondiciones

- El propietario está autenticado en el portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) o [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- La organización existe y fue creada por este usuario ([UC-022](/docs/developers/use-cases/platform/uc-022-create-organization))
- El propietario está en la página de edición de la organización

## Flujo Principal: Añadir Miembro

1. El propietario navega a la página de edición de la organización (`/[locale]/dashboard/organizations/{id}`)
2. El propietario selecciona la pestaña **Miembros**
3. El portal muestra la lista actual de miembros mostrando: nombre (o DID), grupo asignado y rol
4. El propietario hace clic en **Añadir Miembro**
5. El propietario busca al usuario por DID usando el campo de búsqueda
6. El backend busca al usuario vía `GET /api/v1/users/search?q={did}`:
   - Si se encuentra: se muestra el DID y nombre del usuario
   - Si no se encuentra: mensaje de error "Usuario no encontrado — debe iniciar sesión en la plataforma primero"
7. El propietario selecciona un grupo para el nuevo miembro del desplegable de grupos existentes
8. El propietario selecciona un rol para el miembro dentro de ese grupo (ej., `admin`, `member`)
9. El propietario confirma la adición
10. El backend añade el miembro a la organización:
    - Crea una entrada de miembro con `user_id`, `group_id` y `role`
    - El DID del miembro se resuelve desde su `user_id`
11. La lista de miembros se actualiza mostrando al nuevo miembro
12. El usuario invitado ahora tiene acceso a la perspectiva de esta organización en su dashboard ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective)) y puede actuar en nombre de la organización

## Flujo Principal: Crear Grupo

13. El propietario selecciona la pestaña **Grupos** en la página de edición de la organización
14. El portal muestra la lista actual de grupos (el grupo Admin siempre aparece primero y está marcado como grupo del sistema)
15. El propietario hace clic en **Añadir Grupo**
16. El propietario introduce:
    - Nombre del grupo (obligatorio)
    - Descripción del grupo (opcional)
17. El propietario confirma la creación
18. El backend crea el grupo dentro de la organización (`is_admin: false`)
19. El nuevo grupo aparece en la lista de grupos y está disponible para asignación de miembros

## Flujo Principal: Eliminar Miembro

20. Desde la lista de miembros (paso 3), el propietario hace clic en la acción de eliminar sobre un miembro
21. El portal muestra un diálogo de confirmación advirtiendo que el miembro perderá acceso a esta organización
22. El propietario confirma la eliminación
23. El backend elimina la entrada del miembro de la organización
24. El dashboard del usuario eliminado ya no muestra la perspectiva de esta organización

## Flujo Principal: Eliminar Grupo

25. Desde la lista de grupos (paso 14), el propietario hace clic en la acción de eliminar sobre un grupo personalizado
26. El portal muestra un diálogo de confirmación:
    - Si el grupo tiene miembros: advierte que los miembros serán desasignados
    - Si el grupo es el Admin: la eliminación está bloqueada (el grupo Admin no puede eliminarse)
27. El propietario confirma la eliminación
28. El backend elimina el grupo y desasigna sus miembros (permanecen como miembros pero necesitan reasignación)

## Flujos Alternativos

### FA-1: Usuario no encontrado por DID
- En el paso 6, el DID no coincide con ningún usuario en la plataforma
- El portal muestra: "Usuario no encontrado. Debe iniciar sesión en la plataforma al menos una vez antes de poder ser añadido"
- El propietario no puede continuar hasta que se seleccione un usuario válido

### FA-2: Usuario ya es miembro
- En el paso 9, el usuario que se intenta añadir ya existe como miembro de esta organización
- El backend rechaza el duplicado con un error de conflicto
- El portal muestra: "Este usuario ya es miembro de esta organización"

### FA-3: No se puede eliminar al propietario
- En el paso 20, el propietario intenta eliminarse a sí mismo
- El backend impide la eliminación — el propietario no puede ser eliminado de su propia organización
- El portal muestra: "El propietario de la organización no puede ser eliminado"

### FA-4: No se puede eliminar el grupo Admin
- En el paso 25, el propietario intenta eliminar el grupo Admin
- La acción de eliminar está deshabilitada o el backend rechaza la solicitud
- El grupo Admin (`is_admin: true`) es permanente y no puede eliminarse, solo renombrarse

### FA-5: Cambiar grupo o rol de miembro
- Desde la lista de miembros, el propietario cambia la asignación de grupo o rol de un miembro
- El backend actualiza la entrada del miembro con el nuevo `group_id` y/o `role`
- Los permisos del miembro dentro de la organización cambian inmediatamente

### FA-6: El propietario no es el usuario autenticado
- En el paso 1, el usuario autenticado no es el propietario de esta organización
- El backend devuelve HTTP 403 (Forbidden) para cualquier operación de modificación
- El acceso de lectura puede seguir siendo permitido para miembros (futuro: control de acceso basado en roles)

## Postcondiciones

- **Añadir miembro**: El nuevo miembro existe en la organización con grupo y rol asignados; puede acceder a la perspectiva de la organización y realizar acciones (emitir credenciales, solicitar información) según su rol
- **Crear grupo**: Un nuevo grupo existe dentro de la organización para asignación de miembros
- **Eliminar miembro**: El miembro es eliminado y pierde acceso a la perspectiva de la organización
- **Eliminar grupo**: El grupo es eliminado; sus miembros necesitan reasignación

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Página de edición de organización con pestañas (Info Básica, Grupos, Miembros), búsqueda de miembros por DID, formularios de asignación de grupo/rol, diálogos de confirmación |
| **backend** | CRUD de miembros (añadir, actualizar, eliminar), CRUD de grupos (crear, actualizar, eliminar), búsqueda de usuarios por DID, validación de propiedad, operaciones en cascada |

## Notas Técnicas

- **Resolución de miembros**: Los miembros se añaden por DID. El backend resuelve el DID a un `user_id` vía la tabla de usuarios. El usuario objetivo debe haber iniciado sesión al menos una vez (lo que crea su registro de usuario). Añadir miembros por DID (no por email) se alinea con el modelo de identidad descentralizada
- **Modelo de grupos**: Cada organización tiene 1..N grupos. El grupo Admin se crea automáticamente y no puede eliminarse (`is_admin: true`). Los grupos personalizados pueden crearse y eliminarse libremente por el propietario. Cada miembro pertenece a exactamente un grupo
- **Modelo de roles**: Cada miembro tiene una cadena de `role` dentro de su grupo (ej., `admin`, `member`). Los roles determinan qué acciones puede realizar el miembro dentro de la organización: emitir credenciales, solicitar información, o ambas. Los permisos específicos por rol son aplicados por el backend
- **Comportamiento en cascada**: Eliminar una organización elimina en cascada todos sus grupos y miembros. Eliminar un grupo elimina el grupo pero los registros de miembros necesitan reasignación o eliminación explícita
- **API**: La gestión de miembros y grupos se realiza mediante `PATCH /api/v1/organizations/{id}` que acepta el estado completo actualizado de grupos y miembros. El backend reconcilia la diferencia (añade nuevos, elimina los borrados, actualiza los cambiados)
- **Implementación actual**: La página de edición de emisores existente (`/dashboard/issuers/[id]`) tiene tres pestañas (Info Básica, Grupos, Miembros) y se refactorizará al modelo unificado de organizaciones en `/dashboard/organizations/[id]`
- **Futuro: flujo de invitación**: Actualmente los miembros se añaden directamente por el propietario. Una mejora futura podría añadir un flujo de invitación donde el usuario objetivo recibe una notificación y debe aceptar la invitación antes de convertirse en miembro
