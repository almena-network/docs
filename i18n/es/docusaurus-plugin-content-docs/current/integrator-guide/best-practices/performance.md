---
sidebar_position: 3
---

# Mejores Prácticas de Rendimiento

Optimiza tu integración con Almena ID para velocidad y eficiencia.

## Estrategias de Caché

### Caché de Resoluciones DID

```javascript
const didCache = new Map();
const CACHE_TTL = 3600000; // 1 hora

async function resolveDID(did) {
  // Verificar caché primero
  const cached = didCache.get(did);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  // Obtener de la API
  const data = await fetch(`https://api.almena.id/did/${did}`);
  const resolved = await data.json();
  
  // Almacenar resultado en caché
  didCache.set(did, {
    data: resolved,
    timestamp: Date.now()
  });
  
  return resolved;
}
```

### Caché de Challenges

```javascript
// Caché en memoria para challenges (lado del servidor)
const redis = require('redis').createClient();

async function cacheChallenge(did, challenge, ttl = 300) {
  await redis.set(
    `challenge:${did}`,
    challenge,
    'EX',
    ttl
  );
}

async function getChallengeFromCache(did) {
  return await redis.get(`challenge:${did}`);
}
```

## Agrupación de Conexiones

### HTTP/2 Keep-Alive

```javascript
const http2 = require('http2');

// Reutilizar conexiones
const client = http2.connect('https://api.almena.id');

async function makeRequest(path) {
  const req = client.request({
    ':path': path,
    ':method': 'GET'
  });
  
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(JSON.parse(data)));
    req.on('error', reject);
  });
}
```

## Solicitudes por Lotes

### Verificar Múltiples DIDs

```javascript
// En lugar de solicitudes individuales
async function verifyDIDsSequential(dids) {
  const results = [];
  for (const did of dids) {
    results.push(await verifyDID(did)); // ¡Lento!
  }
  return results;
}

// Usar Promise.all para solicitudes paralelas
async function verifyDIDsParallel(dids) {
  return await Promise.all(
    dids.map(did => verifyDID(did))
  );
}

// O usar endpoint de API por lotes (cuando esté disponible)
async function verifyDIDsBatch(dids) {
  const response = await fetch('https://api.almena.id/verify-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dids })
  });
  return await response.json();
}
```

## Optimización de Solicitudes

### Minimizar Tamaño de Payload

```javascript
// ❌ Malo: Enviar datos innecesarios
await fetch('/api/authenticate', {
  method: 'POST',
  body: JSON.stringify({
    did: 'did:almena:abc123...',
    challenge: 'challenge123',
    signature: 'sig123',
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    // ... campos innecesarios
  })
});

// ✅ Bueno: Enviar solo datos requeridos
await fetch('/api/authenticate', {
  method: 'POST',
  body: JSON.stringify({
    did: 'did:almena:abc123...',
    challenge: 'challenge123',
    signature: 'sig123'
  })
});
```

### Comprimir Solicitudes

```javascript
const pako = require('pako');

async function sendCompressed(url, data) {
  const compressed = pako.gzip(JSON.stringify(data));
  
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip'
    },
    body: compressed
  });
}
```

## Optimización de Base de Datos

### Indexar Columna DID

```sql
-- Crear índice para búsquedas DID más rápidas
CREATE INDEX idx_users_did ON users(did);

-- Índice compuesto para consultas comunes
CREATE INDEX idx_users_did_status ON users(did, status);
```

### Usar Agrupación de Conexiones

```javascript
const { Pool } = require('pg');

// Crear pool (reutilizar conexiones)
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Usar pool para consultas
async function getUserByDID(did) {
  const result = await pool.query(
    'SELECT * FROM users WHERE did = $1',
    [did]
  );
  return result.rows[0];
}
```

## Optimización del Lado del Cliente

### Carga Perezosa del SDK

```javascript
// Solo cargar cuando sea necesario
async function getAlmenaSDK() {
  if (!window.almenaSDK) {
    window.almenaSDK = await import('./almena-sdk');
  }
  return window.almenaSDK;
}
```

### Debounce de Llamadas a API

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Uso: No validar en cada pulsación de tecla
const validateDIDDebounced = debounce(async (did) => {
  const isValid = await validateDID(did);
  updateUI(isValid);
}, 500);
```

### Usar Web Workers

