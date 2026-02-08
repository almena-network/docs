
## [Sin Publicar]

### Planificado
- Emisión y gestión de credenciales verificables
- Flujos de verificación de credenciales
- Métodos de autenticación adicionales

## [0.2.0] - 2026-02-08

### Añadido

#### Wallet - Mensajería Cifrada (DIDComm V2)
- Enviar y recibir mensajes cifrados de extremo a extremo entre wallets
- Lista de conversaciones con alias de contactos, vista previa del último mensaje y marcas de tiempo
- Añadir contactos por DID con alias opcional
- Validación de formato DID para nuevos contactos
- Eliminar conversaciones individuales
- Indicador de cifrado confirmando cifrado DIDComm V2
- Almacenamiento de mensajes solo local (sin intervención de servidores)
- Todos los datos de chat eliminados al cerrar sesión por seguridad

#### Wallet - Código QR de Identidad
- Código QR autogenerado que contiene tu DID
- El código QR rota cada 30 segundos con token de seguridad
- Temporizador mostrando tiempo restante antes de la actualización
- Código QR en colores de marca Almena

#### Wallet - Anclaje de DID en Blockchain
- Anclar tu DID en la blockchain de Almena para verificabilidad pública
- Anclaje gratuito (comisiones de transacción subsidiadas por la red)
- Seguimiento del estado de anclaje (no anclado, anclando, anclado, fallido)
- Visualización del hash de transacción tras anclaje exitoso
- Mecanismo de reintento en caso de fallo
- Disponible en la pantalla de éxito de creación de identidad

#### Wallet - Autenticación Externa
- Autenticarse con sitios web y aplicaciones externas usando tu wallet
- Aprobar o rechazar solicitudes de autenticación
- Visualización de detalles de solicitud (servicio, acción, DID, temporizador de expiración)
- Firma de desafío criptográfico
- Expiración automática de solicitudes no respondidas

#### Wallet - Página de Seguridad
- Configurar URL de API REST de blockchain
- Validación de URL y confirmación de guardado
- Restaurar configuración predeterminada

#### Aplicación Web Frontend
- Página de inicio con características de la plataforma y casos de uso
- Inicio de sesión basado en DID con wallet (sin contraseñas para la aplicación web)
- Flujo de autenticación con aprobación del wallet y tiempo límite de 5 minutos
- Panel de control mostrando DID del usuario e indicador de perfil
- Página de estado de API con monitoreo de salud en tiempo real y tiempos de respuesta
- Página de configuración con selección de idioma
- Soporte multiidioma: Inglés, Español, Francés, Alemán, Italiano
- Diseño responsivo para móvil, tablet y escritorio

#### Frontend - Flujo de Autenticación
- Autenticación challenge-response vía wallet
- Sondeo en tiempo real para aprobación del wallet (cada 2 segundos)
- Múltiples estados de autenticación (inactivo, solicitando, esperando, éxito, error, tiempo agotado, rechazado)
- Persistencia de sesión con localStorage
- Rutas protegidas del panel de control con AuthGuard

### Cambiado
- Navegación lateral del panel de control actualizada con sección de Mensajes
- Cerrar sesión ahora elimina todos los datos locales (claves, mensajes, contactos, configuración de blockchain)
- Página de configuración simplificada para mostrar solo funciones implementadas (idioma, biométrica, info de bloqueo automático)

## [0.1.0] - 2026-02-01

### Añadido

#### Wallet Multiplataforma (Tauri 2.0 + Svelte 5)

**Creación y Gestión de Identidad**
- Crear nueva identidad descentralizada con protección por contraseña
- Generar frase de recuperación de 12 palabras (estándar BIP39)
- Derivar par de claves criptográficas Ed25519 desde mnemotécnica BIP39
- Generar formato de Identificador Descentralizado (DID): `did:almena:{identifier}`
- Almacenamiento seguro: Clave privada en llavero del dispositivo, clave pública en Tauri Store
- Recuperar identidad desde frase de recuperación de 12 palabras existente
- Recuperación de identidad entre dispositivos (mismo DID en múltiples dispositivos)
- Hash de contraseña con Argon2 (almacenado para gestión de sesión)

**Interfaz de Wallet**
- Pantalla de bienvenida con opciones Crear/Recuperar
- Flujo de incorporación de múltiples pasos (contraseña, frase de recuperación, éxito)
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
- Claves privadas almacenadas en llavero nativo (macOS Keychain, Windows Credential Manager, Linux Secret Service, Android Keystore)
- Claves públicas y DID almacenados en Tauri Store
- Hash de contraseña con Argon2

**Idiomas**
- Soporte multiidioma: Inglés y Español
- Detección automática del idioma del sistema host (por defecto Inglés)

**Soporte de Plataformas**
- Windows, macOS, Linux (escritorio)
- Android, iOS (móvil/tablet) - listo para despliegue

#### API Backend (FastAPI)
- Configuración de API REST con FastAPI
- Endpoint de verificación de salud
- Configuración de middleware CORS
- Containerización Docker con PostgreSQL
- Estructura de arquitectura hexagonal (DDD)
- Integración de ORM SQLAlchemy asíncrono

#### Documentación
- Guía de inicio para usuarios
- Guía completa del usuario (wallet, seguridad, configuración, solución de problemas)
- FAQ de usuarios
- Documentación bilingüe (Inglés y Español)

### Seguridad
- Gestión de identidad solo del lado del cliente
- Sin almacenamiento del lado del servidor de claves sensibles
- Estándar BIP39 para frases de recuperación
- Pares de claves criptográficas Ed25519
- Hash de contraseña Argon2
- Almacenamiento de claves privadas en llavero nativo
- Bloqueo automático después de inactividad (5 minutos)
- Soporte de autenticación biométrica (Touch ID de macOS)

---

