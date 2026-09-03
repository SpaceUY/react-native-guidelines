---
title: Running the App
parent: Getting Started
nav_order: 5
---

# Running the App

## Start the dev server

```bash
pnpm start        # expo start
```

Press `i` for iOS, `a` for Android, or scan the QR code.

## Build and run the native app

When your project uses custom native modules, run the **dev client** instead of
Expo Go:

```bash
pnpm ios          # expo run:ios
pnpm android      # expo run:android
```

{: .note }
**Expo Go vs a dev client:** Expo Go is the quick sandbox that only includes
Expo's built-in native modules. As soon as a project adds its own native code,
you need a dev client — the two commands above build one for you.

## First-run gotchas

- **iOS pods out of date** — run `cd ios && pod install && cd ..`, or just
  re-run `pnpm ios`.
- **Android SDK not found** — make sure `ANDROID_HOME` points at your SDK and
  Android Studio has installed a platform + build-tools.
- **Weird Metro/cache errors** — clear the cache: `pnpm start -- -c` (or
  `expo start -c`).

Once the app launches, head to **Project Architecture** to learn how the code is
organized.
