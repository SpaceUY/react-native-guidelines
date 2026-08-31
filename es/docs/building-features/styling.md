---
title: Estilos (NativeWind)
parent: Desarrollo de Funcionalidades
nav_order: 5
---

# Estilos (NativeWind)

Estilamos con **NativeWind v4** — clases utilitarias de Tailwind vía
`className`. `StyleSheet.create` quedó retirado; usá `style` inline solo para
valores que únicamente podés calcular en runtime (matemática de safe-area,
un `fill` de SVG, un valor animado).

```tsx
import { View, Text } from "react-native";

export function Badge({ label }: { label: string }) {
  return (
    <View className="rounded-full bg-primary px-3 py-1">
      <Text className="text-sm font-medium text-white">{label}</Text>
    </View>
  );
}
```

## Los design tokens son la única fuente de verdad

Colores, spacing, tamaños de fuente, etc. viven en un único `tokens.ts`. La
config de Tailwind los consume, y los consumidores que solo usan JS (un
`fill` de SVG, un color de `ActivityIndicator`) importan el mismo archivo —
así hay exactamente un lugar para cambiar un color.

```js
// tailwind.config.js
const { tokens } = require("./src/shared/constants/tokens");

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: { colors: tokens.colors, spacing: tokens.spacing },
  },
};
```

## El helper `cn()`

Combiná clases condicionales y que se sobreescriben con `clsx` +
`tailwind-merge`:

```ts
// src/shared/constants/cn.ts
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

```tsx
<View className={cn("p-4", isActive && "bg-primary", className)} />
```

Agregá **`prettier-plugin-tailwindcss`** para que las clases queden siempre
ordenadas de la misma forma.

{: .warning-title }
Advertencia

{: .warning }
**Las utilidades de animación (`transition-*`, `animate-*`) dependen de que
Reanimated esté linkeado.** Si tu proyecto no linkea Reanimated, estas clases
explotan en runtime. O no las uses — manejá la animación desde JavaScript —
o agregá Reanimated a propósito y confirmá que está linkeado antes de
depender de ellas.
