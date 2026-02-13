---
title: "UC-013: Generar Presentación Verificable"
sidebar_label: "UC-013: Generar Presentación"
sidebar_position: 13
---

# UC-013: Generar Presentación Verificable

:::note Flujo de Referencia
Corresponde al **Flujo 3 — Solicitud y Presentación Verificable**, pasos 2-6.
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. Las presentaciones verificables aún no están implementadas.
:::

## Descripción

El Holder genera una presentación verificable (VP) para responder a una solicitud de información de un Requester. El Holder revisa la solicitud, otorga su consentimiento (que se registra en la blockchain), descifra las credenciales relevantes del almacenamiento descentralizado usando su clave privada, construye una VP con únicamente los claims específicos solicitados (divulgación selectiva) y la firma con su clave privada. La VP se envía entonces al Requester.

## Actores

- **Holder**: Usuario que genera la presentación a partir de sus credenciales
- **Requester**: Entidad que envió la solicitud de información y recibirá la VP
- **Wallet**: Firma la presentación con la clave privada del Holder
- **Blockchain**: Registra el consentimiento y proporciona resolución de DIDs
- **Nodo Storage**: Almacenamiento descentralizado donde están las credenciales cifradas del Holder

## Precondiciones

- El Holder tiene un DID registrado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- El Holder posee credenciales válidas emitidas por Issuers autorizados ([UC-012](/docs/developers/use-cases/platform/uc-012-issue-verifiable-credential))
- Un Requester ha enviado una solicitud de información al Holder ([UC-014](/docs/developers/use-cases/platform/uc-014-request-information-to-user))

## Flujo Principal

1. El Holder recibe la solicitud y el wallet muestra qué información se solicita y quién la solicita
2. El Holder revisa la solicitud y la aprueba mediante un reto criptográfico (challenge-response) — el consentimiento queda registrado en la blockchain
3. El Holder descifra las credenciales relevantes del almacenamiento descentralizado usando su clave privada
4. El Holder construye una Presentación Verificable (VP) que contiene únicamente los claims específicos solicitados (divulgación selectiva), extraídos de las credenciales correspondientes
5. La VP se firma con la clave privada del Holder
6. La VP firmada se transmite al Requester
7. La blockchain registra el hash de la operación de presentación como evidencia auditable ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Flujos Alternativos

### FA-1: No hay credenciales coincidentes
- En el paso 3, el Holder no tiene credenciales que satisfagan la solicitud del Requester
- El wallet muestra un mensaje indicando qué credenciales faltan
- El Holder no puede generar la presentación

### FA-2: El Holder rechaza la solicitud
- En el paso 2, el Holder decide no compartir la información
- La solicitud se marca como rechazada y el Requester es notificado

### FA-3: Divulgación selectiva
- En el paso 4, el Holder elige compartir solo claims específicos de una credencial en lugar de la credencial completa
- La VP incluye solo los claims seleccionados (principio de mínima exposición)

### FA-4: Fallo en la firma del wallet
- En el paso 5, el wallet no es accesible o el Holder cancela la firma
- La presentación no se genera y el Holder puede reintentar

### FA-5: Solicitud expirada
- En el paso 1, la solicitud del Requester ha superado su tiempo de expiración
- El wallet muestra la solicitud como expirada y el Holder no puede generar una presentación para ella

### FA-6: Fallo en el descifrado de credencial
- En el paso 3, la credencial no puede descifrarse del storage (datos corruptos, storage inaccesible)
- El Holder es informado y puede reintentar

## Postcondiciones

- El Requester ha recibido la VP firmada con únicamente los claims solicitados
- El Holder ha compartido solo la información mínima necesaria (divulgación selectiva)
- El consentimiento está registrado en la blockchain sin datos personales
- Toda la operación queda trazada en la blockchain mediante hashes ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))
- El Requester puede ahora delegar la verificación al Verifier ([UC-015](/docs/developers/use-cases/platform/uc-015-verify-presentation))

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** | Visualización de solicitud, UI de consentimiento, descifrado de credenciales, firma de VP |
| **backend** | Construcción de la VP (formato W3C VP), entrega al Requester |
| **blockchain** | Registro de consentimiento, resolución de DIDs, pista de auditoría |
| **storage** | Recuperación de credenciales cifradas |

## Notas Técnicas

- **Formato de VP**: W3C Verifiable Presentations Data Model — JSON-LD que envuelve una o más VCs con una prueba del Holder
- **Vinculación por challenge**: La VP incluye el challenge (nonce) del Requester para prevenir repetición — la VP es válida solo para la solicitud específica a la que responde
- **Consentimiento on-chain**: El consentimiento del Holder se registra en la blockchain como hash — ningún dato personal se almacena on-chain
- **Divulgación selectiva**: La VP contiene solo los claims específicos solicitados, no las credenciales completas — sigue el principio de mínima exposición
- **Cifrado**: Las credenciales se descifran del storage solo con la clave privada del Holder — nunca se transmiten en texto claro
- **Estándares**: W3C VC Data Model 2.0, DIF Presentation Exchange, OID4VP, GDPR (consentimiento explícito)
