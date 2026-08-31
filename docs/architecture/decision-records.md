---
title: Architecture Decision Records
parent: Project Architecture
nav_order: 3
---

# Architecture Decision Records

An **ADR** is a short, durable note that records *why* we made a significant
decision — the context, the choice, and its consequences. Months later, when
someone asks "why did we do it this way?", the answer is written down instead of
lost in a Slack thread.

## Where they live

```
docs/decisions/<AREA-NN>-<slug>.md
# e.g. docs/decisions/NAV-01-navigation-library.md
```

Use a short area prefix (`NAV`, `STYLE`, `SETUP`, …) and a running number so
related decisions sort together.

## Template

```markdown
# NAV-01 — Navigation library

- Status: Accepted (2026-08-15) — supersedes: none
- Context: <the problem and the forces at play>
- Decision: <what we chose>
- Consequences: <trade-offs, follow-ups, what this rules out>
```

## When to write one

Write an ADR whenever a decision is expensive to reverse or would puzzle a
future reader: choosing a navigation library, a styling approach, a folder
convention, a build/distribution strategy.

{: .note }
Decisions can change. When they do, **write a new ADR (or update the status) that
supersedes the old one** — don't delete history. The trail of "we chose X, then
reversed to Y because Z" is exactly what makes ADRs valuable.
