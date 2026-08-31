---
title: Configuración Inicial
parent: Compilación y Distribución
nav_order: 2
---

# Configuración Inicial

Hacé esto una vez por máquina (y una vez por proyecto, del lado de
Firebase). Si todavía no instalaste las herramientas, ver **Primeros Pasos →
Requisitos Previos y Herramientas**.

## 1. Iniciar sesión en los CLIs

```bash
npx firebase login    # cuenta de Google con acceso al proyecto de Firebase
eas login             # cuenta de Expo
```

## 2. Crear tu `.env`

El script de distribución lee tres variables. Copiá la plantilla y
completalas desde **Firebase Console → Project settings → General → Your
apps**:

```bash
cp scripts/.env.example .env
```

```
FIREBASE_ANDROID_APP_ID=1:000000000000:android:xxxxxxxxxxxx
FIREBASE_IOS_APP_ID=1:000000000000:ios:xxxxxxxxxxxx
FIREBASE_TESTER_GROUP=internal
```

{: .note-title }
Nota

{: .note }
`.env` está ignorado por git — **nunca lo commitees**.

## 3. Crear el proyecto de Firebase + el grupo de testers (solo la primera vez)

1. **Creá el proyecto** en la consola de Firebase. Analytics es opcional —
   App Distribution no lo necesita.
2. **Registrá las apps con tus identificadores de producción:** la app de
   Android con tu **package name** de producción, la de iOS con tu **bundle
   id** de producción. Podés **saltearte** la descarga de
   `google-services.json` / `GoogleService-Info.plist` y los pasos de
   instalación del SDK — App Distribution solo necesita el CLI.
3. **Activá App Distribution** y creá un **grupo** de testers. Asegurate de
   que el **alias** del grupo coincida exactamente con
   `FIREBASE_TESTER_GROUP` (ej. `internal`), y después agregale los emails
   de tus testers.
