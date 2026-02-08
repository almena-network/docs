# Preguntas Frecuentes - Usuarios

Preguntas comunes de los usuarios de Almena ID.

## Preguntas Generales

### ¿Qué es Almena ID?

Almena ID es una billetera de identidad descentralizada que te da control completo sobre tu identidad digital. A diferencia de las cuentas tradicionales, tu identidad está asegurada por criptografía y solo tú tienes acceso a ella.

### ¿Almena ID es gratuito?

Sí, la billetera de Almena ID y la gestión básica de identidad son gratuitas.

### ¿Qué plataformas son compatibles?

Almena ID está disponible en:
- Windows
- macOS
- Linux
- Android
- iOS

## Creación de Cuenta

### ¿Cómo creo una cuenta?

1. Instala la billetera de Almena ID en tu dispositivo
2. Haz clic en "Crear Nueva Cuenta"
3. Crea una contraseña segura
4. Guarda tu frase de recuperación de 12 palabras
5. ¡Tu identidad está creada!

### ¿Qué es una frase de recuperación?

Una frase de recuperación (también llamada mnemotécnica o frase semilla) es una lista de 12 palabras que actúa como una clave maestra para tu identidad. Con esta frase, puedes recuperar tu cuenta en cualquier dispositivo.

### ¿Por qué 12 palabras?

El formato de 12 palabras sigue el estándar BIP39, que proporciona 128 bits de entropía, suficiente para ser criptográficamente seguro mientras permanece manejable para escribir.

### ¿Puedo cambiar mi frase de recuperación?

No. Tu frase de recuperación se deriva matemáticamente de tu identidad. Para obtener una nueva frase de recuperación, debes crear una nueva identidad (que tendrá un DID diferente).

## Recuperación de Cuenta

### Olvidé mi contraseña. ¿Qué hago?

Si tienes tu frase de recuperación de 12 palabras:
1. Haz clic en "Recuperar Cuenta"
2. Ingresa tu frase de recuperación
3. Crea una nueva contraseña
4. Tu identidad está restaurada

### Perdí mi frase de recuperación. ¿Pueden ayudarme?

Desafortunadamente, no. Tu frase de recuperación es la ÚNICA forma de recuperar tu cuenta. Si la pierdes y olvidas tu contraseña, tu identidad no puede ser recuperada. Esto es por diseño para asegurar máxima seguridad y descentralización.

### ¿Puede Almena ID recuperar mi cuenta por mí?

No. Este es un principio fundamental de la identidad descentralizada: solo tú controlas tus claves. No tenemos "puerta trasera" ni mecanismo de recuperación.

## Seguridad

### ¿Es seguro Almena ID?

Sí. Almena ID usa:
- Criptografía estándar de la industria (BIP39, BIP32, BIP44)
- Cifrado AES-256 para claves almacenadas
- Tu contraseña nunca sale de tu dispositivo
- Tus claves nunca se transmiten a ningún servidor

### ¿Dónde se almacenan mis datos?

Tu clave privada cifrada, clave pública y DID se almacenan localmente en tu dispositivo. Tu contraseña y frase de recuperación NUNCA se almacenan en ningún lugar.

### ¿Puede alguien hackear mi identidad?

Tu identidad es tan segura como tu contraseña y frase de recuperación. Mientras:
- Uses una contraseña segura
- Mantengas tu frase de recuperación segura y secreta
- No compartas tus credenciales

...tu identidad es extremadamente segura.

### ¿Debo almacenar mi frase de recuperación digitalmente?

**¡No!** Nunca almacenes tu frase de recuperación:
- En capturas de pantalla
- En aplicaciones de notas
- En correo electrónico
- En almacenamiento en la nube
- Como foto

Escríbela en papel y guárdala en un lugar seguro.

## Usando Almena ID

### ¿Qué es un DID?

DID significa Identificador Descentralizado. Es tu dirección de identidad única en la red de Almena ID. Se ve así: `did:almena:a1b2c3d4...`

### ¿Puedo tener múltiples identidades?

¡Sí! Puedes crear múltiples identidades:
1. Cerrando sesión de tu identidad actual
2. Creando una nueva cuenta

Cada identidad tendrá su propio DID y frase de recuperación.

### ¿Puedo usar mi identidad en múltiples dispositivos?

¡Sí! Usa tu frase de recuperación de 12 palabras para restaurar tu identidad en cualquier dispositivo. Tu DID será el mismo en todos los dispositivos.

### ¿Puedo cambiar mi DID?

No. Tu DID se deriva matemáticamente de tu clave pública. Para obtener un nuevo DID, debes crear una nueva identidad.

### ¿Cómo comparto mi identidad con otros?

Comparte tu DID. Es seguro compartirlo públicamente: es como un nombre de usuario o dirección de correo electrónico. Otros pueden usarlo para verificar tu identidad o enviarte credenciales verificables. También puedes mostrar tu código QR de identidad desde la sección Identidad de tu wallet.

## Mensajería

### ¿Cómo envío un mensaje?

1. Abre la sección Mensajes desde el menú lateral
2. Haz clic en Nueva Conversación
3. Introduce el DID del destinatario
4. Escribe y pulsa Enter para enviar

