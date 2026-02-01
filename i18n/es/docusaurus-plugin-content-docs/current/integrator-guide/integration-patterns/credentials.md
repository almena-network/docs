---
sidebar_position: 2
---

# Patrones de Credenciales

Aprende cómo emitir y verificar credenciales verificables con Almena ID.

## Resumen

Las credenciales verificables son declaraciones digitales que:
- Son criptográficamente seguras
- Pueden ser verificadas independientemente
- Son resistentes a la manipulación
- No requieren verificación centralizada

## Próximamente

Las funcionalidades de emisión y verificación de credenciales están actualmente en desarrollo.

Funcionalidad planificada:
- Emitir credenciales verificables a DIDs
- Verificar credenciales criptográficamente
- Revocar credenciales
- Verificar estado de credenciales
- Soporte para tipos de credenciales estándar

## Casos de Uso de Credenciales

### Para Emisores

**Quién**: Organizaciones que emiten credenciales
- Universidades (diplomas, certificados)
- Empleadores (verificación de empleo)
- Agencias gubernamentales (licencias, permisos)
- Organismos certificadores (certificaciones profesionales)

**Qué puedes hacer**:
- Emitir credenciales a prueba de manipulación
- Revocar credenciales si es necesario
- Rastrear estado de credenciales
- No es necesario manejar solicitudes de verificación

### Para Titulares (Usuarios)

**Quién**: Individuos que reciben y poseen credenciales
- Estudiantes
- Empleados
- Ciudadanos
- Profesionales

**Qué pueden hacer**:
- Recibir credenciales de emisores
- Almacenar credenciales de forma segura
- Compartir credenciales selectivamente
- Demostrar propiedad criptográficamente

### Para Verificadores

**Quién**: Aplicaciones que verifican credenciales
- Empleadores (verificando calificaciones)
- Proveedores de servicios (verificación de edad)
- Plataformas (verificación de membresía)
- Sistemas de cumplimiento (verificación de licencias)

**Qué puedes hacer**:
- Verificar credenciales independientemente
- Verificar si las credenciales están revocadas
- Confirmar autenticidad del emisor
- Validar datos de credenciales

## Tipos de Credenciales Planificados

### Credenciales de Identidad
- Verificación de email
- Verificación de teléfono
- Verificación de dirección
- Verificación de edad

### Credenciales Profesionales
- Títulos y diplomas
- Certificaciones
- Licencias
- Registros de empleo

### Credenciales de Membresía
- Membresía de organización
- Estado de suscripción
- Niveles de acceso
- Roles y permisos

### Credenciales Personalizadas
- Definir tus propios esquemas de credenciales
- Emitir atributos personalizados
- Establecer reglas de validación

## Cómo Funcionarán las Credenciales

### 1. Flujo de Emisión

```
1. El usuario proporciona información al emisor
2. El emisor verifica la información (fuera de cadena)
3. El emisor crea credencial verificable
4. El emisor firma la credencial con su clave
5. El usuario recibe y almacena la credencial
6. La credencial está vinculada al DID del usuario
```

### 2. Flujo de Verificación

```
1. El usuario comparte credencial con verificador
2. El verificador verifica la firma criptográfica
3. El verificador confirma la identidad del emisor
4. El verificador verifica que la credencial no ha sido revocada
5. El verificador valida los datos de la credencial
6. La verificación tiene éxito o falla
```

## Endpoints de API Planificados

### Emitir Credencial

```http
POST /api/v1/credentials/issue
```

**Solicitud**:
```json
{
  "holderDID": "did:almena:abc123...",
  "type": "EmailVerification",
  "claims": {
    "email": "user@example.com",
    "verified": true,
    "verifiedAt": "2024-01-15T10:00:00Z"
  },
  "expirationDate": "2025-01-15T10:00:00Z"
}
```

