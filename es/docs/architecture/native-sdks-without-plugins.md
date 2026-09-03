---
title: SDKs Nativos Sin Plugin de Expo
parent: Arquitectura del Proyecto
nav_order: 4
---

# SDKs Nativos Sin Plugin de Expo

El proyecto se mantiene en el **workflow managed** (ver **Primeros Pasos →
Workflow Managed (CNG)**) incluso para un SDK nativo sin integración de Expo —
escribiendo un **config plugin local** chico en vez de ejectar a bare o
commitear `ios/`/`android/`.

## Cuándo aplica

Algunos SDKs de proveedores — verificación de identidad/KYC, pagos, y
similares — solo traen instrucciones de instalación nativa: una dependencia
de CocoaPods y claves de `Info.plist` en iOS, una dependencia/repositorio de
Gradle y entradas de `AndroidManifest.xml` en Android. Ningún plugin de
`app.config.ts`, ni oficial ni de comunidad.

Es exactamente lo que le pasó al equipo integrando **Sumsub** (verificación de
identidad) en un proyecto interno: no existía un plugin de Expo, y la propia
doc del SDK solo describe pasos nativos.

{: .note-title }
Nota

{: .note }
Buscá primero, siempre. Revisá npm/GitHub por `<nombre del sdk> expo plugin` o
`expo-config-plugin-*` antes de escribir el tuyo — la mayoría de los SDKs
populares ya tienen uno, oficial o mantenido por la comunidad.

## El patrón

Creá un archivo por SDK bajo `plugins/`, ej. `plugins/withSumsub.js`. Usa los
mods de [`@expo/config-plugins`](https://docs.expo.dev/config-plugins/introduction/)
para aplicar los pasos de instalación nativa del SDK de forma programática,
así `npx expo prebuild` — corrido local o por EAS Build — genera un proyecto
nativo con el SDK ya integrado.

```js
// plugins/withSumsub.js
const {
  withPlugins,
  withInfoPlist,
  withAndroidManifest,
  withAppBuildGradle,
} = require("@expo/config-plugins");

// Plantilla esquemática. Los mods de abajo están intencionalmente vacíos —
// completalos con la guía oficial de instalación nativa del SDK. Nunca
// copies claves de Info.plist, permisos, o coordenadas de Gradle de este
// archivo — son específicos de la versión del SDK que estés integrando.

function withSumsubIOS(config) {
  return withInfoPlist(config, (config) => {
    // Setear las claves de Info.plist que pide la guía de instalación de iOS del SDK.
    return config;
  });
}

function withSumsubAndroid(config) {
  config = withAndroidManifest(config, (config) => {
    // Agregar los permisos / entradas <meta-data> que pide el merge del manifest del SDK.
    return config;
  });
  return withAppBuildGradle(config, (config) => {
    // Agregar el repositorio Maven / línea de dependencia que pide la guía de instalación del SDK.
    return config;
  });
}

module.exports = function withSumsub(config) {
  return withPlugins(config, [withSumsubIOS, withSumsubAndroid]);
};
```

```ts
// app.config.ts
export default () => ({
  expo: {
    // ...
    plugins: ["./plugins/withSumsub"],
  },
});
```

Si el paso de instalación de iOS del SDK es una entrada directa en el
`Podfile` en vez de una clave de `Info.plist`, el mod equivalente es
`withPodfile`, del mismo paquete.

## Escalar a más de un SDK

Un archivo por SDK, cada uno acotado a una sola responsabilidad nativa — el
mismo principio de unidades chicas y bien delimitadas que sigue el resto del
código (ver **Estructura Basada en Features**). Se componen en el array
`plugins` de `app.config.ts`; cada entrada es independiente y fácil de sacar
si se deja de usar el SDK.

## Testearlo

Corré `npx expo prebuild --clean` local para regenerar `ios/` y `android/` y
confirmar que el mod se aplicó bien (abrí el proyecto generado en Xcode /
Android Studio si hace falta), y después borrá las carpetas generadas de
nuevo — igual nunca se commitean. Ver **Primeros Pasos → Workflow Managed
(CNG)**.

{: .note-title }
Nota

{: .note }
Volvé a chequear esto antes de cualquier build de EAS que toque el plugin. Un
config plugin roto no falla hasta el paso de build nativo — no hay ningún
aviso antes.

## Mantenimiento

A diferencia de `ios/`/`android/`, el archivo del plugin sí es código
commiteado — el code review y el `git blame` normales aplican.

{: .warning-title }
Advertencia

{: .warning }
**Pineá la versión del SDK nativo.** Un bump de versión puede cambiar en
silencio qué configuración nativa necesita (un permiso nuevo, un Podspec
cambiado) — `prebuild` no te avisa si el plugin quedó desalineado con lo que
pide la nueva versión del SDK. Revisá el plugin contra el changelog del SDK en
cada upgrade.

## Ver también

- **Primeros Pasos → Workflow Managed (CNG)** — por qué esto en vez de bare o
  eject.
- **Entorno y Configuración → Configuración en Tiempo de Compilación** — cómo
  ya está estructurado `app.config.ts` para valores por ambiente; este plugin
  se registra en el mismo archivo.
