---
sidebar_position: 2
---

# Crear tu Identidad

Aprende cómo crear tu identidad descentralizada con Almena ID.

## Antes de Empezar

Asegúrate de tener:
- Almena ID wallet instalado en tu dispositivo
- Un bolígrafo y papel para escribir tu frase de recuperación
- Un lugar seguro para guardar tu frase de recuperación

## Guía Paso a Paso

### Paso 1: Abre Almena ID

Abre la aplicación Almena ID wallet en tu dispositivo (Windows, macOS, Linux, Android o iOS).

### Paso 2: Elige "Crear Identidad"

En la pantalla de bienvenida, haz clic en el botón **"Crear Identidad"**.

### Paso 3: Crea una Contraseña Fuerte

Crea una contraseña que:
- Tenga al menos 8 caracteres
- Puedas recordar
- Sea única para esta identidad

**Importante**: Esta contraseña:
- Protege tu billetera en este dispositivo
- Se usa para desbloquear la aplicación después de inactividad
- Puede ser diferente en cada dispositivo
- Se almacena de forma segura como hash

Ingresa la contraseña dos veces para confirmar que coincida.

### Paso 4: Guarda tu Frase de Recuperación

Verás **12 palabras** mostradas en pantalla en formato de cuadrícula.

**⚠️ CRÍTICO**: 
- Haz clic en **"Copiar al portapapeles"** para copiar las 12 palabras
- Pégalas en una ubicación segura (gestor de contraseñas, papel, etc.)
- Escríbelas **en orden**
- Guárdalas en un lugar seguro
- El botón **"He guardado mi frase"** solo se activa después de copiar

Estas 12 palabras son la **ÚNICA** forma de recuperar tu identidad entre dispositivos o si pierdes el acceso.

#### ¿Por qué 12 Palabras?

Tu frase de recuperación usa el **estándar BIP39**, proporcionando seguridad criptográfica mientras permanece manejable para escribir.

#### Qué Sucede Cuando Continúas

Cuando haces clic en "He guardado mi frase":
1. La billetera genera tus claves criptográficas desde la frase de recuperación
2. Tu **clave privada** se almacena en el keychain seguro de tu dispositivo
3. Tu **clave pública** y DID se almacenan en el almacenamiento seguro de la aplicación
4. ¡Estás listo para usar tu identidad!

### Paso 5: ¡Identidad Creada!

Tu identidad ahora está creada con:
- Un **DID** único (Identificador Descentralizado) formato: `did:almena:xxxxx`
- Una **clave pública** (Ed25519, para verificación)
- Una **clave privada** (Ed25519, almacenada de forma segura en el keychain del dispositivo)

Verás tu panel de control con tu DID mostrado.

## Qué Sucede Detrás de Escena

Cuando creas una identidad:

1. **Generación de Mnemónico**: Se generan 12 palabras aleatorias usando el estándar BIP39
2. **Derivación de Claves**: Se deriva un par de claves Ed25519 desde tu mnemónico
3. **Creación de DID**: Tu DID se genera desde tu clave pública (formato: `did:almena:{identifier}`)
4. **Almacenamiento Seguro**:
   - **Clave privada** → Keychain nativo del dispositivo (Keychain en macOS/iOS, Credential Manager en Windows, Secret Service en Linux, Keystore en Android)
   - **Clave pública y DID** → Almacenamiento seguro de Tauri
   - **Hash de contraseña** → Hasheado con Argon2 y almacenado en el almacén de Tauri
5. **Sin Red**: Todo sucede localmente en tu dispositivo

**Nada se envía a ningún servidor**. Tu identidad es completamente autosoberana y privada.

## Después de la Creación

### ✅ Haz Esto Ahora

- [ ] Guarda tu frase de recuperación de forma segura
- [ ] Prueba copiar tu DID
- [ ] Verifica que tu panel de control se muestre correctamente
- [ ] Anota tu DID en algún lugar accesible (es seguro compartirlo)

### ❌ Nunca Hagas Esto

- No compartas tu frase de recuperación con nadie
- No almacenes tu frase de recuperación digitalmente
- No compartas tu contraseña
- No tomes capturas de pantalla de tu frase de recuperación

## Próximos Pasos

- [Aprende sobre tu panel de control →](./dashboard.md)
- [Entiende las frases de recuperación →](../security/recovery-phrase.md)
- [Configura tus ajustes →](../settings/language.md)
