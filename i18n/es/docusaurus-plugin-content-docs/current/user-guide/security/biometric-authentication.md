---
sidebar_position: 5
---

# Autenticación Biométrica

Aprende cómo usar Touch ID, Face ID u otros sensores biométricos para desbloquear tu billetera Almena ID.

## ¿Qué es la Autenticación Biométrica?

La autenticación biométrica te permite desbloquear tu billetera usando el sensor biométrico de tu dispositivo en lugar de escribir tu contraseña. Esto proporciona:
- **Desbloqueo más rápido**: Un toque o mirada
- **Conveniencia**: No necesitas recordar o escribir contraseña
- **Seguridad**: Tus datos biométricos nunca salen de tu dispositivo

## Plataformas Compatibles

### ✅ Actualmente Compatible

- **macOS**: Touch ID (Touch Bar, Magic Keyboard)
- **iOS**: Touch ID / Face ID (próximamente)

### 🔄 Próximamente

- **Android**: Huella dactilar / Desbloqueo facial
- **Windows**: Windows Hello

### ❌ No Compatible

- **Linux**: Sin soporte biométrico nativo

## Habilitar Autenticación Biométrica

### Prerrequisitos

- Tu dispositivo debe tener un sensor biométrico
- El sensor biométrico debe estar configurado en la configuración de tu dispositivo
- Debes haber creado o recuperado una identidad en Almena ID

### Paso a Paso

1. Abre la billetera Almena ID
2. Haz clic en el **menú de hamburguesa** (☰) para abrir la barra lateral
3. Navega a **Configuración**
4. Encuentra la sección **"Autenticación Biométrica"**
5. Activa el interruptor a **ON**
6. **Verificación inmediata**: Se te pedirá autenticarte con tu sensor biométrico
7. Si la autenticación tiene éxito, el desbloqueo biométrico está habilitado
8. Si la autenticación falla, el interruptor permanece OFF

**Nota**: La verificación biométrica sucede inmediatamente cuando activas ON. No hay diálogo de confirmación intermedio.

## Usar Desbloqueo Biométrico

### Cuando Está Bloqueado Automáticamente

Después de 5 minutos de inactividad, tu billetera se bloquea automáticamente. Para desbloquear con biométrica:

1. Verás la pantalla de desbloqueo
2. Se presentan dos opciones:
   - **Contraseña**: Ingresa tu contraseña
   - **Usar Biométrico**: Autentícate con sensor biométrico
3. Haz clic en "Usar Biométrico"
4. Autentícate con Touch ID / Face ID
5. En caso de éxito, regresas a tu pantalla anterior

### En macOS (Touch ID)

- Coloca tu dedo registrado en el sensor Touch ID
- O toca el botón Touch ID en Magic Keyboard
- La autenticación sucede en ~1 segundo

### En iOS (Touch ID / Face ID)

- **Touch ID**: Coloca el dedo registrado en el botón de inicio
- **Face ID**: Mira tu dispositivo
- La autenticación es casi instantánea

## Consideraciones de Seguridad

### Qué Protege la Biométrica

✅ **Protegido**:
- Desbloqueo rápido después del bloqueo automático
- Acceso a tu panel de control de billetera
- Navegación por secciones de la billetera

✅ **Cómo Está Asegurado**:
- Los datos biométricos NUNCA salen de tu dispositivo
- El enclave seguro de tu dispositivo maneja la autenticación
- Almena ID solo recibe "éxito" o "fallo" del sistema
- No se almacenan datos biométricos en la aplicación

### Qué No Reemplaza la Biométrica

❌ **Aún Requerido**:
- Contraseña durante la configuración inicial (crear/recuperar identidad)
- Frase de recuperación para recuperación entre dispositivos
- Contraseña como respaldo si la biométrica falla

### Biométrica vs Contraseña

| Característica | Biométrica | Contraseña |
|---------|-----------|----------|
| Velocidad | Muy rápida | Requiere escribir |
| Conveniencia | Alta | Media |
| Disponibilidad | Depende del dispositivo | Siempre disponible |
| Respaldo | Se requiere contraseña | N/A |
| Configuración | Debe probarse primero | Siempre funciona |

## Deshabilitar Biométrica

Para desactivar la autenticación biométrica:

1. Ve a **Configuración**
2. Encuentra "Autenticación Biométrica"
3. Activa el interruptor a **OFF**
4. No se necesita confirmación
5. Ahora solo usarás contraseña para desbloquear

**Nota**: Deshabilitar la biométrica no afecta tu capacidad de usar la billetera. El desbloqueo con contraseña siempre está disponible.

## Solución de Problemas

### "Autenticación Biométrica No Disponible"

Si ves este mensaje:
- Tu dispositivo no tiene un sensor biométrico
- El sensor no está configurado en la configuración del sistema
- Almena ID aún no soporta biométrica en tu SO

### La Biométrica Falla al Habilitar

Si la autenticación falla al intentar habilitar:
- Verifica que tu sensor biométrico funcione en otras aplicaciones
- Verifica la configuración del sistema para la configuración biométrica
- Intenta nuevamente con dedos limpios/secos (Touch ID)
- Asegura buena iluminación y posición (Face ID)

### Desbloqueo Biométrico No Funciona

Si la biométrica falla durante el desbloqueo:
- Usa el desbloqueo con contraseña como respaldo
- Verifica que la biométrica aún esté habilitada en Configuración
- Verifica que el sensor esté limpio y funcionando
- Vuelve a habilitar la biométrica en Configuración si es necesario

### "Tiempo de Autenticación Agotado"

Si ves este error:
- Te tomó demasiado tiempo autenticarte (tiempo de espera de 60 segundos)
- Usa el desbloqueo con contraseña en su lugar
- Intenta la biométrica nuevamente

## Privacidad y Seguridad

### Tus Datos Biométricos

- ✅ Almacenados en el enclave seguro del dispositivo
- ✅ Nunca accesibles por Almena ID
- ✅ Nunca transmitidos por red
- ✅ Gestionados completamente por tu sistema operativo

### Cómo Funciona la Autenticación

1. Almena ID solicita autenticación al SO
2. El SO muestra el aviso biométrico (Touch ID / Face ID)
3. Te autenticas con tu sensor
4. El SO devuelve solo "éxito" o "fallo" a la aplicación
5. La aplicación se desbloquea en caso de éxito

**Almena ID nunca ve ni maneja tus datos biométricos**.

## Notas Específicas de Plataforma

### macOS

- Usa el framework LocalAuthentication
- Soporta Touch ID en MacBook Pro, Magic Keyboard
- Funciona con desbloqueo de Apple Watch (si está configurado)
- El respaldo a contraseña siempre está disponible

### iOS (Próximamente)

- Touch ID en iPhone 5s hasta iPhone 8
- Face ID en iPhone X y posteriores
- Funciona incluso cuando la aplicación está en segundo plano

### Android (Próximamente)

- Sensores de huella dactilar
- Desbloqueo facial (en dispositivos compatibles)
- Sigue la API Biométrica de Android

### Windows (Próximamente)

- Windows Hello (reconocimiento facial, huella dactilar, PIN)
- Integrado con la seguridad de Windows

## Temas Relacionados

- [Bloqueo Automático y Seguridad de Sesión →](./auto-lock.md)
- [Mejores Prácticas de Contraseñas →](./password-best-practices.md)
- [Funciones de Privacidad →](./privacy.md)
