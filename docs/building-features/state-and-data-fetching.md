---
title: State & Data Fetching
parent: Building Features
nav_order: 2
---

# State & Data Fetching

Two kinds of state, two tools:

- **Server state** (anything that lives on your backend) → **`@tanstack/react-query`**.
- **Local / UI state** (a toggle, a form step, a selected tab) → **React hooks +
  Context**.

{: .important }
**No global store (Redux/Zustand) by default.** react-query already handles
caching, loading, retries, and background refetching for server data — which is
most of what a "global store" used to hold. Reach for a global store only when
you have genuinely global *client* state that many screens mutate, and add it
deliberately.

## Query keys

Keys are arrays, ordered most-general → most-specific. This makes invalidation
predictable:

```ts
["orders"]            // the list
["orders", orderId]   // one order
```

## A query hook

Wrap each request in a hook that lives in the feature's `hooks/`:

```ts
// src/features/orders/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/services/api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await api.get("/orders")).data,
    staleTime: 30_000,          // treat data as fresh for 30s
  });
}
```

## Mutations + invalidation

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: NewOrder) => api.post("/orders", body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
```

The `QueryClientProvider` is mounted once at the root, in `app/_layout.tsx`, so
every screen shares one cache.
