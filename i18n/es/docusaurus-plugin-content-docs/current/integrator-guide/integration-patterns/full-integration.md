---
sidebar_position: 3
---

# Guía de Integración Completa

## ⚠️ Próximamente

**La mayoría de las funcionalidades de integración aún no están implementadas.** Esta documentación describe el enfoque de integración planificado.

---

Guía completa para integrar todas las funcionalidades de Almena ID (planificado).

## Resumen

Esta guía recorre una integración completa que incluye:
- Autenticación de usuarios con DIDs
- Emisión y verificación de credenciales
- Gestión de identidad
- Implementación de mejores prácticas

## Fases de Integración

### Fase 1: Autenticación Básica (Disponible Ahora)

Implementar autenticación basada en DID:

1. **Autenticación Challenge-Response**
   - [Patrón de Autenticación →](./authentication.md)
   - [Ejemplo Completo →](../examples/authentication-flow.md)

2. **Gestión de Sesiones**
   - Almacenar sesiones de forma segura
   - Manejar actualización de tokens
   - Implementar cierre de sesión

3. **Manejo de Errores**
   - [Mejores Prácticas de Manejo de Errores →](../best-practices/error-handling.md)

### Fase 2: Verificación de Identidad (Próximamente)

Agregar verificación de identidad:

1. **Resolución DID**
   - Resolver DIDs a claves públicas
   - Verificar propiedad de DID
   - Validar firmas

2. **Perfiles de Usuario**
   - Vincular DIDs a cuentas de usuario
   - Gestionar múltiples DIDs por usuario
   - Manejar recuperación de DID

### Fase 3: Credenciales (Próximamente)

Implementar emisión y verificación de credenciales:

1. **Emitir Credenciales**
   - [Patrones de Credenciales →](./credentials.md)
   - Definir esquemas de credenciales
   - Firmar y emitir credenciales

2. **Verificar Credenciales**
   - Verificar validez de credenciales
   - Verificar firmas del emisor
   - Verificar estado de revocación

### Fase 4: Funcionalidades Avanzadas (Planificado)

Agregar funcionalidad avanzada:

1. **Pruebas de Conocimiento Cero**
   - Divulgación selectiva
   - Verificación que preserva la privacidad
   - Pruebas de atributos

2. **Flujos de Trabajo Multi-Parte**
   - Delegación de credenciales
   - Credenciales co-firmadas
   - Cadenas de verificación

## Ejemplos de Arquitectura

### Integración Simple

Para autenticación básica solamente:

```
┌─────────────┐
│ Tu Aplicación│
│             │
│  ┌───────┐  │
│  │Gestor │  │
│  │Sesión │  │
│  └───┬───┘  │
└──────┼──────┘
       │
       ▼
┌──────────────┐      ┌─────────────┐
│  API Almena  │◄────►│ Almena ID   │
│              │      │  Billetera  │
│ • Challenge  │      │  (Navegador)│
│ • Verificar  │      └─────────────┘
└──────────────┘
```

### Integración Completa

Con todas las funcionalidades:

```
┌─────────────────────────────────────┐
│      Tu Aplicación                  │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │  Módulo  │  │ Módulo   │        │
│  │   Auth   │  │Credencial│        │
│  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼──────────────┘
        │             │
        ▼             ▼
┌────────────────────────────────┐
│       API Almena ID            │
│                                │
│  • Autenticación               │
│  • Resolución DID              │
│  • Emisión de Credenciales     │
│  • Verificación de Credenciales│
│  • Registro de Revocación      │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────┐
│  Billetera Almena  │
│                    │
│  • DID del Usuario │
│  • Claves Privadas │
│  • Credenciales    │
└────────────────────┘
```

## Lista de Verificación de Implementación

### Fase de Configuración

- [ ] Registrarse para acceso a API (cuando esté disponible)
- [ ] Configurar entorno de desarrollo
- [ ] Revisar documentación
- [ ] Probar conectividad de API
- [ ] Instalar SDKs (cuando esté disponible)

### Fase de Autenticación

- [ ] Implementar generación de challenge
- [ ] Configurar almacenamiento de challenge (Redis/base de datos)
- [ ] Implementar verificación de firmas
- [ ] Crear gestión de sesiones
- [ ] Agregar middleware de autenticación
- [ ] Probar flujo de autenticación
- [ ] Implementar cierre de sesión
- [ ] Agregar manejo de errores

### Fase de Seguridad

