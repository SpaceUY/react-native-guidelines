---
title: Testing E2E
parent: Calidad de Código
nav_order: 4
---

# Testing E2E

Nuestro default es **tests unitarios y de componentes primero** — son
rápidos y cubren la mayor parte de la lógica. Los tests end-to-end son
**opcionales**, se agregan cuando un flujo crítico (login, checkout)
justifica protegerlo contra regresiones en toda la app.

Cuando sí agregues E2E, preferí **Maestro** antes que Detox. Maestro maneja
la app con flows YAML simples y necesita mucha menos configuración nativa.

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

Correlo con `maestro test .maestro/login.yaml`.

{: .note-title }
Nota

{: .note }
Mantené el E2E a un puñado de **happy paths críticos**. Son más lentos y más
inestables que los tests unitarios, así que una suite de E2E gigante suele
costar más de lo que protege.
