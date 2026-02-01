---
sidebar_position: 2
---

# Plataformas Compatibles

Almena ID Wallet es una aplicación verdaderamente multiplataforma construida con Tauri 2.0, que funciona de forma nativa en dispositivos de escritorio y móviles.

## Plataformas de Escritorio

### 🍎 macOS

**Versiones Compatibles**: macOS 10.15 (Catalina) y posteriores

**Características**:
- ✅ Aplicación nativa (no es una aplicación web)
- ✅ Soporte Touch ID para desbloqueo biométrico
- ✅ Integración con Keychain para almacenamiento de claves privadas
- ✅ Paridad completa de funciones
- ✅ Soporte para Apple Silicon (M1/M2/M3) e Intel

**Instalación**:
- Descarga el archivo `.dmg` desde las versiones
- Arrastra a la carpeta Aplicaciones
- La primera ejecución puede requerir aprobación de permisos

### 🪟 Windows

**Versiones Compatibles**: Windows 10 (1903+) y Windows 11

**Características**:
- ✅ Aplicación nativa (no es una aplicación web)
- ✅ Integración con Credential Manager
- ✅ Paridad completa de funciones
- 🔄 Soporte Windows Hello (próximamente)

**Instalación**:
- Descarga el instalador `.exe` o el paquete `.msi`
- Ejecuta el instalador
- La aplicación se instala en Archivos de Programa

### 🐧 Linux

**Distribuciones Compatibles**:
- Ubuntu 20.04+ / Debian 11+
- Fedora 35+
- Arch Linux
- Otras distribuciones con GTK 3.24+

**Características**:
- ✅ Aplicación nativa
- ✅ Integración con Secret Service (GNOME Keyring, KWallet)
- ✅ Paridad completa de funciones
- ❌ Sin soporte nativo biométrico

**Instalación**:
- Descarga `.AppImage`, `.deb`, o `.rpm`
- Para AppImage: Haz ejecutable y ejecuta
- Para deb/rpm: Instala con el gestor de paquetes

## Plataformas Móviles

### 📱 iOS

**Versiones Compatibles**: iOS 13 y posteriores

**Características**:
- ✅ Aplicación nativa iOS
- ✅ Soporte Touch ID / Face ID (próximamente)
- ✅ Integración con iOS Keychain
- ✅ Paridad completa de funciones
- ✅ Soporte para iPad

**Instalación**:
- Disponible vía TestFlight (beta)
- App Store (próximamente)

**Estado**: Listo para despliegue, pendiente de aprobación de App Store

### 🤖 Android

**Versiones Compatibles**: Android 7.0 (Nougat) y posteriores

**Características**:
- ✅ Aplicación nativa Android
- ✅ Integración con Android Keystore
- ✅ Paridad completa de funciones
- 🔄 Soporte de huella dactilar / desbloqueo facial (próximamente)
- ✅ Soporte para tabletas

**Instalación**:
- Disponible vía descarga APK
- Google Play Store (próximamente)

**Estado**: Listo para despliegue, pendiente de aprobación de Play Store

## Comparación de Funciones

| Función | Windows | macOS | Linux | Android | iOS |
|---------|---------|-------|-------|---------|-----|
| Crear Identidad | ✅ | ✅ | ✅ | ✅ | ✅ |
| Recuperar Identidad | ✅ | ✅ | ✅ | ✅ | ✅ |
| Almacenamiento Seguro | ✅ | ✅ | ✅ | ✅ | ✅ |
| Bloqueo Automático | ✅ | ✅ | ✅ | ✅ | ✅ |
| Biométrico | 🔄 | ✅ | ❌ | 🔄 | 🔄 |
| Multi-Idioma | ✅ | ✅ | ✅ | ✅ | ✅ |

**Leyenda**:
- ✅ Totalmente compatible
- 🔄 Próximamente
- ❌ No compatible / No disponible

## Requisitos del Sistema

### Escritorio (Todas las Plataformas)

**Mínimos**:
- 2 GB RAM
- 100 MB espacio en disco
- Pantalla: resolución 800x600

**Recomendados**:
- 4 GB RAM
- 200 MB espacio en disco
- Pantalla: resolución 1920x1080

### Móvil

**Mínimos**:
- Android: 2 GB RAM, Android 7.0+
- iOS: 2 GB RAM, iOS 13+

**Recomendados**:
- Android: 4 GB RAM, Android 10+
- iOS: 4 GB RAM, iOS 15+

## Instalación

Para instrucciones detalladas de instalación, descarga el instalador apropiado para tu plataforma desde el sitio web oficial de Almena ID o el repositorio.

## Notas Específicas de Plataforma

### macOS

**Solicitud de Acceso a Keychain**: La primera vez que crees o recuperes una identidad, macOS puede pedir permiso para acceder al keychain. Esto es normal y necesario para el almacenamiento seguro de claves. Elige "Permitir siempre" para evitar solicitudes repetidas.

**Gatekeeper**: En el primer lanzamiento, es posible que necesites hacer clic derecho en la aplicación y seleccionar "Abrir" para omitir Gatekeeper si la descargaste fuera de App Store.

### Windows

**SmartScreen**: Windows Defender SmartScreen puede mostrar una advertencia en la primera ejecución. Haz clic en "Más información" y "Ejecutar de todas formas" si confías en la fuente.

**Credential Manager**: Las claves privadas se almacenan en Windows Credential Manager bajo "almena-id-wallet".

### Linux

**Requisito de Keyring**: Requiere GNOME Keyring, KWallet, o una implementación compatible de Secret Service para el almacenamiento seguro de claves.

**Permisos de AppImage**: Haz el AppImage ejecutable con `chmod +x` antes de ejecutarlo.

### Android

**Permisos**: No se requieren permisos especiales. Todo el almacenamiento es privado de la aplicación y seguro.

### iOS

**Confiar en el Desarrollador**: Puede requerir confiar en el certificado del desarrollador en Configuración si se instala vía TestFlight o distribución empresarial.

## Identidad Multiplataforma

Tu identidad es **verdaderamente portable** en todas las plataformas:

1. Crea identidad en cualquier dispositivo
2. Guarda tu frase de recuperación de 12 palabras
3. Usa "Recuperar Identidad" en cualquier otro dispositivo
4. El mismo DID aparece en todas partes

**¡Tu identidad es independiente de la plataforma!**

## Actualizaciones y Versiones

- **Actualización automática**: Las versiones de escritorio soportan actualizaciones automáticas
- **Actualización manual**: Las versiones móviles se actualizan a través de las tiendas de aplicaciones
- **Verificación de versión**: Comprobador de actualizaciones integrado (próximamente)

## Temas Relacionados

- [Crear tu Identidad →](./wallet/creating-identity.md)
- [Resumen del Panel de Control →](./wallet/dashboard.md)
- [Solución de Problemas →](./troubleshooting/extension-not-working.md)
