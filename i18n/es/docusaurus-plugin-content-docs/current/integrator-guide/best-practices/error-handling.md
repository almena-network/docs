---
sidebar_position: 2
---

# Mejores Prácticas de Manejo de Errores

Estrategias robustas de manejo de errores para la integración con Almena ID.

## Filosofía del Manejo de Errores

Un buen manejo de errores debe:
- **Fallar de forma elegante** - No hacer que tu aplicación se bloquee
- **Ser informativo** - Registrar detalles para depuración
- **Ser amigable para el usuario** - Mostrar mensajes claros a los usuarios
- **Ser accionable** - Decirle a los usuarios qué hacer a continuación

## Manejo de Errores HTTP

### Manejo de Códigos de Estado

```javascript
async function callAlmenaAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`https://api.almena.id${endpoint}`, options);
    
    // Manejar diferentes códigos de estado
    switch (response.status) {
      case 200:
      case 201:
        return await response.json();
      
      case 400:
        const error = await response.json();
        throw new BadRequestError(error.detail);
      
      case 401:
        throw new UnauthorizedError('Se requiere autenticación');
      
      case 403:
        throw new ForbiddenError('Permisos insuficientes');
      
      case 404:
        throw new NotFoundError('Recurso no encontrado');
      
      case 429:
        throw new RateLimitError('Demasiadas solicitudes');
      
      case 500:
      case 502:
      case 503:
        throw new ServerError('Error del servidor, por favor intenta de nuevo');
      
      default:
        throw new APIError(`Estado inesperado: ${response.status}`);
    }
  } catch (error) {
    // Errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new NetworkError('No se puede conectar a la API de Almena');
    }
    throw error;
  }
}
```

### Clases de Error Personalizadas

```javascript
class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

class BadRequestError extends APIError {
  constructor(message) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

class UnauthorizedError extends APIError {
  constructor(message) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

class RateLimitError extends APIError {
  constructor(message) {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}
```

## Lógica de Reintento

### Retroceso Exponencial

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // No reintentar errores del cliente (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      // Reintentar errores del servidor (5xx) y límites de tasa
      if (response.ok || attempt === maxRetries - 1) {
        return response;
      }
      
      // Calcular retraso de retroceso
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await sleep(delay);
      
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      await sleep(delay);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### Reintento con Jitter

```javascript
async function fetchWithJitter(url, options = {}, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (attempt < maxRetries - 1) {
        // Agregar jitter aleatorio para prevenir el efecto "thundering herd"
        const baseDelay = 1000 * Math.pow(2, attempt);
        const jitter = Math.random() * 1000;
        await sleep(baseDelay + jitter);
      }
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const baseDelay = 1000 * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      await sleep(baseDelay + jitter);
    }
  }
}
```

## Manejo de Timeouts

### Timeout de Solicitud

```javascript
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Timeout de solicitud');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
```

## Errores de Validación

### Validación de Entrada

```javascript
function validateDID(did) {
  if (!did) {
    throw new ValidationError('El DID es requerido');
  }
  
  if (typeof did !== 'string') {
    throw new ValidationError('El DID debe ser una cadena de texto');
  }
  
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  if (!pattern.test(did)) {
    throw new ValidationError(
      'Formato de DID inválido. Esperado: did:almena:{32 caracteres hex}'
    );
  }
  
  return true;
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Registro de Errores

### Registro Estructurado

```javascript
class Logger {
  static error(message, context = {}) {
    console.error({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      ...context
    });
  }
  
  static warn(message, context = {}) {
    console.warn({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      ...context
    });
  }
  
  static info(message, context = {}) {
    console.log({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...context
    });
  }
}

// Uso
try {
  await callAlmenaAPI('/endpoint');
} catch (error) {
  Logger.error('Llamada a API falló', {
    endpoint: '/endpoint',
    error: error.message,
    statusCode: error.statusCode
  });
}
```

### Qué Registrar

✅ **Sí registrar**:
- Mensajes de error
- Códigos de estado de solicitud/respuesta
- Marcas de tiempo
- Códigos de error visibles para el usuario
- Trazas de pila (en desarrollo)

❌ **Nunca registrar**:
- Claves de API
- Tokens de sesión
- Contraseñas
- Frases de recuperación
- Firmas
- Cuerpos completos de solicitud/respuesta (pueden contener datos sensibles)

## Mensajes para el Usuario

### Directrices de Mensajes de Error

```javascript
function getUserMessage(error) {
  // Mapear errores técnicos a mensajes amigables para el usuario
  const messages = {
    NetworkError: 'No se puede conectar. Por favor verifica tu conexión a internet.',
    UnauthorizedError: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
    RateLimitError: 'Demasiadas solicitudes. Por favor espera un momento e intenta de nuevo.',
    ServerError: 'Algo salió mal en nuestro lado. Por favor intenta más tarde.',
    ValidationError: error.message, // Los mensajes de validación ya son amigables
    default: 'Ocurrió un error inesperado. Por favor intenta de nuevo.'
  };
  
  return messages[error.name] || messages.default;
}

// Uso
try {
  await authenticateUser(did);
} catch (error) {
  Logger.error('Autenticación falló', { error: error.message });
  showUserError(getUserMessage(error));
}
```

## Patrón Circuit Breaker

### Prevenir Fallas en Cascada

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('El circuit breaker está ABIERTO');
      }
      this.state = 'HALF_OPEN';
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
  
  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}

