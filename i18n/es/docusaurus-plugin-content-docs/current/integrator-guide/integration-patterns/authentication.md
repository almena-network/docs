---
sidebar_position: 1
---

# Patrón de Autenticación

## ⚠️ Próximamente

**La autenticación basada en DID aún no está implementada.** Esta documentación describe el patrón de autenticación planificado.

---

Aprende cómo implementar autenticación basada en DID en tu aplicación (planificado).

## Resumen

Reemplaza la autenticación tradicional de usuario/contraseña con autenticación de identidad descentralizada usando DIDs (cuando esté disponible).

## Beneficios

- **Sin almacenamiento de contraseñas**: No hay contraseñas que gestionar o filtrar
- **Prueba criptográfica**: Los usuarios demuestran la propiedad de su DID
- **Control del usuario**: Los usuarios poseen su identidad, no tu servicio
- **Privacidad**: No se requiere email ni información personal

## Cómo Funciona

```
1. El usuario proporciona su DID
2. Tu aplicación genera un challenge
3. El usuario firma el challenge con su clave privada (en su billetera)
4. Tu aplicación verifica la firma con la clave pública
5. Autenticación exitosa
```

## Pasos de Implementación

### Paso 1: Solicitar DID del Usuario

**Interfaz de Usuario**:
```html
<form>
  <label for="did">Ingresa tu DID:</label>
  <input 
    type="text" 
    id="did" 
    placeholder="did:almena:abc123..."
    pattern="^did:almena:[a-f0-9]{32}$"
  />
  <button type="submit">Iniciar Sesión</button>
</form>
```

**Validación**:
```javascript
function isValidDID(did) {
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  return pattern.test(did);
}
```

### Paso 2: Generar Challenge

Crear un challenge único y aleatorio:

```javascript
// Node.js
const crypto = require('crypto');

function generateChallenge() {
  return crypto.randomBytes(32).toString('hex');
}

// Navegador
function generateChallenge() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
}
```

**Almacenar Challenge**:
```javascript
// Almacenar con expiración (5 minutos)
await redis.set(
  `challenge:${did}`, 
  challenge,
  'EX',
  300
);
```

### Paso 3: Solicitar Firma del Usuario

**Respuesta al Usuario**:
```javascript
app.post('/auth/challenge', async (req, res) => {
  const { did } = req.body;
  
  if (!isValidDID(did)) {
    return res.status(400).json({ error: 'Formato DID inválido' });
  }
  
  const challenge = generateChallenge();
  await storeChallenge(did, challenge);
  
  res.json({
    challenge,
    message: 'Firma este challenge con tu billetera Almena ID'
  });
});
```

**Usuario Firma en Billetera**:
El usuario abre su billetera Almena ID y firma el challenge. Esto ocurre del lado del cliente en la aplicación de la billetera.

### Paso 4: Verificar Firma

Cuando el usuario regresa con la firma:

```javascript
app.post('/auth/verify', async (req, res) => {
  const { did, challenge, signature } = req.body;
  
  // Verificar que el challenge fue emitido y no expiró
  const storedChallenge = await redis.get(`challenge:${did}`);
  if (storedChallenge !== challenge) {
    return res.status(400).json({ error: 'Challenge inválido o expirado' });
  }
  
  // Verificar firma (endpoint de API por implementar)
  const isValid = await verifySignature(did, challenge, signature);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Firma inválida' });
  }
  
  // Limpiar challenge
  await redis.del(`challenge:${did}`);
  
  // Crear sesión
  const sessionToken = await createSession(did);
  
  res.json({
    success: true,
    sessionToken,
    did
  });
});
```

### Paso 5: Mantener Sesión

**Crear Sesión**:
```javascript
async function createSession(did) {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  await redis.set(
    `session:${sessionToken}`,
    JSON.stringify({
      did,
      createdAt: Date.now()
    }),
    'EX',
    86400 // 24 horas
  );
  
  return sessionToken;
}
```