- [ ] Implementar HTTPS
- [ ] Configurar limitación de tasa
- [ ] Agregar validación de entrada
- [ ] Asegurar credenciales de API
- [ ] Implementar CORS correctamente
- [ ] Agregar encabezados de seguridad
- [ ] Revisar mejores prácticas de seguridad
- [ ] Realizar auditoría de seguridad

### Fase de Credenciales (Cuando Esté Disponible)

- [ ] Definir esquemas de credenciales
- [ ] Implementar flujo de emisión
- [ ] Agregar lógica de verificación
- [ ] Configurar verificación de revocación
- [ ] Probar ciclo de vida de credenciales
- [ ] Manejar credenciales expiradas
- [ ] Implementar divulgación selectiva

### Fase de Producción

- [ ] Pruebas de carga
- [ ] Optimización de rendimiento
- [ ] Configuración de monitoreo
- [ ] Seguimiento de errores
- [ ] Estrategia de respaldo
- [ ] Documentación para el equipo
- [ ] Proceso de soporte al usuario

## Organización del Código

### Estructura Recomendada

```
tu-app/
├── src/
│   ├── auth/
│   │   ├── almena.ts          # Integración Almena
│   │   ├── session.ts         # Gestión de sesiones
│   │   ├── middleware.ts      # Middleware de autenticación
│   │   └── utils.ts           # Funciones auxiliares
│   │
│   ├── credentials/           # Cuando esté disponible
│   │   ├── issue.ts
│   │   ├── verify.ts
│   │   └── revoke.ts
│   │
│   ├── models/
│   │   └── user.ts            # Modelo de usuario con DID
│   │
│   └── config/
│       └── almena.ts          # Configuración de API
│
├── tests/
│   ├── auth.test.ts
│   └── credentials.test.ts
│
└── docs/
    └── integration.md
```

### Gestión de Configuración

```typescript
// config/almena.ts
export const almenaConfig = {
  apiUrl: process.env.ALMENA_API_URL || 'https://api.almena.id',
  apiKey: process.env.ALMENA_API_KEY, // Cuando sea requerido
  challengeTTL: 300, // 5 minutos
  sessionTTL: 86400, // 24 horas
  environment: process.env.NODE_ENV || 'development'
};
```

## Ejemplo: Integración Completa

### Configuración del Backend

```typescript
// auth/almena.ts
import crypto from 'crypto';
import Redis from 'redis';

const redis = Redis.createClient();

export class AlmenaAuth {
  // Generar challenge de autenticación
  async generateChallenge(did: string): Promise<string> {
    const challenge = crypto.randomBytes(32).toString('hex');
    await redis.set(
      `challenge:${did}`,
      challenge,
      'EX',
      300 // 5 minutos
    );
    return challenge;
  }
  
  // Verificar firma (placeholder para verificación real)
  async verifySignature(
    did: string,
    challenge: string,
    signature: string
  ): Promise<boolean> {
    // Obtener challenge almacenado
    const storedChallenge = await redis.get(`challenge:${did}`);
    if (!storedChallenge || storedChallenge !== challenge) {
      return false;
    }
    
    // TODO: Verificar firma con API de Almena
    // const response = await fetch('https://api.almena.id/verify', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ did, challenge, signature })
    // });
    
    // Limpiar challenge
    await redis.del(`challenge:${did}`);
    
    return true; // Placeholder
  }
  
  // Crear sesión
  async createSession(did: string): Promise<string> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionData = {
      did,
      createdAt: Date.now()
    };
    
    await redis.set(
      `session:${sessionToken}`,
      JSON.stringify(sessionData),
      'EX',
      86400 // 24 horas
    );
    
    return sessionToken;
  }
  
  // Validar sesión
  async validateSession(token: string): Promise<string | null> {
    const sessionData = await redis.get(`session:${token}`);
    if (!sessionData) return null;
    
    const { did } = JSON.parse(sessionData);
    return did;
  }
  
  // Cerrar sesión
  async destroySession(token: string): Promise<void> {
    await redis.del(`session:${token}`);
  }
}
```

### Middleware de Express

```typescript
// auth/middleware.ts
import { AlmenaAuth } from './almena';

const almenaAuth = new AlmenaAuth();

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Se requiere autenticación' });
  }
  
  const token = authHeader.substring(7);
  const did = await almenaAuth.validateSession(token);
  
  if (!did) {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
  
  req.user = { did };
  next();
}
```

### Rutas de API

