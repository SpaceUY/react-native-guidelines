---
title: Create or Clone a Project
parent: Getting Started
nav_order: 2
---

# Create or Clone a Project

## Starting a new project

```bash
pnpm create expo-app my-app        # or: npx create-expo-app@latest my-app
cd my-app && pnpm install
```

This gives you a modern Expo app (SDK 54 / RN 0.81 style) with TypeScript and
file-based routing ready to go.

## Joining an existing project

```bash
git clone <repo-url>
cd <repo>
pnpm install
```

## A note on native folders

{: .note }
Some projects commit the `ios/` and `android/` folders (the "bare" workflow);
others generate them on demand with `npx expo prebuild`. Either is fine — just
know which one you're in. The **Environment & Configuration** section explains
how a dynamic `app.config.ts` drives the native identifiers per environment.

## Git hygiene: your `.gitignore`

`create-expo-app` ships a solid `.gitignore` for the **managed** workflow. The
moment you commit the `ios/` and `android/` folders (bare) or run
`npx expo prebuild`, you also inherit their **build outputs** — and those are
_not_ in the default template. If they land in git, every teammate pulls
hundreds of MB of compiled artifacts and diffs become unreadable.

{: .warning }
**Builds never belong in the repo.** Compiled apps (`*.apk`, `*.aab`, `*.ipa`),
native build folders (`ios/build/`, `android/app/build/`), and dependency caches
(`ios/Pods/`, `node_modules/`) are all _generated_ — regenerated from source on
every build. Committing them bloats history irreversibly.

Make sure your `.gitignore` covers at least the following:

```gitignore
# Dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native build outputs — generated, never commit
ios/build/
android/build/
android/app/build/
android/.gradle/
android/.cxx/
*.apk
*.aab
*.ipa
*.app
*.dSYM
*.dSYM.zip

# CocoaPods (restored by `pod install`)
ios/Pods/
ios/.xcode.env.local

# Android local machine config
android/local.properties

# Metro / bundler
.metro-health-check*
*.jsbundle

# Signing material & secrets — must never be committed
*.keystore
!debug.keystore
*.p8
*.p12
*.key
*.mobileprovision
.env
.env.*
!.env.example

# Logs & debug output
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# TypeScript
*.tsbuildinfo

# IDE / OS noise
.DS_Store
.vscode/
.idea/
*.pem
```

A few notes on the entries that trip people up:

- **`!debug.keystore`** — the shared Android *debug* keystore is safe to commit
  so every developer gets the same debug signature. Your **release** keystore is
  a secret: keep it out of the repo (store it in EAS or a secrets manager).
- **The `.env.*` files** (`.env.dev`, `.env.preview`, `.env.prod`) are ignored;
  **`.env.example`** is committed. See **Environment Variables** and
  **Environment & Configuration → Secrets** for the full rule — and rotate
  anything that leaks into git history.
- **Firebase config** (`google-services.json`, `GoogleService-Info.plist`): if a
  project generates these per-environment at build time, ignore them; if it
  checks in a single non-secret config, commit it. Decide once per project and
  document it in the repo's `README`.

{: .note }
If a build artifact is _already_ tracked, adding it to `.gitignore` won't remove
it — Git keeps ignoring changes only to *untracked* files. Stop tracking it with
`git rm -r --cached ios/build android/app/build` (adjust paths), then commit.

Next: set up your **Environment Variables**.
