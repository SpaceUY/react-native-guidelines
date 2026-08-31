---
title: Builds Internos (Firebase)
parent: Compilación y Distribución
nav_order: 3
---

# Builds Internos (Firebase)

Un solo comando compila la app localmente con el profile `preview` y la
sube a Firebase App Distribution.

## Conectar los scripts

```json
// package.json
{
  "scripts": {
    "release:preview:android": "node scripts/distribute-firebase.js android",
    "release:preview:ios": "node scripts/distribute-firebase.js ios"
  }
}
```

## Qué hace el script

1. **Valida el `.env`** — falla rápido con un mensaje claro si falta una
   variable `FIREBASE_*`, *antes* de perder tiempo con un build.
2. **Compila localmente** con el profile `preview`
   (`eas build --local --non-interactive`).
3. **Verifica que el artefacto** exista en `./build/`.
4. **Sube a Firebase** con **notas de release automáticas** — la rama
   actual, el SHA corto del commit, y el asunto del último commit.

Acá está el `scripts/distribute-firebase.js` completo:

```js
#!/usr/bin/env node
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const platform = process.argv[2];
if (platform !== "android" && platform !== "ios") {
  console.error("Usage: node scripts/distribute-firebase.js <android|ios>");
  process.exit(1);
}

// Minimal .env loader (no dotenv dependency)
(function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
})();

const appId =
  platform === "android"
    ? process.env.FIREBASE_ANDROID_APP_ID
    : process.env.FIREBASE_IOS_APP_ID;
const group = process.env.FIREBASE_TESTER_GROUP || "internal";

if (!appId) {
  const varName =
    platform === "android" ? "FIREBASE_ANDROID_APP_ID" : "FIREBASE_IOS_APP_ID";
  console.error(`Missing ${varName} in .env. Copy scripts/.env.example to .env.`);
  process.exit(1);
}

function git(cmd) {
  return execSync(`git ${cmd}`, { encoding: "utf8" }).trim();
}
let releaseNotes = "manual build";
try {
  releaseNotes = `${git("rev-parse --abbrev-ref HEAD")} ${git(
    "rev-parse --short HEAD",
  )} - ${git("log -1 --pretty=%s")}`;
} catch {}

function run(command) {
  execSync(command, { stdio: "inherit" });
}

const ext = platform === "android" ? "apk" : "ipa";
const artifact = path.resolve("build", `app-preview.${ext}`);
fs.mkdirSync(path.dirname(artifact), { recursive: true });

console.log(`\n> Building ${platform} (preview, local)...`);
run(
  `npx eas build -p ${platform} --profile preview --local --non-interactive ` +
    `--output "${artifact}"`,
);

if (!fs.existsSync(artifact)) {
  console.error(`Build finished but ${artifact} was not created. Aborting.`);
  process.exit(1);
}

console.log(`\n> Uploading to Firebase App Distribution (group: ${group})...`);
run(
  `npx firebase appdistribution:distribute "${artifact}" ` +
    `--app "${appId}" --groups "${group}" ` +
    `--release-notes "${releaseNotes.replace(/"/g, "'")}"`,
);

if (platform === "ios") {
  console.log(
    "\nNote: iOS is ad-hoc. A tester can only install if their device UDID is " +
      "in the provisioning profile. New device? See 'Adding a New iOS Device'.",
  );
}

console.log("\nDone.");
```

## Android

Sin restricciones de dispositivo — un solo comando:

```bash
pnpm run release:preview:android
```

El release aparece en **Firebase Console → App Distribution** (app de
Android), y los testers de tu grupo reciben un email con un link de
instalación.

## iOS

iOS usa distribución **ad-hoc**, que tiene reglas de dispositivo estrictas.
Corré:

```bash
pnpm run release:preview:ios
```

...pero leé **Agregar un Nuevo Dispositivo iOS** antes de prometerle un
build a un tester cuyo dispositivo todavía no registraste.

## Instrucciones para el tester

- **Android:** abrir el email de Firebase → tocar el link → instalar el
  `.apk` (permitir "instalar de fuentes desconocidas" si lo pide).
- **iOS:** abrir el link del email → instalar la app **Firebase App
  Tester** (la ofrece ahí mismo) → instalar el build desde App Tester.

{: .warning-title }
Advertencia

{: .warning }
**Android:** un tester que tiene instalada la versión de tienda tiene que
**desinstalarla primero** — el build interno está firmado de forma
distinta, y Android no instala sobre una firma diferente.
