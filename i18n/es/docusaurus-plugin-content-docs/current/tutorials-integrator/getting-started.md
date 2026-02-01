---
sidebar_position: 1
---

# Tutorial de Inicio

## Actualmente Disponible

Ahora mismo, puedes:
- ✅ Probar el endpoint de verificación de salud de la API
- ✅ Validar formatos de DID
- ✅ Preparar tu infraestructura de integración

## Próximamente

Los endpoints de autenticación y verificación de identidad están en desarrollo.

---

Tutorial paso a paso para integrar Almena ID en tu aplicación.

## Resumen

En este tutorial, aprenderás cómo:
1. Configurar tu entorno de desarrollo
2. Hacer tu primera llamada a la API
3. Implementar validación básica de DID
4. Prepararte para la integración de autenticación

## Prerrequisitos

- Node.js 20+ o Python 3.12+
- Comprensión básica de APIs REST
- Editor de texto o IDE

## Paso 1: Probar Conexión a la API

Verifiquemos que puedes conectarte a la API de Almena ID.

### Usando JavaScript

Crea un archivo `test-api.js`:

```javascript
async function testAlmenaAPI() {
  try {
    const response = await fetch('https://api.almena.id/health');
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ Conectado exitosamente a la API de Almena ID');
      return true;
    }
  } catch (error) {
    console.error('❌ Error al conectar:', error.message);
    return false;
  }
}

testAlmenaAPI();
```

Ejecútalo:
```bash
node test-api.js
```

### Usando Python

Crea un archivo `test_api.py`:

```python
import requests

def test_almena_api():
    try:
        response = requests.get('https://api.almena.id/health')
        data = response.json()
        
        if data['status'] == 'ok':
            print('✅ Conectado exitosamente a la API de Almena ID')
            return True
    except Exception as e:
        print(f'❌ Error al conectar: {e}')
        return False

test_almena_api()
```

Ejecútalo:
```bash
python test_api.py
```

## Paso 2: Validar Formato de DID

Crea una función de validación de DID.

### JavaScript

```javascript
function isValidAlmenaDID(did) {
  // Formato DID: did:almena:32-caracteres-hex
  const pattern = /^did:almena:[a-f0-9]{32}$/;
  return pattern.test(did);
}

// Pruébalo
const testDIDs = [
  'did:almena:a1b2c3d4e5f6789012345678901234', // Válido
  'did:almena:invalid',                        // Inválido
  'did:other:a1b2c3d4e5f6789012345678901234'  // Método incorrecto
];

testDIDs.forEach(did => {
  console.log(`${did}: ${isValidAlmenaDID(did) ? '✅' : '❌'}`);
});
```

### Python

```python
import re

def is_valid_almena_did(did):
    """Valida el formato de DID de Almena"""
    pattern = r'^did:almena:[a-f0-9]{32}$'
    return bool(re.match(pattern, did))

# Pruébalo
test_dids = [
    'did:almena:a1b2c3d4e5f6789012345678901234',  # Válido
    'did:almena:invalid',                         # Inválido
    'did:other:a1b2c3d4e5f6789012345678901234'   # Método incorrecto
]

for did in test_dids:
    status = '✅' if is_valid_almena_did(did) else '❌'
    print(f'{did}: {status}')
```

## Paso 3: Crear Módulo Auxiliar

Organiza tu código en un módulo reutilizable.

### Módulo JavaScript

Crea `almena-client.js`:

```javascript
class AlmenaClient {
  constructor(apiUrl = 'https://api.almena.id') {
    this.apiUrl = apiUrl;
  }
  
  async checkHealth() {
    const response = await fetch(`${this.apiUrl}/health`);
    return await response.json();
  }
  
  validateDID(did) {
    const pattern = /^did:almena:[a-f0-9]{32}$/;
    return pattern.test(did);
  }
  
  shortenDID(did) {
    if (!this.validateDID(did)) {
      throw new Error('Formato de DID inválido');
    }
    const prefix = did.substring(0, 18); // "did:almena:a1b2..."
    const suffix = did.slice(-4);        // "...1234"
    return `${prefix}...${suffix}`;
  }
}

// Exportar para usar en otros archivos
module.exports = AlmenaClient;

// Ejemplo de uso
const client = new AlmenaClient();
console.log(await client.checkHealth());
console.log(client.validateDID('did:almena:' + 'a'.repeat(32)));
console.log(client.shortenDID('did:almena:' + 'a1b2c3d4'.repeat(4)));
```

### Módulo Python

Crea `almena_client.py`:

