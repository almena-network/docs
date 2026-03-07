---
title: "UC-029: Consultar Pista de Auditoría"
sidebar_label: "UC-029: Consultar Auditoría"
sidebar_position: 29
---

# UC-029: Consultar Pista de Auditoría

:::note Flujo de Referencia
Corresponde al **Flujo 7 — Trazabilidad y Auditoría** (sección de Consulta).
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La consulta de pista de auditoría aún no está implementada.
:::

## Descripción

Un auditor autorizado consulta la blockchain en busca de registros de auditoría. La consulta devuelve datos on-chain (hashes, timestamps, tipos de evento, DIDs participantes) sin exponer datos personales. Si el auditor necesita el detalle completo, debe solicitar acceso al almacenamiento off-chain, lo cual requiere autorización y — si contiene datos personales — el consentimiento del Holder.

## Actores

- **Auditor**: Persona o entidad autorizada que consulta registros de auditoría
- **Blockchain**: Red distribuida donde se almacenan los hashes y metadatos de auditoría
- **Holder**: Usuario cuyo consentimiento puede requerirse para acceder a datos personales off-chain

## Precondiciones

- El auditor tiene autorización para consultar registros de auditoría
- Existen registros de auditoría en la blockchain ([UC-028](/docs/developers/use-cases/platform/uc-028-record-audit-trail))

## Flujo Principal

1. El auditor consulta la blockchain filtrando por DID, rango de fechas o tipo de evento
2. La blockchain devuelve registros on-chain: hashes, timestamps, tipos de evento y DIDs participantes — no se exponen datos personales
3. Si el auditor necesita el detalle completo, solicita acceso al almacenamiento off-chain
4. El acceso off-chain requiere autorización y, si contiene datos personales, el consentimiento explícito del Holder

## Flujos Alternativos

### FA-1: No se encontraron registros
- En el paso 2, ningún registro coincide con los criterios de búsqueda
- El auditor es informado y puede ajustar los parámetros de búsqueda

### FA-2: Acceso off-chain denegado
- En el paso 4, el auditor no tiene autorización suficiente o el Holder no ha consentido
- Solo los registros on-chain (hashes, metadatos) están disponibles

### FA-3: Datos off-chain eliminados (derecho al olvido)
- En el paso 3, el detalle off-chain ha sido eliminado según el derecho al olvido del GDPR
- El hash on-chain sigue existiendo como evidencia de que la operación ocurrió, pero el detalle ya no está disponible

## Postcondiciones

- El auditor ha recibido los registros de auditoría solicitados
- Los registros on-chain siempre están disponibles (inmutables)
- El acceso a datos personales off-chain está gobernado por autorización y consentimiento

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **frontend** | Interfaz de consulta de auditoría, visualización de resultados |
| **backend** | Orquestación de consultas, verificación de autorización, recuperación de datos off-chain |
| **blockchain** | Consultas de registros de auditoría (por DID, fecha, tipo de evento) |
| **storage** | Recuperación de detalle off-chain (con autorización) |

## Notas Técnicas

- **Consultas on-chain**: Filtrado por DID, rango de fechas o tipo de evento — devuelve solo hashes, metadatos y DIDs
- **Acceso off-chain**: Requiere autorización separada — el acceso a datos personales requiere consentimiento del Holder según GDPR
- **Derecho al olvido**: Los datos personales off-chain pueden eliminarse según GDPR — los hashes on-chain permanecen ya que no son datos personales
- **Independencia de auditoría**: El registro on-chain proporciona evidencia a prueba de manipulaciones independiente del operador de la plataforma
- **Estándares**: GDPR (derecho de acceso, derecho al olvido), eIDAS 2.0 (requisitos de auditoría)
