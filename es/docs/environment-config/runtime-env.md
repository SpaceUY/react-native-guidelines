---
title: Entorno en Tiempo de Ejecución
parent: Entorno y Configuración
nav_order: 1
---

# Entorno en Tiempo de Ejecución

Los valores de runtime vienen de variables `EXPO_PUBLIC_*`, leídas vía
`process.env`. Envolvelos en un único módulo tipado para que el resto de la
app importe un objeto limpio en vez de acceder a `process.env` en todos
lados:

```ts
// src/shared/config/env.ts
export const env = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com",
};
```

Beneficios del wrapper: un solo lugar para los valores por defecto, un único
punto para validar al iniciar, y autocompletado para `env.` en todos lados.

{: .warning-title }
Advertencia

{: .warning }
Los valores `EXPO_PUBLIC_*` se compilan **dentro del bundle del cliente** y
son legibles por cualquiera que tenga la app. Poné acá solo valores
**públicos**. Cualquier cosa sensible va al backend o a los secrets de EAS —
ver **Secretos**.
