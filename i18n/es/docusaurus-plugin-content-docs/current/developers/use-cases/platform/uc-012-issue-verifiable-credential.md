---
title: "UC-012: Emitir Credencial Verificable"
sidebar_label: "UC-012: Emitir Credencial"
sidebar_position: 12
---

# UC-012: Emitir Credencial Verificable

:::note Flujo de Referencia
Corresponde al **Flujo 2 — Emisión de Credencial Verificable**.
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La emisión de credenciales aún no está implementada.
:::

## Descripción

Un Issuer (organización) autorizado emite una credencial verificable (VC) a un Holder. El Issuer construye la credencial con los claims correspondientes, la firma con su clave privada, la cifra con la clave pública del Holder (obtenida resolviendo el DID del Holder en la blockchain) y la persiste en el almacenamiento descentralizado. El estado de la credencial (activa, con fecha de expiración) se registra en la blockchain. Solo el Holder puede descifrar la credencial con su clave privada. El Issuer retiene únicamente un identificador/hash para gestionar la revocación.

## Actores

- **Issuer**: Organización autorizada que emite la credencial — debe estar registrada en el trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- **Holder**: Usuario que recibe la credencial
- **Blockchain**: Red distribuida para resolución de DIDs y registro de estado de credenciales
- **Nodo Storage**: Almacenamiento descentralizado donde se persiste la credencial cifrada

## Precondiciones

- El Issuer y el Holder tienen DIDs registrados en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- El Issuer está autorizado en el trust framework ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
- El Holder ha solicitado o aceptado recibir la credencial

## Flujo Principal

1. El Issuer construye la Credencial Verificable (VC) con:
   - Los claims correspondientes (datos del Holder)
   - Fecha de emisión
   - Fecha de expiración (TTL) — opcional: si se omite, la credencial no tiene expiración
   - Referencia al DID del Holder como `credentialSubject`
   - Referencia al DID del Issuer como `issuer`
2. El Issuer firma la VC con su clave privada — esta firma permite verificar la autenticidad e integridad de la credencial
3. El Issuer resuelve el DID del Holder en la blockchain para obtener su clave pública
4. El Issuer cifra la VC firmada con la clave pública del Holder — solo el Holder podrá descifrarla con su clave privada
5. La credencial cifrada se persiste en el nodo de almacenamiento descentralizado — se genera un identificador/hash de referencia
6. El Issuer registra el estado de la credencial en la blockchain:
   - Identificador de la credencial
   - DID del Issuer
   - Estado inicial: **activa**
   - Fecha de expiración (si se estableció)
7. El Holder recibe una notificación de que tiene una nueva credencial disponible — su wallet almacena la referencia al storage y los metadatos
8. La blockchain registra el hash de la operación de emisión como evidencia auditable ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Flujos Alternativos

### FA-1: DID del Holder no encontrado
- En el paso 3, el DID del Holder no puede resolverse en la blockchain
- La emisión no puede continuar — se informa al Issuer de que el Holder debe anclar su DID primero

### FA-2: Issuer no autorizado
- En el paso 1, el sistema verifica que el Issuer está autorizado en el trust framework
- Si el Issuer no está autorizado o su autorización ha sido revocada, la emisión se rechaza

### FA-3: Fallo en la validación del esquema
- En el paso 1, los claims no cumplen con el esquema de credencial
- Se muestran errores de validación al Issuer que debe corregir los datos

### FA-4: Nodo de storage inaccesible
- En el paso 5, el almacenamiento descentralizado no es accesible
- La operación falla y el Issuer puede reintentar más tarde

### FA-5: Fallo en la transacción blockchain
- En el paso 6, la transacción blockchain para el registro de estado falla
- La credencial no se considera emitida — el Issuer puede reintentar

## Postcondiciones

- La credencial cifrada está en el almacenamiento descentralizado, accesible solo por el Holder (que puede descifrarla con su clave privada)
- El estado de la credencial (activa, con fecha de expiración) está registrado en la blockchain
- El Issuer retiene solo el identificador/hash de la credencial para gestión de revocación ([UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- El hash de la operación de emisión está registrado en la blockchain como evidencia auditable
- El Holder puede ver la credencial desde su perspectiva ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de emisión de credenciales, selección de esquema, búsqueda de Holder, UI de confirmación |
| **backend** | Construcción de la VC (formato W3C), firma, resolución de DID, cifrado, persistencia en storage |
| **blockchain** | Resolución del DID del Holder (obtención de clave pública), registro de estado de credencial, pista de auditoría |
| **storage** | Persistencia de credencial cifrada, generación de identificador de referencia |

## Notas Técnicas

- **Formato de credencial**: W3C Verifiable Credentials Data Model 2.0 con campo `credentialStatus` apuntando al registro de revocación en blockchain (W3C Bitstring Status List)
- **Cifrado**: La VC se cifra con la clave pública del Holder antes de persistirse — esto asegura que solo el Holder puede acceder al contenido de la credencial
- **Almacenamiento descentralizado**: Las credenciales se almacenan en el nodo de storage basado en IPFS, no en la base de datos del backend — el backend solo almacena metadatos y referencias
- **Ciclo de vida del estado**: `ACTIVE` → `EXPIRED` (automático, basado en TTL) o `ACTIVE` → `REVOKED` (manual, vía [UC-016](/docs/developers/use-cases/platform/uc-016-revoke-verifiable-credential))
- **Trazabilidad**: El hash de la operación de emisión se registra on-chain — ningún dato personal se almacena en la blockchain
- **Estándares**: W3C VC Data Model 2.0, W3C Bitstring Status List, eIDAS 2.0, OID4VCI
