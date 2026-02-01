# Primeros Pasos - Guía de Usuario

¡Bienvenido a Almena ID! Esta guía te ayudará a comenzar con tu wallet de identidad descentralizada.

## ¿Qué es Almena ID?

Almena ID es una plataforma de identidad descentralizada que te da control completo sobre tu identidad digital. Tu identidad está asegurada mediante criptografía y solo tú tienes acceso a ella.

## Requisitos Previos

- Un dispositivo con Windows, macOS, Linux, Android o iOS
- Aproximadamente 100-200 MB de espacio de almacenamiento libre

## Instalación

### Escritorio (Windows, macOS, Linux)

**Almena ID Wallet** es una aplicación nativa de escritorio construida con Tauri 2.0.

1. Descarga el instalador para tu sistema operativo:
   - **macOS**: archivo `.dmg`
   - **Windows**: instalador `.exe` o `.msi`
   - **Linux**: `.AppImage`, `.deb` o `.rpm`
2. Ejecuta el instalador
3. Lanza Almena ID desde tu menú de aplicaciones

### Móvil (Android, iOS)

**Próximamente**: Las aplicaciones móviles están listas para despliegue, pendientes de aprobación en las tiendas de aplicaciones.

- **Android**: APK disponible para pruebas
- **iOS**: Beta disponible en TestFlight

## Configuración Inicial

Cuando abras Almena ID Wallet por primera vez, verás dos opciones:

### Opción 1: Crear Identidad

Si eres nuevo en Almena ID:

1. Haz clic en **"Crear Identidad"**
2. **Crea una contraseña**:
   - Mínimo 8 caracteres
   - Confirma la contraseña escribiéndola nuevamente
3. **Guarda tu frase de recuperación**:
   - Verás 12 palabras mostradas en una cuadrícula
   - Haz clic en "Copiar al portapapeles" para copiar todas las palabras
   - Guárdalas en un lugar seguro
   - El botón "He guardado mi frase" se activa después de copiar
4. **Se generan las claves**:
   - Tus claves criptográficas se generan a partir de la frase de recuperación
   - La clave privada se almacena en el llavero de tu dispositivo
   - La clave pública y el DID se almacenan en el almacenamiento seguro de la aplicación
5. **¡Éxito!** Tu identidad está creada y verás tu panel de control

**⚠️ Crítico**: 
- Nunca compartas tu frase de recuperación con nadie
- Cualquiera con tu frase de recuperación puede recrear tu identidad
- Guárdala de forma segura - es la única manera de recuperar tu identidad

### Opción 2: Recuperar Identidad

Si ya tienes una identidad de Almena ID:

1. Haz clic en **"Recuperar Identidad"**
2. **Crea una contraseña** para este dispositivo:
   - Puede ser diferente de tu contraseña anterior
   - Específica para este dispositivo solamente
3. **Ingresa tu frase de recuperación**:
   - Escribe o pega tus 12 palabras separadas por espacios
   - Haz clic en "Pegar desde portapapeles" para ingreso rápido
   - El contador de palabras muestra el progreso (X/12 palabras)
4. Haz clic en **"Recuperar Identidad"**
5. Tu identidad se restaura con el mismo DID

## Tu Identidad

Una vez configurado, tendrás:

- **DID (Identificador Descentralizado)**: Tu identidad única en la plataforma (formato: `did:almena:...`)
- **Clave Pública**: Tu clave criptográfica pública para verificación
- **Clave Privada**: Almacenada de forma segura en el llavero de tu dispositivo

## Soporte de Idiomas

Almena ID Wallet está disponible en múltiples idiomas:

- 🇬🇧 Inglés (predeterminado)
- 🇪🇸 Español

La aplicación detecta automáticamente el idioma de tu dispositivo y lo usa si está soportado. De lo contrario, usa inglés por defecto.

## Características de Seguridad

Almena ID Wallet incluye múltiples capas de seguridad:

- **Protección por contraseña**: Requerida para configurar y desbloquear tu wallet
- **Bloqueo automático**: Se bloquea automáticamente después de 5 minutos de inactividad
- **Desbloqueo biométrico**: Usa Touch ID / Face ID (macOS soportado, otros próximamente)
- **Almacenamiento seguro**: Claves privadas almacenadas en el llavero nativo del dispositivo
- **Sin red**: Todo sucede localmente en tu dispositivo

## Notas de Seguridad

- **Tu contraseña** se hashea con Argon2 y nunca se almacena en texto plano
- **Tu clave privada** se almacena en el llavero seguro de tu dispositivo
- **Tu frase de recuperación** es la ÚNICA forma de recuperar tu identidad entre dispositivos
- **No podemos recuperar** tu identidad si pierdes tu frase de recuperación
- **No se envían datos a servidores**: Todas las operaciones son solo del lado del cliente

## ¿Necesitas Ayuda?

Contacta soporte en support@almena.id
