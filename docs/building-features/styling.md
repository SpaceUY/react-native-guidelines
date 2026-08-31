---
title: Styling (NativeWind)
parent: Building Features
nav_order: 5
---

# Styling (NativeWind)

We style with **NativeWind v4** — Tailwind utility classes via `className`.
`StyleSheet.create` is retired; reach for inline `style` only for values you can
only compute at runtime (safe-area math, an SVG `fill`, an animated value).

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

## Design tokens are the single source of truth

Colors, spacing, font sizes, etc. live in one `tokens.ts`. The Tailwind config
consumes them, and JS-only consumers (an SVG fill, an `ActivityIndicator` color)
import the same file — so there's exactly one place to change a color.

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

## The `cn()` helper

Merge conditional and overriding classes with `clsx` + `tailwind-merge`:

```ts
// src/shared/constants/cn.ts
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```

```tsx
<View className={cn("p-4", isActive && "bg-primary", className)} />
```

Add **`prettier-plugin-tailwindcss`** so classes are always sorted the same way.

{: .warning }
**Animation utilities (`transition-*`, `animate-*`) depend on Reanimated being
linked.** If your project doesn't link Reanimated, these classes crash at
runtime. Either don't use them — drive animation from JavaScript — or add
Reanimated deliberately and confirm it's linked before relying on them.
