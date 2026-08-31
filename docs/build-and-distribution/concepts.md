---
title: Concepts
parent: Build & Distribution
nav_order: 1
---

# Concepts

## EAS build profiles

Builds are described by **profiles** in `eas.json`. Three matter:

| Profile | Distribution | For |
| --- | --- | --- |
| `development` | internal | Dev client, local development |
| `preview` | internal → APK / ad-hoc | **Testers.** Sets `APP_ENV=preview` |
| `production` | store | **The stores.** Store signing |

```json
{
  "cli": { "version": ">= 14.4.1", "appVersionSource": "remote" },
  "build": {
    "preview": {
      "distribution": "internal",
      "autoIncrement": true,
      "env": { "APP_ENV": "preview" }
    }
  }
}
```

## Local builds

We build **locally** (the `--local` flag) so we don't spend EAS cloud credits.
The compiled `.apk` / `.ipa` / `.aab` lands in `./build/` on your machine.

## The golden rule

{: .important }
An **internal (ad-hoc)** build can't be uploaded to the store, and a **store**
build can't be installed directly on a phone. They're signed differently and are
**not interchangeable**. Mixing them up is the number-one time-waster — keep the
two paths separate in your head.

## Firebase App Distribution ≠ the stores

Firebase App Distribution is a free channel that **hosts a build and emails
testers a link**. Registering an "app" there creates **no** App Store or Play
listing — it's purely a delivery pipe, which is exactly why we can automate it
from the command line.

## Bundle id

An internal build that uses the **production** bundle id will **replace** the
store app on a device (they can't coexist). On Android, if a differently-signed
store version is installed, the tester must uninstall it first.
