---
title: Agregar un Nuevo Dispositivo iOS
parent: Compilación y Distribución
nav_order: 4
---

# Agregar un Nuevo Dispositivo iOS

## Por qué tenés que hacer esto (la versión de 30 segundos)

Fuera de la App Store, Apple no deja que tu app se instale en cualquier
iPhone. Para builds de prueba internos — Apple lo llama **distribución
ad-hoc** — tenés que declarar *de antemano* exactamente qué iPhones tienen
permitido correr el build. No se instala en ningún teléfono que no hayas
declarado antes.

Pensá un build como una **fiesta privada con lista de invitados en la puerta**:

- **UDID** — la huella única de cada iPhone, como el número de documento de
  una persona.
- **Provisioning profile** — la **lista de invitados**. iOS es el de
  seguridad en la puerta: si el UDID de un dispositivo no está en la lista,
  no lo deja entrar y la app no se instala.
- **Firma (code signing)** — en el momento en que se crea el build, la lista
  de invitados actual queda **sellada adentro**. No podés agregar un nombre a
  la lista después; tenés que imprimir una lista nueva y volver a compilar.

Ese último punto es toda la razón por la que existe esta página. Registrar un
dispositivo nuevo (Paso 1) solo agrega su nombre a la lista *maestra* de
dispositivos conocidos de Apple — **no** toca la lista de invitados que ya
quedó sellada en un build que enviaste antes. Para dejar entrar al dispositivo
nuevo, tenés que regenerar el profile *con ese dispositivo incluido* y
**recompilar** (Paso 3). En una línea: un build se instala **solo** en
dispositivos cuyo **UDID quedó incluido en el profile con el que fue firmado**
— si el dispositivo no está en el profile, no se instala, y no hay workaround
más que recompilar.

## 1. Registrar el dispositivo (una vez por dispositivo)

```bash
eas device:create        # elegí "Website"; mandale el link/QR al tester
```

El tester tiene que abrir el link **en el iPhone que va a usar**. Instala
un perfil de configuración y agrega el UDID del dispositivo a la lista
maestra de Apple en el Apple Developer portal (este es el paso de "agregar
un nombre a la lista maestra" — todavía **no** lo pone en la lista de
invitados sellada de ningún build). Confirmá que se registró:

```bash
eas device:list --apple-team-id <TEAM_ID>
```

## 2. El caso límite crítico

El script de distribución compila con `--non-interactive`. En ese modo EAS
**reusa el provisioning profile cacheado** (la lista de invitados que ya
tiene guardada) y **no** lo regenera para incluir los dispositivos recién
registrados. Así que el dispositivo nuevo está en la lista maestra de Apple,
pero no en la lista de invitados sellada del build que acabás de enviar.

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
   en cada uno para que todos queden tildados. Acá estás imprimiendo la lista
   de invitados nueva: cualquiera que no tildes queda afuera de ella y no va a
   poder instalar. (Este es exactamente el paso donde se suele dejar afuera un
   dispositivo.) Confirmá.

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
