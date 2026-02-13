---
title: "UC-014: Solicitar Información al Usuario"
sidebar_label: "UC-014: Solicitar Información"
sidebar_position: 14
---

# UC-014: Solicitar Información al Usuario

:::note Flujo de Referencia
Corresponde al **Flujo 3 — Solicitud y Presentación Verificable**, paso 1.
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. El sistema de solicitud de información aún no está implementado.
:::

## Descripción

Un Requester (organización) envía una solicitud de información a un Holder. La solicitud especifica los claims necesarios (ej., prueba de mayoría de edad, domicilio, titulación), incluye el DID del Requester y el propósito de la solicitud. El Holder recibe la solicitud en su wallet y puede responder generando una presentación verificable ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation)) o rechazarla.

## Actores

- **Requester**: Entidad que necesita información verificada del Holder — tiene un DID registrado en la blockchain
- **Holder**: Usuario que recibe la solicitud y decide si comparte la información
- **Blockchain**: Proporciona resolución de DIDs para el Requester

## Precondiciones

- El Requester tiene un DID registrado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- El Holder tiene un DID registrado en la blockchain
- El Requester tiene una necesidad legítima de verificar información del Holder

## Flujo Principal

1. El Requester genera una Presentation Request especificando:
   - Los claims necesarios (ej., prueba de mayoría de edad, domicilio, titulación)
   - El DID del Requester
   - El propósito de la solicitud (mostrado al Holder por transparencia)
   - Nonce de challenge (para vincular la VP de respuesta)
   - Tiempo de expiración de la solicitud
2. La solicitud se entrega al Holder
3. El wallet del Holder recibe la solicitud y muestra qué información se solicita y quién la solicita
4. El Holder puede responder:
   - **Aceptar**: Generar una presentación verificable ([UC-013](/docs/developers/use-cases/platform/uc-013-generate-verifiable-presentation))
   - **Rechazar**: Rechazar la solicitud con un motivo opcional
5. El estado de la solicitud se actualiza:
   - `PENDING` → `FULFILLED` (Holder envió una VP)
   - `PENDING` → `DECLINED` (Holder rechazó)
   - `PENDING` → `EXPIRED` (sin respuesta antes de la expiración)

## Flujos Alternativos

### FA-1: Holder no encontrado
- En el paso 2, el DID del Holder no puede resolverse
- El Requester es informado de que la solicitud no puede entregarse

### FA-2: El Holder rechaza
- En el paso 4, el Holder revisa y rechaza la solicitud
- El Requester es notificado del rechazo

### FA-3: La solicitud expira
- El Holder no responde antes del tiempo de expiración
- La solicitud se marca automáticamente como `EXPIRED`
- El Requester puede crear una nueva solicitud

## Postcondiciones

- Existe una solicitud de información con estado `PENDING`
- El Holder ha sido notificado de la solicitud
- La solicitud incluye un nonce de challenge que debe incluirse en la VP de respuesta para prevenir repetición

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Formulario de creación de solicitudes, búsqueda de usuarios, historial de solicitudes, seguimiento de estado |
| **backend** | Creación de solicitudes, entrega, gestión de estado |
| **blockchain** | Resolución de DIDs para Requester y Holder |

## Notas Técnicas

- **Presentation Request**: Sigue la especificación DIF Presentation Exchange para definir qué claims se necesitan
- **Nonce de challenge**: Cada solicitud incluye un nonce único que debe incluirse en la VP de respuesta — esto vincula la presentación a la solicitud específica y previene repetición
- **Ciclo de vida del estado**: `PENDING` → `FULFILLED` / `DECLINED` / `EXPIRED`
- **Privacidad**: El Requester no puede explorar la lista de credenciales del Holder — solo puede solicitar claims específicos y esperar la respuesta del Holder
- **Estándares**: DIF Presentation Exchange, OID4VP, GDPR (limitación de propósito, minimización de datos)
