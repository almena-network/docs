---
sidebar_position: 1
---

# Preguntas sobre la API

Preguntas frecuentes sobre la integración con la API de Almena ID.

## General

### ¿Cuál es la URL base de la API?

**Producción**: `https://api.almena.id/api/v1`
**Desarrollo**: `http://localhost:8000/api/v1`

### ¿La API es RESTful?

Sí, la API sigue los principios REST con métodos HTTP estándar y códigos de estado.

### ¿Necesito una clave de API?

La autenticación de API será requerida para la mayoría de los endpoints cuando estén implementados. Actualmente, los endpoints de verificación de salud son de acceso público.

### ¿Hay límite de velocidad?

Se implementará límite de velocidad. Los detalles se documentarán cuando estén disponibles.

## Autenticación

### ¿Cómo autentico las solicitudes de API?

Los métodos de autenticación de API se documentarán cuando estén implementados. Los métodos planificados incluyen claves de API y OAuth 2.0.

### ¿Cómo verifico el DID de un usuario?

Los endpoints de verificación de DID estarán disponibles pronto. Consulta [Patrón de Autenticación](../integrator-guide/integration-patterns/authentication.md) para la implementación planificada.

## Integración

### ¿Puedo usar Almena ID para autenticación de usuarios?

¡Sí! Ese es uno de los casos de uso principales. Consulta [Patrón de Autenticación](../integrator-guide/integration-patterns/authentication.md) para detalles de implementación.

### ¿Qué lenguajes de programación son compatibles?

La API REST puede usarse con cualquier lenguaje que pueda hacer solicitudes HTTP. Se proporcionan ejemplos en:
- JavaScript/TypeScript
- Python
- cURL

Se planean SDKs para JavaScript y Python.

### ¿Necesito ejecutar mi propio servidor?

Sí, necesitarás un servidor backend para:
- Almacenar datos de desafío-respuesta
- Gestionar sesiones
- Verificar firmas (vía API de Almena)

## DIDs

### ¿Cómo valido el formato de un DID?

Usa este patrón regex:
```
^did:almena:[a-f0-9]{32}$
```

Consulta [Entendiendo los DIDs](../getting-started-integrator/understanding-dids.md) para más detalles.

### ¿Pueden los usuarios tener múltiples DIDs?

Sí, los usuarios pueden crear múltiples identidades, cada una con su propio DID.

### ¿Qué pasa si un usuario pierde su DID?

Los DIDs son permanentes y están vinculados a la frase de recuperación del usuario. Si pierden su frase de recuperación, pierden el acceso a ese DID y deben crear una nueva identidad.

## Errores

### ¿Qué hago si obtengo un error 500?

- Verifica el estado de la API en [status.almena.id](https://status.almena.id)
- Implementa lógica de reintento con retroceso exponencial
- Contacta soporte si el problema persiste

### ¿Cómo manejo errores de red?

Implementa un manejo adecuado de errores:
- Captura errores de conexión
- Usa tiempos de espera
- Implementa lógica de reintento
- Muestra mensajes de error amigables para el usuario

Consulta [Manejo de Errores](../api-reference/errors/overview.md) para ejemplos.

## Seguridad

### ¿Cómo almaceno las credenciales de API de forma segura?

- Usa variables de entorno
- Nunca comprometas credenciales al control de versiones
- Rota credenciales regularmente
- Usa credenciales diferentes para cada entorno

Consulta [Mejores Prácticas de Seguridad](../integrator-guide/best-practices/security.md).

### ¿Están cifradas las solicitudes?

Sí, toda la comunicación de la API usa cifrado HTTPS/TLS.

### ¿Cuánto tiempo deben ser válidos los desafíos?

Recomendado: 5 minutos (300 segundos)

Esto equilibra la seguridad (ventana corta para ataques) con la usabilidad (tiempo suficiente para que los usuarios firmen).

## Desarrollo

### ¿Hay un entorno de prueba?

Los detalles del entorno de prueba se proporcionarán cuando estén disponibles.

### ¿Puedo probar localmente?

¡Sí! Puedes ejecutar la API backend localmente para desarrollo. Consulta el README del módulo para instrucciones de configuración.

### ¿Hay ejemplos de código?

¡Sí! Consulta:
- [Flujo de Autenticación Completo](../integrator-guide/examples/authentication-flow.md)
- [Tutorial de Inicio](../tutorials-integrator/getting-started.md)

## Soporte

### ¿Dónde puedo obtener ayuda?

- **Documentación**: [docs.almena.id](https://docs.almena.id)
- **Email**: integrations@almena.id
- **Problemas**: GitHub Issues (cuando esté disponible)

### ¿Cómo reporto errores?

Envía un email a bugs@almena.id con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs real
- Endpoint de API y detalles de la solicitud

### ¿Hay un foro comunitario?

Los canales comunitarios se anunciarán. ¡Mantente atento!

## Hoja de Ruta

### ¿Qué características están por venir?

Características planificadas:
- Endpoints de verificación de identidad
- Emisión y verificación de credenciales
- SDKs oficiales (JavaScript, Python)
- Soporte de webhooks
- Integración OAuth 2.0

Consulta [Registro de Cambios](../changelog/overview.md) para actualizaciones.

### ¿Cómo me mantengo actualizado?

- Suscríbete a nuestro boletín
- Sigue [@almenaid](https://twitter.com/almenaid)
- Revisa el [Registro de Cambios](../changelog/overview.md) regularmente

¿Más preguntas? Email: integrations@almena.id