### ¿Los mensajes están cifrados?

Sí. Todos los mensajes usan cifrado de extremo a extremo DIDComm V2. Solo tú y el destinatario pueden leerlos.

### ¿Dónde se almacenan los mensajes?

Los mensajes se almacenan localmente solo en tu dispositivo. Ningún servidor almacena el contenido de tus mensajes.

### ¿Qué pasa con mis mensajes si cierro sesión?

Todos los datos de chat (mensajes y contactos) se eliminan del dispositivo al cerrar sesión. Esto es por diseño por razones de seguridad.

## Anclaje en Blockchain

### ¿Qué es el anclaje en blockchain?

El anclaje registra tu DID en la blockchain de Almena, haciéndolo verificable públicamente. Cualquiera puede confirmar que tu identidad es legítima consultando la blockchain.

### ¿Tengo que anclar mi DID?

No. El anclaje es opcional. Tu wallet funciona completamente sin él, pero el anclaje fortalece la confianza en tu identidad.

### ¿El anclaje tiene coste?

No. El anclaje de DID en la blockchain de Almena es gratuito. Las comisiones de transacción están subsidiadas por la red.

## Aplicación Web

### ¿Hay una aplicación web?

Sí. Almena ID incluye una aplicación web a la que puedes acceder desde cualquier navegador. Inicias sesión usando tu wallet, no se necesita una cuenta separada.

### ¿Cómo inicio sesión en la aplicación web?

Haz clic en el botón "Almena ID" en la página de inicio de sesión. Tu wallet recibirá una solicitud de autenticación. Apruébala en tu wallet y se iniciará sesión automáticamente.

## Idioma y Preferencias

### ¿Cómo cambio el idioma?

1. Haz clic en Configuración desde tu panel de control
2. Selecciona Idioma
3. Elige tu idioma preferido
4. La interfaz se actualiza inmediatamente

### ¿Qué idiomas son compatibles?

- Inglés
- Español
- Francés
- Alemán
- Italiano

## Solución de Problemas

### La billetera no funciona

Prueba estos pasos:
1. Cierra y vuelve a abrir la billetera
2. Reinicia tu dispositivo
3. Reinstala la aplicación

### No puedo ver mi DID

Asegúrate de:
1. Estar iniciado sesión
2. Que tu billetera se haya creado exitosamente
3. Esperar unos segundos para que carguen los datos

### El idioma no cambia

1. Reinicia la billetera
2. Verifica que tu selección se haya guardado
3. Reinicia la aplicación

## Privacidad

### ¿Qué datos recopila Almena ID?

Ninguno. No recopilamos datos personales, análisis o información de seguimiento.

### ¿Pueden ver mi información de identidad?

No. Tu información de identidad se almacena localmente en tu dispositivo y está cifrada con tu contraseña. No tenemos acceso a ella.

### ¿Se rastrea mi actividad?

No. La billetera de Almena ID no rastrea tu actividad ni recopila datos sobre tu uso.

## Preguntas Técnicas

### ¿Qué es BIP39/BIP32/BIP44?

Estas son Propuestas de Mejora de Bitcoin que definen estándares para:
- **BIP39**: Generación de frases mnemotécnicas
- **BIP32**: Derivación de claves jerárquicas
- **BIP44**: Rutas de derivación de claves

Almena ID usa estos estándares probados en batalla para seguridad.

### ¿Cómo se almacena mi clave privada?

Tu clave privada es:
1. Generada desde tu frase de recuperación
2. Cifrada con AES-256 usando tu contraseña
3. Almacenada en el almacenamiento local de tu dispositivo
4. Nunca transmitida a ningún servidor

### ¿Puedo exportar mi clave privada?

Actualmente, no. Tu clave privada es gestionada automáticamente por la billetera. Siempre puedes restaurar tu identidad usando tu frase de recuperación.

## Obtener Ayuda

### ¿Cómo contacto soporte?

- Email: support@almena.id
- Documentación: [docs.almena.id](https://docs.almena.id)
- FAQ: ¡Esta página!

### ¿Dónde puedo reportar errores?

Reporta errores vía:
- Email: bugs@almena.id
- GitHub Issues (si es código abierto)

### ¿Hay una comunidad?

Consulta:
- Discord: [discord.gg/almenaid](https://discord.gg/almenaid)
- Telegram: [@almenaid](https://t.me/almenaid)
- Twitter: [@almenaid](https://twitter.com/almenaid)

## Gestión de Cuenta

### ¿Cómo elimino mi cuenta?

Tu identidad es descentralizada y existe solo en tu dispositivo. Para "eliminarla":
1. Cierra sesión
2. Desinstala la billetera de Almena ID

Nota: Esto solo la elimina de tu dispositivo. Tu DID todavía existe en cualquier blockchain o sistemas donde fue registrado.

### ¿Cómo cambio mi contraseña?

Actualmente, para cambiar tu contraseña:
1. Usa "Recuperar Cuenta" con tu frase de recuperación
2. Crea una nueva contraseña

Tu identidad (DID) permanece igual.

## ¿Aún Tienes Preguntas?

¿No encuentras tu respuesta aquí? Contáctanos en support@almena.id
