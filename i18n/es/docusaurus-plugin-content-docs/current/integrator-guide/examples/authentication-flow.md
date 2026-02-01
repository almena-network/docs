---
sidebar_position: 1
---

# Flujo Completo de Autenticación

## ⚠️ Próximamente

**Esta funcionalidad aún no está implementada.** Esta documentación muestra cómo funcionará la autenticación cuando la funcionalidad esté disponible.

---

Un ejemplo listo para producción de autenticación basada en DID (implementación planificada).

## Resumen

Este ejemplo muestra una implementación completa de autenticación basada en DID con:
- Generación y almacenamiento de challenges
- Verificación de firmas (placeholder)
- Gestión de sesiones
- Manejo de errores

## Implementación del Backend

### Dependencias

```bash
npm install express redis crypto
```

### Servidor Completo

```javascript
const express = require('express');
const crypto = require('crypto');
const redis = require('redis').createClient();

const app = express();
app.use(express.json());

// Middleware para verificar formato DID
function validateDID(req, res, next) {
  const { did } = req.body;
  if (!/^did:almena:[a-f0-9]{32}$/.test(did)) {
    return res.status(400).json({ error: 'Formato DID inválido' });
  }
  next();
}

// Paso 1: Solicitar challenge de autenticación
app.post('/auth/challenge', validateDID, async (req, res) => {
  try {
    const { did } = req.body;
    
    // Generar challenge aleatorio
    const challenge = crypto.randomBytes(32).toString('hex');
    
    // Almacenar challenge con expiración de 5 minutos
    await redis.set(
      `challenge:${did}`,
      challenge,
      'EX',
      300
    );
    
    res.json({
      challenge,
      expiresIn: 300,
      message: 'Firma este challenge con tu billetera Almena ID'
    });
  } catch (error) {
    console.error('Error de generación de challenge:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Paso 2: Verificar firma y crear sesión
app.post('/auth/verify', validateDID, async (req, res) => {
  try {
    const { did, challenge, signature } = req.body;
    
    // Validar campos requeridos
    if (!challenge || !signature) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos' 
      });
    }
    
    // Verificar que el challenge existe y coincide
    const storedChallenge = await redis.get(`challenge:${did}`);
    if (!storedChallenge) {
      return res.status(400).json({ 
        error: 'Challenge no encontrado o expirado' 
      });
    }
    
    if (storedChallenge !== challenge) {
      return res.status(400).json({ 
        error: 'Challenge no coincide' 
      });
    }
    
    // TODO: Verificar firma con API de Almena
    // Por ahora, simularemos la verificación
    const isValid = await verifySignature(did, challenge, signature);
    
    if (!isValid) {
      // Limpiar challenge fallido
      await redis.del(`challenge:${did}`);
      return res.status(401).json({ 
        error: 'Firma inválida' 
      });
    }
    
    // Limpiar challenge usado
    await redis.del(`challenge:${did}`);
    
    // Crear sesión
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      did,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    };
    
    await redis.set(
      `session:${sessionToken}`,
      JSON.stringify(sessionData),
      'EX',
      86400 // 24 horas
    );
    
    res.json({
      success: true,
      sessionToken,
      did,
      expiresIn: 86400
    });
  } catch (error) {
    console.error('Error de verificación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Middleware para requerir autenticación
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No se proporcionó token' });
    }
    
    const token = authHeader.substring(7);
    const sessionData = await redis.get(`session:${token}`);
    
    if (!sessionData) {
      return res.status(401).json({ 
        error: 'Sesión inválida o expirada' 
      });
    }
    
    req.user = JSON.parse(sessionData);
    
    // Verificar si la sesión expiró
    if (req.user.expiresAt < Date.now()) {
      await redis.del(`session:${token}`);
      return res.status(401).json({ error: 'Sesión expirada' });
    }
    
    next();
  } catch (error) {
    console.error('Error de middleware de autenticación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Ruta protegida de ejemplo
app.get('/api/profile', requireAuth, async (req, res) => {
  res.json({
    did: req.user.did,
    createdAt: req.user.createdAt
  });
});

// Endpoint de cierre de sesión
app.post('/auth/logout', requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization.substring(7);
    await redis.del(`session:${token}`);
    
    res.json({ success: true, message: 'Cierre de sesión exitoso' });
  } catch (error) {
    console.error('Error de cierre de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Placeholder para verificación de firma
// Esto usará la API de Almena cuando esté disponible
async function verifySignature(did, challenge, signature) {
  // TODO: Llamar a la API de Almena ID para verificar firma
  // const response = await fetch('https://api.almena.id/verify-signature', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ did, challenge, signature })
  // });
  // return response.ok;
  
  // Por ahora, simular verificación
  console.log('Simulando verificación de firma para DID:', did);
  return true; // En producción, esto debe verificar la firma real
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
```

## Implementación del Frontend

```javascript
class AlmenaAuth {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }
  
  // Solicitar challenge de autenticación
  async requestChallenge(did) {
    const response = await fetch(`${this.apiUrl}/auth/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al solicitar challenge');
    }
    
    return await response.json();
  }
  
  // Verificar firma y obtener token de sesión
  async verifySignature(did, challenge, signature) {
    const response = await fetch(`${this.apiUrl}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ did, challenge, signature })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Verificación falló');
    }
    
    return await response.json();
  }
  
  // Hacer solicitud autenticada
  async authenticatedRequest(endpoint, token, options = {}) {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sesión expirada');
      }
      throw new Error('Solicitud falló');
    }
    
    return await response.json();
  }
  
  // Cerrar sesión
  async logout(token) {
    const response = await fetch(`${this.apiUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  }
}

// Ejemplo de uso
async function loginWithAlmenaID() {
  const auth = new AlmenaAuth('http://localhost:3000');
  
  try {
    // 1. Obtener DID del usuario
    const did = document.getElementById('did-input').value;
    
    // 2. Solicitar challenge
    const { challenge } = await auth.requestChallenge(did);
    
    // 3. Solicitar al usuario que firme el challenge en su billetera
    // Esto interactuaría con la billetera Almena ID
    const signature = await requestWalletSignature(challenge);
    
    // 4. Verificar firma
    const { sessionToken } = await auth.verifySignature(
      did,
      challenge,
      signature
    );
    
    // 5. Almacenar token de sesión
    localStorage.setItem('sessionToken', sessionToken);
    localStorage.setItem('did', did);
    
    // 6. Redirigir al dashboard
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
    alert('Inicio de sesión falló: ' + error.message);
  }
}
```

## Pruebas

### Probar con cURL

```bash
# 1. Solicitar challenge
curl -X POST http://localhost:3000/auth/challenge \
  -H "Content-Type: application/json" \
  -d '{"did":"did:almena:a1b2c3d4e5f6789012345678901234"}'

# 2. Verificar firma (usando challenge del paso 1)
curl -X POST http://localhost:3000/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "did":"did:almena:a1b2c3d4e5f6789012345678901234",
    "challenge":"<challenge-del-paso-1>",
    "signature":"<firma-del-usuario>"
  }'

# 3. Acceder a ruta protegida (usando token del paso 2)
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer <token-de-sesión>"

# 4. Cerrar sesión
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <token-de-sesión>"
```

## Próximos Pasos

- [Patrón de Autenticación →](../integration-patterns/authentication.md)
- [Mejores Prácticas de Seguridad →](../best-practices/security.md)
- [Manejo de Errores →](../best-practices/error-handling.md)

Más ejemplos próximamente.
