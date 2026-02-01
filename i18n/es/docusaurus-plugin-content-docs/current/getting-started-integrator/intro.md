---
sidebar_position: 1
---

# Primeros Pasos - Integradores

¡Bienvenido! Esta guía te ayudará a integrar Almena ID en tu aplicación.

## ¿Para Quién es Esta Guía?

Esta guía es para **desarrolladores e integradores** que desean:
- Agregar identidad descentralizada a sus aplicaciones
- Implementar autenticación basada en DID
- Emitir y verificar credenciales
- Construir aplicaciones que utilicen Almena ID

## ¿Qué es Almena ID?

Almena ID es una plataforma de identidad descentralizada que permite:
- **Usuarios** controlar sus propias identidades digitales
- **Aplicaciones** autenticar usuarios sin contraseñas
- **Emisores** proporcionar credenciales verificables
- **Verificadores** comprobar credenciales criptográficamente

## Actualmente Disponible

### Verificación de Estado de la API
- ✅ Probar conectividad de la API
- ✅ Verificar que la API está en ejecución
- [Endpoint de Verificación de Estado →](../api-reference/endpoints/health.md)

## Próximamente

Las siguientes opciones de integración están en desarrollo:

### 1. Autenticación
Usa Almena ID para autenticación de usuarios en lugar del tradicional usuario/contraseña.

**Casos de Uso Planeados**:
- Aplicaciones web
- Apps móviles
- Sistemas empresariales

### 2. Verificación de Identidad
Verifica que un usuario controla un DID específico.

**Casos de Uso Planeados**:
- Procesos KYC
- Control de acceso
- Confirmación de identidad

### 3. Emisión de Credenciales
Emite credenciales verificables a los usuarios.

**Casos de Uso Planeados**:
- Certificados
- Licencias
- Membresías
- Logros

### 4. Verificación de Credenciales
Verifica credenciales emitidas por otros.

**Casos de Uso Planeados**:
- Verificación de antecedentes
- Verificación de calificaciones
- Verificación de edad

## Requisitos Previos

Antes de comenzar:
- Comprensión básica de APIs REST
- Entorno de desarrollo (Node.js 20+ o Python 3.12+)
- Comprensión de DIDs (te lo explicaremos)
- Credenciales de API (próximamente)

## Inicio Rápido

### 1. Prueba la API

```bash
curl https://api.almena.id/health
```

Respuesta esperada:
```json
{
  "status": "ok"
}
```

### 2. Explora la Documentación Actual

**Disponible Ahora**:
- [Endpoint de Verificación de Estado →](../api-reference/endpoints/health.md)
- [Endpoint Raíz →](../api-reference/endpoints/root.md)
- [Comprendiendo DIDs →](./understanding-dids.md)

**Próximamente** (en desarrollo):
- Patrones de autenticación
- Ejemplos de integración
- Documentación del SDK

### 3. Lee las Mejores Prácticas

Estas mejores prácticas aplican cuando las características de autenticación estén disponibles:
- [Seguridad →](../integrator-guide/best-practices/security.md)
- [Manejo de Errores →](../integrator-guide/best-practices/error-handling.md)
- [Rendimiento →](../integrator-guide/best-practices/performance.md)

## Próximos Pasos

Elige tu camino:

### Camino 1: Autenticación
[Implementar autenticación basada en DID →](../integrator-guide/integration-patterns/authentication.md)

### Camino 2: Credenciales
[Emitir o verificar credenciales →](../integrator-guide/integration-patterns/credentials.md)

### Camino 3: Integración Completa
[Guía de integración completa →](../integrator-guide/integration-patterns/full-integration.md)

## Soporte

¿Necesitas ayuda?
- [FAQ de Integradores →](../faq-integrator/api.md)
- Email: integrations@almena.id
- Documentación: [docs.almena.id](https://docs.almena.id)

## ¿Qué Hay en Esta Guía?

### Primeros Pasos
- Configuración rápida
- Primera llamada a la API
- Comprendiendo DIDs

### Patrones de Integración
- Flujos de autenticación
- Emisión de credenciales
- Métodos de verificación

### Referencia de la API
- Todos los endpoints documentados
- Esquemas de solicitud/respuesta
- Códigos de error

### Mejores Prácticas
- Directrices de seguridad
- Consejos de rendimiento
- Manejo de errores

### Ejemplos
- Muestras de código completas
- Escenarios comunes
- Patrones listos para producción
