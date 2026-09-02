---
title: Production Releases
parent: Build & Distribution
nav_order: 6
---

# Production Releases

Production uses the **`production`** profile (store signing) and **`eas submit`**.
Firebase is not involved here at all.

## iOS → App Store Connect

```bash
eas build --profile production --platform ios --local --output ./build/app-production.ipa
eas submit --profile production --platform ios --path ./build/app-production.ipa
```

{: .important }
> **From App Store Connect you then send the build to TestFlight or to review.**
> `eas submit` only uploads the binary — it does **not** submit it anywhere on its own.

## Android → Google Play

```bash
eas build --profile production --platform android --local --output ./build/app-production.aab
eas submit --profile production --platform android --path ./build/app-production.aab
```

`eas submit` for Android needs a Google Play **service-account key**. If it isn't
configured yet, EAS walks you through creating one.

Submit metadata (Apple ID, App Store app id, bundle id) lives in the
`submit.production` block of `eas.json`, so you don't pass it on the command line.

Once `eas submit` finishes, the build is uploaded but **not live** — it's sitting
in TestFlight (iOS) or a Play track (Android). See
[Store Submission](store-submission.html) for the console steps that take it to
production.

{: .note }
With EAS **cloud** build credits you can build without `--local` and then submit
the most recent cloud build with `--latest` (no `--path` needed):
`eas submit --profile production --platform ios --latest`.
