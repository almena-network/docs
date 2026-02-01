---
sidebar_position: 1
---

# Preguntas Generales

Preguntas comunes sobre el uso de Almena ID.

## ¿Qué es Almena ID?

Almena ID es una plataforma de identidad descentralizada que te da control completo sobre tu identidad digital. En lugar de depender de nombres de usuario y contraseñas, usas claves criptográficas que solo tú controlas.

## ¿Necesito una cuenta?

No se necesita una "cuenta" tradicional. Creas una identidad que existe solo en tu dispositivo. No hay registro por correo electrónico, no hay nombre de usuario, no hay servidor almacenando tus datos.

## ¿Es gratuito?

Sí, Almena ID es gratuito para los usuarios.

## ¿Cómo se almacenan mis datos?

Todos tus datos se almacenan localmente en tu dispositivo:
- Cifrados con tu contraseña
- Nunca enviados a nuestros servidores
- Solo accesibles por ti
- Eliminados cuando desinstalas la billetera

## ¿Puedo usar Almena ID en múltiples dispositivos?

¡Sí! Usa tu frase de recuperación de 12 palabras para configurar tu identidad en otros dispositivos:

1. Instala Almena ID en el nuevo dispositivo
2. Elige "Recuperar Cuenta"
3. Ingresa tu frase de recuperación
4. Crea una contraseña para ese dispositivo

Tu mismo DID estará disponible en todos los dispositivos.

## ¿Se requiere internet?

- **Para crear identidad**: No
- **Para usar la billetera**: No
- **Para autenticarse con servicios**: Sí

La billetera funciona sin conexión, pero conectarse a servicios requiere internet.

## ¿Qué plataformas son compatibles?

### Escritorio
- ✅ Windows 10+
- ✅ macOS 10.13+
- ✅ Linux (Ubuntu, Debian, Fedora, etc.)

### Móvil
- ✅ Android 8.0+
- ✅ iOS 13.0+

## ¿Qué es un DID?

Un **DID** (Identificador Descentralizado) es tu identidad única. Se ve así:

```
did:almena:a1b2c3d4e5f6789012345678901234
```

Piénsalo como un nombre de usuario, pero:
- Criptográficamente verificable
- Globalmente único
- Nadie puede quitártelo
- Funciona en cualquier servicio compatible

## ¿Puedo cambiar mi DID?

No. Tu DID se deriva de tus claves criptográficas. Para obtener un nuevo DID, necesitarías crear una nueva identidad.

## ¿Qué pasa si olvido mi contraseña?

Usa tu frase de recuperación de 12 palabras:
1. Haz clic en "Recuperar Cuenta"
2. Ingresa tu frase de recuperación
3. Crea una nueva contraseña

Si has perdido tanto la contraseña COMO la frase de recuperación, tu identidad no puede ser recuperada.

## ¿Qué es una frase de recuperación?

Una frase de recuperación son 12 palabras aleatorias que pueden restaurar tu identidad:

```
apple banana cherry date elderberry fig
grape honeydew ice jackfruit kiwi lemon
```

**Crítico**: Esta es la ÚNICA forma de recuperar tu identidad si olvidas tu contraseña o pierdes tu dispositivo.

## ¿Puede Almena ID restablecer mi contraseña?

No. No tenemos acceso a tu contraseña o datos. Solo tu frase de recuperación puede restaurar el acceso. Esto asegura la verdadera propiedad de tu identidad.

## ¿Son privados mis datos?

Sí:
- Los datos nunca salen de tu dispositivo (a menos que los uses para autenticarte)
- Cifrados con tu contraseña
- No podemos ver tus datos
- Sin seguimiento ni análisis de tu identidad

## ¿Puede alguien robar mi identidad?

Para robar tu identidad, alguien necesitaría:
- Tu frase de recuperación, O
- Tu contraseña Y acceso a tu dispositivo

**Protege tu frase de recuperación** y usa una contraseña segura.

## ¿Qué pasa si pierdo mi frase de recuperación?

Si pierdes tu frase de recuperación y olvidas tu contraseña:
- ❌ No se puede recuperar la identidad
- ❌ No se puede acceder a ese DID
- ❌ Todos los datos perdidos permanentemente

¡Por eso enfatizamos escribirla de forma segura!

## ¿Puedo tener múltiples identidades?

¡Sí! Puedes crear múltiples identidades (cada una con su propio DID):
1. Cierra sesión
2. Crea nueva cuenta
3. Nueva identidad con nuevo DID

Cada identidad es completamente separada.

## ¿Cómo elimino mi identidad?

1. Ve a Configuración
2. Haz clic en "Eliminar Cuenta"
3. Confirma la eliminación
4. Todos los datos se eliminan

**Nota**: Esto solo elimina de este dispositivo. Si lo tienes en otros dispositivos, elimínalo de esos también. Guarda tu frase de recuperación si podrías querer restaurarla más tarde.

## ¿Para qué es el color naranja?

El naranja es el color de marca de Almena ID. Lo verás en toda nuestra plataforma y documentación.

## ¿Es Almena ID código abierto?

Los detalles de disponibilidad del código fuente se anunciarán. Consulta nuestro sitio web para actualizaciones.

## ¿Qué idiomas son compatibles?

- 🇬🇧 Inglés
- 🇪🇸 Español (Español)
- 🇫🇷 Francés (Français)
- 🇩🇪 Alemán (Deutsch)
- 🇮🇹 Italiano (Italiano)

¡Más idiomas próximamente!

## ¿Puedo sugerir características?

¡Sí! Envía sugerencias a:
- Email: feedback@almena.id
- O a través de nuestros canales comunitarios (próximamente)

## ¿Cómo actualizo la billetera?

### Escritorio
Las actualizaciones son automáticas cuando están disponibles, o puedes descargar la última versión desde el sitio web oficial.

### Móvil
Las actualizaciones se entregan a través de tu tienda de aplicaciones (Google Play o App Store).

## ¿Qué hay de nuevo en la última versión?

Consulta el [Registro de Cambios](../changelog/overview.md) para las últimas actualizaciones y características.

## ¿Pueden las empresas usar Almena ID?

¡Sí! Las empresas pueden integrar Almena ID para:
- Autenticación de usuarios
- Verificación de identidad
- Emisión de credenciales

Consulta [Guía del Integrador](../getting-started-integrator/intro.md) para detalles.

## ¿Quién creó Almena ID?

La información sobre el equipo y la organización estará disponible en nuestro sitio web.

## ¿Hay una comunidad?

Canales comunitarios próximamente:
- Servidor de Discord
- Foro
- Redes sociales

Sigue @almenaid para anuncios.

## ¿Cómo reporto un error?

Email: bugs@almena.id

Incluye:
- Plataforma y versión (Windows, macOS, Linux, Android, iOS)
- Versión del sistema operativo
- Pasos para reproducir
- Capturas de pantalla (¡sin contraseñas/frases!)

## ¿Cómo obtengo ayuda?

- 📖 [Guía del Usuario](../user-guide/intro.md)
- 🔧 [Solución de Problemas](../user-guide/troubleshooting/extension-not-working.md)
- 📧 Email: support@almena.id
- 💬 Foros comunitarios (próximamente)

## ¿Más Preguntas?

¿No encontraste tu respuesta?
- Consulta [Solución de Problemas](../user-guide/troubleshooting/extension-not-working.md)
- Lee la [Guía del Usuario](../user-guide/intro.md) completa
- Contacta support@almena.id
