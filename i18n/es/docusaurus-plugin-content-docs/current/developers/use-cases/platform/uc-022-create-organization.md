---
title: "UC-022: Crear Organización"
sidebar_label: "UC-022: Crear Organización"
sidebar_position: 22
---

# UC-022: Crear Organización

## Descripción

Un usuario crea una nueva organización (entidad) en la plataforma. Una organización es una entidad unificada que puede tanto **emitir credenciales verificables** como **solicitar información verificada** a los usuarios. No existe distinción entre "emisor" y "solicitante" — toda organización tiene ambas capacidades a través de dos áreas funcionales: un **buzón de emisión** (para emitir credenciales) y un **buzón de peticiones (entrada/salida)** (para solicitar y recibir información verificada). Cuando un usuario crea una organización, automáticamente se convierte en su **propietario** y se coloca en un grupo **Admin** creado automáticamente. La organización comienza en estado `draft`. Un usuario puede crear y poseer múltiples organizaciones.

## Actores

- **Usuario Final (Creador)**: Persona que crea la organización desde el dashboard del portal
- **Frontend (Portal)**: Aplicación web Next.js que proporciona el formulario de creación de organizaciones
- **Backend API**: Servicio FastAPI que gestiona la creación de organizaciones, asignación de propietario e inicialización de grupos

## Precondiciones

- El usuario está autenticado en el portal ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) o [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- El usuario tiene un DID anclado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Flujo Principal

1. El usuario navega a la sección de gestión de organizaciones: `/[locale]/dashboard/organizations`
2. El usuario hace clic en **Crear Nueva Organización**
3. El portal muestra el formulario de creación con:
   - Nombre de la organización (obligatorio)
   - Descripción (obligatoria)
4. El usuario completa el nombre y la descripción
5. El usuario envía el formulario
6. El backend crea la organización:
   - Genera un ID único
   - Establece al usuario autenticado como `owner_id`
   - Establece el estado en `draft`
   - Crea automáticamente un grupo **Admin** (`is_admin: true`) — este grupo no puede eliminarse
   - Añade al propietario como miembro del grupo Admin con rol `admin`
   - Establece las marcas temporales `created_at` y `updated_at`
7. El backend devuelve la organización creada con todos los detalles
8. El portal navega a la página de edición de la organización, donde el propietario puede gestionar grupos y añadir miembros ([UC-023](/docs/developers/use-cases/platform/uc-023-manage-organization-members))

## Flujos Alternativos

### FA-1: Campos obligatorios vacíos
- En el paso 5, el nombre o la descripción están vacíos
- El formulario muestra errores de validación en los campos vacíos
- El botón de envío permanece deshabilitado hasta que todos los campos obligatorios estén completos

### FA-2: Nombre de organización duplicado
- En el paso 6, el backend permite organizaciones con el mismo nombre (los nombres no son restricciones únicas)
- Cada organización se identifica de forma única por su ID, no por su nombre

### FA-3: Usuario no autenticado
- En el paso 6, el token de autenticación es inválido o ha expirado
- El backend devuelve HTTP 401 y el portal redirige a la página de inicio de sesión

## Postcondiciones

- Existe una nueva organización en la base de datos con estado `draft`
- El creador es el propietario de la organización
- Existe un grupo Admin con el propietario como su primer miembro (rol: `admin`)
- La organización aparece en la lista de organizaciones del usuario
- La organización puede emitir credenciales ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential)) y solicitar información ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user)) una vez que los miembros estén configurados
- El selector de perspectivas del usuario en el dashboard ahora incluye la nueva organización ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de creación de organizaciones, validación, navegación a la página de edición |
| **backend** | Creación de la entidad organización, creación automática del grupo Admin, asignación de miembro propietario, persistencia |

## Notas Técnicas

- **Modelo de entidad unificado**: Las organizaciones no se tipifican como "emisor" o "solicitante". Cada organización tiene capacidades duales: emitir credenciales y solicitar información. La distinción es funcional (qué acción realiza el miembro), no estructural (qué tipo es la entidad)
- **Dos áreas funcionales**: Cada organización tiene un **buzón de emisión** (credenciales emitidas a usuarios) y un **buzón de peticiones (entrada/salida)** (solicitudes de información enviadas a usuarios y presentaciones recibidas de vuelta). Ambas áreas son accesibles desde la perspectiva Organización en el dashboard
- **Ciclo de vida del estado**: `draft` → `synced`. El estado `draft` indica que la organización aún no ha sido registrada en la blockchain. La sincronización ancla el DID de la organización on-chain
- **Grupo Admin**: Cada organización tiene exactamente un grupo Admin, creado automáticamente y marcado con `is_admin: true`. Este grupo no puede eliminarse pero puede renombrarse. Los miembros del grupo Admin tienen privilegios administrativos completos
- **Rol de propietario**: El propietario es el usuario que creó la organización. El propietario tiene control total: editar detalles, gestionar grupos, añadir/eliminar miembros, eliminar la organización. La propiedad se rastrea mediante `owner_id`
- **Endpoints de API**:
  - `POST /api/v1/organizations` — Crear organización
  - `GET /api/v1/organizations` — Listar organizaciones a las que pertenece el usuario actual
  - `GET /api/v1/organizations/{id}` — Obtener detalles de la organización
  - `PATCH /api/v1/organizations/{id}` — Actualizar organización
  - `DELETE /api/v1/organizations/{id}` — Eliminar organización (solo propietario)
- **Migración desde emisores**: El modelo de entidad de emisores existente y su API (`/api/v1/issuers`) se refactorizarán al modelo unificado de organizaciones. La estructura de datos permanece igual (nombre, descripción, DID, estado, owner_id, grupos, miembros); se elimina la distinción de tipo de entidad
- **Arquitectura del backend**: Entidad de dominio (`Organization`) → Interfaz de repositorio → Implementación SQLAlchemy → Router FastAPI con schemas Pydantic. Sigue el patrón de arquitectura limpia definido en `backend-fastapi.mdc`
