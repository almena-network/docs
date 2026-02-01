# Registro de Cambios

Todos los cambios notables en Almena ID serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere a [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [Sin Publicar]

### Planificado
- Endpoints de API de verificación de identidad
- Emisión y verificación de credenciales
- Portal web frontend
- SDK para JavaScript/TypeScript
- SDK para Python
- Métodos de autenticación adicionales

## [0.1.0] - 2026-02-01

### Añadido

#### Billetera Multiplataforma (Tauri 2.0 + Svelte 5)

**Creación y Gestión de Identidad**
- Crear nueva identidad descentralizada con protección por contraseña
- Generar frase de recuperación de 12 palabras (estándar BIP39)
- Derivar par de claves criptográficas Ed25519 desde mnemotécnica BIP39
- Generar formato de Identificador Descentralizado (DID): `did:almena:{identifier}`
- Almacenamiento seguro: Clave privada en llavero del dispositivo, clave pública en Tauri Store
- Recuperar identidad desde frase de recuperación de 12 palabras existente
- Recuperación de identidad entre dispositivos (mismo DID en múltiples dispositivos)
- Hash de contraseña con Argon2 (almacenado para gestión de sesión)

**Interfaz de Billetera**
- Pantalla de bienvenida con opciones Crear/Recuperar
- Flujo de incorporación de múltiples pasos (contraseña → frase de recuperación → éxito)
- Panel de control mostrando DID con funcionalidad de copiar
- Menú de navegación lateral (Inicio, Identidad, Credenciales, Seguridad, Configuración, Cerrar Sesión)
- Barra lateral colapsable en móvil/tablet con botón hamburguesa
- Encabezado y pie de página consistentes en todas las pantallas
- Diseño responsivo para móvil, tablet y escritorio

**Características de Seguridad**
- Bloqueo automático después de 5 minutos de inactividad
- Pantalla de desbloqueo con re-autenticación por contraseña
- Autenticación biométrica (Touch ID en macOS)
- Cierre de sesión seguro con diálogo de confirmación
- Validación de contraseña (mínimo 8 caracteres)
- Validación de frase BIP39
- Monitoreo de actividad (eventos de mouse, teclado, táctiles)

**Almacenamiento y Criptografía**
- Claves privadas almacenadas en llavero nativo:
  - macOS/iOS: Keychain
  - Windows: Credential Manager
  - Linux: Secret Service
  - Android: Keystore
- Claves públicas y DID almacenados en Tauri Store
- Hash de contraseña con Argon2
- Sin datos sensibles en logs

**Idiomas**
- Soporte multiidioma: Inglés y Español
- Detección automática del idioma del sistema host (por defecto Inglés)
- Traducciones para todos los elementos de UI

**Soporte de Plataformas**
- Windows (escritorio)
- macOS (escritorio)
- Linux (escritorio)
- Android (móvil/tablet) - listo para despliegue
- iOS (móvil/tablet) - listo para despliegue

#### API Backend (FastAPI)
- Configuración de API REST con FastAPI
- Endpoint de verificación de salud (`GET /api/v1/health`)
- Endpoint de información raíz (`GET /api/v1/`)
- Configuración de middleware CORS para frontend
- Containerización Docker
- Configuración de Docker Compose con PostgreSQL
- Estructura de arquitectura hexagonal (DDD)
- Integración de ORM SQLAlchemy asíncrono

#### Frontend (Next.js)
- Página de inicio con características y casos de uso
- Página de inicio de sesión (placeholder)
- Diseño de panel de control con navegación lateral
- Soporte multiidioma: Inglés y Español (next-intl)
- Diseño responsivo (móvil, tablet, escritorio)
- TypeScript con verificación estricta de tipos
- Estilos Tailwind CSS
- Containerización Docker
- Biblioteca de componentes: Header, Footer, DashboardLayout
- Endpoint de verificación de salud para monitoreo

#### Documentación
- Guía de inicio para usuarios
- Guía completa del usuario
- Guía de inicio para desarrolladores
- Documentación de referencia de API
- FAQ de usuarios
- FAQ de desarrolladores
- Estructura de guía de integración
- Resumen de arquitectura
- Estructura de referencia del SDK
- Estructuras de tutoriales

#### Infraestructura
- Estructura de monorepo
- Reglas de desarrollo de Cursor AI
- Flujo de trabajo Git con commits convencionales
- Estándares de TypeScript en todos los proyectos
- Guías de seguridad
- Configuraciones Docker para todos los módulos
- Sistema de documentación completo

### Seguridad
- Sin registro de datos sensibles (claves privadas, contraseñas, mnemotécnicas)
- Gestión de identidad solo del lado del cliente
- Sin almacenamiento del lado del servidor de claves sensibles
- Estándar BIP39 para frases de recuperación
- Pares de claves criptográficas Ed25519
- Hash de contraseña Argon2
- Almacenamiento de claves privadas en llavero nativo
- Bloqueo automático después de inactividad (5 minutos)
- Soporte de autenticación biométrica (Touch ID de macOS)
- Gestión segura de sesiones

## Historial de Versiones

### Estrategia de Versionado

Almena ID sigue el Versionado Semántico:

- **MAYOR** versión (X.0.0): Cambios de API incompatibles
- **MENOR** versión (0.X.0): Nuevas características, compatible hacia atrás
- **PARCHE** versión (0.0.X): Correcciones de errores, compatible hacia atrás

### Ciclo de Lanzamiento

- **Lanzamientos de parche**: Según sea necesario para correcciones de errores
- **Lanzamientos menores**: Lanzamientos de características mensuales
- **Lanzamientos mayores**: Anuales o cuando haya cambios incompatibles

## Guías de Actualización

### Actualizando a 0.1.0

Lanzamiento inicial - no se necesita actualización.

## Avisos de Deprecación

Ninguno aún.

## Cambios Incompatibles

### 0.1.0
- Lanzamiento inicial - sin cambios incompatibles

## Soporte

- **Versión Actual**: 0.1.0
- **Versiones Soportadas**: 0.1.x
- **Período de Soporte**: 1 año desde el lanzamiento

Para versiones anteriores, por favor actualiza a la última versión.

## Contribuir

Consulta [FAQ del Integrador](../faq-integrator/api.md) para cómo integrar con Almena ID.

Al agregar características, siempre actualiza este registro de cambios con:
- Lo que se agregó/cambió/corrigió
- Cualquier cambio incompatible
- Guías de migración si es necesario

---

## Cómo Leer Este Registro de Cambios

- **[Sin Publicar]**: Características en desarrollo
- **[Versión] - Fecha**: Versiones publicadas con fecha
- **Añadido**: Nuevas características
- **Cambiado**: Cambios a características existentes
- **Deprecado**: Características a eliminar
- **Eliminado**: Características eliminadas
- **Corregido**: Correcciones de errores
- **Seguridad**: Mejoras de seguridad
