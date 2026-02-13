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

Desde la perspectiva Organización, un miembro de la organización verifica una presentación verificable (VP) recibida de un usuario. El proceso de verificación valida la firma del titular en la VP, la firma del emisor en cada credencial verificable incluida, el estado de revocación de las credenciales y la integridad de los datos. La verificación se realiza contra un nodo verificador que resuelve DIDs desde la blockchain y comprueba las pruebas criptográficas. Por ejemplo, un banco verifica que la credencial de título de un cliente fue genuinamente emitida por una universidad y no ha sido revocada.

## Actores

- **Miembro de la Organización**: Persona actuando desde la perspectiva Organización, iniciando la verificación
- **Frontend (Portal)**: Aplicación web Next.js que muestra los resultados de verificación
- **Backend API**: Servicio FastAPI que orquesta el proceso de verificación
- **Nodo Verificador**: Servicio que realiza la verificación criptográfica (validación de firmas, comprobaciones de revocación)
- **Blockchain**: Blockchain de Almena que proporciona resolución de Documentos DID y registro de revocación

## Precondiciones

- El miembro de la organización está autenticado y en el dashboard en **perspectiva Organización** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- Un usuario ha respondido a una solicitud de información con una presentación verificable ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
- La solicitud de información está en estado `FULFILLED` ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))
- El nodo verificador está accesible

## Flujo Principal

1. El miembro de la organización ve una solicitud cumplida en la perspectiva Organización con una presentación verificable vinculada
2. El miembro de la organización hace clic en **Verificar** sobre la presentación
3. El portal envía la VP al backend para su verificación
4. El backend envía la VP al nodo verificador
5. El nodo verificador realiza las siguientes comprobaciones:

### Verificación a nivel de VP (Titular)
   - Resuelve el DID del titular desde la blockchain (o extrae la clave pública de la cadena DID para `did:almena:*`)
   - Verifica la firma Ed25519 del titular en la VP
   - Valida que el nonce de desafío coincide con la solicitud original
   - Comprueba que la VP no ha expirado

### Verificación a nivel de VC (para cada credencial incluida)
   - Resuelve el DID del emisor desde la blockchain
   - Obtiene la clave pública del emisor del Documento DID
   - Verifica la firma del emisor en la credencial
   - Valida que la credencial no ha expirado
   - Comprueba el registro de revocación: consulta la blockchain para confirmar que la credencial no ha sido revocada
   - Valida la conformidad con el esquema de credencial

6. El nodo verificador devuelve el resultado de la verificación:
   - Estado general: `VALID`, `INVALID` o `PARTIAL`
   - Resultados por credencial con estados de comprobación individuales
   - Motivos de fallo (si los hay)
7. El backend almacena el resultado de verificación vinculado a la solicitud original
8. El portal muestra el resultado de verificación al miembro de la organización:
   - Estado general con indicador visual (verde/rojo/amarillo)
   - Desglose por credencial mostrando cada comprobación (firma, expiración, revocación)
   - Las declaraciones/atributos verificados de las credenciales
   - Marca temporal de la verificación

## Flujos Alternativos

### FA-1: Firma de la VP inválida
- En el paso 5, la firma del titular no coincide
- El nodo verificador devuelve `INVALID` con motivo "Fallo en la verificación de la firma del titular"
- El portal muestra el fallo y la organización no puede confiar en los datos presentados

### FA-2: Credencial revocada
- En el paso 5, una de las credenciales incluidas ha sido revocada por su emisor
- El nodo verificador devuelve `PARTIAL` o `INVALID` dependiendo de si todas las credenciales son requeridas
- El portal resalta qué credencial fue revocada

### FA-3: DID del emisor no encontrado
- En el paso 5, el DID del emisor no puede resolverse desde la blockchain
- El nodo verificador devuelve `INVALID` con motivo "DID del emisor no resoluble"
- Esto puede indicar que el DID del emisor nunca fue anclado o que la blockchain no está accesible

### FA-4: Nonce de desafío no coincide
- En el paso 5, el nonce en la VP no coincide con el desafío de la solicitud
- El nodo verificador devuelve `INVALID` con motivo "Desafío no coincide — posible repetición"
- Esto indica que la VP puede haber sido reutilizada de una solicitud diferente

### FA-5: Credencial expirada
- En el paso 5, una credencial ha superado su fecha de expiración
- El nodo verificador marca la credencial como expirada
- El miembro de la organización es informado y puede decidir contextualmente si acepta la credencial expirada

### FA-6: Nodo verificador inaccesible
- En el paso 4, el nodo verificador no está accesible
- El portal muestra un error y el miembro de la organización puede reintentar más tarde

## Postcondiciones

- El resultado de la verificación está almacenado y asociado con la solicitud de información original
- El miembro de la organización tiene una evaluación clara de si la información presentada es confiable
- El resultado de la verificación queda registrado en el historial de la organización

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Activador de verificación, visualización de resultados con desglose por credencial, indicadores de estado |
| **backend** | Orquestación de la verificación, almacenamiento de resultados, comunicación con el nodo verificador |
| **blockchain** | Resolución de Documentos DID (DIDs del titular y del emisor), consultas al registro de revocación |

## Notas Técnicas

- **Nodo verificador**: Un servicio dedicado (o módulo del backend) que realiza la verificación criptográfica real. Separar la lógica de verificación permite reutilizarla en diferentes contextos (API, CLI, etc.)
- **Resolución de DID**: Para `did:almena:*`, la clave pública está embebida en la cadena del DID. Para DIDs anclados, se consulta el módulo DID de la blockchain para obtener el Documento DID completo con métodos de verificación
- **Registro de revocación**: El módulo de credenciales de la blockchain mantiene un registro de revocación. Comprobar la revocación es una consulta a la blockchain, no una modificación
- **Vinculación por desafío**: El nonce de desafío de la VP debe coincidir con el nonce de la solicitud original. Esto impide que un titular reenvíe una VP generada previamente para una solicitud diferente
- **La verificación no es destructiva**: La VP y las credenciales permanecen sin cambios después de la verificación. El proceso solo lee y valida
- **Pista de auditoría**: Cada resultado de verificación se almacena con marca temporal, permitiendo a la organización demostrar cuándo y cómo verificó la información
