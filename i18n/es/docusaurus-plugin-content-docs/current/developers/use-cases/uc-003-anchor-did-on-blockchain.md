---
title: "UC-003: Anclar DID en Blockchain"
sidebar_label: "UC-003: Anclar DID en Blockchain"
sidebar_position: 3
---

# UC-003: Anclar DID en Blockchain

## Descripción

El usuario ancla su DID en la blockchain de Almena. Esto registra el DID Document (compatible con W3C DID Core) on-chain mediante una transacción `MsgAnchorDID`, haciendo la identidad públicamente verificable. Este paso es opcional — el DID es utilizable sin anclaje — y solo se ofrece tras la creación de identidad (no tras la recuperación).

## Actores

- **Usuario Final**: Persona que elige anclar su DID
- **Wallet (Frontend)**: Aplicación Svelte que orquesta el flujo de anclaje
- **Wallet (Rust Backend)**: Comandos Tauri que construyen el DID Document, firman la transacción y gestionan el acceso al keychain
- **Blockchain de Almena**: Cadena Cosmos SDK que recibe y procesa la transacción `MsgAnchorDID`
- **Backend API** (opcional): Backend de la plataforma que registra el evento de anclaje para indexación

## Precondiciones

- El usuario acaba de completar la creación de identidad ([UC-001](./uc-001-create-identity.md)) y está en la pantalla de éxito
- El DID existe localmente con `anchorStatus: 'not_anchored'`
- Las claves privadas Ed25519 y secp256k1 están almacenadas en el keychain del sistema
- El nodo blockchain es accesible en la URL de API configurada (por defecto: `http://localhost:1317`)

## Flujo Principal

1. El usuario está en la pantalla de éxito de creación (`/create/success`) y ve el botón **Anclar DID** con una descripción de qué significa el anclaje
2. El usuario hace clic en **Anclar DID**
3. La UI transiciona al estado `anchoring` (spinner de carga, texto "Anclando...")
4. La wallet obtiene la dirección Almena a partir de la clave secp256k1:
   - Llama a `getAlmenaAddress(did)` que invoca el comando Rust para obtener la clave pública secp256k1 del keychain
   - Deriva la dirección Bech32: comprime pubkey (33 bytes) → SHA256 → RIPEMD160 → Bech32 con prefijo `almena`
5. La wallet consulta la información de la cuenta en blockchain:
   - GET `/cosmos/auth/v1beta1/accounts/{address}`
   - Obtiene número de cuenta y secuencia (ambos 0 para cuentas nuevas)
6. La wallet invoca el comando Rust `prepare_anchor_did_tx` con:
   - Clave privada secp256k1 (del keychain)
   - DID y clave pública Ed25519
   - Número de cuenta, secuencia, chain ID (`almenachain`)
   - Configuración de fee: `0 stake`, límite de gas `200000`
7. El Rust backend:
   - Construye un DID Document compatible con W3C DID Core:
     - Método de verificación con clave pública Ed25519 en formato multibase (z + base58)
     - Referencias de autenticación, aserción, invocación de capacidad y delegación de capacidad
   - Crea el mensaje protobuf `MsgAnchorDID` (dirección del creador, DID, JSON del DID Document)
   - Firma la transacción con la clave privada secp256k1
   - Devuelve los bytes `TxRaw` codificados en base64
8. La wallet transmite la transacción:
   - POST `/cosmos/tx/v1beta1/txs` con los bytes de la transacción firmada (modo de broadcast: `BROADCAST_MODE_SYNC`)
9. Si tiene éxito, la blockchain devuelve el hash de la transacción
10. La wallet actualiza la identidad en el Tauri Store:
    - `anchorStatus: 'anchored'`
    - `anchorTxHash: <hash_transaccion>`
    - `anchoredAt: <timestamp_ISO>`
11. La UI transiciona al estado `anchored` (checkmark verde, hash de transacción mostrado)
12. Best-effort: la wallet llama a `registerAnchorWithBackend(did, txHash)` para notificar al backend de la plataforma (POST `/api/v1/identities/anchor`) — esta llamada no bloquea y los fallos se ignoran silenciosamente
13. El usuario hace clic en **Continuar** para navegar al dashboard

## Flujos Alternativos

### FA-1: Nodo blockchain inaccesible
- En el paso 5, si la API de blockchain no es accesible, la operación falla
- La UI transiciona al estado `failed` con un mensaje de error
- Se muestra un botón **Reintentar**

### FA-2: Fallo en el broadcast de la transacción
- En el paso 8, si el broadcast devuelve un error (gas insuficiente, transacción inválida, etc.), la UI transiciona al estado `failed`
- Se muestra el mensaje de error y un botón **Reintentar**

### FA-3: El usuario omite el anclaje
- En el paso 2, en lugar de hacer clic en **Anclar DID**, el usuario hace clic en **Continuar**
- El DID permanece con `anchorStatus: 'not_anchored'`
- El usuario continúa al dashboard sin ninguna interacción con blockchain

### FA-4: Fallo en el registro con el backend
- En el paso 12, si la llamada a la API del backend falla, el fallo se ignora silenciosamente
- El estado de anclaje permanece como `anchored` ya que la transacción en blockchain tuvo éxito

## Postcondiciones

- El DID Document está registrado en la blockchain de Almena
- El Tauri Store refleja `anchorStatus: 'anchored'` con el hash de la transacción
- El DID es públicamente verificable a través de la blockchain
- El backend (si es accesible) ha sido notificado del evento de anclaje

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | Gestión de estado UI (not_anchored → anchoring → anchored/failed), llamadas API a blockchain |
| **wallet** (Rust backend) | Construcción del DID Document, construcción del protobuf `MsgAnchorDID`, firma de transacción secp256k1 |
| **blockchain** | Procesa y almacena la transacción `MsgAnchorDID`, registra el DID Document on-chain |
| **backend** | Recibe notificación de anclaje para indexación (best-effort, no bloqueante) |

## Notas Técnicas

- **Estructura del DID Document**: Compatible con W3C DID Core con Ed25519VerificationKey2020, clave pública codificada en multibase (z + base58)
- **Firma de transacción**: Firma secp256k1 sobre la estructura `SignDoc` de Cosmos SDK
- **Subsidio de fees**: El fee de transacción es `0 stake` — la blockchain subsidia el anclaje de identidad
- **Límite de gas**: Fijado en `200000` para transacciones de anclaje
- **Chain ID**: `almenachain`
- **Modo de broadcast**: `BROADCAST_MODE_SYNC` — espera a que la transacción sea aceptada en el mempool pero no a la confirmación del bloque
- **Idempotencia**: Si el usuario reintenta, se construye y transmite una nueva transacción; la blockchain gestiona el registro duplicado de DID mediante sus propias reglas de validación
- **Offline-first**: El anclaje es opcional; el DID funciona completamente sin estar on-chain. El anclaje añade verificabilidad pública
