---
sidebar_position: 1
---

# Verificación de Estado

Verifica si la API de Almena ID está en ejecución y respondiendo.

## Endpoint

```http
GET /api/v1/health
```

**URL Base**: `https://api.almena.id`

**URL Completa**: `https://api.almena.id/api/v1/health`

## Solicitud

### Headers

No se requieren headers especiales.

### Parámetros

Ninguno.

### Cuerpo de la Solicitud

Ninguno.

## Respuesta

### Respuesta Exitosa

**Código de Estado**: `200 OK`

**Cuerpo de la Respuesta**:
```json
{
  "status": "ok"
}
```

### Campos de la Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `status` | string | Estado de la API. Valor: `"ok"` cuando está operativa |

## Ejemplos

### cURL

```bash
curl https://api.almena.id/api/v1/health
```

### JavaScript (Fetch)

```javascript
const checkHealth = async () => {
  const response = await fetch('https://api.almena.id/api/v1/health');
  const data = await response.json();
  console.log(data.status); // "ok"
  return data;
};

checkHealth();
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const checkHealth = async () => {
  const response = await axios.get('https://api.almena.id/api/v1/health');
  console.log(response.data.status); // "ok"
  return response.data;
};

checkHealth();
```

### Python (requests)

```python
import requests

def check_health():
    response = requests.get('https://api.almena.id/api/v1/health')
    data = response.json()
    print(data['status'])  # "ok"
    return data

check_health()
```

### Python (httpx)

```python
import httpx

async def check_health():
    async with httpx.AsyncClient() as client:
        response = await client.get('https://api.almena.id/api/v1/health')
        data = response.json()
        print(data['status'])  # "ok"
        return data

# Ejecutar con: asyncio.run(check_health())
```

## Casos de Uso

### Monitoreo

Usa este endpoint para monitorear la disponibilidad de la API:

```javascript
// Verificar cada 30 segundos
setInterval(async () => {
  try {
    const response = await fetch('https://api.almena.id/api/v1/health');
    if (response.ok) {
      console.log('La API está saludable');
    } else {
      console.error('La API retornó estado de error');
    }
  } catch (error) {
    console.error('La API es inalcanzable', error);
  }
}, 30000);
```

### Verificaciones de Estado en Aplicaciones

Incluye en la verificación de estado de tu aplicación:

```javascript
app.get('/health', async (req, res) => {
  try {
    // Verificar API de Almena
    const almenaHealth = await fetch('https://api.almena.id/api/v1/health');
    const almenaData = await almenaHealth.json();
    
    if (almenaData.status === 'ok') {
      res.json({ status: 'ok', almena: 'connected' });
    } else {
      res.status(503).json({ status: 'degraded', almena: 'unhealthy' });
    }
  } catch (error) {
    res.status(503).json({ status: 'degraded', almena: 'unreachable' });
  }
});
```

## Respuestas de Error

### Error de Red

Si la API es inalcanzable:
- Sin respuesta HTTP
- Timeout de conexión
- Fallo en resolución DNS

**Maneja en tu código**:

```javascript
try {
  const response = await fetch('https://api.almena.id/health', {
    timeout: 5000 // timeout de 5 segundos
  });
  // Manejar respuesta
} catch (error) {
  if (error.name === 'AbortError') {
    console.error('Tiempo de espera agotado');
  } else {
    console.error('Error de red:', error.message);
  }
}
```

## Limitación de Tasa

El endpoint de verificación de estado no está limitado por tasa.

## Mejores Prácticas

### ✅ Hacer

- Usar para monitoreo y alertas
- Incluir en tus endpoints de verificación de estado
- Establecer valores de timeout razonables (5-10 segundos)
- Registrar fallos para depuración

### ❌ No Hacer

- Depender de esto para verificaciones de autenticación
- Llamar excesivamente (mantener intervalos razonables como 30-60 segundos)
- Usar como endpoint de ping (es específicamente para verificaciones de estado)

## Endpoints Relacionados

- [Endpoint Raíz →](./root.md) - Endpoint de información de la API
- [Página de Estado →](#) - Página de estado detallada (próximamente)

## Soporte

Si la verificación de estado falla consistentemente:
- Revisa [status.almena.id](https://status.almena.id) (cuando esté disponible)
- Contacta support@almena.id
- Revisa [GitHub Status](https://github.com/almena-id)
