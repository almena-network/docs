---
sidebar_position: 1
---

# Mejores Prácticas de Seguridad

Guías esenciales de seguridad para integrar Almena ID.

## Gestión de Claves de API

### ✅ Hacer

- Almacenar claves de API en variables de entorno
- Rotar claves regularmente (cada 90 días recomendado)
- Usar claves diferentes para diferentes entornos (dev, staging, producción)
- Restringir permisos de claves de API al mínimo requerido

### ❌ No Hacer

- Confirmar claves de API en control de versiones
- Compartir claves de API en logs o mensajes de error
- Usar claves de producción en desarrollo
- Codificar claves en el código fuente

## Seguridad Challenge-Response

Al implementar autenticación:

### Generar Challenges Seguros

```javascript
// ✅ Bueno: Aleatorio criptográficamente
const challenge = crypto.randomBytes(32).toString('hex');

// ❌ Malo: Predecible
const challenge = Date.now().toString();
```

### Establecer Timeouts Apropiados

```javascript
// ✅ Bueno: Expiración de 5 minutos
await redis.set(`challenge:${did}`, challenge, 'EX', 300);

// ❌ Malo: Sin expiración
await redis.set(`challenge:${did}`, challenge);
```

### Usar Solo Una Vez

```javascript
// ✅ Bueno: Eliminar después de verificación
await redis.del(`challenge:${did}`);

// ❌ Malo: Permitir reutilización
// El challenge permanece en almacenamiento
```

## Verificación de Firmas

Siempre verificar firmas antes de confiar:

```javascript
// ❌ Malo: Confiar sin verificación
const { did } = req.body;
createSession(did);

// ✅ Bueno: Verificar firma
const { did, challenge, signature } = req.body;
const isValid = await verifySignature(did, challenge, signature);
if (isValid) {
  createSession(did);
}
```

## Gestión de Sesiones

### Tokens de Sesión

```javascript
// ✅ Bueno: Tokens aleatorios y únicos
const sessionToken = crypto.randomBytes(32).toString('hex');

// ❌ Malo: Tokens predecibles
const sessionToken = userId + Date.now();
```

### Almacenamiento de Sesión

```javascript
// ✅ Bueno: Almacenamiento del lado del servidor con expiración
await redis.set(`session:${token}`, userData, 'EX', 86400);

// ❌ Malo: Solo del lado del cliente
localStorage.setItem('session', JSON.stringify(userData));
```

## Validación de Datos

### Validar Todas las Entradas

```javascript
// ✅ Bueno: Validar formato DID
if (!/^did:almena:[a-f0-9]{32}$/.test(did)) {
  return res.status(400).json({ error: 'DID inválido' });
}

// ❌ Malo: Sin validación
const user = await db.users.findOne({ did: req.body.did });
```

## Solo HTTPS

### Forzar HTTPS

```javascript
// ✅ Bueno: Redirigir HTTP a HTTPS
app.use((req, res, next) => {
  if (req.protocol !== 'https') {
    return res.redirect('https://' + req.hostname + req.url);
  }
  next();
});
```

## Limitación de Tasa

Implementar limitación de tasa para prevenir abuso:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limitar cada IP a 100 solicitudes por windowMs
});

app.use('/api/', limiter);
```

## Registro

### Qué Registrar

✅ Registrar:
- Intentos de autenticación (éxito/fallo)
- Solicitudes a API (sin datos sensibles)
- Mensajes de error
- Violaciones de límite de tasa

❌ Nunca registrar:
- Claves de API
- Tokens de sesión
- Contraseñas de usuario
- Cadenas de challenge
- Firmas

## Próximos Pasos

- [Manejo de Errores →](./error-handling.md)
- [Rendimiento →](./performance.md)
- [Patrón de Autenticación →](../integration-patterns/authentication.md)

Más documentación de mejores prácticas próximamente.
