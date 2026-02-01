---
sidebar_position: 3
---

# DID No Se Muestra

Soluciones para problemas con la visualización de DID y claves.

## DID Faltante o No Se Muestra

### Síntomas
- El panel de control muestra carga infinita
- El campo DID está en blanco
- La clave pública no es visible
- Se muestra "undefined" o "null"

### Soluciones

1. **Actualiza la Billetera**
   - Cierra la aplicación de billetera
   - Vuelve a abrir Almena ID
   - Espera a que cargue

2. **Reinicia la Aplicación**
   - Cierra Almena ID completamente
   - Reinicia tu dispositivo si es necesario
   - Abre la billetera Almena ID

3. **Verifica si Estás Iniciado Sesión**
   - Puede que hayas cerrado sesión
   - Intenta iniciar sesión nuevamente
   - Ingresa tu contraseña

4. **Recupera tu Identidad**
   - Si el problema persiste, intenta recuperar
   - Haz clic en "Recuperar Cuenta" en la configuración
   - Usa tu frase de recuperación de 12 palabras
   - Crea una nueva contraseña

## Botón Copiar No Funciona

### No Puedo Copiar DID o Clave Pública

**Síntomas**:
- Hago clic en el botón copiar, nada sucede
- El mensaje "¡Copiado!" no aparece
- Pegar no funciona

**Soluciones**:

1. **Concede Permiso de Portapapeles**
   - Tu dispositivo puede estar bloqueando el acceso al portapapeles
   - Busca el aviso de permiso
   - Haz clic en "Permitir"

2. **Copia Manual**
   - Selecciona el texto del DID manualmente
   - Usa copiar desde el menú contextual
   - O usa Ctrl+C (Windows/Linux) / Cmd+C (Mac)

3. **Reinicia la Aplicación**
   - Cierra y vuelve a abrir Almena ID
   - Intenta copiar nuevamente

## Problemas de Formato de DID

### El DID Se Ve Incorrecto

Un DID válido de Almena se ve así:
```
did:almena:a1b2c3d4e5f6789012345678901234
```

**Formato correcto**:
- Comienza con `did:almena:`
- Seguido de 32 caracteres
- Solo letras minúsculas (a-f) y números (0-9)

**Si tu DID no coincide**:
1. Intenta actualizar
2. Si aún está incorrecto, reporta el error a support@almena.id

## DID Truncado

### El DID Aparece Cortado

**¡Esto es normal!**

En algunas vistas, los DIDs se acortan para legibilidad:
```
Completo:      did:almena:a1b2c3d4e5f6789012345678901234
Acortado:      did:almena:a1b2...1234
```

**Para ver el DID completo**:
- Ve al panel de control
- El DID completo debería ser visible allí
- Usa el botón copiar para obtener el DID completo

## Problemas con Clave Pública

### Clave Pública No Se Muestra

**Mismas soluciones que DID no se muestra**:
1. Actualiza la billetera
2. Reinicia la aplicación
3. Verifica si estás iniciado sesión
4. Recupera la identidad si es necesario

### Formato de Clave Pública

Las claves públicas son más largas que los DIDs:
- Generalmente 64+ caracteres hexadecimales
- Comienza con `0x` en algunas visualizaciones
- Mucho más larga que el DID

## Panel de Control Vacío

### Nada Se Muestra en el Panel de Control

**Síntomas**:
- Pantalla en blanco
- Sin DID, sin clave pública
- Sin datos en absoluto

**Soluciones**:

1. **Espera la Carga**
   - Dale 10-15 segundos
   - Puede estar cargando desde el almacenamiento

2. **Borra la Caché de la Aplicación**
   - Cierra la billetera
   - Borra la caché de la aplicación a través de la configuración del sistema
   - Vuelve a abrir la billetera

3. **Reinstala la Billetera**
   - Desinstala Almena ID
   - Reinicia el dispositivo
   - Instala nuevamente
   - Recupera con la frase

## Inconsistencia de Datos

### DID Diferente en Diferentes Dispositivos

**¡Esto es esperado!**

Si creaste identidades por separado en cada dispositivo, tendrán DIDs diferentes.

**Para usar la misma identidad**:
1. Elige qué DID mantener
2. Obtén la frase de recuperación de ese dispositivo
3. Recupera la identidad en otros dispositivos
4. Ahora todos los dispositivos muestran el mismo DID

### DID Cambió Después de la Recuperación

**¡Esto NO debería suceder!**

La frase de recuperación debería restaurar el mismo DID.

**Si el DID cambió**:
- Puede que hayas usado la frase de recuperación incorrecta
- O creaste una nueva identidad en lugar de recuperar
- Verifica que usaste las 12 palabras correctas

## Problemas de Almacenamiento

### Almacenamiento Lleno o Corrupto

**Síntomas**:
- Los datos no se guardan
- El DID desaparece después de actualizar
- Se requiere inicio de sesión constante

**Soluciones**:

1. **Verifica el Espacio de Almacenamiento**
   - El dispositivo puede estar sin espacio
   - Libera espacio en tu dispositivo

2. **Borra los Datos de la Aplicación**
   - Ve a la configuración del dispositivo
   - Encuentra Almena ID en las aplicaciones
   - Borra la caché (¡no los datos!)
   - Intenta nuevamente

3. **Reinstala la Aplicación**
   - Desinstala Almena ID
   - Reinstala desde la tienda/descarga
   - Recupera la identidad con la frase

## Problemas Visuales

### Problemas de Visualización

**Síntomas**:
- Texto superpuesto
- Botones desalineados
- DID parcialmente oculto

**Soluciones**:

1. **Tamaño de Pantalla**
   - Prueba un tamaño de ventana diferente (escritorio)
   - Rota el dispositivo (móvil)

2. **Actualiza la Aplicación**
   - Asegúrate de tener la última versión
   - Actualiza si está disponible

3. **Reinicia el Dispositivo**
   - A veces un reinicio soluciona problemas de visualización

## Reportar Problemas

### Si el Problema Persiste

Contacta con soporte con:

**Incluye**:
- Plataforma (Windows, macOS, Linux, Android, iOS)
- Versión de la aplicación
- Captura de pantalla del problema
- Pasos para reproducir
- Mensajes de error

**No incluyas**:
- Tu contraseña
- Tu frase de recuperación
- Tu clave privada

**Contacto**:
- Correo electrónico: support@almena.id
- Asunto: "Problema de Visualización de DID"

## Prevención

### Evitar Problemas de Visualización

✅ **Haz**:
- Mantén la aplicación actualizada
- Concede los permisos necesarios
- Reinicia la aplicación ocasionalmente

❌ **No Hagas**:
- Bloquees los permisos de almacenamiento
- Uses versiones muy antiguas del dispositivo

## Ayuda Relacionada

- [Billetera No Funciona →](./extension-not-working.md)
- [No Puedo Iniciar Sesión →](./cant-login.md)
- [Guía del Panel de Control →](../wallet/dashboard.md)
