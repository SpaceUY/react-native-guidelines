---
title: Environment Variables
parent: Getting Started
nav_order: 3
---

# Environment Variables

We keep **one env file per environment**, each git-ignored, plus a single
committed template:

| File | Environment | In git |
| --- | --- | --- |
| `.env.dev` | development | ignored |
| `.env.preview` | preview | ignored |
| `.env.prod` | production | ignored |
| `.env.example` | template (dummy values) | committed |

{: .note }
If you're coming from another stack, **`preview` is our "staging"** — the
internal, pre-production environment. We call it `preview` to match Expo's EAS
`preview` build profile and the `APP_ENV=preview` value.

The variable **names** are the same across environments — only the values
differ — so one `.env.example` documents them all. Copy it into each
environment file and fill in the real values:

```bash
cp .env.example .env.dev       # repeat for .env.preview and .env.prod
```

## Loading the right file

Select the file per environment with
[`env-cmd`](https://www.npmjs.com/package/env-cmd) (a dev dependency) in your
`package.json` scripts:

```json
"scripts": {
  "start":         "env-cmd -f .env.dev expo start",
  "start:preview": "env-cmd -f .env.preview expo start",
  "start:prod":    "env-cmd -f .env.prod expo start"
}
```

Give each file its own `APP_ENV` (`development` / `preview` / `production`) so
the runtime values `env-cmd` loads and the build-time config the dynamic
`app.config.ts` selects stay in sync from one source. (`dotenv-cli` works the
same way if you already use it.) For EAS builds the values still come from the
`env` block of the matching profile in `eas.json` — see **Build-Time Config**.

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

- `.env.dev`, `.env.preview`, `.env.prod` — your real per-environment values.
  **Git-ignored. Never commit them.**
- `.env.example` — the template with empty or dummy values. **Committed**, so
  everyone knows which variables a project needs.

## Why one file per environment

- **Isolation** — a dev or test wallet/credential in `.env.dev` can never be
  bundled into a preview or production build.
- **No blocked tooling** — real wallets and keys live only in git-ignored
  files, never in tracked content, so Claude Code and secret scanners don't
  trip on a detected key and refuse to work.

For the full picture — runtime vs build-time config and how `APP_ENV` selects an
environment — see **Environment & Configuration**.
