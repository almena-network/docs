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

Desde la perspectiva Emisor del dashboard, un miembro del emisor emite una credencial verificable (VC) a un usuario. Por ejemplo, una universidad emite una credencial de título a un graduado. El emisor selecciona el tipo de credencial, rellena las afirmaciones, establece el periodo de validez (con una fecha de expiración opcional), firma la credencial con la clave DID del emisor y la entrega al titular. La credencial se ajusta al W3C Verifiable Credentials Data Model. Después de la emisión, el emisor puede revocar la credencial si es necesario ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential)).

## Actores

- **Miembro del Emisor**: Persona actuando desde la perspectiva Emisor con permiso para emitir credenciales
- **Titular (Usuario Destino)**: Persona que recibe la credencial
- **Frontend (Portal)**: Aplicación web Next.js que proporciona la UI de emisión
- **Backend API**: Servicio FastAPI que gestiona la creación, firma y entrega de credenciales
- **Blockchain**: Blockchain de Almena para anclaje opcional de credenciales o registro de revocación

## Precondiciones

- El miembro del emisor está autenticado y en el dashboard en **perspectiva Emisor** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- El miembro del emisor tiene permiso para emitir credenciales para su organización
- La organización emisora tiene un DID anclado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- El titular destino tiene un DID registrado en la plataforma

## Flujo Principal

1. El miembro del emisor navega a la sección de emisión de credenciales en la perspectiva Emisor
2. El miembro del emisor selecciona un tipo/esquema de credencial (ej: "Título Universitario", "Certificación Profesional")
3. El portal muestra el formulario con los campos definidos por el esquema seleccionado
4. El miembro del emisor introduce las afirmaciones:
   - DID del titular (buscado por nombre o DID)
   - Atributos específicos de la credencial (ej: nombre del título, institución, fecha de graduación, honores)
   - Período de validez:
     - **Fecha de emisión**: Por defecto la fecha/hora actual, puede ajustarse
     - **Fecha de expiración** (opcional): Si se establece, la credencial se invalida automáticamente después de esta fecha. Si se omite, la credencial no tiene expiración y permanece válida hasta ser revocada explícitamente ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
5. El miembro del emisor envía la credencial
6. El backend construye la Credencial Verificable W3C:
   - Establece `@context`, `type`, `issuer` (DID del emisor), `credentialSubject` (DID del titular + afirmaciones)
   - Establece `issuanceDate` y opcionalmente `expirationDate`
   - Genera un ID de credencial único
7. El backend firma la credencial usando la clave privada del emisor (Ed25519 o la clave de la organización emisora)
8. El backend almacena la credencial y la asocia con el DID del titular
9. El backend notifica al titular (a través de la plataforma) que una nueva credencial está disponible
10. El portal confirma la emisión con el ID de credencial y un resumen

## Flujos Alternativos

### FA-1: DID del titular no encontrado
- En el paso 4, el titular buscado no existe en la plataforma
- El formulario muestra un error y el emisor no puede continuar hasta que se seleccione un titular válido

### FA-2: El miembro del emisor no tiene permiso
- En el paso 5, el backend valida el rol del miembro dentro de la organización emisora
- Si el miembro no tiene permiso de emisión, la solicitud se rechaza con un error de autorización

### FA-3: La validación del esquema falla
- En el paso 5, las afirmaciones introducidas no se ajustan al esquema de credencial seleccionado
- El formulario muestra errores de validación para los campos no conformes

### FA-4: Fecha de expiración en el pasado
- En el paso 4, el emisor introduce una fecha de expiración anterior a la fecha de emisión o en el pasado
- El formulario muestra un error de validación en el campo de fecha de expiración
- El emisor debe corregir la fecha antes de enviar

## Postcondiciones

- Existe una nueva credencial verificable, firmada por el emisor, con estado `VALID`
- Si se estableció una fecha de expiración, la credencial transitará automáticamente a estado `EXPIRED` después de esa fecha
- La credencial está asociada al DID del titular y accesible desde su perspectiva Titular ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- La emisión queda registrada en el historial del emisor
- El emisor puede revocar la credencial posteriormente si es necesario ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de emisión de credenciales, selección de esquema, búsqueda de titular, UI de confirmación |
| **backend** | Construcción de credencial (formato W3C VC), firma, almacenamiento, notificación al titular |
| **blockchain** | Resolución del DID del emisor (para obtención de clave), anclaje opcional de credencial, registro de revocación |

## Notas Técnicas

- **Formato de credencial**: W3C Verifiable Credentials Data Model 2.0. JSON-LD con prueba criptográfica
- **Firma**: La clave Ed25519 del emisor firma la credencial. La clave está asociada al DID de la organización emisora
- **Esquema**: Las credenciales siguen esquemas predefinidos que definen atributos obligatorios y opcionales. Los esquemas son gestionados por la plataforma
- **Periodo de validez**: El `issuanceDate` marca cuándo la credencial se vuelve válida. El `expirationDate` opcional marca cuándo deja de ser válida. Una credencial sin fecha de expiración permanece válida indefinidamente (hasta ser revocada). Patrones típicos: certificaciones profesionales expiran tras 1-5 años; títulos académicos típicamente no tienen expiración
- **Ciclo de vida del estado de credencial**: `VALID` → `EXPIRED` (automático, basado en `expirationDate`) o `VALID` → `REVOKED` (manual, via [UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential)). Expiración y revocación son independientes — una credencial puede estar tanto expirada como revocada
- **Campo `credentialStatus`**: Cada credencial incluye un `credentialStatus` que apunta al registro de revocación de la blockchain, siguiendo la especificación W3C Bitstring Status List. Esto permite a los verificadores comprobar el estado de revocación on-chain
- **Entrega**: La credencial se almacena en el servidor y se pone a disposición del titular via API. Futuro: entrega via DIDComm a través del módulo mediator
- **Implementación actual**: La página de gestión de emisores (`/dashboard/issuers`) permite crear emisores y gestionar miembros. La UI de emisión de credenciales no existe aún
