---
sidebar_position: 3
---

# Funciones de Privacidad

Entiende cómo Almena ID protege tu privacidad y qué datos se almacenan.

## Privacidad por Diseño

Almena ID está construido con la privacidad como principio fundamental:

### Sin Rastreo
- ❌ Sin análisis
- ❌ Sin telemetría
- ❌ Sin rastreo de uso
- ❌ Sin recopilación de datos de comportamiento

### Sin Base de Datos Central

- Tu identidad **no se almacena en nuestros servidores**
- Todo es **local en tu dispositivo**
- No hay base de datos de usuarios para hackear

### Sin Información Personal Requerida

- No se requiere correo electrónico
- No se necesita número de teléfono
- No se requiere nombre o dirección
- Solo tu contraseña y frase de recuperación

## Qué Datos se Almacenan

### Localmente (En tu Dispositivo)

**Almacenado en almacenamiento local**:
- ✅ Clave privada encriptada
- ✅ Clave pública (no sensible)
- ✅ DID (identificador público)
- ✅ Preferencia de idioma

**Nunca almacenado**:
- ❌ Tu contraseña
- ❌ Tu frase de recuperación
- ❌ Claves sin encriptar

### En Servidores

**Nada se almacena en los servidores de Almena ID.**

Cuando se implementen las APIs del backend, el servidor puede almacenar:
- ✅ DIDs (públicos por naturaleza)
- ✅ Claves públicas (destinadas a ser públicas)
- ✅ Credenciales que has emitido/recibido (si usas el servicio de credenciales)

**Nunca almacenado en servidores**:
- ❌ Claves privadas
- ❌ Contraseñas
- ❌ Frases de recuperación
- ❌ Información personal

## Encriptación

### Encriptación Local

Tu clave privada está encriptada con:
- **Algoritmo**: AES-256
- **Clave**: Derivada de tu contraseña
- **Almacenamiento**: Almacenamiento local del dispositivo

Esto significa:
- Sin tu contraseña, la clave encriptada es inútil
- Incluso si alguien accede al almacenamiento de tu dispositivo, no puede usar tu clave

### En Tránsito

Cuando se implementen las APIs:
- Toda la comunicación usa HTTPS
- La encriptación TLS protege los datos en tránsito
- No se transmiten datos sensibles

## ¿Qué Pueden Ver Otros?

### Información Pública

Cualquiera puede ver (si lo compartes):
- ✅ Tu DID
- ✅ Tu clave pública

Esto es **intencional y seguro**. Estos están destinados a ser identificadores públicos.

### Información Privada

Nadie puede acceder:
- ❌ Tu clave privada (encriptada, solo local)
- ❌ Tu contraseña (nunca almacenada en ningún lugar)
- ❌ Tu frase de recuperación (nunca almacenada)

## Privacidad del Dispositivo

### Almacenamiento del Dispositivo

Tus datos están aislados por:
- **Dispositivo**: No puede acceder a los datos de otros dispositivos
- **Aplicación**: Separado de otras aplicaciones
- **Usuario**: Aislado de otros usuarios en dispositivos compartidos

## Privacidad de Red

### Permisos de la Billetera

La billetera Almena ID:
- ❌ No lee tu historial de navegación
- ❌ No monitorea tus actividades
- ❌ No rastrea tu uso
- ✅ Solo se ejecuta cuando la abres

### Conexión a Internet

Actualmente:
- La billetera funciona completamente sin conexión
- No se necesita conexión a internet
- Las funciones futuras de API requerirán internet

## Eliminación de Datos

### Cerrar Sesión

Cuando cierras sesión:
- La sesión se borra
- Los datos encriptados permanecen en el almacenamiento del dispositivo
- Puedes iniciar sesión nuevamente con tu contraseña

### Eliminación Completa

Para eliminar completamente tus datos:

1. Cierra sesión en Almena ID
2. Desinstala la aplicación
3. O borra los datos de la aplicación a través de la configuración del dispositivo

**⚠️ Advertencia**: Esto no se puede deshacer sin tu frase de recuperación.

## Servicios de Terceros

### Sin Terceros

Almena ID no:
- Usa análisis de terceros
- Integra scripts de rastreo
- Comparte datos con socios
- Usa redes publicitarias

## Comparación con Sistemas Tradicionales

### Identidad Tradicional (Usuario/Contraseña)

| Característica | Tradicional | Almena ID |
|---------|-------------|-----------|
| Base de Datos Central | ✅ Tus datos almacenados | ❌ Sin almacenamiento central |
| Acceso del Servidor | ✅ Puede acceder a todos los datos | ❌ Sin acceso a las claves |
| Violaciones de Datos | ⚠️ Riesgo de exposición | ✅ Nada que violar |
| Recuperación de Cuenta | ✅ Restablecimiento de contraseña | ❌ Solo autosoberano |
| Privacidad | ⚠️ Varía por servicio | ✅ Privado por defecto |

### Identidad Basada en Blockchain

| Característica | Blockchain | Almena ID |
|---------|------------|-----------|
| Libro Mayor Público | ⚠️ Todas las transacciones públicas | ✅ Solo comparte lo que quieres |
| Tarifas de Transacción | ⚠️ Tarifas de gas | ✅ Sin tarifas (actualmente) |
| Permanencia | ✅ Registro permanente | ✅ Autocontrolado |
| Velocidad | ⚠️ Confirmación de bloque | ✅ Instantáneo (local) |

## Mejores Prácticas de Privacidad

### ✅ Haz

- Usa Almena ID solo en dispositivos de confianza
- Mantén tu dispositivo actualizado
- Usa contraseñas/biométricos del dispositivo
- Cierra sesión en computadoras compartidas

### ❌ No Hagas

- Uses en computadoras públicas (bibliotecas, cibercafés)
- Compartas tu dispositivo con Almena ID iniciado
- Hagas captura de pantalla de tu panel de control
- Compartas tu DID en plataformas no confiables

## Seguridad del Dispositivo

### Escritorio

Almena ID funciona en:
- ✅ Windows (con encriptación de dispositivo recomendada)
- ✅ macOS (con FileVault recomendado)
- ✅ Linux (con encriptación de disco recomendada)

### Móvil

- ✅ Android (con encriptación de dispositivo)
- ✅ iOS (encriptado por defecto)

### Consejos de Seguridad

Ten cuidado con:
- Otras aplicaciones que puedan acceder al almacenamiento
- Software malicioso
- Solo instala aplicaciones de fuentes confiables

## Funciones Futuras de Privacidad

Mejoras de privacidad planificadas:
- Pruebas de conocimiento cero para verificación de credenciales
- Divulgación selectiva de atributos de credenciales
- Compartir credenciales que preserva la privacidad
- Opciones de encriptación mejoradas

## Preguntas Frecuentes de Privacidad

### ¿Puede Almena ID ver mi clave privada?

No. Tu clave privada nunca sale de tu dispositivo y siempre está encriptada.

### ¿Se rastrea mi actividad?

No. La billetera no monitorea tu actividad.

### ¿Puedo ser anónimo?

Sí. Tu DID no contiene información personal. Sin embargo, si compartes tu DID con servicios que conocen tu identidad, pueden vincularlo.

### ¿Qué pasa si un gobierno solicita mis datos?

No tenemos datos que proporcionar. Tu identidad es autosoberana y local en tu dispositivo.

## Próximos Pasos

- [Seguridad de contraseñas →](./password-best-practices.md)
- [Seguridad de frase de recuperación →](./recovery-phrase.md)
- [Solución de problemas →](../troubleshooting/extension-not-working.md)
