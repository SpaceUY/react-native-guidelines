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

Next: set up your **Environment Variables**.
