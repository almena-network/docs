---
title: "UC-015: Verificar Presentación"
sidebar_label: "UC-015: Verificar Presentación"
sidebar_position: 15
---

# UC-015: Verificar Presentación

:::note Flujo de Referencia
Corresponde al **Flujo 3 — Solicitud y Presentación Verificable**, pasos 7-12.
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La verificación de presentaciones aún no está implementada.
:::

## Descripción

El Requester delega la verificación de una presentación verificable (VP) recibida al Verifier. El Verifier realiza la validación criptográfica completa: verifica la firma del Holder en la VP, verifica la firma de cada Issuer en las credenciales incluidas, comprueba el estado de las credenciales (activa/revocada/expirada) en la blockchain y verifica la legitimidad de cada Issuer a través del trust framework. El Verifier devuelve el resultado de la verificación al Requester.

## Actores

- **Requester**: Entidad que recibió la VP y delega la verificación
- **Verifier**: Componente o servicio que realiza la verificación criptográfica — comprueba firmas, integridad de datos, estado de revocación y legitimidad del Issuer vía el trust framework
- **Blockchain**: Proporciona resolución de DIDs, estado de credenciales (registro de revocación) y trust framework (registro de Issuers autorizados)

## Precondiciones

- Un Holder ha respondido a una solicitud de información con una VP ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- El servicio Verifier está accesible
- La blockchain está operativa

## Flujo Principal

1. El Requester recibe la VP y delega la verificación al Verifier
2. El Verifier verifica la firma del Holder:
   - Resuelve el DID del Holder en la blockchain para obtener la clave pública
   - Verifica la firma del Holder en la VP
   - Valida que el nonce de challenge coincide con la solicitud original
   - Comprueba que la VP no ha expirado
3. Para cada credencial incluida, el Verifier:
   - Resuelve el DID del Issuer en la blockchain para obtener la clave pública
   - Verifica la firma del Issuer en la credencial
   - Valida que la credencial no ha expirado
   - Comprueba el registro de revocación en la blockchain para confirmar que la credencial no ha sido revocada
4. El Verifier verifica la legitimidad de cada Issuer:
   - Consulta el trust framework en la blockchain para confirmar que cada Issuer está autorizado para emitir el tipo de credencial presentada ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework))
5. El Verifier devuelve el resultado de la verificación al Requester:
   - Estado general: `VALID`, `INVALID` o `PARTIAL`
   - Desglose por credencial con estados de comprobación individuales
   - Detalle de cada verificación realizada
6. La blockchain registra el hash de la operación de verificación como evidencia auditable ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Flujos Alternativos

### FA-1: Firma del Holder inválida
- En el paso 2, la firma del Holder no coincide
- El Verifier devuelve `INVALID` — los datos presentados no son confiables

### FA-2: Credencial revocada
- En el paso 3, una de las credenciales incluidas ha sido revocada
- El Verifier devuelve `PARTIAL` o `INVALID` según si todas las credenciales son requeridas

### FA-3: DID del Issuer no encontrado
- En el paso 3, el DID del Issuer no puede resolverse desde la blockchain
- El Verifier devuelve `INVALID` — la credencial no puede validarse

### FA-4: Nonce de challenge no coincide
- En el paso 2, el nonce en la VP no coincide con el challenge de la solicitud
- El Verifier devuelve `INVALID` — posible ataque de repetición

### FA-5: Credencial expirada
- En el paso 3, una credencial ha superado su fecha de expiración
- El Verifier marca la credencial como expirada en el resultado

### FA-6: Issuer no autorizado en el trust framework
- En el paso 4, el Issuer no se encuentra en el trust framework o su autorización ha sido revocada
- El Verifier devuelve `INVALID` — el Issuer no es legítimo para este tipo de credencial

### FA-7: Verifier inaccesible
- En el paso 1, el servicio Verifier no está accesible
- El Requester puede reintentar más tarde

## Postcondiciones

- El Requester tiene una evaluación clara de si la información presentada es confiable
- El resultado de la verificación incluye desglose por credencial de todas las comprobaciones realizadas
- La operación de verificación está registrada en la blockchain como evidencia auditable
- Todos los datos verificados sin exponer información personal on-chain

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **backend** | Orquestación de la verificación, almacenamiento de resultados |
| **blockchain** | Resolución de DID Documents (DIDs del Holder y del Issuer), consultas al registro de revocación, consultas al trust framework |

## Notas Técnicas

- **Verifier como componente separado**: El Verifier es un servicio/componente dedicado que realiza la verificación criptográfica — separarlo del Requester asegura validación independiente
- **Verificación del trust framework**: Esta es una comprobación nueva — el Verifier consulta el trust framework en blockchain para confirmar que cada Issuer está autorizado ([UC-025](/docs/developers/use-cases/platform/uc-025-register-issuer-in-trust-framework), [UC-026](/docs/developers/use-cases/platform/uc-026-delegate-issuer-authorization))
- **La verificación no es destructiva**: La VP y las credenciales permanecen sin cambios — el proceso solo lee y valida
- **Estándares**: W3C VC Data Model 2.0, W3C Bitstring Status List, DIF Presentation Exchange