**Respuesta**:
```json
{
  "credential": {
    "id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    "type": ["VerifiableCredential", "EmailVerification"],
    "issuer": "did:almena:issuer123...",
    "issuanceDate": "2024-01-15T10:00:00Z",
    "expirationDate": "2025-01-15T10:00:00Z",
    "credentialSubject": {
      "id": "did:almena:abc123...",
      "email": "user@example.com",
      "verified": true
    },
    "proof": {
      "type": "Ed25519Signature2020",
      "created": "2024-01-15T10:00:00Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:almena:issuer123...#keys-1",
      "jws": "eyJhbGc...signature"
    }
  }
}
```

### Verificar Credencial

```http
POST /api/v1/credentials/verify
```

**Solicitud**:
```json
{
  "credential": {
    "id": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    ...
  }
}
```

**Respuesta**:
```json
{
  "verified": true,
  "checks": {
    "signatureValid": true,
    "notRevoked": true,
    "notExpired": true,
    "issuerTrusted": true
  },
  "issuer": {
    "did": "did:almena:issuer123...",
    "name": "Example University"
  }
}
```

### Revocar Credencial

```http
POST /api/v1/credentials/revoke
```

**Solicitud**:
```json
{
  "credentialId": "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
  "reason": "Ya no es válida"
}
```

## Privacidad de Datos

### Divulgación Selectiva

Soporte futuro para:
- Compartir solo claims específicos
- Probar atributos sin revelar valores reales
- Pruebas de conocimiento cero

**Ejemplo**: Probar que eres mayor de 18 años sin revelar tu fecha de nacimiento.

### Verificación que Preserva la Privacidad

- Los verificadores solo ven lo que compartes
- Sin seguimiento entre verificadores
- Exposición mínima de datos

## Ejemplos de Integración (Próximamente)

### Para Emisores

```javascript
// Ejemplo: Emitir credencial de título universitario
const credential = await almenaAPI.credentials.issue({
  holderDID: userDID,
  type: 'UniversityDegree',
  claims: {
    degree: 'Licenciatura en Ciencias',
    major: 'Ciencias de la Computación',
    graduationDate: '2024-05-15',
    university: 'Example University'
  },
  expirationDate: null // Nunca expira
});
```

### Para Verificadores

```javascript
// Ejemplo: Verificar una credencial
const verification = await almenaAPI.credentials.verify(credential);

if (verification.verified) {
  console.log('¡La credencial es válida!');
  console.log('Emitida por:', verification.issuer.name);
  console.log('Claims:', credential.credentialSubject);
} else {
  console.log('Verificación falló:', verification.checks);
}
```

### Para Titulares

```javascript
// Ejemplo: Usuario solicita credencial desde billetera
const credential = await almenaWallet.requestCredential({
  issuerDID: 'did:almena:university123...',
  type: 'UniversityDegree'
});

// Usuario comparte credencial con verificador
await almenaWallet.shareCredential(credential, verifierDID);
```

## Cumplimiento de Estándares

Las credenciales de Almena ID seguirán:
- Modelo de Datos de Credenciales Verificables W3C
- Especificación DID W3C
- Formato JSON-LD
- Tipos de prueba estándar

## Mantente Actualizado

La funcionalidad de credenciales es una prioridad máxima. Consulta:
- [Changelog](../../changelog/overview.md) para actualizaciones
- [Roadmap](#) para cronograma (próximamente)
- Suscríbete a nuestro boletín para anuncios

## Acceso Anticipado

¿Interesado en probar las funcionalidades de credenciales en beta?
- Email: beta@almena.id
- Asunto: "Programa Beta de Credenciales"

## Documentación Relacionada

- [Patrón de Autenticación →](./authentication.md) - Verificar identidad de usuario
- [Referencia de API →](../../api-reference/endpoints/health.md) - Documentación de API
- [Mejores Prácticas →](../best-practices/security.md) - Guías de seguridad

## Soporte

¿Preguntas sobre credenciales?
- Email: integrations@almena.id
- [Preguntas Frecuentes del Integrador →](../../faq-integrator/api.md)

---

**Nota**: Esta documentación describe funcionalidad planificada. Las APIs y funcionalidades están sujetas a cambios antes del lanzamiento.
