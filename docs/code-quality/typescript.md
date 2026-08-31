---
title: TypeScript
parent: Code Quality
nav_order: 1
---

# TypeScript

TypeScript runs in **strict mode**. Extend Expo's base config so you inherit
sane defaults, and turn on `strict`:

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

Conventions:

- **Shared types** live in `src/shared/types`; feature-local types stay in the
  feature's `types.ts`.
- Prefer **inferring** types from the source of truth — a zod schema
  (`z.infer<typeof schema>`), a query hook's return — over re-declaring shapes by
  hand.

Type-check everything (this is also a CI step):

```bash
npx tsc --noEmit
```