**Verificar Sesión**:
```javascript
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No se proporcionó token' });
  }
  
  const session = await redis.get(`session:${token}`);
  if (!session) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
  
  req.user = JSON.parse(session);
  next();
}
```

## Ejemplo Completo

### Backend (Express.js)

```javascript
const express = require('express');
const crypto = require('crypto');
const redis = require('redis').createClient();

const app = express();
app.use(express.json());

// Paso 1: Solicitar challenge
app.post('/auth/challenge', async (req, res) => {
  const { did } = req.body;
  
  if (!/^did:almena:[a-f0-9]{32}$/.test(did)) {
    return res.status(400).json({ error: 'DID inválido' });
  }
  
  const challenge = crypto.randomBytes(32).toString('hex');
  await redis.set(`challenge:${did}`, challenge, 'EX', 300);
  
  res.json({ challenge });
});

// Paso 2: Verificar firma
app.post('/auth/verify', async (req, res) => {
  const { did, challenge, signature } = req.body;
  
  const storedChallenge = await redis.get(`challenge:${did}`);
  if (storedChallenge !== challenge) {
    return res.status(400).json({ error: 'Challenge inválido' });
  }
  
  // TODO: Llamar a API de Almena para verificar firma
  const isValid = await almenaAPI.verifySignature(did, challenge, signature);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Firma inválida' });
  }
  
  await redis.del(`challenge:${did}`);
  
  const sessionToken = crypto.randomBytes(32).toString('hex');
  await redis.set(
    `session:${sessionToken}`,
    JSON.stringify({ did, createdAt: Date.now() }),
    'EX',
    86400
  );
  
  res.json({ sessionToken, did });
});

// Ruta protegida
app.get('/api/protected', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = await redis.get(`session:${token}`);
  
  if (!session) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  const user = JSON.parse(session);
  res.json({ message: 'Éxito', user });
});
```

### Frontend

```javascript
// Solicitar challenge
async function login(did) {
  // Obtener challenge
  const challengeResp = await fetch('/auth/challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ did })
  });
  const { challenge } = await challengeResp.json();
  
  // Solicitar al usuario que firme en la billetera (esto interactuaría con la app de billetera)
  const signature = await requestWalletSignature(challenge);
  
  // Verificar firma
  const verifyResp = await fetch('/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ did, challenge, signature })
  });
  const { sessionToken } = await verifyResp.json();
  
  // Almacenar token
  localStorage.setItem('sessionToken', sessionToken);
  
  return sessionToken;
}
```

## Consideraciones de Seguridad

### Requisitos del Challenge

✅ **Hacer**:
- Generar challenges aleatorios criptográficamente
- Hacer challenges únicos
- Establecer expiración (5 minutos recomendado)
- Usar challenge solo una vez
- Limpiar challenge después de verificación

❌ **No hacer**:
- Reutilizar challenges
- Usar challenges predecibles
- Permitir tiempo ilimitado
- Omitir verificación

### Gestión de Sesiones

✅ **Hacer**:
- Usar tokens de sesión seguros y aleatorios
- Establecer expiración razonable (24 horas)
- Almacenar sesiones de forma segura (Redis, base de datos)
- Implementar funcionalidad de cierre de sesión
- Usar solo HTTPS

❌ **No hacer**:
- Almacenar sesiones solo del lado del cliente
- Usar IDs de sesión predecibles
- Permitir reutilización de sesión después de cierre de sesión
- Enviar tokens en URLs

## Mejoras Futuras

Cuando la API de verificación de firmas esté disponible:
- Implementar verificación real de firmas
- Soporte para múltiples algoritmos de firma
- Agregar soporte para rotación de DID
- Implementar tokens de actualización

## Relacionado

- [Entender DIDs →](../../getting-started-integrator/understanding-dids.md)
- [Mejores Prácticas de Seguridad →](../best-practices/security.md)
- [Ejemplos de Código →](../examples/authentication-flow.md)
