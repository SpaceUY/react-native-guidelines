---
title: TypeScript
parent: Calidad de Código
nav_order: 1
---

# TypeScript

TypeScript corre en **modo strict**. Extendé la config base de Expo para
heredar defaults sensatos, y activá `strict`:

```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"]
    }
  }
}
```

Convenciones:

- Los **tipos compartidos** viven en `src/shared/types`; los tipos locales
  de una feature quedan en el `types.ts` de esa feature.
- Preferí **inferir** los tipos desde la fuente de verdad — un schema de zod
  (`z.infer<typeof schema>`), el return de un hook de query — antes que
  redeclarar las formas a mano.

Type-checkeá todo (esto también es un paso de CI):

```bash
npx tsc --noEmit
```
