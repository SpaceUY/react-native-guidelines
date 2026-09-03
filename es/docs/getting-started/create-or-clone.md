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
El default del equipo es el **workflow managed con Continuous Native
Generation (CNG)**: las carpetas `ios/` y `android/` nunca se commitean. Se
generan a demanda — local con `npx expo prebuild`, o de forma transparente en
EAS Build — a partir de `app.config.ts` y los paquetes instalados. Ver
**Primeros Pasos → Workflow Managed (CNG)** para la justificación completa y
qué hacer cuando un SDK nativo necesita más que un config plugin.

## Higiene de Git: tu `.gitignore`

`create-expo-app` incluye un `.gitignore` sólido para el workflow **managed**
— el default de esta guía de abajo lo extiende ignorando `/ios` y `/android`
directamente, no solo sus subcarpetas de build. Si un proyecto se desvía de
ese default y commitea las carpetas nativas igual, también hereda sus
**artefactos de build**, que son fáciles de pasar por alto e inflan cada clon
con cientos de MB de artefactos compilados.

{: .warning-title }
Advertencia

{: .warning }
**Los builds no van en el repo.** Las apps compiladas (`*.apk`, `*.aab`,
`*.ipa`) y los caches de dependencias (`node_modules/`) son todos _generados_
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

# Carpetas nativas — generadas por CNG, nunca commitear (ver Workflow Managed)
/ios
/android

# Binarios de app compilados — generados en cada build
*.apk
*.aab
*.ipa
*.app
*.dSYM
*.dSYM.zip

# Metro / bundler
.metro-health-check*
*.jsbundle

# Material de firma y secretos — nunca commitear
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

- **No hay debug keystore de Android para commitear.** Con el default managed,
  `android/` no se commitea en absoluto, así que no hay un `debug.keystore`
  compartido al que hacerle una excepción. Cada máquina (y EAS) usa su propia
  firma de debug; si una feature realmente necesita un SHA-1 de debug
  compartido (ej. Google Sign-In), manejalo como credencial de EAS, no como
  archivo commiteado. Tu keystore de **release** siempre es un secreto,
  cualquiera sea el workflow: mantenelo fuera del repo (guardalo en EAS o en un
  gestor de secretos).
- Los **archivos `.env.*`** (`.env.dev`, `.env.preview`, `.env.prod`) se
  ignoran; **`.env.example`** se commitea. Mirá **Variables de Entorno** y
  **Entorno y Configuración → Secretos** para la regla completa — y rotá
  cualquier cosa que se filtre en el historial de git.
- **Config de Firebase** (`google-services.json`, `GoogleService-Info.plist`):
  con el default managed no pueden vivir dentro de `ios/`/`android/` (no se
  commitean), así que apuntalas desde afuera — ej. una ruta en la raíz
  referenciada vía `googleServicesFile` en `app.config.ts`, que un config
  plugin copia al proyecto generado en el `prebuild`. Si ese archivo en sí es
  seguro de commitear (normalmente es un identificador no secreto por
  proyecto) es una decisión que se toma una vez por proyecto y se documenta en
  el `README` del repo.

{: .note-title }
Nota

{: .note }
Si `ios/`, `android/`, o un artefacto de build _ya_ está trackeado, agregarlo
al `.gitignore` no lo elimina — Git solo ignora cambios de archivos *no
trackeados*. Dejá de trackearlo con `git rm -r --cached ios android` (ajustá
las rutas para una limpieza más acotada) y después commiteá.

Siguiente: configurá tus **Variables de Entorno**.
