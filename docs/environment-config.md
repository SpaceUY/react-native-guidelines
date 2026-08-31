---
title: Environment & Configuration
nav_order: 5
has_children: true
---

# Environment & Configuration

Two kinds of configuration, kept separate:

- **Runtime** values the app reads while it's running (an API URL).
- **Build-time** values that change *what kind of app you build* — dev, preview,
  or production.

And one rule that ties them together: **keep secrets out of the client.**

- **Runtime Environment** · **Build-Time Config** · **Secrets**
