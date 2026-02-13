---
title: "UC-004: Activar Autenticación Biométrica"
sidebar_label: "UC-004: Activar Auth Biométrica"
sidebar_position: 4
---

# UC-004: Activar Autenticación Biométrica

## Descripción

El usuario activa la autenticación biométrica (Touch ID / Face ID) desde los ajustes de la wallet. Esto permite desbloquear la wallet usando el sensor biométrico del dispositivo en lugar de escribir la contraseña. La activación requiere una verificación biométrica exitosa para confirmar que el usuario tiene acceso biométrico. Actualmente implementado completamente solo en macOS.

## Actores

- **Usuario Final**: Persona que activa la autenticación biométrica en su wallet
- **Wallet (Frontend)**: Aplicación Svelte que gestiona la UI de ajustes y el estado
- **Wallet (Rust Backend)**: Comandos Tauri que interactúan con las APIs biométricas del SO
- **Sistema Operativo**: Proporciona el framework de autenticación biométrica (LocalAuthentication en macOS)

## Precondiciones

- El usuario tiene una identidad creada en la wallet ([UC-001](/docs/developers/use-cases/wallet/uc-001-create-identity))
- El usuario está autenticado y en el dashboard
- El dispositivo tiene hardware biométrico disponible (ej: sensor Touch ID en macOS)
- La biometría está registrada en el SO (al menos una huella o rostro registrado)
- La autenticación biométrica está actualmente desactivada (`biometricEnabled: false`)

## Flujo Principal

1. El usuario navega a **Ajustes** (`/dashboard/settings`)
2. La página de ajustes ejecuta una verificación de disponibilidad al montar: invoca el comando Rust `is_biometric_available`
3. El Rust backend (macOS): instancia un `LAContext`, llama a `canEvaluatePolicy` con la política `deviceOwnerAuthenticationWithBiometrics` (valor de política 1)
4. La verificación devuelve `true` — el toggle biométrico se muestra habilitado e interactivo
5. El usuario activa el interruptor de **Autenticación Biométrica** a ON
6. La wallet invoca el comando Rust `authenticate_biometric` para verificar la biometría del usuario
7. El SO muestra el prompt biométrico nativo con el mensaje: "Authenticate to enable biometric unlock for Almena ID"
8. El usuario se autentica exitosamente (huella o rostro)
9. El Rust backend devuelve éxito
10. La wallet actualiza el auth store: `setBiometricEnabled(true)`
11. La wallet persiste el flag en el Tauri Store: `updateIdentityInStore({ biometricEnabled: true })` en `identity.json`
12. El toggle permanece en ON y la descripción se actualiza a "Desbloquear con huella o reconocimiento facial"

## Flujos Alternativos

### FA-1: Hardware biométrico no disponible
- En el paso 3, `canEvaluatePolicy` devuelve `false`
- El toggle se muestra deshabilitado con una etiqueta "No disponible"
- La descripción indica: "No disponible en este dispositivo"
- El usuario no puede activar la biometría

### FA-2: El usuario cancela el prompt biométrico
- En el paso 8, el usuario cancela el diálogo biométrico del SO
- El Rust backend devuelve el código de error `LAErrorUserCancel` (-2) mapeado a `USER_CANCELLED`
- El toggle vuelve a OFF silenciosamente (no se muestra alerta de error)

### FA-3: La verificación biométrica falla
- En el paso 8, la biometría no coincide
- El Rust backend devuelve un error con la descripción del fallo
- Se muestra una alerta al usuario con el mensaje de error
- El toggle vuelve a OFF

### FA-4: Timeout de autenticación
- En el paso 8, el usuario no responde en 60 segundos
- El Rust backend devuelve "Authentication timed out"
- El toggle vuelve a OFF

### FA-5: El usuario desactiva la biometría
- El usuario cambia el interruptor a OFF
- La wallet actualiza el auth store: `setBiometricEnabled(false)`
- La wallet persiste: `updateIdentityInStore({ biometricEnabled: false })`
- No se requiere prompt biométrico para desactivar

## Postcondiciones

- `biometricEnabled: true` está persistido en el Tauri Store (`identity.json`)
- El auth store refleja `biometricEnabled: true`
- En los bloqueos posteriores de la wallet, la pantalla de bloqueo mostrará un botón "Usar Biometría" (ver [UC-005](/docs/developers/use-cases/wallet/uc-005-unlock-wallet-with-biometrics))
- La wallet no almacena plantillas biométricas ni secretos — el SO gestiona todos los datos biométricos

## Módulos Involucrados

| Módulo | Rol |
|--------|-----|
| **wallet** (frontend) | UI de ajustes, manejo del toggle, verificación de disponibilidad, actualización del auth store |
| **wallet** (Rust backend) | Integración con `LAContext` de macOS via Objective-C runtime, comandos `is_biometric_available` y `authenticate_biometric` |

## Notas Técnicas

- **Implementación macOS**: Usa el framework `LocalAuthentication` mediante bindings de Objective-C runtime (crates `objc` y `block`). Política: `deviceOwnerAuthenticationWithBiometrics` (solo biométrico, sin fallback a passcode del dispositivo)
- **Estado de soporte por plataforma**:
  - macOS: Completamente implementado (Touch ID / Face ID)
  - Windows: Stub — `is_biometric_available` devuelve `false`
  - Linux: Stub — devuelve `false`
  - iOS: Stub — devuelve `true` (placeholder)
  - Android: Stub — devuelve `true` (placeholder)
- **No se almacenan datos biométricos**: La wallet solo guarda un flag booleano. Toda la verificación biométrica se delega al SO — la wallet nunca accede a plantillas de huellas ni datos faciales
- **Verificación sin estado**: Cada prompt biométrico es independiente. No hay token de sesión ni resultado biométrico cacheado
- **Activar requiere prueba**: El usuario debe pasar una verificación biométrica para activar la funcionalidad, evitando la activación no autorizada
