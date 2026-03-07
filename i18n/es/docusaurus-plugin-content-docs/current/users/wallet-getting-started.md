---
sidebar_position: 2
title: "Wallet: Primeros Pasos"
sidebar_label: "Wallet: Primeros Pasos"
---

# Wallet: Primeros Pasos

La Almena Wallet es tu aplicación personal de identidad. Te permite crear y gestionar tu identidad descentralizada (DID) en tu propio dispositivo.

## Creando tu Cuenta

Cuando abras la billetera por primera vez, verás la pantalla de bienvenida con dos opciones:

1. **Registrar cuenta** — Comienza desde cero con una nueva identidad.
2. **Recuperar cuenta** — Restaura una identidad existente desde una frase de recuperación (próximamente).

### Paso 1: Elige "Registrar cuenta"

Toca el botón principal para comenzar el proceso de creación de cuenta.

### Paso 2: Establece tu Contraseña

Se te pedirá crear una contraseña segura. La billetera valida tu contraseña en tiempo real con las siguientes reglas:

- Mínimo **8 caracteres**
- Al menos una letra **mayúscula** (A-Z)
- Al menos una letra **minúscula** (a-z)
- Al menos un **dígito** (0-9)

Cada regla muestra un indicador visual mientras escribes:
- Aparece una marca de verificación cuando se cumple una regla.
- El campo de confirmación de contraseña debe coincidir exactamente.

Puedes alternar la visibilidad de la contraseña usando el botón mostrar/ocultar en cada campo.

### Paso 3: Frase de Recuperación

:::info Próximamente
Después de establecer tu contraseña, la billetera generará una **frase de recuperación de 12 palabras** (mnemónico BIP39). Esta frase es la única forma de recuperar tu identidad si pierdes acceso a tu dispositivo. Anótala y guárdala de forma segura — no se mostrará de nuevo.
:::

## Detalles Técnicos

- La billetera se ejecuta como una aplicación de escritorio nativa construida con [Tauri](https://tauri.app/).
- Tus claves privadas se almacenan de forma segura en el llavero de tu sistema operativo (macOS Keychain, Windows Credential Store o Linux Secret Service).
- No se envían datos a ningún servidor durante la creación de la cuenta — todo sucede localmente en tu dispositivo.
- La interfaz está optimizada para una experiencia mobile-first (viewport de 390×844).
