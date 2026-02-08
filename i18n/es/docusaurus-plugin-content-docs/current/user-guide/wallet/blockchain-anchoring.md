---
sidebar_position: 6
---

# Anclaje en Blockchain

Después de crear tu identidad, puedes anclar tu DID en la blockchain de Almena. El anclaje registra tu identidad en un libro mayor público e inmutable, haciéndola verificable de forma independiente por cualquier persona.

## ¿Por Qué Anclar Tu DID?

- **Verificabilidad pública**: Cualquiera puede confirmar que tu DID es legítimo consultando la blockchain
- **Protección contra alteraciones**: Una vez anclado, tu documento DID no puede ser modificado sin tu autorización
- **Persistencia**: Tu identidad se preserva en la blockchain incluso si pierdes acceso a tu dispositivo

El anclaje es opcional. Tu wallet funciona completamente sin él, pero el anclaje fortalece la confianza en tu identidad.

## Cómo Anclar Tu DID

El anclaje está disponible en la pantalla de éxito justo después de crear una nueva identidad:

1. Después de crear tu identidad, verás tu nuevo DID en la pantalla de éxito
2. Haz clic en el botón **Anclar en Blockchain**
3. El wallet firma una transacción usando tus claves
4. Espera a que la transacción sea procesada
5. Una vez completado, el estado de anclaje cambia a **Anclado** y se muestra el hash de la transacción

Si el anclaje falla, aparece un botón **Reintentar** para que puedas intentarlo de nuevo.

## Estado del Anclaje

Tu DID puede tener uno de estos estados:

- **No Anclado**: Tu DID existe localmente pero no está registrado en la blockchain
- **Anclando**: La transacción está siendo procesada
- **Anclado**: Tu DID está registrado exitosamente en la blockchain
- **Fallido**: La transacción de anclaje falló (puedes reintentar)

## Configuración de Blockchain

Puedes configurar a qué nodo de blockchain conectarte:

1. Ve a la sección **Seguridad** desde el menú lateral
2. Introduce la URL de la API REST de la blockchain
3. Haz clic en **Guardar**
4. Usa el botón **Restaurar valores predeterminados** para restaurar la configuración por defecto

## Coste

El anclaje de DID en la blockchain de Almena es gratuito. Las comisiones de transacción están subsidiadas por la red.

## Siguientes Pasos

- [Conoce tu panel de control →](./dashboard.md)
- [Entiende las características de seguridad →](../security/privacy.md)
