---
title: Claude
nav_order: 10
---

# Claude

This guideline works best when your AI assistant (Claude Code, or any
LLM-based tool) treats it as the source of truth instead of guessing
conventions from scratch each session. This page is instructions *for
Claude* — copy them into new projects so the assistant is productive on day
one and stays consistent with the rest of the org.

## Bootstrap prompt

Paste this into a fresh Claude Code session when starting or joining a React
Native + Expo project:

```
This project follows the SpaceDev React Native Guidelines:
https://spaceuy.github.io/react-native-guidelines/

Before doing anything else:
1. Read CLAUDE.md in this repo (if it exists) — it lists this project's
   specific stack, commands, and any deviations from the guideline.
2. Read docs/decisions/ (if it exists) for ADRs — decisions already made and why.
3. When the guideline and the repo's actual code disagree, follow the repo —
   then flag the conflict instead of silently "fixing" it.
4. If this is a new project and CLAUDE.md doesn't exist yet, create one (see
   the guideline's Claude → Project CLAUDE.md template) once you've learned
   enough about the stack to fill it in accurately.
```

## Project CLAUDE.md template

Every project should have a `CLAUDE.md` at the repo root. Keep it short and
link out to this guideline instead of duplicating it — a `CLAUDE.md` that
repeats the guideline goes stale the moment the guideline changes.

```markdown
# CLAUDE.md

This project follows the SpaceDev React Native Guidelines:
https://spaceuy.github.io/react-native-guidelines/

## Stack
- Expo SDK <version>, Expo Router, TypeScript
- State/data: TanStack Query [+ <client state lib, if any>]
- Styling: NativeWind
- Forms: React Hook Form + Zod

## Commands
- `pnpm start` — run the dev server
- `pnpm test` — unit tests
- `pnpm lint` / `pnpm typecheck`
- `eas build --profile preview` — internal test build

## Deviations from the guideline
- <e.g. "Uses Redux Toolkit instead of Zustand for X reason — see ADR STATE-01">

## Project-specific notes
- <anything a new engineer or Claude would otherwise have to rediscover>
```

{: .tip }
If the deviations list is empty, say so explicitly (`None — follow the
guideline as-is.`). That's a signal Claude can trust, not an omission it has
to double-check.

## What Claude should do first, every project

1. Read `CLAUDE.md`, then skim `package.json` and the folder structure —
   confirm the stack matches what's declared before assuming anything.
2. Check `docs/decisions/` for ADRs (see **Architecture Decision Records**) —
   they override the guideline's defaults for that project.
3. Match existing patterns over the guideline's examples when the two
   disagree in a working codebase — consistency with the surrounding code
   beats textbook-correctness.
4. For anything genuinely ambiguous (a missing convention, a new library
   choice), ask — don't invent a convention that the next session, or the
   next engineer, then has to reverse-engineer.

## What to persist, and where

Not everything Claude learns belongs in the same place. Use the most
durable, most shared location that fits:

| What | Where | Why |
| --- | --- | --- |
| Stack, commands, known deviations | `CLAUDE.md` (repo) | Shared with the whole team, versioned with the code. |
| A significant, expensive-to-reverse decision | `docs/decisions/*.md` (ADR) | Needs the *why*, not just the *what* — see **Architecture Decision Records**. |
| A one-off fact about this codebase (e.g. "the `legacy/` folder is unmaintained, don't touch it") | `CLAUDE.md`, "Project-specific notes" | Anyone working here needs it, not just Claude. |
| Your personal working preferences (verbosity, when to ask vs. act) | Claude's own memory | Follows *you* across projects; not relevant to teammates or CI. |

{: .warning }
Never persist secrets, API keys, or credentials anywhere Claude writes to —
`CLAUDE.md`, ADRs, and memory are all things a human or another tool can read
later. See **Environment & Configuration → Secrets**.

## Efficiency tips

- Point Claude at a specific page (e.g. "follow Building Features →
  Navigation") instead of the whole guideline when the task is scoped — less
  context to load, less chance of it picking the wrong section.
- Keep `CLAUDE.md` a pointer, not a copy. If it starts re-explaining folder
  structure or naming rules that already live in this guideline, delete that
  part and link instead.
- When the guideline changes, there's nothing to migrate in existing
  `CLAUDE.md` files unless they've genuinely diverged — that's the point of
  linking rather than copying.
