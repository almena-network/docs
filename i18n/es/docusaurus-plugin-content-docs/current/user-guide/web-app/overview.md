---
sidebar_position: 1
---

# Aplicación Web

Almena ID también incluye una aplicación web a la que puedes acceder desde cualquier navegador. La aplicación web te permite iniciar sesión con tu wallet, ver tu panel de control y verificar el estado de los servicios de la plataforma.

## Acceso a la Aplicación Web

Abre tu navegador y navega a la URL de la aplicación web de Almena ID proporcionada por tu organización o comunidad.

## Funcionalidades

### Página de Inicio

La página de inicio presenta la plataforma Almena ID y sus principales características:

- **Identidad Auto-Soberana**: Tú posees y controlas tu identidad digital
- **Pruebas de Conocimiento Cero**: Verifica atributos sin revelar datos innecesarios
- **Verificación Instantánea**: Verificación de identidad rápida y fiable
- **Rotación y Recuperación de Claves**: Mantén el acceso incluso cuando las claves cambien
- **Control Granular de Privacidad**: Elige exactamente qué compartir
- **Interoperabilidad**: Funciona con los estándares W3C DID

La página de inicio también muestra casos de uso reales como inicio de sesión sin contraseña, mensajería cifrada, identidad de dispositivos y más.

### Iniciar Sesión con Tu Wallet

La aplicación web utiliza tu wallet de Almena ID para la autenticación. No se necesitan contraseñas ni nombres de usuario para la aplicación web.

1. Haz clic en el botón **Almena ID** en la página de inicio de sesión
2. Tu wallet recibe una solicitud de autenticación
3. Aprueba la solicitud en tu wallet (ver [Autenticación Externa](../wallet/authentication.md))
4. Inicias sesión automáticamente en la aplicación web

El proceso de inicio de sesión tiene un tiempo límite de 5 minutos. Si no apruebas a tiempo, puedes intentarlo de nuevo.

### Panel de Control

Una vez conectado, tienes acceso a tu panel de control que muestra:

- **Tu DID**: Tu identificador descentralizado completo con un indicador de perfil
- **Resumen de estadísticas**: Credenciales, verificaciones y conexiones (próximamente)
- **Acciones Rápidas**: Atajos para tareas comunes (próximamente)
- **Actividad Reciente**: Un historial de tus últimas acciones (próximamente)

La barra lateral del panel de control proporciona navegación a:

- Identidad (próximamente)
- Credenciales (próximamente)
- Seguridad (próximamente)
- Configuración

### Configuración

En la configuración de la aplicación web puedes cambiar el idioma de la interfaz. Idiomas disponibles:

- Inglés
- Español
- Francés
- Alemán
- Italiano

El idioma cambia inmediatamente cuando seleccionas uno nuevo.

### Estado de la API

La página de estado te permite verificar si los servicios backend de Almena ID están funcionando:

- **En línea**: El servicio funciona normalmente
- **Fuera de línea**: El servicio no es accesible
- **Degradado**: El servicio funciona pero más lento de lo habitual

La página muestra tiempos de respuesta y se actualiza automáticamente cada 30 segundos. También puedes actualizar manualmente en cualquier momento.

## Soporte Multiidioma

Toda la aplicación web está disponible en 5 idiomas. Puedes cambiar el idioma desde:

- El pie de página en cualquier página
- La página de configuración cuando estés conectado

Tu preferencia de idioma se refleja en la URL y persiste mientras navegas.

## Siguientes Pasos

- [Conoce la autenticación con wallet →](../wallet/authentication.md)
- [Configura los ajustes de tu wallet →](../settings/language.md)
