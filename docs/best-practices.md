---
title: Best Practices
nav_order: 8
---

# Best Practices

A short list of conventions and the traps we've actually hit. When in doubt,
match the surrounding code.

## Naming

- **Components:** `PascalCase` (`OrderCard`).
- **Hooks:** `useXxx` (`useOrders`).
- **Files:** match the default export (`OrderCard.tsx`, `useOrders.ts`).
- **Tests:** co-located, `*.test.ts` / `*.test.tsx`.

## Folders

- A feature owns its code under `src/features/<feature>/`.
- `src/shared/` is only for genuinely cross-cutting code. If one feature uses it,
  it lives in that feature.

## Commits & PRs

- Use **conventional-commit** style: `feat:`, `fix:`, `docs:`, `chore:`,
  `refactor:`, `test:`.
- Keep commits small and focused; keep PRs reviewable.
- **CI must be green** before merge (see **Code Quality → Continuous
  Integration**).

## Common pitfalls

{: .warning }
These are the mistakes that cost the most time:

- Importing a **feature barrel** from another feature (creates import cycles) —
  import the leaf module instead.
- Putting a **secret** in an `EXPO_PUBLIC_*` variable — it ships inside the app.
- Using `transition-*` / `animate-*` classes **without Reanimated linked** — they
  crash at runtime.
- Running `eas submit` on a **preview** (ad-hoc) build — the store rejects it.
- Adding an iOS device and **forgetting to regenerate the provisioning profile** —
  the tester can register but can't install.
