---
title: "UC-013: Generar Presentación Verificable"
sidebar_label: "UC-013: Generar Presentación"
sidebar_position: 13
---

# UC-013: Generar Presentación Verificable

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. Las presentaciones verificables aún no están implementadas.
:::

## Descripción

Desde la perspectiva Titular, el usuario genera una presentación verificable (VP) para responder a una solicitud de información de una organización. Una VP es un envoltorio que agrupa una o más credenciales verificables (o declaraciones seleccionadas de ellas) en un paquete firmado que demuestra que el titular controla las credenciales y consiente en compartirlas. Por ejemplo, un banco solicita prueba del título universitario del usuario — el usuario selecciona la credencial relevante, el portal genera una VP firmada con la clave DID del usuario y la entrega a la organización solicitante.

## Actores

- **Usuario Final (Titular)**: Persona que genera la presentación a partir de sus credenciales
- **Frontend (Portal)**: Aplicación web Next.js que proporciona la interfaz de generación de presentaciones
- **Backend API**: Servicio FastAPI que construye y firma la VP
- **Wallet**: Firma la presentación con la clave privada Ed25519 del titular (vía desafío-respuesta)
- **Organización (Solicitante)**: Organización que recibirá y verificará la presentación

## Precondiciones

- El usuario está autenticado y en el dashboard en **perspectiva Titular** ([UC-010](/docs/developers/use-cases/platform/uc-010-view-dashboard-by-perspective))
- El usuario tiene al menos una credencial verificable válida ([UC-011](/docs/developers/use-cases/platform/uc-011-view-verified-credentials))
- Una organización ha solicitado información al usuario ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user)), o el usuario inicia una presentación de forma proactiva

## Flujo Principal

1. El usuario está en la perspectiva Titular y ve una solicitud de información pendiente de una organización, o navega para generar una presentación manualmente
2. El portal muestra los detalles de la solicitud:
   - Nombre y DID de la organización solicitante
   - Información solicitada (ej., "prueba de título universitario", "certificación profesional")
   - Tiempo de expiración de la solicitud
3. El portal muestra las credenciales del usuario que coinciden con la información solicitada
4. El usuario selecciona qué credenciales (o declaraciones específicas dentro de las credenciales) incluir en la presentación
5. El usuario revisa los datos que se compartirán y confirma
6. El portal envía las credenciales seleccionadas y el contexto de la solicitud al backend
7. El backend construye la Presentación Verificable W3C:
   - Establece `@context`, `type: "VerifiablePresentation"`
   - Establece `holder` con el DID del usuario
   - Incluye las credenciales verificables seleccionadas en `verifiableCredential`
   - Incluye el `challenge` (nonce de la solicitud de la organización) para vincular la VP a la solicitud específica
8. El backend solicita al usuario que firme la VP a través de la wallet (flujo de desafío-respuesta):
   - Envía una solicitud de firma a la wallet vía deep link o HTTP
   - La wallet firma el payload de la VP con la clave privada Ed25519
   - Devuelve la firma
9. El backend adjunta la prueba (firma, método de verificación, marca temporal de creación) a la VP
10. El backend entrega la VP firmada a la organización (a través de la plataforma o URL de callback)
11. El portal confirma la entrega y muestra el resumen de la presentación al usuario

## Flujos Alternativos

### FA-1: No hay credenciales coincidentes
- En el paso 3, el usuario no tiene credenciales que satisfagan la solicitud de la organización
- El portal muestra un mensaje indicando qué credenciales faltan
- El usuario no puede generar la presentación

### FA-2: El usuario rechaza la solicitud
- En el paso 5, el usuario decide no compartir la información
- El usuario hace clic en "Rechazar" y la solicitud se marca como rechazada
- La organización es notificada del rechazo

### FA-3: Divulgación selectiva
- En el paso 4, el usuario elige compartir solo declaraciones específicas de una credencial en lugar de la credencial completa
- La VP incluye solo las declaraciones seleccionadas (si el formato de credencial soporta divulgación selectiva)

### FA-4: Fallo en la firma de la wallet
- En el paso 8, la wallet no es accesible o el usuario cancela la firma
- La presentación no se genera y el usuario puede reintentar

### FA-5: Solicitud expirada
- En el paso 1, la solicitud de la organización ha superado su tiempo de expiración
- El portal muestra la solicitud como expirada y el usuario no puede generar una presentación para ella

## Postcondiciones

- Existe una presentación verificable firmada que contiene las credenciales seleccionadas
- La VP ha sido entregada a la organización solicitante
- La presentación queda registrada en el historial del usuario
- La organización puede ahora verificar la presentación ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Visualización de solicitudes, interfaz de selección de credenciales, revisión y confirmación, confirmación de entrega |
| **backend** | Construcción de la VP (formato W3C VP), orquestación de firma, entrega a la organización |
| **wallet** | Firma Ed25519 del payload de la VP (vía desafío-respuesta) |
| **blockchain** | Resolución del DID del titular (para obtención de clave pública durante la verificación) |

## Notas Técnicas

- **Formato de VP**: W3C Verifiable Presentations Data Model. JSON-LD que envuelve una o más VCs con una prueba del titular
- **Vinculación por desafío**: La VP incluye el `challenge` (nonce) de la organización para prevenir la repetición. La VP es válida únicamente para la solicitud específica a la que responde
- **Firma**: La clave Ed25519 del titular firma la VP. Esto demuestra que el titular consiente en compartir las credenciales agrupadas
- **Divulgación selectiva**: Depende del formato de credencial. Las VCs estándar en JSON-LD incluyen todas las declaraciones. Futuro: las firmas BBS+ podrían habilitar la divulgación selectiva de atributos
- **Entrega**: Inicialmente a través de la API de la plataforma. Futuro: DIDComm v2 a través del módulo mediador para entrega peer-to-peer ([UC-018](/docs/developers/use-cases/wallet/uc-018-send-didcomm-message), [UC-021](/docs/developers/use-cases/mediator/uc-021-route-didcomm-message))
