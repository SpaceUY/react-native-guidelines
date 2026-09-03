---
title: Managed Workflow (CNG)
parent: Getting Started
nav_order: 3
---

# Managed Workflow (CNG)

The team default is Expo's **managed workflow** with **Continuous Native
Generation (CNG)**: the `ios/` and `android/` folders are never committed.
They're generated on demand — locally with `npx expo prebuild`, or
transparently by **EAS Build** in the cloud — from `app.config.ts` and the
packages you install.

{: .note }
**Why not "either is fine"?** Committed native folders turn every native
config change into an unreadable diff, create a second source of truth
(hand-edited native files vs. `app.config.ts`) that silently drifts, and make
onboarding depend on which workflow a given clone happens to be in. CNG keeps
exactly one source of truth.

## Day to day

- Bundle IDs, permissions, deep-link schemes, and other native identifiers are
  changed in `app.config.ts` — see **Environment & Configuration → Build-Time
  Config** — never by hand in Xcode or Android Studio.
- Need to inspect or run a native project locally? Run `npx expo prebuild
  --clean` to (re)generate `ios/` and `android/`. Treat the result as
  **disposable build output**: never commit it, and delete/regenerate it if it
  ever looks like it's drifted from your config.
- Store and internal builds never require anyone to run `prebuild` by hand —
  **EAS Build** runs it in the cloud as part of every build. See **Build &
  Distribution → Concepts**.

## When a config plugin doesn't cover what you need

Most native capabilities ship as an official or community Expo **config
plugin**: add it to `app.config.ts`'s `plugins` array and `prebuild` wires it
into the generated native project for you. Before writing anything custom,
search npm/GitHub for one (`<sdk name> expo plugin`, `expo-config-plugin-*`).

If none exists — some vendor SDKs (KYC/identity verification, payments, etc.)
only ship native install instructions, no Expo integration — the answer is a
**local config plugin**, not ejecting to bare and not committing
`ios/`/`android/`. See **Project Architecture → Native SDKs Without an Expo
Plugin**.

{: .note }
**Joining a project that already has `ios/`/`android/` committed?** That's an
inherited bare setup, not something to "fix" as a side effect of unrelated
work. Migrating an existing project to managed is its own planned change —
raise it separately instead of doing it inline.
