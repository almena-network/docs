---
sidebar_position: 3
---

# Recuperar tu Identidad

Aprende cómo recuperar tu identidad usando tu frase de recuperación de 12 palabras.

## Cuándo Recuperar

Recupera tu identidad cuando:
- Has olvidado tu contraseña
- Estás configurando en un nuevo dispositivo
- Has reinstalado la billetera Almena ID
- Has borrado los datos de la aplicación

## Antes de Empezar

Necesitarás:
- Tu frase de recuperación de 12 palabras (en el orden correcto)
- Almena ID wallet instalado en tu dispositivo

**Sin tu frase de recuperación, la recuperación es imposible.**

## Recuperación Paso a Paso

### Paso 1: Abre Almena ID

Abre la aplicación Almena ID wallet en tu dispositivo.

### Paso 2: Elige "Recuperar Identidad"

En la pantalla de bienvenida, haz clic en el botón **"Recuperar Identidad"**.

### Paso 3: Crea una Nueva Contraseña

Crea una contraseña para este dispositivo:
- Mínimo 8 caracteres
- Puede ser diferente de tu contraseña anterior
- Específica solo para este dispositivo

**Nota**: Esta contraseña solo aplica a este dispositivo. Tu identidad (DID) permanecerá igual en todos los dispositivos.

Ingresa la contraseña dos veces para confirmar que coincida.

### Paso 4: Ingresa tu Frase de Recuperación

Verás un área de texto grande donde puedes:

1. **Pegar tu frase de recuperación**: Haz clic en "Pegar desde portapapeles" para llenar automáticamente las 12 palabras
2. **Escribir manualmente**: Ingresa tus 12 palabras separadas por espacios

**Instrucciones mostradas**:
- Las palabras deben estar separadas por espacios
- Necesitas exactamente 12 palabras
- El contador de palabras muestra el progreso (ej., "11/12 palabras")

El botón **"Recuperar Identidad"** solo se activa cuando tienes exactamente 12 palabras ingresadas.

**Problemas Comunes**:
- Asegúrate de que las palabras estén escritas correctamente
- Las palabras deben estar separadas por espacios simples
- Sin espacios extra al principio o al final
- Asegúrate de estar usando la frase de recuperación correcta

### Paso 5: Restauración de Identidad

Cuando haces clic en "Recuperar Identidad":
1. La aplicación valida tu frase de recuperación (validación BIP39)
2. Si es inválida, verás un mensaje de error
3. Si es válida, la aplicación muestra "Restaurando identidad..." con un indicador de carga
4. Tus claves criptográficas se regeneran desde la frase de recuperación
5. Las claves se almacenan de forma segura (igual que en la creación)

### Paso 6: ¡Recuperación Completa!

Tu identidad ahora está restaurada con:
- El **mismo DID** que antes
- La **misma clave pública**
- La **misma clave privada** (regenerada)
- Una nueva contraseña para este dispositivo

Verás tu panel de control con tu DID mostrado.

## Qué se Restaura

Cuando recuperas tu identidad:

✅ **Restaurado**:
- Tu DID (permanece exactamente igual)
- Tu clave pública (idéntica)
- Tu clave privada (re-derivada desde la frase de recuperación)
- Tu identidad en todos los dispositivos

❌ **No Restaurado**:
- Tu contraseña anterior (creas una nueva)
- Configuraciones específicas del dispositivo (necesitarás reconfigurar)
- Preferencias de idioma (se restablecen al predeterminado)

## Usando Múltiples Dispositivos

Puedes usar tu identidad en múltiples dispositivos:

1. Instala Almena ID en el nuevo dispositivo
2. Usa "Recuperar Cuenta" con tu frase de recuperación
3. Crea una contraseña para ese dispositivo
4. El mismo DID aparece en ambos dispositivos

**Cada dispositivo puede tener una contraseña diferente, pero la identidad es la misma.**

## Solución de Problemas de Recuperación

### "Frase de Recuperación Inválida"

Si ves este error:
- ✅ Verifica la ortografía de cada palabra
- ✅ Verifica el orden de las palabras
- ✅ Asegúrate de estar usando la frase de recuperación correcta
- ✅ Intenta escribir las palabras manualmente (no pegar)

### "Recuperación Fallida"

Posibles causas:
- Problemas de almacenamiento
- Problemas de aplicación
- Conectividad de red (no debería afectar la recuperación, pero puede causar problemas de UI)

**Solución**:
1. Cierra y vuelve a abrir la billetera
2. Intenta la recuperación nuevamente
3. Reinicia tu dispositivo si es necesario

### Frase de Recuperación Perdida

**Si has perdido tu frase de recuperación Y olvidado tu contraseña**:

Desafortunadamente, tu identidad **no puede ser recuperada**. Esto es por diseño para máxima seguridad.

Necesitarás:
1. Crear una nueva identidad (con un nuevo DID)
2. Esta vez, guarda tu frase de recuperación de forma segura

## Seguridad Después de la Recuperación

Después de recuperar tu identidad:

1. **Verifica tu DID**: Verifica que tu DID coincida con lo que recuerdas
2. **Actualiza Contraseña**: Asegúrate de que tu nueva contraseña sea fuerte
3. **Reconfigura Ajustes**: Establece tu idioma y preferencias
4. **Guarda Frase de Recuperación**: Manténla segura para uso futuro

## Próximos Pasos

- [Asegura tu frase de recuperación →](../security/recovery-phrase.md)
- [Mejores prácticas de contraseñas →](../security/password-best-practices.md)
- [Configura ajustes →](../settings/language.md)
