---
title: Configuración en Tiempo de Compilación
parent: Entorno y Configuración
nav_order: 2
---

# Configuración en Tiempo de Compilación

Una única variable, **`APP_ENV`** (`development` | `preview` | `production`),
maneja un **`app.config.ts` dinámico**. Cada ambiente tiene su propio bundle
id, package name, scheme y host de deep-link — así un build de dev, uno de
test y el build de tienda pueden convivir en el mismo teléfono a la vez.

```ts
// app.config.ts
const APP_ENV = process.env.APP_ENV ?? "development";

function getDynamicAppConfig(env: string) {
  const base = { name: "MyApp", scheme: "myapp" };

  if (env === "production") {
    return {
      ...base,
      ios: { bundleIdentifier: "com.yourorg.app" },
      android: { package: "com.yourorg.app" },
    };
  }
  if (env === "preview") {
    return {
      ...base,
      name: "MyApp (preview)",
      scheme: "myapp.preview",
      ios: { bundleIdentifier: "com.yourorg.app.preview" },
      android: { package: "com.yourorg.app.preview" },
    };
  }
  return {
    ...base,
    name: "MyApp (dev)",
    scheme: "myapp.dev",
    ios: { bundleIdentifier: "com.yourorg.app.dev" },
    android: { package: "com.yourorg.app.dev" },
  };
}

export default () => ({ expo: getDynamicAppConfig(APP_ENV) });
```

`APP_ENV` se configura **por build profile de EAS** en `eas.json` (el bloque
`env`), así que nunca lo seteás a mano — elegir un profile elige el
ambiente. Ver **Compilación y Distribución → Conceptos**.

{: .note-title }
Nota

{: .note }
Combiná esto con `appVersionSource: "remote"` y `autoIncrement: true` en
`eas.json` para que EAS te maneje los números de build en vez de
editarlos a mano.
