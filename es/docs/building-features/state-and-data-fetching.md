---
title: Estado y Obtención de Datos
parent: Desarrollo de Funcionalidades
nav_order: 2
---

# Estado y Obtención de Datos

Dos tipos de estado, dos herramientas:

- **Estado de servidor** (cualquier cosa que vive en tu backend) →
  **`@tanstack/react-query`**.
- **Estado local / de UI** (un toggle, un paso de formulario, un tab
  seleccionado) → **hooks de React + Context**.

{: .important-title }
Importante

{: .important }
**Sin store global (Redux/Zustand) por defecto.** react-query ya maneja
caché, loading, reintentos y refetch en segundo plano para los datos de
servidor — que es la mayor parte de lo que antes ocupaba un "store global".
Recurrí a un store global solo cuando tenés estado de *cliente* genuinamente
global que muchas screens mutan, y agregalo a propósito.

## Query keys

Las keys son arrays, ordenadas de más-general a más-específica. Esto hace
que invalidar sea predecible:

```ts
["orders"]            // la lista
["orders", orderId]   // una orden
```

## Un hook de query

Envolvé cada request en un hook que vive en el `hooks/` de la feature:

```ts
// src/features/orders/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/services/api";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await api.get("/orders")).data,
    staleTime: 30_000,          // tratar los datos como frescos por 30s
  });
}
```

## Mutations + invalidación

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

El `QueryClientProvider` se monta una sola vez en la raíz, en
`app/_layout.tsx`, así que todas las screens comparten una sola caché.
