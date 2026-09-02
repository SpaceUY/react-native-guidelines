---
title: Navegación (Expo Router)
parent: Desarrollo de Funcionalidades
nav_order: 1
---

# Navegación (Expo Router)

Usamos **Expo Router** — el ruteo está basado en archivos. Un archivo bajo
`app/` *es* una ruta; no registrás screens a mano.

## Grupos de rutas y layouts

- Una carpeta entre paréntesis, como `(auth)` o `(app)`, es un **grupo de
  rutas**: organiza archivos sin agregar un segmento a la URL.
- Un `_layout.tsx` envuelve todo lo que está debajo — poné ahí los providers
  y los navigators.

```
app/
  _layout.tsx          # providers raíz + <Stack>
  (auth)/
    _layout.tsx
    login.tsx          # ruta: /login
  (app)/
    _layout.tsx        # protege el área autenticada
    (tabs)/
      _layout.tsx      # <Tabs>
      index.tsx        # ruta: /
      profile.tsx      # ruta: /profile
```

## Proteger rutas

Redirigí a los usuarios no autenticados desde un layout:

{% raw %}
```tsx
// app/(app)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@features/auth/hooks/useAuth";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;                 // esperar a que resuelva la sesión
  if (!isAuthenticated) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
```
{% endraw %}

## Navegar

```tsx
import { Link, useRouter } from "expo-router";

// Declarativo
<Link href="/profile">Ir al perfil</Link>;

// Imperativo
const router = useRouter();
router.push("/orders/123");        // ruta dinámica: app/orders/[id].tsx
```

{: .tip-title }
Consejo

{: .tip }
Activá las **typed routes** para que los valores de `href` se chequeen en
tiempo de compilación. Poné `experiments.typedRoutes: true` en
`app.config.ts` y Expo Router genera los tipos de ruta por vos.
