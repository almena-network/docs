---
sidebar_position: 2
---

# Endpoint Raíz

Obtén información sobre la API de Almena ID.

## Endpoint

```http
GET /api/v1/
```

**URL Base**: `https://api.almena.id`

**URL Completa**: `https://api.almena.id/api/v1/`

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
  "message": "Welcome to Almena Portal API",
  "status": "running"
}
```

### Campos de la Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `message` | string | Mensaje de bienvenida |
| `status` | string | Estado de la API. Valor: `"running"` cuando está operativa |

## Ejemplos

### cURL

```bash
curl https://api.almena.id/api/v1/
```

### JavaScript (Fetch)

```javascript
const getAPIInfo = async () => {
  const response = await fetch('https://api.almena.id/api/v1/');
  const data = await response.json();
  console.log(data.message); // "Welcome to Almena Portal API"
  console.log(data.status);  // "running"
  return data;
};

getAPIInfo();
```

### Python (requests)

```python
import requests

def get_api_info():
    response = requests.get('https://api.almena.id/api/v1/')
    data = response.json()
    print(data['message'])  # "Welcome to Almena Portal API"
    print(data['status'])   # "running"
    return data

get_api_info()
```

## Casos de Uso

Usa este endpoint para:
- Verificar que la API es alcanzable y está en ejecución
- Mostrar mensaje de bienvenida en tu aplicación
- Confirmar que la URL base de la API es correcta

## Endpoints Relacionados

- [Verificación de Estado →](./health.md) - Estado de salud de la API

## Soporte

Para preguntas sobre compatibilidad de versiones de la API:
- Email: integrations@almena.id
- Documentación: [docs.almena.id](https://docs.almena.id)