```javascript
// crypto-worker.js
self.addEventListener('message', async (e) => {
  const { did, challenge, signature } = e.data;
  
  // Operación criptográfica pesada
  const isValid = await verifySignature(did, challenge, signature);
  
  self.postMessage({ isValid });
});

// main.js
const worker = new Worker('crypto-worker.js');

function verifyInBackground(did, challenge, signature) {
  return new Promise((resolve) => {
    worker.onmessage = (e) => resolve(e.data.isValid);
    worker.postMessage({ did, challenge, signature });
  });
}
```

## Limitación de Tasa de API

### Limitador de Tasa del Lado del Cliente

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  async throttle() {
    const now = Date.now();
    
    // Eliminar solicitudes antiguas fuera de la ventana
    this.requests = this.requests.filter(
      time => now - time < this.windowMs
    );
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.throttle();
    }
    
    this.requests.push(now);
  }
}

// Uso: Máximo 100 solicitudes por minuto
const limiter = new RateLimiter(100, 60000);

async function callAPI(endpoint) {
  await limiter.throttle();
  return await fetch(endpoint);
}
```

## Monitoreo

### Rastrear Métricas de Rendimiento

```javascript
class PerformanceMonitor {
  static async measureAPICall(fn, name) {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.log({
        name,
        duration,
        status: 'success',
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      this.log({
        name,
        duration,
        status: 'error',
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  static log(metric) {
    console.log('[Rendimiento]', metric);
    // Enviar a servicio de análisis
  }
}

// Uso
const data = await PerformanceMonitor.measureAPICall(
  () => fetch('https://api.almena.id/endpoint'),
  'Llamada a API'
);
```

## CDN y Caché

### Caché de Recursos Estáticos

```javascript
// Service Worker para caché offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('almena-v1').then((cache) => {
      return cache.addAll([
        '/almena-sdk.js',
        '/styles.css',
        '/icons.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

## Optimización de Operaciones Criptográficas

### Reutilizar Pares de Claves

```javascript
// ❌ Malo: Generar nuevas claves cada vez
async function signChallenge(challenge) {
  const keyPair = await generateKeyPair(); // ¡Costoso!
  return sign(challenge, keyPair.privateKey);
}

// ✅ Bueno: Reutilizar claves
let cachedKeyPair;

async function signChallenge(challenge) {
  if (!cachedKeyPair) {
    cachedKeyPair = await generateKeyPair();
  }
  return sign(challenge, cachedKeyPair.privateKey);
}
```

## Pruebas de Carga

### Probar Tu Integración

```javascript
const autocannon = require('autocannon');

// Prueba de carga de tu endpoint
autocannon({
  url: 'http://localhost:3000/auth/verify',
  connections: 100,
  duration: 30,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    did: 'did:almena:test123...',
    challenge: 'challenge',
    signature: 'signature'
  })
}, (err, result) => {
  console.log('Solicitudes por segundo:', result.requests.average);
  console.log('Latencia p99:', result.latency.p99);
});
```

## Resumen de Mejores Prácticas

### ✅ Hacer

- Caché de datos accedidos frecuentemente
- Usar agrupación de conexiones
- Solicitudes por lotes a API cuando sea posible
- Indexar columnas de base de datos correctamente
- Comprimir payloads grandes
- Monitorear métricas de rendimiento
- Pruebas de carga de tu integración
- Usar CDN para activos estáticos

### ❌ No Hacer

- Hacer llamadas a API innecesarias
- Obtener los mismos datos repetidamente
- Bloquear UI con operaciones criptográficas
- Enviar payloads grandes innecesarios
- Omitir índices de base de datos
- Ignorar límites de tasa
- Adivinar cuellos de botella (¡medir!)

## Lista de Verificación de Rendimiento

Antes de ir a producción:

- [ ] Estrategia de caché implementada
- [ ] Base de datos correctamente indexada
- [ ] Agrupación de conexiones configurada
- [ ] Limitación de tasa en su lugar
- [ ] Pruebas de carga completadas
- [ ] Monitoreo configurado
- [ ] CDN configurado para activos estáticos
- [ ] Operaciones pesadas movidas a segundo plano
- [ ] Operaciones por lotes donde sea posible
- [ ] Compresión habilitada

## Próximos Pasos

- [Mejores Prácticas de Seguridad →](./security.md)
- [Manejo de Errores →](./error-handling.md)
- [Ejemplo Completo →](../examples/authentication-flow.md)

## Soporte

¿Preguntas sobre rendimiento?
- Email: integrations@almena.id
- [Preguntas Frecuentes del Integrador →](../../faq-integrator/api.md)
