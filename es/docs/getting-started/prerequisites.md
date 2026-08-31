---
title: Requisitos Previos y Herramientas
parent: Primeros Pasos
nav_order: 1
---

# Requisitos Previos y Herramientas

Instalá esto una sola vez. La columna de la derecha te dice cómo verificar que cada cosa está lista.

| Herramienta | Mínimo | Verificar |
| --- | --- | --- |
| Node.js | 20+ | `node -v` |
| pnpm | 9+ | `pnpm -v` |
| EAS CLI | última | `eas --version` (instalar: `npm i -g eas-cli`) |
| firebase-tools | última | `npx firebase --version` |
| Xcode (macOS, para iOS) | última estable | `xcodebuild -version` |
| Android Studio + SDK | última | `adb --version` |

{: .note-title }
Nota

{: .note }
Usamos **pnpm** como package manager. Es más rápido y más estricto que npm con
tu árbol de dependencias, lo que detecta temprano los bugs de "funciona en mi
máquina". Activalo con Corepack si no lo tenés: `corepack enable && corepack prepare pnpm@latest --activate`.

## Cuentas que vas a necesitar

- **Expo** — para builds y OTA. Iniciá sesión con `eas login`.
- **Apple Developer** — necesario para firmar y publicar builds de iOS (tanto
  para testing ad-hoc como para la App Store).
- **Firebase** — acceso al proyecto usado para distribución interna de pruebas.

Una vez que cada fila esté en orden, seguí con **Crear o Clonar un Proyecto**.
