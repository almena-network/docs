---
title: "UC-015: Verificar Presentación"
sidebar_label: "UC-015: Verificar Presentación"
sidebar_position: 15
---

# UC-015: Verificar Presentación

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La verificación de presentaciones aún no está implementada.
:::

## Descripción

Desde la perspectiva Peticionario, un miembro del peticionario verifica una presentación verificable (VP) recibida de un usuario. El proceso de verificación valida la firma del titular sobre la VP, la firma de cada emisor sobre las credenciales verificables incluidas, el estado de revocación de las credenciales y la integridad de los datos. La verificación se realiza contra un nodo verificador que resuelve DIDs desde la blockchain y comprueba las pruebas criptográficas. Por ejemplo, un banco verifica que la credencial de título de un cliente fue genuinamente emitida por una universidad y no ha sido revocada.

## Actores

- **Miembro del Peticionario**: Persona actuando desde la perspectiva Peticionario, iniciando la verificación
- **Frontend (Portal)**: Aplicación web Next.js que muestra los resultados de verificación
- **Backend API**: Servicio FastAPI que orquesta el proceso de verificación
- **Nodo Verificador**: Servicio que realiza la verificación criptográfica (validación de firma, verificación de revocación)
- **Blockchain**: Blockchain de Almena que proporciona resolución de DID Document y registro de revocación

## Precondiciones

- El miembro del peticionario está autenticado y en el dashboard en **perspectiva Peticionario** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- Un usuario ha respondido a una solicitud de información con una presentación verificable ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- La solicitud de información está en estado `FULFILLED` ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- El nodo verificador es accesible

## Flujo Principal

1. El miembro del peticionario ve una solicitud cumplida en la perspectiva Peticionario con una presentación verificable enlazada
2. El miembro del peticionario hace clic en **Verificar** sobre la presentación
3. El portal envía la VP al backend para verificación
4. El backend envía la VP al nodo verificador
5. El nodo verificador realiza las siguientes comprobaciones:

### Verificación a nivel VP (Titular)
   - Resuelve el DID del titular desde la blockchain (o extrae la clave pública del string DID para `did:almena:*`)
   - Verifica la firma Ed25519 del titular sobre la VP
   - Valida que el nonce de challenge coincide con la solicitud original
   - Comprueba que la VP no ha expirado

### Verificación a nivel VC (por cada credencial incluida)
   - Resuelve el DID del emisor desde la blockchain
   - Obtiene la clave pública del emisor del DID Document
   - Verifica la firma del emisor sobre la credencial
   - Valida que la credencial no ha expirado
   - Comprueba el registro de revocación: consulta la blockchain para confirmar que la credencial no ha sido revocada
   - Valida la conformidad con el esquema de la credencial

6. El nodo verificador devuelve el resultado de verificación:
   - Estado general: `VALID`, `INVALID` o `PARTIAL`
   - Resultados por credencial con estados individuales de cada comprobación
   - Motivos de fallo (si existen)
7. El backend almacena el resultado de verificación vinculado a la solicitud original
8. El portal muestra el resultado de verificación al miembro del peticionario:
   - Estado general con indicador visual (verde/rojo/amarillo)
   - Desglose por credencial mostrando cada comprobación (firma, expiración, revocación)
   - Las afirmaciones/atributos verificados de las credenciales
   - Timestamp de la verificación

## Flujos Alternativos

### FA-1: Firma de VP inválida
- En el paso 5, la firma del titular no coincide
- El nodo verificador devuelve `INVALID` con motivo "La verificación de firma del titular falló"
- El portal muestra el fallo y el peticionario no puede confiar en los datos presentados

### FA-2: Credencial revocada
- En el paso 5, una de las credenciales incluidas ha sido revocada por su emisor
- El nodo verificador devuelve `PARTIAL` o `INVALID` dependiendo de si todas las credenciales son requeridas
- El portal resalta qué credencial fue revocada

### FA-3: DID del emisor no encontrado
- En el paso 5, el DID del emisor no puede resolverse desde la blockchain
- El nodo verificador devuelve `INVALID` con motivo "DID del emisor no resoluble"
- Esto puede indicar que el DID del emisor nunca fue anclado o que la blockchain es inaccesible

### FA-4: Nonce de challenge no coincide
- En el paso 5, el nonce en la VP no coincide con el challenge de la solicitud
- El nodo verificador devuelve `INVALID` con motivo "Challenge no coincide — posible replay"
- Esto indica que la VP puede haber sido reutilizada de una solicitud diferente

### FA-5: Credencial expirada
- En el paso 5, una credencial ha superado su fecha de expiración
- El nodo verificador marca la credencial como expirada
- El miembro del peticionario es informado y puede decidir contextualmente si acepta la credencial expirada

### FA-6: Nodo verificador inaccesible
- En el paso 4, el nodo verificador no es accesible
- El portal muestra un error y el peticionario puede reintentar más tarde

## Postcondiciones

- El resultado de verificación está almacenado y asociado a la solicitud de información original
- El miembro del peticionario tiene una evaluación clara de si la información presentada es confiable
- El resultado de verificación queda registrado en el historial del peticionario

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Trigger de verificación, visualización de resultado con desglose por credencial, indicadores de estado |
| **backend** | Orquestación de verificación, almacenamiento de resultados, comunicación con nodo verificador |
| **blockchain** | Resolución de DID Document (DIDs de titular y emisor), consultas al registro de revocación |

## Notas Técnicas

- **Nodo verificador**: Un servicio dedicado (o módulo del backend) que realiza la verificación criptográfica real. Separar la lógica de verificación permite reutilizarla en diferentes contextos (API, CLI, etc.)
- **Resolución DID**: Para `did:almena:*`, la clave pública está embebida en el string DID. Para DIDs anclados, se consulta el módulo DID de la blockchain para obtener el DID Document completo con métodos de verificación
- **Registro de revocación**: El módulo de credenciales de la blockchain mantiene un registro de revocación. Comprobar la revocación es una consulta a la blockchain, no una modificación
- **Vinculación de challenge**: El nonce de challenge de la VP debe coincidir con el nonce de la solicitud original. Esto previene que un titular reenvíe una VP generada previamente para una solicitud diferente
- **La verificación es no destructiva**: La VP y las credenciales permanecen sin cambios después de la verificación. El proceso solo lee y valida
- **Auditoría**: Cada resultado de verificación se almacena con timestamp, permitiendo al peticionario demostrar cuándo y cómo verificó la información
