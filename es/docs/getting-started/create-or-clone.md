---
title: Crear o Clonar un Proyecto
parent: Primeros Pasos
nav_order: 2
---

# Crear o Clonar un Proyecto

## Empezar un proyecto nuevo

```bash
pnpm create expo-app my-app        # o: npx create-expo-app@latest my-app
cd my-app && pnpm install
```

Esto te da una app de Expo moderna (estilo SDK 54 / RN 0.81) con TypeScript y
ruteo basado en archivos, lista para usar.

## Sumarte a un proyecto existente

```bash
git clone <repo-url>
cd <repo>
pnpm install
```

## Una nota sobre las carpetas nativas

{: .note-title }
Nota

{: .note }
Algunos proyectos commitean las carpetas `ios/` y `android/` (el workflow
"bare"); otros las generan a demanda con `npx expo prebuild`. Cualquiera de
las dos está bien — solo tenés que saber en cuál estás. La sección **Entorno
y Configuración** explica cómo un `app.config.ts` dinámico maneja los
identificadores nativos por ambiente.

## Higiene de Git: tu `.gitignore`

`create-expo-app` incluye un `.gitignore` sólido para el workflow **managed**.
Apenas commiteás las carpetas `ios/` y `android/` (bare) o corrés
`npx expo prebuild`, también heredás sus **artefactos de build** — y esos _no_
están en el template por defecto. Si terminan en git, cada compañero se baja
cientos de MB de artefactos compilados y los diffs se vuelven ilegibles.

{: .warning-title }
Advertencia

{: .warning }
**Los builds no van en el repo.** Las apps compiladas (`*.apk`, `*.aab`,
`*.ipa`), las carpetas de build nativas (`ios/build/`, `android/app/build/`) y
los caches de dependencias (`ios/Pods/`, `node_modules/`) son todos _generados_
— se regeneran desde el código en cada build. Commitearlos infla el historial
de forma irreversible.

Asegurate de que tu `.gitignore` cubra al menos lo siguiente:

```gitignore
# Dependencias
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Artefactos de build nativos — generados, nunca commitear
ios/build/
android/build/
android/app/build/
android/.gradle/
android/.cxx/
*.apk
*.aab
*.ipa
*.app
*.dSYM
*.dSYM.zip

# CocoaPods (se restaura con `pod install`)
ios/Pods/
ios/.xcode.env.local

# Config local de la máquina (Android)
android/local.properties

# Metro / bundler
.metro-health-check*
*.jsbundle

# Material de firma y secretos — nunca commitear
*.keystore
!debug.keystore
*.p8
*.p12
*.key
*.mobileprovision
.env
.env.*
!.env.example

# Logs y salida de debug
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# TypeScript
*.tsbuildinfo

# Ruido de IDE / SO
.DS_Store
.vscode/
.idea/
*.pem
```

Algunas notas sobre las entradas que suelen confundir:

- **`!debug.keystore`** — el keystore de *debug* compartido de Android se puede
  commitear tranquilo para que todos tengan la misma firma de debug. Tu keystore
  de **release** es un secreto: mantenelo fuera del repo (guardalo en EAS o en un
  gestor de secretos).
- Los **archivos `.env.*`** (`.env.dev`, `.env.preview`, `.env.prod`) se
  ignoran; **`.env.example`** se commitea. Mirá **Variables de Entorno** y
  **Entorno y Configuración → Secretos** para la regla completa — y rotá
  cualquier cosa que se filtre en el historial de git.
- **Config de Firebase** (`google-services.json`, `GoogleService-Info.plist`): si
  un proyecto las genera por ambiente en tiempo de build, ignoralas; si commitea
  una única config no secreta, commiteala. Decidilo una vez por proyecto y
  documentalo en el `README` del repo.

{: .note-title }
Nota

{: .note }
Si un artefacto de build _ya_ está trackeado, agregarlo al `.gitignore` no lo
elimina — Git solo ignora cambios de archivos *no trackeados*. Dejá de trackearlo
con `git rm -r --cached ios/build android/app/build` (ajustá las rutas) y después
commiteá.

Siguiente: configurá tus **Variables de Entorno**.
