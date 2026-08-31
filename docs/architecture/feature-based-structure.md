---
title: Feature-Based Structure
parent: Project Architecture
nav_order: 1
---

# Feature-Based Structure

We split the app into two roots:

- **`app/`** — Expo Router routes. This layer is *thin*: a route file just
  re-exports the real screen.
- **`src/`** — all the actual code, organized by **feature**.

```
app/                         # Expo Router — routes only
  _layout.tsx                # providers (error boundary, query client, auth, safe area)
  (auth)/                    # public route group
  (app)/                     # authenticated route group
src/
  features/<feature>/        # auth, profile, orders, ...
    screens/                 # one file per screen
    components/              # components used only by this feature
    hooks/                   # feature hooks (queries, mutations, logic)
    services/                # API calls for this feature
    types.ts                 # feature-local types
    index.ts                 # barrel — the feature's public surface
  shared/
    components/ config/ constants/ hooks/ services/ types/ utils/
  assets/
```

## The rules

- **Route files re-export screens.** A file in `app/` should be one line:

  ```tsx
  // app/(app)/profile.tsx
  export { ProfileScreen as default } from "@features/profile";
  ```

- **A feature owns its slice.** Screens, components, hooks, services, and types
  for a feature live together under `src/features/<feature>/`.
- **`shared/` is for genuinely cross-cutting code** — the API client, design
  tokens, error boundary, generic hooks/utils. If only one feature uses it, it
  belongs in that feature.

{: .note }
**Why feature-based beats layer-based?** In a layer-based layout
(`components/`, `hooks/`, `services/` at the top), one feature's code is
scattered across the tree. Feature-based keeps things that change together in
one place, so a feature is easy to find, reason about, and even delete.
