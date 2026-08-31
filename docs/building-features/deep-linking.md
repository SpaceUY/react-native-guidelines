---
title: Deep Linking
parent: Building Features
nav_order: 8
---

# Deep Linking

A deep link opens a specific screen from outside the app — an email, a
notification, a browser. With Expo Router, links map to routes **automatically**:
a link to `/orders/123` opens `app/orders/[id].tsx`. You mostly just configure
the scheme.

## Scheme + universal links

- A custom **scheme** (`myapp://orders/123`) always works and is great for
  testing.
- **Universal / App Links** (`https://myapp.com/orders/123`) open the app from a
  real web URL and need platform association files (Apple `apple-app-site-
  association`, Android `assetlinks.json`).

{: .note }
Give each environment its **own scheme and host** so a dev build and a store
build don't fight over the same links. See **Environment & Configuration →
Build-Time Config** for how `APP_ENV` sets these per variant.

## Testing a link

```bash
npx uri-scheme open "myapp://orders/123" --ios
npx uri-scheme open "myapp://orders/123" --android
```
