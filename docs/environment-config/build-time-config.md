---
title: Build-Time Config
parent: Environment & Configuration
nav_order: 2
---

# Build-Time Config

A single variable, **`APP_ENV`** (`development` | `preview` | `production`),
drives a **dynamic `app.config.ts`**. Each environment gets its own bundle id,
package name, scheme, and deep-link host — so a dev build, a test build, and the
store build can all sit on the same phone at once.

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

`APP_ENV` is set **per EAS build profile** in `eas.json` (the `env` block), so
you never set it by hand — picking a profile picks the environment. See
**Build & Distribution → Concepts**.

{: .note }
Pair this with `appVersionSource: "remote"` and `autoIncrement: true` in
`eas.json` so EAS manages build numbers for you instead of hand-editing them.
