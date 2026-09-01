---
title: Secrets
parent: Environment & Configuration
nav_order: 3
---

# Secrets

The rule is simple: **secrets never reach the client.**

- `.env.dev`, `.env.preview`, and `.env.prod` hold your per-environment values
  and are **git-ignored** — never commit them.
- `.env.example` is **committed** as the template, with empty or dummy values.
- A server-only secret must **not** use the `EXPO_PUBLIC_` prefix (that prefix
  ships the value inside the app). Put it in an **EAS secret** for builds, or
  keep it entirely on the backend.

## Where each value belongs

| Value type | Where it lives |
| --- | --- |
| Public config (API base URL, public client id) | `EXPO_PUBLIC_*` in `.env.<env>` |
| Build-time secret (signing, service tokens for CI) | EAS secret |
| Server secret (private API keys, DB credentials) | Backend only — never in the app |

{: .warning }
If a secret ever lands in a committed file or an `EXPO_PUBLIC_*` variable,
treat it as **leaked**: rotate it. Removing it in a later commit doesn't help —
it's already in git history and in shipped bundles.
