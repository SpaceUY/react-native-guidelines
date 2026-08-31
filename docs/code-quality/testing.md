---
title: Unit & Component Testing
parent: Code Quality
nav_order: 3
---

# Unit & Component Testing

We test with the **`jest-expo`** preset and **`@testing-library/react-native`**.
Tests are **co-located** next to the code they cover, named `*.test.ts` /
`*.test.tsx`.

## A component test

```tsx
import { render, screen } from "@testing-library/react-native";
import { OrderCard } from "./OrderCard";

test("shows the order total", () => {
  render(<OrderCard total="42.00" />);
  expect(screen.getByText("42.00")).toBeTruthy();
});
```

## Testing a query hook

Hooks that use react-query need a `QueryClientProvider` around them:

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

{: .note }
Under NativeWind, `className` is **inert in tests** — there's no native styling
engine running. So assert **behavior and text**, not visual styles (verify how
things *look* on a device or simulator). Remember to mirror your path aliases in
`jest.config.js` `moduleNameMapper`, or imports like `@shared/...` won't resolve.

Run the suite:

```bash
pnpm test            # jest
```
