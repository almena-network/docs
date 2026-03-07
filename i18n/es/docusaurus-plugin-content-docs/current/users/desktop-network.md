---
sidebar_position: 3
title: "Desktop: Explorador de Red"
sidebar_label: "Desktop: Explorador de Red"
---

# Desktop: Explorador de Red

La aplicación Almena Desktop incluye un Explorador de Red que proporciona una vista en tiempo real de la red peer-to-peer.

## Accediendo al Explorador de Red

1. Abre la aplicación Almena Desktop.
2. En la pantalla de inicio de sesión, autentícate mediante código QR o usa el botón de omitir (para desarrollo).
3. Navega a la pestaña **Red** en el dock inferior.

## Mapa de Red

El Explorador de Red muestra un mapa mundial interactivo con datos geográficos. Cada nodo en la red P2P aparece como un marcador en el mapa:

- **Tu nodo** — Se muestra como un marcador más grande (6px) en tu geolocalización.
- **Nodos peer** — Se muestran como marcadores más pequeños (4px) en sus respectivas ubicaciones.

El mapa se centra automáticamente en la posición geográfica de tu nodo basándose en tu dirección IP pública.

## Lista de Peers

Debajo del mapa, verás una lista de todos los peers descubiertos con la siguiente información:

- **Peer ID** — Un identificador truncado (primeros 12 caracteres) de cada nodo.
- **Estado de conexión** — Un punto de color indica:
  - **Verde** — Conectado y activo.
  - **Gris** — Descubierto pero actualmente desconectado.
- **Tipo de red** — Si el peer está en tu red local (LAN) o en internet.
- **Direcciones** — Número de direcciones de red asociadas al peer.

## Control del Daemon

La esquina superior derecha del encabezado de la aplicación muestra el **Botón de Estado del Daemon**:

- **Punto rojo** — El daemon está detenido. Haz clic para iniciarlo.
- **Punto verde** — El daemon está en ejecución. Haz clic para detenerlo.
- **Punto amarillo** — Verificando el estado del daemon.

Al iniciar el daemon, la aplicación reintenta hasta 5 veces (con retrasos de 500ms) para permitir que el servidor gRPC se inicialice.

## Limitaciones Actuales

- El descubrimiento de peers está limitado a la **red local (LAN)** mediante mDNS. El descubrimiento de peers por internet aún no está disponible.
- Los datos de geolocalización se obtienen de una API pública (ipapi.co) y requieren acceso a internet.
- Las secciones de Dashboard y Configuración están en desarrollo.
