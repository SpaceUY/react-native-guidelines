---
title: E2E Testing
parent: Code Quality
nav_order: 4
---

# E2E Testing

Our default is **unit + component tests first** — they're fast and cover most
logic. End-to-end tests are **optional**, added when a critical flow (login,
checkout) is worth guarding against regressions across the whole app.

When you do add E2E, prefer **Maestro** over Detox. Maestro drives the app with
simple YAML flows and needs far less native configuration.

```yaml
# .maestro/login.yaml
appId: com.yourorg.app
---
- launchApp
- tapOn: "Log in"
- inputText: "test@example.com"
- tapOn: "Continue"
- assertVisible: "Home"
```

Run it with `maestro test .maestro/login.yaml`.

{: .note }
Keep E2E to a handful of **critical happy paths**. They're slower and flakier
than unit tests, so a giant E2E suite tends to cost more than it protects.
