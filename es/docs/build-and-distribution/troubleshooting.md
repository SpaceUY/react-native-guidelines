---
title: Solución de Problemas
parent: Compilación y Distribución
nav_order: 8
---

# Solución de Problemas

Errores reales, su causa, y la solución. Buscá tu mensaje acá antes de
meterte en una sesión de debugging.

| Error | Causa | Solución |
| --- | --- | --- |
| "Invalid Provisioning Profile ... signed with an Ad Hoc/Enterprise Provisioning Profile" en `eas submit` | Estás submiteando un build `preview` (ad-hoc) a la tienda | Compilá con el profile `production` y submiteá eso. Nunca hagas `eas submit` de un build preview |
| "The IPA bundle ID 'X' does not match your Firebase app's bundle ID 'Y'" | El App ID de Firebase apunta a una app registrada con un bundle id distinto | Registrá la app de iOS con tu bundle id de producción (Android con su package); apuntá los App IDs del `.env` a *esas* apps |
| El tester ve "Device registered, wait for email" pero no puede instalar (iOS) | El UDID del dispositivo no está en el provisioning profile del build subido — común al agregar un dispositivo, empeorado por `--non-interactive` | Regenerá el profile con **todos** los dispositivos vía `eas credentials`, recompilá, redistribuí; verificá el IPA primero |
| "Missing FIREBASE_ANDROID_APP_ID in .env" | No hay `.env`, o falta el App ID | `cp scripts/.env.example .env` y completá los App IDs reales |
| "Unable to select an Apple team in non-interactive mode" | Un comando no interactivo necesita saber el team | Agregá `--apple-team-id <TEAM_ID>` |
| Android "app not installed" / conflicto de firma | Ya está instalada una versión de tienda firmada de forma distinta | Desinstalá la versión de tienda primero, después instalá el build interno |
