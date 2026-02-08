---
sidebar_position: 1
---

# Panel de Control

Tu panel de control es la pantalla principal en Almena ID donde puedes ver y gestionar tu identidad descentralizada.

## Resumen del Panel de Control

Cuando abres Almena ID después de la autenticación, verás tu panel de control con:

### Información de tu Identidad

**DID (Identificador Descentralizado)**
- Tu dirección de identidad única
- Formato: `did:almena:{identifier}` (mostrado en dos líneas)
- Haz clic en el botón copiar para copiar el DID completo al portapapeles
- Compártelo con otros para que puedan verificar tu identidad
- El identificador completo es visible sin truncamiento

### Menú Lateral Izquierdo

La barra lateral proporciona navegación a todas las secciones del wallet:

- **Inicio**: Tu panel de control principal (muestra tu DID)
- **Identidad**: Ver tu [código QR de identidad](./identity-qr.md)
- **Credenciales**: Gestionar credenciales verificables (próximamente)
- **Mensajes**: [Enviar y recibir mensajes cifrados](./messaging.md)
- **Seguridad**: [Configuración de blockchain](./blockchain-anchoring.md) y ajustes de seguridad
- **Configuración**: Preferencias de la aplicación y autenticación biométrica
- **Cerrar Sesión**: Salir del wallet

**Móvil y Tableta**: El menú se puede alternar con un botón de hamburguesa en el encabezado
**Escritorio**: El menú siempre es visible en el lado izquierdo

### Encabezado y Pie de Página

- **Encabezado**: Muestra el logo de Almena ID y el título de la aplicación de forma consistente en todas las pantallas
- **Pie de Página**: Muestra la insignia "Asegurado localmente" indicando almacenamiento solo local

## Usando tu Panel de Control

### Copiar tu DID

1. Localiza tu tarjeta DID en la pantalla de Inicio
2. Haz clic en el botón **"Copiar DID"**
3. Tu DID completo ahora está en tu portapapeles
4. Aparece un mensaje de confirmación brevemente

### Navegando por el Wallet

**En Móvil/Tableta**:
1. Toca el botón de hamburguesa en la esquina superior izquierda
2. El menú se desliza desde la izquierda
3. Toca cualquier elemento del menú para navegar
4. El menú se cierra automáticamente después de la selección

**En Escritorio**:
- La barra lateral siempre es visible
- Haz clic en cualquier elemento del menú para navegar
- La página actual está resaltada

### Compartir tu Identidad

Tu DID es seguro de compartir públicamente. Úsalo cuando:
- Alguien necesita verificar tu identidad
- Registrándote con servicios que soportan DIDs
- Recibiendo credenciales verificables
- Conectándote con otros usuarios
- Iniciando una [nueva conversación](./messaging.md)

También puedes compartir tu identidad mostrando tu [código QR](./identity-qr.md).

**Recuerda**: Solo comparte tu DID, **nunca** tu contraseña o frase de recuperación.

## Funciones de Seguridad

### Bloqueo Automático (Detección de Inactividad)

El wallet se bloquea automáticamente después de **5 minutos de inactividad** para proteger tu identidad.

Cuando está bloqueado:
- Serás redirigido a la pantalla de desbloqueo
- Ingresa tu contraseña para desbloquear
- Si la biométrica está habilitada, puedes usar Touch ID / Face ID

### Autenticación Biométrica

Puedes habilitar la autenticación biométrica en **Configuración**:

**Compatible**:
- **macOS**: Touch ID
- **iOS**: Touch ID / Face ID (próximamente)
- **Android**: Huella dactilar / Desbloqueo facial (próximamente)
- **Windows**: Windows Hello (próximamente)
- **Linux**: No compatible

**Para Habilitar**:
1. Ve a Configuración desde el menú lateral
2. Encuentra la opción "Autenticación Biométrica"
3. Actívala
4. Se te pedirá autenticarte con tu sensor biométrico
5. Si tiene éxito, el desbloqueo biométrico está habilitado

**Nota**: Habilitar la autenticación biométrica requiere una verificación biométrica inmediata para confirmar que tu dispositivo la soporta.

### Cerrar Sesión

Para cerrar sesión de forma segura:
1. Haz clic en **"Cerrar Sesión"** en el menú lateral
2. Aparece un diálogo de advertencia
3. Confirma tu elección
4. Tu sesión termina y todos los datos locales se eliminan (claves privadas, mensajes de chat, contactos, configuración de blockchain)
5. Vuelves a la pantalla de bienvenida
6. Puedes configurar de nuevo ingresando tu contraseña o usando tu frase de recuperación

**Importante**: Cerrar sesión elimina todos los datos locales del dispositivo, incluyendo mensajes y contactos. Tu identidad siempre puede recuperarse usando tu frase de recuperación.

## Próximos Pasos

- [Ver tu código QR de identidad →](./identity-qr.md)
- [Enviar mensajes cifrados →](./messaging.md)
- [Anclar tu DID en blockchain →](./blockchain-anchoring.md)
- [Autenticarte con servicios externos →](./authentication.md)
- [Aprende sobre seguridad →](../security/password-best-practices.md)
- [Configura ajustes →](../settings/language.md)