```python
import re
import requests

class AlmenaClient:
    def __init__(self, api_url='https://api.almena.id'):
        self.api_url = api_url
    
    def check_health(self):
        """Verifica el estado de la API"""
        response = requests.get(f'{self.api_url}/health')
        return response.json()
    
    def validate_did(self, did):
        """Valida el formato de DID"""
        pattern = r'^did:almena:[a-f0-9]{32}$'
        return bool(re.match(pattern, did))
    
    def shorten_did(self, did):
        """Acorta el DID para mostrar"""
        if not self.validate_did(did):
            raise ValueError('Formato de DID inválido')
        prefix = did[:18]  # "did:almena:a1b2..."
        suffix = did[-4:]  # "...1234"
        return f'{prefix}...{suffix}'

# Ejemplo de uso
if __name__ == '__main__':
    client = AlmenaClient()
    print(client.check_health())
    print(client.validate_did('did:almena:' + 'a' * 32))
    print(client.shorten_did('did:almena:' + 'a1b2c3d4' * 4))
```

## Paso 4: Construir una UI Simple

Crea una página HTML básica para probar tu integración.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Prueba de Integración Almena ID</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    input {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      box-sizing: border-box;
    }
    button {
      background: #ff6b35;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background: #ff5722;
    }
    .result {
      margin-top: 20px;
      padding: 15px;
      background: #f0f0f0;
      border-radius: 5px;
    }
    .error { background: #ffebee; color: #c62828; }
    .success { background: #e8f5e9; color: #2e7d32; }
  </style>
</head>
<body>
  <h1>Prueba de Integración Almena ID</h1>
  
  <h2>1. Probar Conexión a la API</h2>
  <button onclick="testAPI()">Probar API</button>
  <div id="api-result" class="result" style="display:none"></div>
  
  <h2>2. Validar DID</h2>
  <input 
    type="text" 
    id="did-input" 
    placeholder="Ingresa DID (ej., did:almena:abc123...)"
  />
  <button onclick="validateDID()">Validar</button>
  <div id="did-result" class="result" style="display:none"></div>
  
  <script>
    async function testAPI() {
      const resultDiv = document.getElementById('api-result');
      resultDiv.style.display = 'block';
      resultDiv.textContent = 'Probando...';
      resultDiv.className = 'result';
      
      try {
        const response = await fetch('https://api.almena.id/health');
        const data = await response.json();
        
        if (data.status === 'ok') {
          resultDiv.textContent = '✅ La API es accesible y está funcionando';
          resultDiv.classList.add('success');
        } else {
          resultDiv.textContent = '❌ La API devolvió una respuesta inesperada';
          resultDiv.classList.add('error');
        }
      } catch (error) {
        resultDiv.textContent = '❌ Error al conectar: ' + error.message;
        resultDiv.classList.add('error');
      }
    }
    
    function validateDID() {
      const input = document.getElementById('did-input');
      const resultDiv = document.getElementById('did-result');
      const did = input.value.trim();
      
      resultDiv.style.display = 'block';
      resultDiv.className = 'result';
      
      const pattern = /^did:almena:[a-f0-9]{32}$/;
      
      if (pattern.test(did)) {
        const shortened = did.substring(0, 18) + '...' + did.slice(-4);
        resultDiv.textContent = `✅ DID válido!\nAcortado: ${shortened}`;
        resultDiv.classList.add('success');
      } else {
        resultDiv.textContent = '❌ Formato de DID inválido\n\nFormato esperado: did:almena:{32 caracteres hex}';
        resultDiv.classList.add('error');
      }
    }
  </script>
</body>
</html>
```

Guarda como `test.html` y ábrelo en tu navegador.

## Próximos Pasos

Ahora que tienes lo básico funcionando:

1. **Aprende sobre Autenticación**
   - [Patrón de Autenticación →](../integrator-guide/integration-patterns/authentication.md)
   - [Ejemplo Completo →](../integrator-guide/examples/authentication-flow.md)

2. **Explora la API**
   - [Referencia de API →](../api-reference/endpoints/health.md)
   - [Manejo de Errores →](../api-reference/errors/overview.md)

3. **Mejores Prácticas**
   - [Seguridad →](../integrator-guide/best-practices/security.md)

## Solución de Problemas

### No puedo conectar a la API

- Verifica tu conexión a internet
- Verifica que la URL de la API sea correcta
- Revisa la consola del navegador por errores CORS

### La validación de DID falla

- Asegúrate de que el DID comience con `did:almena:`
- Verifica que el identificador sea exactamente 32 caracteres hexadecimales
- Revisa errores tipográficos o espacios extra

## Soporte

¿Necesitas ayuda?
- [FAQ del Integrador →](../faq-integrator/api.md)
- Email: integrations@almena.id
