---
sidebar_position: 2
---

# Comprendiendo los DIDs

Aprende sobre los Identificadores Descentralizados (DIDs) y cómo funcionan en Almena ID.

## ¿Qué es un DID?

Un **DID** (Identificador Descentralizado) es un identificador único que:
- Es **globalmente único**
- Es **criptográficamente verificable**
- Está **controlado por el usuario** (soberanía propia)
- **No requiere** una autoridad central

### Formato de DID

Los DIDs de Almena ID siguen este formato:

```
did:almena:{identificador}
```

**Ejemplo**:
```
did:almena:a1b2c3d4e5f6789...
```

**Componentes**:
- `did`: El esquema DID
- `almena`: El método DID (red de Almena ID)
- `{identificador}`: Identificador único (32 caracteres, derivado de la clave pública)

## Cómo se Generan los DIDs

Cuando un usuario crea una identidad:

1. **Generar Mnemónico**: 12 palabras aleatorias (BIP39)
2. **Derivar Claves**: Usar BIP32/BIP44 para derivar claves
3. **Hash de Clave Pública**: Hash SHA-256 de la clave pública
4. **Crear DID**: Tomar los primeros 32 caracteres y formatear como DID

```
Clave Pública → SHA-256 → Primeros 32 caracteres → did:almena:{hash}
```

## DIDs vs Identificadores Tradicionales

| Característica | Tradicional (Email/Usuario) | DID |
|----------------|----------------------------|-----|
| **Autoridad Central** | Requerida (proveedor de email, sitio web) | Ninguna |
| **Portabilidad** | Vinculado al proveedor | Totalmente portable |
| **Control del Usuario** | El proveedor controla | El usuario controla |
| **Verificación** | Basada en contraseña | Criptográfica |
| **Privacidad** | Vinculado a info personal | Pseudónimo |

## Conceptos Clave

### Clave Pública

Cada DID tiene una **clave pública** asociada:
- Usada para verificación
- Derivada de la misma semilla que el DID
- Segura para compartir públicamente

### Clave Privada

La **clave privada** correspondiente:
- Usada para firmar
- Prueba el control del DID
- Nunca se comparte
- Se almacena cifrada localmente

### Identidad Soberana

Los usuarios controlan sus propias identidades:
- No se necesita autoridad central
- No puede ser revocada por una empresa
- Funciona en cualquier servicio compatible
- El usuario posee su identidad permanentemente

## Usando DIDs en Tu Aplicación

### Como Identificador de Usuario

Usa DIDs en lugar de nombres de usuario:

```javascript
// Tradicional
const user = await db.users.findOne({ username: "john_doe" });

// Con DIDs
const user = await db.users.findOne({ did: "did:almena:a1b2c3..." });
```

### Para Autenticación

Verifica que los usuarios controlen su DID mediante firmas criptográficas:

```javascript
// El usuario afirma poseer un DID
const did = "did:almena:a1b2c3...";

// Solicitar firma de un desafío
const challenge = generateChallenge();
const signature = await requestUserSignature(did, challenge);

// Verificar firma con clave pública
const isValid = await verifySignature(did, challenge, signature);

if (isValid) {
  // Usuario probó controlar este DID
  authenticateUser(did);
}
```

## Propiedades de los DIDs

### Inmutable

Una vez creado, un DID nunca cambia:
- Mismo DID en todos los dispositivos
- Mismo DID incluso si cambia la contraseña
- La única forma de obtener un nuevo DID es crear una nueva identidad

### Pseudónimo

Los DIDs no contienen información personal:
- Sin nombre
- Sin email
- Sin información identificable
- Solo un identificador criptográfico

### Resoluble

Los DIDs pueden ser "resueltos" para obtener datos asociados:
- Clave pública
- Endpoints de servicio (futuro)
- Métodos de autenticación (futuro)

## Documentos DID (Futuro)

En versiones futuras, cada DID tendrá un Documento DID que contendrá:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:almena:a1b2c3...",
  "publicKey": [{
    "id": "did:almena:a1b2c3...#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:almena:a1b2c3...",
    "publicKeyHex": "0x1234..."
  }],
  "authentication": ["did:almena:a1b2c3...#keys-1"]
}
```

## Trabajando con DIDs

### Validando Formato de DID

Verifica si una cadena es un DID de Almena válido:

```javascript
function isValidAlmenaDID(did) {
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  return pattern.test(did);
}
```

### Almacenando DIDs

Almacena DIDs como cadenas en tu base de datos:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  did VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Mostrando DIDs

Los DIDs son largos. Considera mostrar versiones acortadas en la UI:

```javascript
function shortenDID(did) {
  // did:almena:a1b2c3d4... → did:almena:a1b2...d4e5
  const prefix = did.substring(0, 18); // "did:almena:a1b2..."
  const suffix = did.slice(-4);        // "...d4e5"
  return `${prefix}...${suffix}`;
}
```

## DIDs y Privacidad

### Resistencia a la Correlación

Usar el mismo DID en varios servicios permite correlación:
- El Servicio A conoce tu DID
- El Servicio B conoce tu DID
- Pueden correlacionar que es la misma persona

**Solución Futura**: Los usuarios podrían tener múltiples DIDs para diferentes contextos.

### Público por Diseño

Los DIDs están diseñados para ser identificadores públicos:
- Como nombres de usuario (pero criptográficamente verificables)
- No como contraseñas (que son secretas)
- Compartir tu DID es esperado y seguro

## Preguntas Comunes

### ¿Puedo cambiar mi DID?

No. Tu DID se deriva de tus claves criptográficas. Para obtener un nuevo DID, necesitarías crear una nueva identidad.

### ¿Es mi DID información personal?

No. Un DID en sí mismo no contiene información personal. Sin embargo, si lo asocias con datos personales (como tu nombre real), entonces ese vínculo se convierte en información personal.

### ¿Pueden dos personas tener el mismo DID?

Criptográficamente imposible. Las probabilidades de colisión son astronómicamente bajas (2^128 posibilidades).

### ¿Qué pasa si pierdo acceso a mi DID?

Si pierdes tu frase de recuperación y olvidas tu contraseña, pierdes acceso a ese DID permanentemente. Por eso las frases de recuperación son críticas.

## Próximos Pasos

- [Tutorial Completo →](../tutorials-integrator/getting-started.md)
- [Patrones de Autenticación →](../integrator-guide/integration-patterns/authentication.md)
- [Referencia de la API →](../api-reference/endpoints/health.md)
