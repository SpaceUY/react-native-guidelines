---
title: Agregar un Nuevo Dispositivo iOS
parent: Compilación y Distribución
nav_order: 4
---

# Agregar un Nuevo Dispositivo iOS

{: .important-title }
Importante

{: .important }
**La regla ad-hoc:** un build de iOS se instala **solo** en dispositivos
cuyo **UDID esté incluido en el provisioning profile** con el que fue
firmado. Si un dispositivo no está en el profile, iOS se niega a
instalarlo. No hay workaround — tenés que recompilar con un profile que
incluya ese dispositivo.

## 1. Registrar el dispositivo (una vez por dispositivo)

```bash
eas device:create        # elegí "Website"; mandale el link/QR al tester
```

El tester tiene que abrir el link **en el iPhone que va a usar**. Instala
un perfil de configuración y registra el UDID del dispositivo en el Apple
Developer portal. Confirmá que se registró:

```bash
eas device:list --apple-team-id <TEAM_ID>
```

## 2. El caso límite crítico

El script de distribución compila con `--non-interactive`. En ese modo EAS
**reusa el provisioning profile cacheado** y **no** agrega automáticamente
los dispositivos recién registrados.

{: .warning-title }
Advertencia

{: .warning }
**Síntoma:** el tester abre el link, ve *"Dispositivo registrado — vas a
recibir un email cuando la app esté lista"*, pero el **botón de instalar
nunca aparece**. El dispositivo está registrado con Apple, pero el build
que subiste fue firmado *antes* de eso, con un profile que no incluye el
UDID nuevo.

## 3. La solución determinística — regenerar el profile con TODOS los dispositivos

```bash
eas credentials          # interactivo; pide tu login de Apple
```

Después navegá:

1. Platform **iOS** → build profile **preview** → tu app
   (`com.yourorg.app`, team `<TEAM_ID>`).
2. Elegí **Build Credentials → set up all required credentials** (o
   **Provisioning Profile → create a new provisioning profile**).
3. Cuando liste los dispositivos, **seleccioná TODOS** — apretá **espacio**
   en cada uno para que todos queden tildados. (Este es exactamente el paso
   donde se suele dejar afuera un dispositivo.) Confirmá.

Después recompilá y redistribuí:

```bash
pnpm run release:preview:ios
```

Finalmente, **verificá el IPA** antes de que el tester lo intente de
nuevo — ver la página siguiente.

{: .note-title }
Nota

{: .note }
**Límites de Apple:** 100 dispositivos por año, por tipo de dispositivo, y
la cuota **no se resetea** cuando borrás un dispositivo. Cada dispositivo
nuevo implica regenerar + recompilar — así que **juntá varios dispositivos
nuevos y regenerá una sola vez**, en vez de recompilar por cada tester que
se suma.
