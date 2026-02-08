---
sidebar_position: 5
---

# Código QR de Identidad

Tu wallet puede generar un código QR que representa tu identidad. Otras personas o servicios pueden escanear este código para recibir rápidamente tu DID y verificar quién eres.

## Ver Tu Código QR

1. Abre la sección **Identidad** desde el menú lateral
2. Tu código QR se muestra automáticamente

## Cómo Funciona el Código QR

El código QR contiene tu DID junto con un token de seguridad que rota periódicamente. Esto significa:

- El código QR se actualiza automáticamente cada **30 segundos**
- Un temporizador muestra cuánto tiempo queda antes de la siguiente actualización
- Cada código incluye una marca de tiempo y una fecha de expiración, por lo que no puede reutilizarse después de expirar

Este mecanismo de rotación añade una capa adicional de seguridad, evitando que alguien use un código QR capturado anteriormente.

## Compartir Tu Identidad

Muestra tu código QR a:

- Otros usuarios de Almena ID que quieran iniciar una conversación contigo
- Servicios o aplicaciones que acepten identificación basada en DID
- Cualquier persona que necesite verificar tu identidad

El código QR solo comparte tu DID público. Nunca expone tu clave privada, contraseña o frase de recuperación.

## Siguientes Pasos

- [Conoce la mensajería →](./messaging.md)
- [Conoce el anclaje en blockchain →](./blockchain-anchoring.md)
