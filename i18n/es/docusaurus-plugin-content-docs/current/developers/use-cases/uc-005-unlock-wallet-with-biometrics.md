---
title: "UC-005: Desbloquear Wallet con Biometría"
sidebar_label: "UC-005: Desbloquear con Biometría"
sidebar_position: 5
---

# UC-005: Desbloquear Wallet con Biometría

## Descripción

El usuario desbloquea la wallet usando autenticación biométrica (Touch ID / Face ID) después de que la sesión se haya bloqueado por inactividad. Esto proporciona una alternativa más rápida a la introducción de contraseña. El desbloqueo biométrico está disponible en dos pantallas: el overlay de bloqueo dentro de la app y la página dedicada de desbloqueo. La contraseña siempre está disponible como alternativa.

## Actores

- **Usuario Final**: Persona que desbloquea la wallet con biometría
- **Wallet (Frontend)**: Aplicación Svelte que gestiona la UI de la pantalla de bloqueo y el estado de sesión
- **Wallet (Rust Backend)**: Comandos Tauri que interactúan con las APIs biométricas del SO
- **Sistema Operativo**: Proporciona el prompt de autenticación biométrica

## Precondiciones

- El usuario tiene una identidad creada en la wallet
- La autenticación biométrica ha sido activada ([UC-004](./uc-004-enable-biometric-authentication.md)) — `biometricEnabled: true` en el Tauri Store
- La sesión de la wallet está bloqueada (por timeout de inactividad o bloqueo manual)
- El dispositivo tiene hardware biométrico disponible y funcional

## Flujo Principal

1. La sesión de la wallet se bloquea (timeout de inactividad o acción de bloqueo manual)
2. Se muestra la pantalla de bloqueo (ya sea el overlay `LockScreen.svelte` o la página `/unlock`)
3. La pantalla de bloqueo verifica la disponibilidad biométrica: invoca `is_biometric_available`
4. Se cumplen ambas condiciones (`biometricEnabled && biometricAvailable`), por lo que el botón **Usar Biometría** se renderiza junto al campo de contraseña
5. El usuario hace clic en **Usar Biometría**
6. La wallet invoca el comando Rust `authenticate_biometric`
7. El SO muestra el prompt biométrico nativo (diálogo Touch ID en macOS)
8. El usuario se autentica exitosamente (huella o rostro)
9. El Rust backend devuelve éxito
10. La wallet llama a `unlockSession()` para restaurar el estado desbloqueado
11. El usuario vuelve al dashboard

## Flujos Alternativos

### FA-1: La verificación biométrica falla
- En el paso 8, la biometría no coincide
- La pantalla de bloqueo muestra un mensaje de error: "La autenticación biométrica falló"
- El usuario permanece en la pantalla de bloqueo y puede reintentar la biometría o usar la contraseña

### FA-2: El usuario cancela el prompt biométrico
- En el paso 8, el usuario cancela el diálogo del SO
- No se muestra error (la cancelación se maneja silenciosamente)
- El usuario permanece en la pantalla de bloqueo y puede reintentar o usar la contraseña

### FA-3: Hardware biométrico no disponible en el momento del desbloqueo
- En el paso 3, `is_biometric_available` devuelve `false` (hardware desconectado, problema de driver, etc.)
- El botón **Usar Biometría** no se muestra
- Solo la contraseña está disponible

### FA-4: El usuario elige contraseña en su lugar
- En el paso 5, el usuario escribe su contraseña en el campo en lugar de hacer clic en el botón biométrico
- La wallet verifica el hash de contraseña mediante Argon2
- Si es válida, la sesión se desbloquea normalmente

### FA-5: Desbloqueo mediante página dedicada
- La wallet navega a `/unlock` en lugar de mostrar el overlay de pantalla de bloqueo
- El flujo es idéntico: botón biométrico mostrado si se cumplen las condiciones, al tener éxito navega a `/dashboard`

## Postcondiciones

- La sesión de la wallet está desbloqueada
- El usuario tiene acceso al dashboard y todas las funcionalidades de la wallet
- No ocurren cambios de estado persistente — el desbloqueo biométrico es sin estado
- El temporizador de inactividad se reinicia

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | UI de pantalla de bloqueo (`LockScreen.svelte` y `/unlock`), renderizado del botón biométrico, desbloqueo de sesión |
| **wallet** (Rust backend) | Comando `authenticate_biometric` via `LAContext` de macOS |

## Notas Técnicas

- **Dos pantallas de desbloqueo**: `LockScreen.svelte` es un componente overlay dentro de la app; `/unlock` es una página de ruta dedicada. Ambos implementan el mismo flujo biométrico de forma independiente
- **Autenticación sin estado**: Cada desbloqueo biométrico es una verificación nueva a nivel de SO. No se reutilizan tokens, sesiones ni resultados cacheados
- **Contraseña siempre disponible**: El campo de contraseña siempre se renderiza independientemente de la disponibilidad biométrica, asegurando que el usuario nunca quede bloqueado
- **Ningún dato biométrico fluye a través de la wallet**: El Rust backend pide al SO que verifique, recibe un resultado booleano y nunca accede a datos biométricos en crudo
- **Condición para el botón biométrico**: `biometricEnabled` (preferencia del usuario desde el store) AND `biometricAvailable` (verificación de hardware en vivo). Ambos deben ser `true`
