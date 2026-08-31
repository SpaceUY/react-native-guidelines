---
title: Ejecutar la App
parent: Primeros Pasos
nav_order: 4
---

# Ejecutar la App

## Iniciar el servidor de desarrollo

```bash
pnpm start        # expo start
```

Presioná `i` para iOS, `a` para Android, o escaneá el código QR.

## Compilar y correr la app nativa

Cuando tu proyecto usa módulos nativos a medida, corré el **dev client** en vez
de Expo Go:

```bash
pnpm ios          # expo run:ios
pnpm android      # expo run:android
```

{: .note-title }
Nota

{: .note }
**Expo Go vs. un dev client:** Expo Go es el sandbox rápido que solo incluye
los módulos nativos propios de Expo. En cuanto un proyecto agrega su propio
código nativo, necesitás un dev client — los dos comandos de arriba te
compilan uno.

## Problemas comunes al correrla por primera vez

- **Pods de iOS desactualizados** — corré `cd ios && pod install && cd ..`, o
  simplemente volvé a correr `pnpm ios`.
- **Android SDK no encontrado** — asegurate de que `ANDROID_HOME` apunte a tu
  SDK y que Android Studio tenga instalado una platform + build-tools.
- **Errores raros de caché/Metro** — limpiá la caché: `pnpm start -- -c` (o
  `expo start -c`).

Una vez que la app arranca, andá a **Arquitectura del Proyecto** para aprender
cómo está organizado el código.
