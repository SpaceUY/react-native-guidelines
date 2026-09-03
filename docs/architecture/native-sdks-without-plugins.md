---
title: Native SDKs Without an Expo Plugin
parent: Project Architecture
nav_order: 4
---

# Native SDKs Without an Expo Plugin

The project stays on the **managed workflow** (see **Getting Started →
Managed Workflow (CNG)**) even for a native SDK that has no Expo integration —
by writing a small **local config plugin** instead of ejecting to bare or
committing `ios/`/`android/`.

## When this applies

Some vendor SDKs — KYC/identity-verification providers, payment SDKs, and
similar — ship only native install instructions: a CocoaPods dependency and
`Info.plist` keys for iOS, a Gradle dependency/repository and
`AndroidManifest.xml` entries for Android. No `app.config.ts` plugin, official
or community.

This is exactly the situation the team hit integrating **Sumsub** (identity
verification) on an internal project: no Expo plugin existed, and the SDK's
own docs only describe native steps.

{: .note }
Always search first. Check npm/GitHub for `<sdk name> expo plugin` or
`expo-config-plugin-*` before writing your own — most popular SDKs already
have one, official or maintained by the community.

## The pattern

Create one file per SDK under `plugins/`, e.g. `plugins/withSumsub.js`. It
uses [`@expo/config-plugins`](https://docs.expo.dev/config-plugins/introduction/)
mod functions to apply the SDK's native install steps programmatically, so
`npx expo prebuild` — run locally or by EAS Build — produces a native project
with the SDK already wired in.

```js
// plugins/withSumsub.js
const {
  withPlugins,
  withInfoPlist,
  withAndroidManifest,
  withAppBuildGradle,
} = require("@expo/config-plugins");

// Schematic template only. The mod bodies below are intentionally empty —
// fill each one in from the SDK's official native install guide. Never copy
// Info.plist keys, permissions, or Gradle coordinates from this file — they
// are specific to the SDK version you're integrating.

function withSumsubIOS(config) {
  return withInfoPlist(config, (config) => {
    // Set the Info.plist keys the SDK's iOS install guide requires.
    return config;
  });
}

function withSumsubAndroid(config) {
  config = withAndroidManifest(config, (config) => {
    // Add the permissions / <meta-data> entries the SDK's manifest merge requires.
    return config;
  });
  return withAppBuildGradle(config, (config) => {
    // Add the Maven repository / dependency line the SDK's install guide requires.
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

If the SDK's iOS install step is a raw `Podfile` entry instead of an
`Info.plist` key, the equivalent mod is `withPodfile`, from the same package.

## Scaling to more than one SDK

One file per SDK, each scoped to a single native concern — the same
small-well-bounded-units principle the rest of the codebase follows (see
**Feature-Based Structure**). Compose them in `app.config.ts`'s `plugins`
array; each entry is independent and easy to remove if the SDK is dropped.

## Testing it

Run `npx expo prebuild --clean` locally to regenerate `ios/` and `android/`
and confirm the mod applied correctly (open the generated project in Xcode /
Android Studio if needed), then delete the generated folders again — they're
still never committed. See **Getting Started → Managed Workflow (CNG)**.

{: .note }
Re-run this check before any EAS build that touches the plugin. A broken
config plugin doesn't fail until the native build step — there's no earlier
warning.

## Maintenance

Unlike `ios/`/`android/`, the plugin file itself is committed source — normal
code review and `git blame` apply to it.

{: .warning }
**Pin the native SDK's version.** A version bump can silently change what
native config it needs (a new permission, a changed Podspec) — `prebuild`
won't warn you if the plugin has drifted from what the new SDK version
requires. Re-check the plugin against the SDK's changelog on every upgrade.

## See also

- **Getting Started → Managed Workflow (CNG)** — why this instead of bare or
  eject.
- **Environment & Configuration → Build-Time Config** — how `app.config.ts` is
  already structured for per-environment values; this plugin registers into
  the same file.
