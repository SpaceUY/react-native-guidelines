---
title: Estructura Basada en Features
parent: Arquitectura del Proyecto
nav_order: 1
---

# Estructura Basada en Features

Dividimos la app en dos raíces:

- **`app/`** — rutas de Expo Router. Esta capa es *delgada*: un archivo de ruta
  simplemente re-exporta la screen real.
- **`src/`** — todo el código real, organizado por **feature**.

```
app/                         # Expo Router — solo rutas
  _layout.tsx                # providers (error boundary, query client, auth, safe area)
  (auth)/                    # grupo de rutas públicas
  (app)/                     # grupo de rutas autenticadas
src/
  features/<feature>/        # auth, profile, orders, ...
    screens/                 # un archivo por screen
    components/              # componentes usados solo por esta feature
    hooks/                   # hooks de la feature (queries, mutations, lógica)
    services/                # llamadas a la API de esta feature
    types.ts                 # tipos locales de la feature
    index.ts                 # barrel — la superficie pública de la feature
  shared/
    components/ config/ constants/ hooks/ services/ types/ utils/
  assets/
```

## Las reglas

- **Los archivos de ruta re-exportan screens.** Un archivo en `app/` debería
  ser una sola línea:

  ```tsx
  // app/(app)/profile.tsx
  export { ProfileScreen as default } from "@features/profile";
  ```

- **Una feature es dueña de su porción.** Screens, componentes, hooks,
  services y tipos de una feature viven juntos bajo `src/features/<feature>/`.
- **`shared/` es para código genuinamente transversal** — el cliente de API,
  design tokens, el error boundary, hooks/utils genéricos. Si solo una feature
  lo usa, pertenece a esa feature.

{: .note-title }
Nota

{: .note }
**¿Por qué basado en features gana a basado en capas?** En un layout basado en
capas (`components/`, `hooks/`, `services/` en la raíz), el código de una
feature queda disperso por todo el árbol. Basado en features mantiene juntas
las cosas que cambian juntas, así una feature es fácil de encontrar, entender
e incluso borrar.
