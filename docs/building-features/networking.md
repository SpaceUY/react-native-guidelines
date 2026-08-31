---
title: Networking
parent: Building Features
nav_order: 3
---

# Networking

One shared **axios** instance, configured once, used everywhere. It owns the
base URL and cross-cutting concerns (auth headers, error shape); react-query
owns caching and retries on top of it.

```ts
// src/shared/services/api.ts
import axios from "axios";
import { env } from "@shared/config/env";

export const api = axios.create({
  baseURL: env.API_URL,
  timeout: 15_000,
});

// Attach the auth token on every request
api.interceptors.request.use((config) => {
  const token = getAuthToken();                 // from your auth layer
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors so callers get a predictable shape
api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(normalizeApiError(error)),
);
```

## How it composes with react-query

A query's `queryFn` just calls `api`; react-query decides when to fetch, cache,
and retry:

```ts
queryFn: async () => (await api.get("/orders")).data,
```

{: .note }
Keep endpoint calls in each feature's `services/` folder (e.g.
`src/features/orders/services/ordersApi.ts`), not inline in components. Screens
call hooks; hooks call services; services call `api`.
