---
title: Import Rules & Path Aliases
parent: Project Architecture
nav_order: 2
---

# Import Rules & Path Aliases

## The leaf-import rule

When one feature needs something from another, import the **leaf module**
directly — never the feature's barrel.

```ts
// ✅ from another feature — import the leaf module
import { useOrders } from "@features/orders/hooks/useOrders";

// ❌ pulls the whole feature graph and risks import cycles
import { useOrders } from "@features/orders";
```

Only **`app/` route files** import a feature's barrel (`@features/orders`),
because routes sit at the top of the graph and can't create a cycle.

Why it matters: a barrel re-exports everything in a feature, including its
screens. If feature A imports feature B's barrel, and B's barrel pulls in a
screen that imports from A, you get a cycle that shows up as a confusing
"undefined is not a function" at runtime. Leaf imports avoid the whole class of
problem.

## Path aliases (declared in three places)

Aliases keep imports readable. They must be declared **in sync** in three files —
Babel resolves them at build time, TypeScript for editor/type-check, and Jest
for tests:

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

{: .warning }
If you add or rename an alias, update **all three** files. Miss one and builds,
the type-checker, or tests will disagree about where a module lives.
