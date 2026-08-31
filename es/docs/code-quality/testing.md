---
title: Testing Unitario y de Componentes
parent: Calidad de Código
nav_order: 3
---

# Testing Unitario y de Componentes

Testeamos con el preset **`jest-expo`** y **`@testing-library/react-native`**.
Los tests están **co-ubicados** junto al código que cubren, con nombre
`*.test.ts` / `*.test.tsx`.

## Un test de componente

```tsx
import { render, screen } from "@testing-library/react-native";
import { OrderCard } from "./OrderCard";

test("shows the order total", () => {
  render(<OrderCard total="42.00" />);
  expect(screen.getByText("42.00")).toBeTruthy();
});
```

## Testear un hook de query

Los hooks que usan react-query necesitan un `QueryClientProvider`
envolviéndolos:

```tsx
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOrders } from "./useOrders";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

test("loads orders", async () => {
  const { result } = renderHook(() => useOrders(), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

{: .note-title }
Nota

{: .note }
Bajo NativeWind, `className` está **inerte en los tests** — no hay motor de
estilos nativo corriendo. Así que verificá **comportamiento y texto**, no
estilos visuales (eso lo verificás viendo cómo *se ve* en un dispositivo o
simulador). Acordate de reflejar tus alias de rutas en el
`moduleNameMapper` de `jest.config.js`, o imports como `@shared/...` no van
a resolver.

Correr la suite:

```bash
pnpm test            # jest
```