```typescript
// routes/auth.ts
import express from 'express';
import { AlmenaAuth } from '../auth/almena';
import { requireAuth } from '../auth/middleware';

const router = express.Router();
const almenaAuth = new AlmenaAuth();

// Solicitar challenge
router.post('/challenge', async (req, res) => {
  const { did } = req.body;
  const challenge = await almenaAuth.generateChallenge(did);
  res.json({ challenge });
});

// Verificar e iniciar sesión
router.post('/verify', async (req, res) => {
  const { did, challenge, signature } = req.body;
  
  const isValid = await almenaAuth.verifySignature(did, challenge, signature);
  if (!isValid) {
    return res.status(401).json({ error: 'Firma inválida' });
  }
  
  const sessionToken = await almenaAuth.createSession(did);
  res.json({ sessionToken, did });
});

// Ruta protegida de ejemplo
router.get('/profile', requireAuth, (req, res) => {
  res.json({ did: req.user.did });
});

// Cerrar sesión
router.post('/logout', requireAuth, async (req, res) => {
  const token = req.headers.authorization.substring(7);
  await almenaAuth.destroySession(token);
  res.json({ success: true });
});

export default router;
```

## Estrategia de Pruebas

### Pruebas Unitarias

```typescript
describe('AlmenaAuth', () => {
  it('debe generar challenges únicos', async () => {
    const challenge1 = await almenaAuth.generateChallenge('did:almena:test1');
    const challenge2 = await almenaAuth.generateChallenge('did:almena:test2');
    expect(challenge1).not.toBe(challenge2);
  });
  
  it('debe validar firmas correctas', async () => {
    const did = 'did:almena:test';
    const challenge = await almenaAuth.generateChallenge(did);
    const signature = 'firma-válida'; // Mock
    
    const isValid = await almenaAuth.verifySignature(did, challenge, signature);
    expect(isValid).toBe(true);
  });
});
```

### Pruebas de Integración

```typescript
describe('Flujo de Autenticación', () => {
  it('debe completar autenticación completa', async () => {
    // Solicitar challenge
    const challengeRes = await request(app)
      .post('/auth/challenge')
      .send({ did: 'did:almena:test' });
    
    const { challenge } = challengeRes.body;
    
    // Verificar y obtener sesión
    const verifyRes = await request(app)
      .post('/auth/verify')
      .send({
        did: 'did:almena:test',
        challenge,
        signature: 'firma-mock'
      });
    
    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toHaveProperty('sessionToken');
  });
});
```

## Despliegue

### Variables de Entorno

```bash
# .env.production
ALMENA_API_URL=https://api.almena.id
ALMENA_API_KEY=tu-clave-api
REDIS_URL=redis://localhost:6379
NODE_ENV=production
```

### Despliegue con Docker

```dockerfile
FROM node:24.13-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Monitoreo

### Métricas Clave

Monitorear estas métricas:
- Tasa de éxito/fallo de autenticación
- Latencia de generación de challenge
- Latencia de verificación de firma
- Tiempo de creación/validación de sesión
- Tasas de error de API

### Ejemplo de Monitoreo

```typescript
// metrics.ts
import prometheus from 'prom-client';

export const metrics = {
  authAttempts: new prometheus.Counter({
    name: 'almena_auth_attempts_total',
    help: 'Total de intentos de autenticación',
    labelNames: ['status']
  }),
  
  authDuration: new prometheus.Histogram({
    name: 'almena_auth_duration_seconds',
    help: 'Duración de autenticación',
    buckets: [0.1, 0.5, 1, 2, 5]
  })
};
```

## Próximos Pasos

### Inmediato (Fase 1)
1. [Implementar Autenticación →](./authentication.md)
2. [Revisar Seguridad →](../best-practices/security.md)
3. [Manejar Errores →](../best-practices/error-handling.md)

### Futuro (Fase 2-4)
1. [Planificar Credenciales →](./credentials.md)
2. [Optimizar Rendimiento →](../best-practices/performance.md)

## Soporte

¿Necesitas ayuda con la integración?
- Email: integrations@almena.id
- [Preguntas Frecuentes del Integrador →](../../faq-integrator/api.md)
- [Referencia de API →](../../api-reference/endpoints/health.md)

## Comunidad

Comparte tu integración:
- Muestra tu aplicación (próximamente)
- Comparte mejores prácticas
- Ayuda a otros integradores

---

**Nota**: Esta guía se actualiza continuamente. Vuelve a consultar para nuevas funcionalidades y patrones.