// Uso
const breaker = new CircuitBreaker();

async function callAPI() {
  return breaker.execute(async () => {
    return await fetch('https://api.almena.id/endpoint');
  });
}
```

## Recuperación de Errores

### Degradación Elegante

```javascript
async function authenticateWithFallback(did) {
  try {
    // Intentar método de autenticación principal
    return await authenticateWithAlmena(did);
  } catch (error) {
    Logger.warn('Autenticación principal falló, intentando respaldo', { error });
    
    try {
      // Respaldo a autenticación en caché
      return await authenticateFromCache(did);
    } catch (fallbackError) {
      Logger.error('Todos los métodos de autenticación fallaron', { fallbackError });
      throw new Error('Autenticación no disponible');
    }
  }
}
```

## Pruebas de Manejo de Errores

### Simular Errores

```javascript
// Ayudante de prueba
function mockAPIError(statusCode) {
  return Promise.reject({
    status: statusCode,
    json: () => Promise.resolve({ detail: 'Error de prueba' })
  });
}

// Pruebas
describe('Manejo de Errores', () => {
  it('debe manejar errores 401', async () => {
    global.fetch = jest.fn(() => mockAPIError(401));
    
    await expect(callAlmenaAPI('/endpoint'))
      .rejects
      .toThrow(UnauthorizedError);
  });
  
  it('debe reintentar en errores 500', async () => {
    global.fetch = jest.fn()
      .mockRejectedValueOnce(mockAPIError(500))
      .mockRejectedValueOnce(mockAPIError(500))
      .mockResolvedValue({ ok: true, json: () => ({}) });
    
    await fetchWithRetry('https://api.almena.id/endpoint');
    
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
```

## Resumen de Mejores Prácticas

### ✅ Hacer

- Manejar todos los tipos de error explícitamente
- Usar clases de error personalizadas
- Implementar lógica de reintento con retroceso
- Registrar errores con contexto
- Mostrar mensajes amigables para el usuario
- Validar entradas antes de llamadas a API
- Establecer timeouts razonables
- Probar escenarios de error

### ❌ No Hacer

- Tragar errores silenciosamente
- Mostrar errores técnicos a los usuarios
- Registrar información sensible
- Reintentar indefinidamente
- Usar el mismo timeout para todas las solicitudes
- Ignorar errores de validación
- Omitir manejo de errores en código asíncrono

## Próximos Pasos

- [Mejores Prácticas de Seguridad →](./security.md)
- [Rendimiento →](./performance.md)
- [Ejemplo Completo →](../examples/authentication-flow.md)

## Soporte

¿Preguntas sobre manejo de errores?
- Email: integrations@almena.id
- [Preguntas Frecuentes del Integrador →](../../faq-integrator/api.md)
