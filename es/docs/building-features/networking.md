---
title: Networking
parent: Desarrollo de Funcionalidades
nav_order: 3
---

# Networking

Una única instancia de **axios** compartida, configurada una vez, usada en
todos lados. Se encarga de la base URL y de las cuestiones transversales
(headers de auth, forma de los errores); react-query se encarga de la caché
y los reintentos por encima de eso.

```ts
// src/shared/services/api.ts
import axios from "axios";
import { env } from "@shared/config/env";

export const api = axios.create({
  baseURL: env.API_URL,
  timeout: 15_000,
});

// Adjuntar el token de auth en cada request
api.interceptors.request.use((config) => {
  const token = getAuthToken();                 // desde tu capa de auth
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalizar errores para que quien llama reciba una forma predecible
api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(normalizeApiError(error)),
);
```

## Cómo se combina con react-query

El `queryFn` de una query simplemente llama a `api`; react-query decide
cuándo hacer fetch, cachear y reintentar:

```ts
queryFn: async () => (await api.get("/orders")).data,
```

{: .note-title }
Nota

{: .note }
Mantené las llamadas a endpoints en el `services/` de cada feature (ej.
`src/features/orders/services/ordersApi.ts`), no inline en los componentes.
Las screens llaman a los hooks; los hooks llaman a los services; los
services llaman a `api`.
