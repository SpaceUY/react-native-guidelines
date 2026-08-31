---
title: Runtime Environment
parent: Environment & Configuration
nav_order: 1
---

# Runtime Environment

Runtime values come from `EXPO_PUBLIC_*` variables, read via `process.env`. Wrap
them in one typed module so the rest of the app imports a clean object instead of
reaching into `process.env` everywhere:

```ts
// src/shared/config/env.ts
export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com",
};
```

Benefits of the wrapper: one place for defaults, a single spot to validate on
startup, and autocomplete for `env.` everywhere else.

{: .warning }
`EXPO_PUBLIC_*` values are compiled **into the client bundle** and are readable
by anyone who has the app. Only put **public** values here. Anything sensitive
goes to the backend or EAS secrets — see **Secrets**.
