---
title: Reglas de Importación y Alias de Rutas
parent: Arquitectura del Proyecto
nav_order: 2
---

# Reglas de Importación y Alias de Rutas

## La regla de importación por hoja (leaf import)

Cuando una feature necesita algo de otra, importá el **módulo hoja**
directamente — nunca el barrel de la feature.

```ts
// ✅ desde otra feature — importá el módulo hoja
import { useOrders } from "@features/orders/hooks/useOrders";

// ❌ trae todo el grafo de la feature y arriesga ciclos de importación
import { useOrders } from "@features/orders";
```

Solo los **archivos de ruta en `app/`** importan el barrel de una feature
(`@features/orders`), porque las rutas están en la punta del grafo y no
pueden crear un ciclo.

Por qué importa: un barrel re-exporta todo lo de una feature, incluidas sus
screens. Si la feature A importa el barrel de la feature B, y el barrel de B
trae una screen que importa de A, se genera un ciclo que aparece en runtime
como un confuso "undefined is not a function". Las importaciones por hoja
evitan toda esa clase de problema.

## Alias de rutas (declarados en tres lugares)

Los alias mantienen las importaciones legibles. Tienen que estar declarados
**en sincronía** en tres archivos — Babel los resuelve en build time,
TypeScript para el editor/type-check, y Jest para los tests:

```js
// babel.config.js
plugins: [
  ["module-resolver", {
    alias: { "@": "./src", "@features": "./src/features", "@shared": "./src/shared" },
  }],
];
```

```json
// tsconfig.json
"paths": {
  "@/*": ["src/*"],
  "@features/*": ["src/features/*"],
  "@shared/*": ["src/shared/*"]
}
```

```js
// jest.config.js
moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/src/$1",
  "^@features/(.*)$": "<rootDir>/src/features/$1",
  "^@shared/(.*)$": "<rootDir>/src/shared/$1",
}
```

{: .warning-title }
Advertencia

{: .warning }
Si agregás o renombrás un alias, actualizá **los tres** archivos. Si te
olvidás de uno, el build, el type-checker o los tests van a estar en
desacuerdo sobre dónde vive un módulo.
