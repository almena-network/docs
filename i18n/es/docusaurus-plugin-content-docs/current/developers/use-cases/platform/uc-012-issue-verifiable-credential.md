---
title: "UC-012: Emitir Credencial Verificable"
sidebar_label: "UC-012: Emitir Credencial"
sidebar_position: 12
---

# UC-012: Emitir Credencial Verificable

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La emisión de credenciales aún no está implementada.
:::

## Descripción

Desde la perspectiva Organización del dashboard, un miembro de la organización emite una credencial verificable (VC) a un usuario. Por ejemplo, una universidad emite una credencial de título a un graduado. El miembro selecciona el tipo de credencial, completa las declaraciones, establece el período de validez (con una fecha de expiración opcional), firma la credencial con la clave DID de la organización y la entrega al titular. La credencial cumple con el W3C Verifiable Credentials Data Model. Tras la emisión, la organización puede revocar la credencial si es necesario ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential)).

## Actores

- **Miembro de la Organización**: Persona actuando desde la perspectiva Organización con permiso para emitir credenciales
- **Titular (Usuario Destinatario)**: Persona que recibe la credencial
- **Frontend (Portal)**: Aplicación web Next.js que proporciona la interfaz de emisión
- **Backend API**: Servicio FastAPI que gestiona la creación, firma y entrega de credenciales
- **Blockchain**: Blockchain de Almena para el anclaje opcional de credenciales o registro de revocación

## Precondiciones

- El miembro de la organización está autenticado y en el dashboard en **perspectiva Organización** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- El miembro de la organización tiene permiso para emitir credenciales para su organización
- La organización tiene un DID anclado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- El titular destinatario tiene un DID registrado en la plataforma

## Flujo Principal

1. El miembro de la organización navega a la sección de emisión de credenciales en la perspectiva Organización
2. El miembro de la organización selecciona un tipo/esquema de credencial (ej., "Título Universitario", "Certificación Profesional")
3. El portal muestra el formulario con los campos definidos por el esquema seleccionado
4. El miembro de la organización introduce las declaraciones:
   - DID del titular (buscado por nombre o DID)
   - Atributos específicos de la credencial (ej., nombre del título, institución, fecha de graduación, distinciones)
   - Período de validez:
     - **Fecha de emisión**: Por defecto la fecha/hora actual, puede ajustarse
     - **Fecha de expiración** (opcional): Si se establece, la credencial se invalida automáticamente después de esta fecha. Si se omite, la credencial no tiene expiración y permanece válida hasta que se revoque explícitamente ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
5. El miembro de la organización envía la credencial
6. El backend construye la Credencial Verificable W3C:
   - Establece `@context`, `type`, `issuer` (DID del emisor), `credentialSubject` (DID del titular + declaraciones)
   - Establece `issuanceDate` y opcionalmente `expirationDate`
   - Genera un ID de credencial único
7. El backend firma la credencial usando la clave privada de la organización (clave Ed25519 asociada al DID de la organización)
8. El backend almacena la credencial y la asocia con el DID del titular
9. El backend notifica al titular (a través de la plataforma) que una nueva credencial está disponible
10. El portal confirma la emisión con el ID de credencial y un resumen

## Flujos Alternativos

### FA-1: DID del titular no encontrado
- En el paso 4, el titular buscado no existe en la plataforma
- El formulario muestra un error y el miembro no puede continuar hasta que se seleccione un titular válido

### FA-2: El miembro de la organización no tiene permiso
- En el paso 5, el backend valida el rol del miembro dentro de la organización
- Si el miembro no tiene permiso de emisión, la solicitud se rechaza con un error de autorización

### FA-3: Fallo en la validación del esquema
- En el paso 5, las declaraciones introducidas no cumplen con el esquema de credencial seleccionado
- El formulario muestra errores de validación en los campos no conformes

### FA-4: Fecha de expiración en el pasado
- En el paso 4, el miembro introduce una fecha de expiración anterior a la fecha de emisión o en el pasado
- El formulario muestra un error de validación en el campo de fecha de expiración
- El miembro debe corregir la fecha antes de enviar

## Postcondiciones

- Existe una nueva credencial verificable, firmada por la organización, con estado `VALID`
- Si se estableció una fecha de expiración, la credencial pasará automáticamente al estado `EXPIRED` después de esa fecha
- La credencial está asociada al DID del titular y es accesible desde su perspectiva Titular ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- La emisión queda registrada en el historial de la organización
- La organización puede revocar la credencial posteriormente si es necesario ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de emisión de credenciales, selección de esquema, búsqueda de titular, interfaz de confirmación |
| **backend** | Construcción de credenciales (formato W3C VC), firma, almacenamiento, notificación al titular |
| **blockchain** | Resolución del DID de la organización (para obtención de claves), anclaje opcional de credenciales, registro de revocación |

## Notas Técnicas

- **Formato de credencial**: W3C Verifiable Credentials Data Model 2.0. JSON-LD con prueba criptográfica
- **Firma**: La clave Ed25519 de la organización firma la credencial. La clave está asociada al DID de la organización
- **Esquema**: Las credenciales siguen esquemas predefinidos que definen atributos obligatorios y opcionales. Los esquemas son gestionados por la plataforma
- **Período de validez**: El `issuanceDate` marca cuándo la credencial es válida. El `expirationDate` opcional marca cuándo deja de serlo. Una credencial sin fecha de expiración permanece válida indefinidamente (hasta ser revocada). Patrones típicos: las certificaciones profesionales expiran después de 1-5 años; los títulos académicos normalmente no tienen expiración
- **Ciclo de vida del estado de credencial**: `VALID` → `EXPIRED` (automático, basado en `expirationDate`) o `VALID` → `REVOKED` (manual, vía [UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential)). Expiración y revocación son independientes — una credencial puede estar tanto expirada como revocada
- **Campo `credentialStatus`**: Cada credencial incluye un `credentialStatus` que apunta al registro de revocación en la blockchain, siguiendo la especificación W3C Bitstring Status List. Esto permite a los verificadores comprobar el estado de revocación en la cadena
- **Entrega**: La credencial se almacena en el servidor y se pone a disposición del titular a través de la API. Futuro: entrega vía DIDComm a través del módulo mediador ([UC-021](/docs/developers/use-cases/mediator/uc-021-route-didcomm-message))
- **Implementación actual**: La página de gestión de organizaciones (`/dashboard/organizations`) permite crear organizaciones y gestionar miembros. La interfaz de emisión de credenciales aún no existe
