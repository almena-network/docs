---
sidebar_position: 1
---

# Manejo de Errores

Comprendiendo los errores de la API y cómo manejarlos.

## Formato de Respuesta de Error

Todos los errores de la API de Almena ID siguen un formato consistente:

```json
{
  "detail": "Descripción del mensaje de error"
}
```

## Códigos de Estado HTTP

| Código de Estado | Significado | Descripción |
|-----------------|-------------|-------------|
| `200 OK` | Éxito | Solicitud completada exitosamente |
| `201 Created` | Creado | Recurso creado exitosamente |
| `400 Bad Request` | Error del Cliente | Parámetros de solicitud inválidos |
| `401 Unauthorized` | Autenticación Requerida | Se requiere autenticación o falló |
| `403 Forbidden` | Prohibido | Permisos insuficientes |
| `404 Not Found` | No Encontrado | El recurso no existe |
| `422 Unprocessable Entity` | Error de Validación | Validación de solicitud falló |
| `429 Too Many Requests` | Limitado por Tasa | Demasiadas solicitudes, reduce la velocidad |
| `500 Internal Server Error` | Error del Servidor | Error inesperado del servidor |
| `503 Service Unavailable` | No Disponible | Servicio temporalmente no disponible |

## Ejemplos de Manejo de Errores

### JavaScript (Fetch)

```javascript
try {
  const response = await fetch('https://api.almena.id/endpoint');
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Solicitud falló');
  }
  
  const data = await response.json();
  // Manejar éxito
} catch (error) {
  console.error('Error de API:', error.message);
  // Manejar error
}
```

### JavaScript (Axios)

```javascript
try {
  const response = await axios.get('https://api.almena.id/endpoint');
  // Manejar éxito
} catch (error) {
  if (error.response) {
    // El servidor respondió con estado de error
    console.error('Estado:', error.response.status);
    console.error('Error:', error.response.data.detail);
  } else if (error.request) {
    // No se recibió respuesta
    console.error('Error de red: Sin respuesta');
  } else {
    // Error en configuración de solicitud
    console.error('Error:', error.message);
  }
}
```

### Python

```python
import requests

try:
    response = requests.get('https://api.almena.id/endpoint')
    response.raise_for_status()  # Lanza excepción para 4xx/5xx
    data = response.json()
    # Manejar éxito
except requests.exceptions.HTTPError as e:
    error_detail = e.response.json().get('detail', 'Error desconocido')
    print(f'Error HTTP: {e.response.status_code} - {error_detail}')
except requests.exceptions.ConnectionError:
    print('Error de conexión')
except requests.exceptions.Timeout:
    print('Tiempo de espera agotado')
except requests.exceptions.RequestException as e:
    print(f'Error: {e}')
```

## Lógica de Reintentos

Implementa backoff exponencial para solicitudes fallidas:

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        // Limitado por tasa - esperar y reintentar
        const delay = Math.pow(2, i) * 1000; // Backoff exponencial
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (!response.ok && response.status >= 500) {
        // Error del servidor - reintentar
        if (i === maxRetries - 1) throw new Error('Máximo de reintentos alcanzado');
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## Mejores Prácticas

### ✅ Hacer

- Verificar códigos de estado HTTP
- Parsear mensajes de error
- Implementar lógica de reintentos con backoff exponencial
- Registrar errores para depuración
- Mostrar mensajes amigables a los usuarios finales

### ❌ No Hacer

- Ignorar respuestas de error
- Reintentar indefinidamente
- Mostrar mensajes de error técnicos a los usuarios
- Omitir el manejo de errores

## Próximos Pasos

- [Referencia de la API →](../endpoints/health.md)
- [Mejores Prácticas →](../../integrator-guide/best-practices/security.md)

Se agregará más documentación de errores a medida que se implementen los endpoints.
