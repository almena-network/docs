---
sidebar_position: 4
---

# Bloqueo Automático y Seguridad de Sesión

Aprende cómo Almena ID protege tu identidad con bloqueo automático de sesión.

## ¿Qué es el Bloqueo Automático?

El bloqueo automático es una función de seguridad que bloquea automáticamente tu billetera después de un período de inactividad. Esto previene el acceso no autorizado si dejas tu dispositivo desatendido.

## Cómo Funciona

### Detección de Inactividad

La billetera monitorea tu actividad rastreando:
- Movimientos del mouse
- Clics del mouse
- Entrada del teclado
- Interacciones táctiles (en móvil/tableta)
- Desplazamiento

### Temporización del Bloqueo

- **Tiempo de espera**: 5 minutos de inactividad
- **Intervalo de verificación**: Cada 10 segundos
- **Bloqueo automático**: Se activa automáticamente cuando se alcanza el tiempo de espera

### Qué Sucede Cuando se Bloquea

Cuando tu sesión está bloqueada:
1. Eres redirigido a la pantalla de desbloqueo
2. El estado de tu sesión se preserva
3. Las operaciones sensibles están bloqueadas
4. Debes re-autenticarte para continuar

## Desbloquear tu Billetera

### Opción 1: Desbloqueo con Contraseña

1. Ingresa tu contraseña de billetera
2. Haz clic en "Desbloquear"
3. Si es correcta, regresas a donde lo dejaste
4. Si es incorrecta, verás un mensaje de error

### Opción 2: Desbloqueo Biométrico (si está habilitado)

Si has habilitado la autenticación biométrica:
1. Haz clic en el botón "Usar Biométrico"
2. Autentícate con Touch ID / Face ID / Huella dactilar
3. En caso de éxito, la billetera se desbloquea inmediatamente

## Eventos de Actividad

Las siguientes acciones reinician el temporizador de inactividad:
- Mover tu mouse
- Hacer clic en cualquier lugar de la aplicación
- Presionar cualquier tecla
- Tocar la pantalla (móvil)
- Desplazarse

## Beneficios de Seguridad

### Protección Contra

- ✅ Acceso no autorizado cuando el dispositivo está desbloqueado
- ✅ Amenazas de acceso físico (alguien usando tu dispositivo)
- ✅ Shoulder surfing (alguien viendo tu pantalla)
- ✅ Exposición accidental en espacios públicos

### Qué Está Protegido

Cuando está bloqueada, lo siguiente es inaccesible:
- Tu DID e información de identidad
- Navegación a secciones de la billetera
- Cualquier operación de billetera
- Configuración y ajustes

### Qué Permanece Seguro

Incluso cuando está desbloqueada:
- La clave privada permanece en el keychain del dispositivo (nunca expuesta)
- La contraseña nunca se muestra o registra
- La frase de recuperación nunca se almacena (solo se usa durante la configuración)

## Mejores Prácticas

### Al Usar en Público

- ✅ Habilita el desbloqueo biométrico para re-autenticación más rápida
- ✅ Establece una contraseña fuerte pero memorable
- ✅ Ten en cuenta el tiempo de espera de 5 minutos
- ✅ Bloquea manualmente si te alejas (cierra la aplicación)

### En Dispositivos Compartidos

Si debes usar Almena ID en un dispositivo compartido:
- ⚠️ Recuerda el bloqueo automático de 5 minutos
- ⚠️ Considera cerrar sesión en lugar de solo bloquear
- ⚠️ Nunca guardes tu contraseña en el navegador/sistema
- ⚠️ Usa una contraseña única para este dispositivo

### En Dispositivos Personales

- ✅ Habilita el desbloqueo biométrico para conveniencia
- ✅ Usa una contraseña fuerte
- ✅ Mantén tu dispositivo bloqueado cuando no lo uses
- ✅ El bloqueo automático proporciona una capa adicional de seguridad

## Solución de Problemas

### "Sesión Bloqueada" Aparece Muy Frecuentemente

Si te bloquean con demasiada frecuencia:
- El tiempo de espera de 5 minutos está actualmente fijo
- Considera habilitar el desbloqueo biométrico para re-autenticación más rápida
- Las versiones futuras pueden permitir períodos de tiempo de espera personalizables

### Contraseña Olvidada Después del Bloqueo

Si olvidas tu contraseña:
1. Cierra la aplicación completamente
2. Vuelve a abrir la aplicación
3. Usa "Recuperar Identidad" desde la pantalla de bienvenida
4. Ingresa tu frase de recuperación de 12 palabras
5. Crea una nueva contraseña

### Biométrico No Funciona

Si el desbloqueo biométrico falla:
- Siempre recurre al desbloqueo con contraseña
- Verifica que la biométrica aún esté habilitada en Configuración
- Verifica que el sensor biométrico de tu dispositivo esté funcionando
- Intenta volver a habilitar la biométrica en Configuración si es necesario

## Nota de Privacidad

Monitoreo de actividad de bloqueo automático:
- ✅ Solo rastrea eventos genéricos (mouse, teclado)
- ✅ NO registra lo que escribes o haces clic
- ✅ NO envía ningún dato por red
- ✅ Todo sucede localmente en tu dispositivo

## Temas Relacionados

- [Autenticación Biométrica →](./biometric-authentication.md)
- [Mejores Prácticas de Contraseñas →](./password-best-practices.md)
- [Funciones de Privacidad →](./privacy.md)
