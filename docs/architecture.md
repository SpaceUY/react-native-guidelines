---
title: Project Architecture
nav_order: 3
has_children: true
---

# Project Architecture

How we organize code so any project feels the same: a thin routing layer,
feature folders that own their slice of the app, and a shared layer for
cross-cutting code. Plus how we record the decisions that got us here.

- **Feature-Based Structure** — where code lives and why.
- **Import Rules & Path Aliases** — how modules reference each other without
  creating cycles.
- **Architecture Decision Records** — how we capture the "why".
