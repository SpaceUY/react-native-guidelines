---
title: Buenas Prácticas
nav_order: 8
---

# Buenas Prácticas

Una lista corta de convenciones y las trampas en las que realmente caímos.
Ante la duda, seguí el estilo del código que te rodea.

## Nombres

- **Componentes:** `PascalCase` (`OrderCard`).
- **Hooks:** `useXxx` (`useOrders`).
- **Archivos:** igual que el export por defecto (`OrderCard.tsx`, `useOrders.ts`).
- **Tests:** co-ubicados, `*.test.ts` / `*.test.tsx`.

## Carpetas

- Una feature es dueña de su código bajo `src/features/<feature>/`.
- `src/shared/` es solo para código genuinamente transversal. Si lo usa una
  sola feature, vive en esa feature.

## Commits y PRs

- Usá el estilo **conventional-commit**: `feat:`, `fix:`, `docs:`, `chore:`,
  `refactor:`, `test:`.
- Mantené los commits chicos y enfocados; mantené los PRs revisables.
- **El CI tiene que estar en verde** antes de mergear (ver **Calidad de
  Código → Integración Continua**).

## Errores comunes

{: .warning-title }
Advertencia

{: .warning }
Estos son los errores que más tiempo nos costaron:

- Importar el **barrel de una feature** desde otra feature (crea ciclos de
  importación) — importá el módulo hoja directamente.
- Poner un **secreto** en una variable `EXPO_PUBLIC_*` — viaja dentro de la app.
- Usar clases `transition-*` / `animate-*` **sin Reanimated linkeado** — explotan
  en runtime.
- Correr `eas submit` sobre un build **preview** (ad-hoc) — la tienda lo rechaza.
- Agregar un dispositivo iOS y **olvidarse de regenerar el provisioning
  profile** — el tester puede registrarse pero no puede instalar.
