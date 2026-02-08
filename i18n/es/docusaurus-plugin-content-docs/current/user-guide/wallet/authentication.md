---
sidebar_position: 7
---

# Autenticación Externa

Almena ID puede utilizarse para iniciar sesión en sitios web y aplicaciones que admiten autenticación basada en DID. Cuando un servicio solicita autenticación, tu wallet te pedirá que apruebes o rechaces la solicitud.

## Cómo Funciona

1. Visitas un sitio web o aplicación que admite el inicio de sesión con Almena ID
2. El servicio envía una solicitud de autenticación a tu wallet
3. Tu wallet muestra los detalles de la solicitud, incluyendo:
   - El servicio o aplicación solicitante
   - La acción que se está solicitando
   - Qué DID se compartirá
   - Un temporizador que muestra cuánto tiempo es válida la solicitud
4. Eliges **Aprobar** o **Rechazar** la solicitud
5. Si apruebas, el wallet firma un desafío usando tu clave privada y envía la respuesta al servicio
6. El servicio verifica la firma y te concede acceso

## Aprobar una Solicitud

Cuando apruebas una solicitud de autenticación:

- Tu wallet firma un desafío criptográfico
- Solo se comparten tu DID y la respuesta firmada
- Tu clave privada, contraseña y frase de recuperación nunca se exponen
- La autenticación se completa automáticamente

## Rechazar una Solicitud

Si no reconoces la solicitud o no deseas autenticarte:

- Haz clic en **Rechazar**
- No se comparte ninguna información con el servicio solicitante
- La solicitud se cancela

## Expiración de Solicitudes

Las solicitudes de autenticación tienen un tiempo limitado. Si no respondes antes de que el temporizador se agote, la solicitud expira y no se realiza ninguna acción. El servicio solicitante deberá generar una nueva solicitud de autenticación.

## Consideraciones de Seguridad

- Verifica siempre la identidad del servicio antes de aprobar
- Solo aprueba solicitudes de servicios que reconozcas y en los que confíes
- Si una solicitud aparece inesperadamente, recházala
- Tu clave privada nunca sale de tu dispositivo durante la autenticación

## Siguientes Pasos

- [Conoce la seguridad →](../security/password-best-practices.md)
- [Conoce la privacidad →](../security/privacy.md)
