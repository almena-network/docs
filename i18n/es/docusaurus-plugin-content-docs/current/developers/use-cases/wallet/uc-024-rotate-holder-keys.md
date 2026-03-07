---
title: "UC-024: Rotar Claves del Holder"
sidebar_label: "UC-024: Rotar Claves"
sidebar_position: 24
---

# UC-024: Rotar Claves del Holder

:::note Flujo de Referencia
Corresponde al **Flujo 5 — Rotación de Claves del Holder**.
:::

:::info Especificación Funcional
Este caso de uso define el comportamiento previsto. La rotación de claves aún no está implementada.
:::

## Descripción

El Holder actualiza sus claves criptográficas manteniendo su identidad (DID). El proceso implica generar un nuevo par de claves, actualizar el DID Document en la blockchain con la nueva clave pública (firmando con la clave privada actual para demostrar control del DID), recifrar todas las credenciales almacenadas en el storage descentralizado con la nueva clave pública y descartar de forma segura la clave privada anterior.

## Actores

- **Holder**: Usuario que rota sus claves
- **Wallet**: Aplicación que gestiona el proceso de rotación de claves
- **Blockchain**: Red distribuida donde se actualiza el DID Document
- **Nodo Storage**: Almacenamiento descentralizado donde las credenciales deben recifarse

## Precondiciones

- El Holder tiene un DID activo con un DID Document publicado en la blockchain ([UC-003](/docs/developers/use-cases/wallet/uc-003-anchor-did-on-blockchain))
- El Holder mantiene acceso a su clave privada actual

## Flujo Principal

1. El Holder genera un nuevo par de claves criptográficas en su dispositivo
2. El Holder envía una transacción a la blockchain para actualizar su DID Document con la nueva clave pública — la transacción se firma con la clave privada actual (demostrando control del DID)
3. La blockchain valida la firma y actualiza el DID Document — la clave anterior puede marcarse como revocada o mantenerse temporalmente para transición
4. El Holder descifra sus credenciales del almacenamiento descentralizado con la clave privada anterior y las recifra con la nueva clave pública, actualizando el storage
5. Una vez completada la migración, la clave privada anterior se elimina de forma segura del dispositivo

## Flujos Alternativos

### FA-1: Fallo en la transacción blockchain
- En el paso 2, la transacción de actualización falla
- Las claves antiguas permanecen activas y el Holder puede reintentar

### FA-2: Fallo en el recifrado de credenciales
- En el paso 4, algunas credenciales no pueden recifrarse (storage inaccesible, datos corruptos)
- La clave antigua NO se descarta hasta que todas las credenciales sean migradas
- El Holder es informado de qué credenciales no pudieron migrarse

### FA-3: Clave comprometida (rotación de emergencia)
- El Holder sospecha que su clave ha sido comprometida
- Los pasos 1-3 se realizan inmediatamente (actualización de clave en blockchain)
- El paso 4 (recifrado) se realiza lo antes posible
- La clave antigua se revoca inmediatamente en la blockchain

## Postcondiciones

- El DID del Holder permanece igual
- El DID Document refleja la(s) nueva(s) clave(s) pública(s)
- Todas las credenciales están recifradas con la nueva clave
- Las futuras verificaciones usarán la nueva clave pública
- La clave privada anterior ha sido descartada de forma segura

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** | Generación de nueva clave, firma de transacción, recifrado de credenciales, eliminación de clave antigua |
| **blockchain** | Actualización del DID Document, gestión de estado de claves |
| **storage** | Recifrado de credenciales (descifrar con clave antigua, cifrar con nueva) |

## Notas Técnicas

- **Persistencia del DID**: El DID no cambia durante la rotación de claves — solo las claves en el DID Document se actualizan
- **Período de transición**: Durante la migración, ambas claves pueden coexistir en el DID Document para evitar interrupción del servicio
- **Recifrado**: Todas las credenciales deben descifrarse con la clave antigua y recifrarse con la nueva — esta es una operación potencialmente lenta dependiendo del número de credenciales
- **Seguridad**: La clave privada antigua debe eliminarse de forma segura del dispositivo tras la migración exitosa
- **Estándares**: W3C DID Core v1.0 (rotación de claves), NIST SP 800-63-3 (gestión de claves)
