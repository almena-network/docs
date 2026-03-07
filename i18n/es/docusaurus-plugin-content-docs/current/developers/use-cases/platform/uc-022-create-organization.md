---
title: "UC-022: Crear Organización"
sidebar_label: "UC-022: Crear Organización"
sidebar_position: 22
---

# UC-022: Crear Organización

:::note Flujo de Referencia
Corresponde al **Flujo 1 — Registro de Identidad (Onboarding)** aplicado a entidades, y prerrequisitos del **Flujo 6 — Gestión del Trust Framework**.
:::

## Descripción

Un usuario crea una nueva organización (entidad) en la plataforma. Una organización es una entidad unificada que puede actuar como **Issuer** (emitir credenciales verificables) y como **Requester** (solicitar información verificada a usuarios). Cuando un usuario crea una organización, se convierte en su propietario y la organización comienza en estado `draft`. La organización debe seguir el mismo flujo de registro de identidad que los usuarios individuales: generar un DID y anclarlo en la blockchain. Para operar como Issuer, la organización debe adicionalmente estar autorizada en el trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework)).

## Actores

- **Usuario (Creador)**: Persona que crea la organización — se convierte en propietario
- **Blockchain**: Red distribuida donde se anclará el DID de la organización

## Precondiciones

- El usuario está autenticado en la plataforma ([UC-008](/docs/developers/use-cases/platform/uc-008-login-with-desktop-wallet) o [UC-009](/docs/developers/use-cases/platform/uc-009-login-with-mobile-wallet))
- El usuario tiene un DID anclado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))

## Flujo Principal

1. El usuario navega a la sección de gestión de organizaciones
2. El usuario hace clic en **Crear Nueva Organización**
3. El usuario completa los datos de la organización (nombre, descripción)
4. El sistema crea la organización:
   - Genera un ID único
   - Establece al usuario como propietario
   - Establece estado en `draft`
   - Crea automáticamente un grupo **Admin** con el propietario como primer miembro
5. La organización genera un DID siguiendo el mismo flujo de registro de identidad ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
6. El DID de la organización se ancla en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain)), haciéndolo públicamente resoluble
7. El propietario puede gestionar grupos y añadir miembros ([UC-023](/docs/developers/use-cases/platform/uc-023-manage-organization-members))
8. Para operar como Issuer, la organización debe registrarse en el trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))

## Flujos Alternativos

### FA-1: Campos obligatorios vacíos
- En el paso 3, el nombre o descripción están vacíos
- El formulario muestra errores de validación

### FA-2: Fallo en el anclaje del DID
- En el paso 6, la transacción blockchain falla
- La organización permanece en estado `draft` y el anclaje puede reintentarse

### FA-3: Usuario no autenticado
- En el paso 4, la autenticación es inválida
- El usuario es redirigido al login

## Postcondiciones

- Existe una nueva organización con su propio DID
- El creador es el propietario de la organización con un grupo Admin creado automáticamente
- El DID Document de la organización está registrado en la blockchain (públicamente resoluble)
- La organización puede solicitar información a usuarios (capacidad Requester)
- Para emitir credenciales (capacidad Issuer), la organización debe adicionalmente registrarse en el trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de creación de organización, validación, UI de gestión |
| **backend** | Creación de organización, generación de DID, creación automática de grupo Admin, persistencia |
| **blockchain** | Anclaje del DID Document de la organización, resolución pública |

## Notas Técnicas

- **Modelo de entidad unificado**: Las organizaciones no se tipifican como "emisor" o "solicitante" — cada organización tiene capacidades duales
- **Flujo de identidad**: Las organizaciones siguen el mismo flujo de generación y anclaje de DID que los usuarios individuales (Flujo 1)
- **Trust framework**: Operar como Issuer requiere autorización en el trust framework — es un paso separado tras la creación de la organización
- **Ciclo de vida del estado**: `draft` → `synced` (tras anclaje de DID en blockchain)
- **Estándares**: W3C DID v1.0, eIDAS 2.0 (wallets organizacionales)
