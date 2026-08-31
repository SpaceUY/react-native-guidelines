---
title: Lanzamientos a Producción
parent: Compilación y Distribución
nav_order: 6
---

# Lanzamientos a Producción

Producción usa el profile **`production`** (firma de tienda) y **`eas
submit`**. Firebase no está involucrado acá para nada.

## iOS → App Store Connect

```bash
eas build --profile production --platform ios --local --output ./build/app-production.ipa
eas submit --profile production --platform ios --path ./build/app-production.ipa
```

Desde App Store Connect después mandás el build a TestFlight o a revisión.

## Android → Google Play

```bash
eas build --profile production --platform android --local --output ./build/app-production.aab
eas submit --profile production --platform android --path ./build/app-production.aab
```

`eas submit` para Android necesita una **service-account key** de Google
Play. Si todavía no está configurada, EAS te guía para crear una.

Los metadatos de submit (Apple ID, App Store app id, bundle id) viven en el
bloque `submit.production` de `eas.json`, así que no los pasás por línea de
comandos.

{: .note-title }
Nota

{: .note }
Con créditos de build en la **nube** de EAS podés compilar sin `--local` y
después submitear el build más reciente de la nube con `--latest` (sin
necesitar `--path`): `eas submit --profile production --platform ios
--latest`.
