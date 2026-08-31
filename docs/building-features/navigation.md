---
title: Navigation (Expo Router)
parent: Building Features
nav_order: 1
---

# Navigation (Expo Router)

We use **Expo Router** — routing is file-based. A file under `app/` *is* a
route; you don't register screens by hand.

## Route groups and layouts

- A folder in parentheses, like `(auth)` or `(app)`, is a **route group**: it
  organizes files without adding a segment to the URL.
- A `_layout.tsx` wraps everything below it — put providers and navigators there.

```
app/
  _layout.tsx          # root providers + <Stack>
  (auth)/
    _layout.tsx
    login.tsx          # route: /login
  (app)/
    _layout.tsx        # guards the authenticated area
    (tabs)/
      _layout.tsx      # <Tabs>
      index.tsx        # route: /
      profile.tsx      # route: /profile
```

## Guarding routes

Redirect unauthenticated users from a layout:

```tsx
// app/(app)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;                 // wait for the session to resolve
  if (!isAuthenticated) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

## Navigating

```tsx
import { Link, useRouter } from "expo-router";

// Declarative
<Link href="/profile">Go to profile</Link>;

// Imperative
const router = useRouter();
router.push("/orders/123");        // dynamic route: app/orders/[id].tsx
```

{: .tip }
Enable **typed routes** so `href` values are checked at compile time. Set
`experiments.typedRoutes: true` in `app.config.ts` and Expo Router generates
route types for you.
