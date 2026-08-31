---
title: Environment Variables
parent: Getting Started
nav_order: 3
---

# Environment Variables

Copy the template and fill in the values:

```bash
cp .env.example .env
```

## The `EXPO_PUBLIC_` prefix

Any variable prefixed with `EXPO_PUBLIC_` is **inlined into the app bundle** at
build time and readable at runtime through `process.env`:

```ts
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

{: .warning }
`EXPO_PUBLIC_*` values ship **inside the client app** — anyone can read them.
Never put secrets (API keys with write access, tokens, passwords) there. Those
belong on the backend or in EAS secrets. See **Environment & Configuration →
Secrets**.

## What's committed

- `.env` — your local values. **Git-ignored. Never commit it.**
- `.env.example` — the template with empty or dummy values. **Committed**, so
  everyone knows which variables a project needs.

For the full picture — runtime vs build-time config and how `APP_ENV` selects an
environment — see **Environment & Configuration**.
